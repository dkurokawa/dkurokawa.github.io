#!/bin/bash
# usage: ./update_summaries.sh
# 指定パスのinstruction.htmlからsummary情報を抽出し、index.htmlの<!-- summaries here -->と<!-- summaries end -->の間に挿入

set -e
WORKDIR="$(cd "$(dirname "$0")" && pwd)"
INDEX="$WORKDIR/index.html"
TMP_SUMMARY="$WORKDIR/.tmp_summary.html"

for pj in "$WORKDIR"/*; do
  [ -d "$pj" ] || continue
  [ "$(basename "$pj")" = "ppn-page" ] && continue
  find "$pj" -type f -path "*/.html/instruction.html" | while read -r f; do
    ENV=$(grep -oP '<div class="env-info">.*?</div>' "$f" | head -1)
    DESC=$(grep -oP '<div lang="ja">.*?<p>.*?</p>' "$f" | head -1 | sed -n 's/.*<p>\(.*\)<\/p>.*/\1/p')
    LINK="<a href=\"$f\" target=\"_blank\" rel=\"noopener noreferrer\">詳細・手順</a>"
    echo "<div class=\"summary\">$ENV<br><strong>説明:</strong> $DESC<br>$LINK</div>" >> "$TMP_SUMMARY"
  done
done
  # 環境情報抽出（env-infoクラス）
  ENV=$(grep -oP '<div class="env-info">.*?</div>' "$f" | head -1)
  # 説明抽出（日本語lang="ja"部分の最初のpタグ）
  DESC=$(grep -oP '<div lang="ja">.*?<p>.*?</p>' "$f" | head -1 | sed -n 's/.*<p>\(.*\)<\/p>.*/\1/p')
  # リンク
  LINK="<a href=\"$f\" target=\"_blank\" rel=\"noopener noreferrer\">詳細・手順</a>"
  # summary生成
  echo "<div class=\"summary\">$ENV<br><strong>説明:</strong> $DESC<br>$LINK</div>" >> "$TMP_SUMMARY"
done

# index.htmlのsummaries部分を置換
awk -v summary="$(cat $TMP_SUMMARY 2>/dev/null)" '
  BEGIN{inblock=0}
  /<!-- summaries here -->/{print; print summary; inblock=1; next}
  /<!-- summaries end -->/{inblock=0}
  {if(!inblock) print}
' "$INDEX" > "$INDEX.tmp" && mv "$INDEX.tmp" "$INDEX"
rm -f "$TMP_SUMMARY"
echo "summaries updated!"
