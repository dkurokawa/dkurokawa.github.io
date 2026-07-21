#!/usr/bin/env node
// JP/EN structural drift check for tech/index.html <-> tech/index_en.html.
// Compares language-independent skeleton only (counts, hrefs, install commands,
// stack-tag lines). Exit 0 = in sync, exit 1 = drift found (prints report).
//
// Run: node tech/check-i18n-drift.mjs   (from repo root or tech/)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const JP = join(here, "index.html");
const EN = join(here, "index_en.html");

function extract(html) {
  const count = (re) => (html.match(re) || []).length;
  // href set — external links must match across languages (drop lang-switch
  // links index.html / index_en.html, which are intentionally different).
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((h) => h !== "index.html" && h !== "index_en.html")
    .sort();
  // install commands inside <code> — must be byte-identical across languages.
  const cmds = [...html.matchAll(/<code>([^<]+)<\/code>/g)].map((m) => m[1].trim()).sort();
  // stack lines (class="stack"): tag TEXT is translated ("AI 推論" vs
  // "AI inference"), so compare the tag COUNT per line instead — a mismatch
  // means one language added/dropped a technology.
  const stackCounts = [...html.matchAll(/class="stack"[^>]*>([^<]+)</g)]
    .map((m) => m[1].split("·").length)
    .sort((x, y) => x - y);
  return {
    sections: count(/<h2\b/g),
    entries: count(/<h3\b/g),
    hrefs,
    cmds,
    stackCount: stackCounts.length,
    stackCounts,
  };
}

function diffArrays(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  const onlyA = a.filter((x) => !sb.has(x));
  const onlyB = b.filter((x) => !sa.has(x));
  return { onlyA, onlyB };
}

const jp = extract(readFileSync(JP, "utf8"));
const en = extract(readFileSync(EN, "utf8"));

const problems = [];

if (jp.sections !== en.sections)
  problems.push(`section count (<h2>): JP=${jp.sections} EN=${en.sections}`);
if (jp.entries !== en.entries)
  problems.push(`entry count (<h3>): JP=${jp.entries} EN=${en.entries}`);

for (const [field, label] of [["hrefs", "href"], ["cmds", "install command"]]) {
  const { onlyA, onlyB } = diffArrays(jp[field], en[field]);
  if (onlyA.length) problems.push(`${label} only in JP:\n    ${onlyA.join("\n    ")}`);
  if (onlyB.length) problems.push(`${label} only in EN:\n    ${onlyB.join("\n    ")}`);
}

if (jp.stackCount !== en.stackCount)
  problems.push(`stack-line count: JP=${jp.stackCount} EN=${en.stackCount}`);
else if (JSON.stringify(jp.stackCounts) !== JSON.stringify(en.stackCounts))
  problems.push(`stack tag counts differ (one language added/dropped a tech): JP=[${jp.stackCounts}] EN=[${en.stackCounts}]`);

if (problems.length === 0) {
  console.log("i18n drift check: JP/EN in sync ✓");
  process.exit(0);
}

console.error("JP/EN drift detected in tech/index.html <-> tech/index_en.html:\n");
for (const p of problems) console.error("  · " + p);
console.error("\nFix the lagging language before shipping (redesign preserves copy/IA across both).");
process.exit(1);
