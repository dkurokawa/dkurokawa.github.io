#!/bin/bash
# Direct project information collection script
# 個々の.htmlファイルに依存せず、プロジェクトから直接情報を収集

set -e
WORKDIR="$(cd "$(dirname "$0")" && pwd)"
INDEX="$WORKDIR/index.html"
TMP_SUMMARY="$WORKDIR/.tmp_summary.html"

# Clear the temporary file
> "$TMP_SUMMARY"

# Function to extract version from package.json
get_node_version() {
    local pkg="$1/package.json"
    if [ -f "$pkg" ]; then
        grep '"version"' "$pkg" 2>/dev/null | sed -E 's/.*"([0-9]+\.[0-9]+\.[0-9]+)".*/v\1/' | head -1
    fi
}

# Function to extract description from package.json
get_node_description() {
    local pkg="$1/package.json"
    if [ -f "$pkg" ]; then
        grep '"description"' "$pkg" 2>/dev/null | sed -E 's/.*"description":\s*"([^"]+)".*/\1/' | head -1
    fi
}

# Function to get Go version from git tags
get_go_version() {
    local dir="$1"
    if [ -d "$dir/.git" ]; then
        cd "$dir" && git describe --tags --abbrev=0 2>/dev/null || echo ""
        cd - > /dev/null
    fi
}

# Function to get description from instruction.txt
get_description() {
    local txt_file="$1/.instruction.txt"
    if [ -f "$txt_file" ]; then
        # Read all lines except URLs
        grep -v '^https\?://' "$txt_file" 2>/dev/null | tr '\n' ' ' | sed 's/  */ /g' | sed 's/^ *//;s/ *$//'
    fi
}

# Function to get URL from instruction.txt
get_detail_url() {
    local txt_file="$1/.instruction.txt"
    if [ -f "$txt_file" ]; then
        # Extract the first URL line
        grep '^https\?://' "$txt_file" 2>/dev/null | head -1
    fi
}

# Process each project
process_project() {
    local project_dir="$1"
    local project_name="$(basename "$project_dir")"
    local name=""
    local version=""
    local env=""
    local desc=""
    local link=""
    
    # Get description and URL from instruction.txt
    desc=$(get_description "$project_dir")
    detail_url=$(get_detail_url "$project_dir")
    
    case "$project_name" in
        "books")
            name="Books (プログラミング教材書籍)"
            version=$(get_node_version "$project_dir")
            env="ウェブサイト"
            ;;
        "check-nc-licenses")
            name="check-nc-licenses"
            version=$(get_node_version "$project_dir")
            env="npm package"
            ;;
        "cpu-harmony")
            name="CPU Harmony"
            version=$(get_go_version "$project_dir")
            env="macOS"
            ;;
        "portman")
            name="Portman"
            version=$(get_go_version "$project_dir")
            env="CLI (macOS, Linux)"
            ;;
        "vscode-port-monitor")
            name="VSCode Port Monitor"
            version=$(get_node_version "$project_dir")
            env="VS Code拡張機能"
            ;;
        "vscode-web-panel")
            name="VSCode Web Panel"
            version=$(get_node_version "$project_dir")
            env="VS Code拡張機能"
            ;;
    esac
    
    # Check if project has instruction.html for link
    if [ -f "$project_dir/.instruction.html" ]; then
        # Copy to projects directory
        local project_name=$(basename "$project_dir")
        cp "$project_dir/.instruction.html" "$WORKDIR/projects/${project_name}.html"
        link="<a href=\"projects/${project_name}.html\" target=\"_blank\" rel=\"noopener noreferrer\">詳細な手順・説明はこちら</a>"
    fi
    
    # Generate summary
    if [ -n "$name" ]; then
        {
            echo "<div class=\"summary\">"
            if [ -n "$version" ]; then
                echo "  <strong>$name</strong> $version<br>"
            else
                echo "  <strong>$name</strong><br>"
            fi
            echo "  <div class=\"env-desc\">"
            echo "    <strong>環境:</strong> $env<br>"
            
            # Show install command for npm packages
            if [ "$env" = "npm package" ] && [ -n "$name" ]; then
                # Convert display name to package name (lowercase, no spaces)
                local pkg_name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
                local npm_cmd="npm install -g $pkg_name"
                echo "    <strong>インストール:</strong> <code>$npm_cmd</code>"
                echo "    <button class=\"copy-button\" onclick=\"copyToClipboard('$npm_cmd', this)\">コピー</button><br>"
            fi
            
            # Show marketplace info for VS Code extensions
            if [ "$env" = "VS Code拡張機能" ]; then
                echo "    <strong>インストール:</strong> VS Code Marketplaceで「${name}」を検索<br>"
            fi
            
            # Show install info for CPU Harmony
            if [ "$name" = "CPU Harmony" ]; then
                echo "    <strong>インストール:</strong> <code>brew install dkurokawa/tap/cpu-harmony</code>"
                echo "    <button class=\"copy-button\" onclick=\"copyToClipboard('brew install dkurokawa/tap/cpu-harmony', this)\">コピー</button><br>"
                echo "    <span style=\"font-size: 0.9em; color: #666;\">または <a href=\"https://github.com/dkurokawa/cpu-harmony/releases\" target=\"_blank\">GitHubのReleasesページ</a>からダウンロード</span><br>"
            fi
            
            # Show install info for Portman
            if [ "$name" = "Portman" ]; then
                echo "    <strong>インストール:</strong> <code>brew install dkurokawa/tap/portman</code>"
                echo "    <button class=\"copy-button\" onclick=\"copyToClipboard('brew install dkurokawa/tap/portman', this)\">コピー</button><br>"
                echo "    <span style=\"font-size: 0.9em; color: #666;\">または <a href=\"https://github.com/dkurokawa/portman/releases\" target=\"_blank\">GitHubのReleasesページ</a>からダウンロード</span><br>"
            fi
            
            echo -n "    <strong>説明:</strong> $desc"
            if [ -n "$detail_url" ]; then
                echo " <a href=\"$detail_url\" target=\"_blank\" rel=\"noopener noreferrer\">詳細はこちら</a><br>"
            else
                echo "<br>"
            fi
            if [ -n "$link" ]; then
                echo "    $link"
            fi
            echo "  </div>"
            echo "</div>"
            echo "<hr>"
        } >> "$TMP_SUMMARY"
    fi
}

# Process all projects
for project_dir in "$WORKDIR/target-projects"/*; do
    if [ -d "$project_dir" ]; then
        process_project "$project_dir"
    fi
done

# Replace summaries section in index.html
awk -v summary_file="$TMP_SUMMARY" '
  BEGIN{inblock=0}
  /<!-- summaries here -->/{
    print;
    print "<div class=\"summaries-container\">";
    while ((getline line < summary_file) > 0) print line;
    close(summary_file);
    print "</div>";
    inblock=1; next
  }
  /<!-- summaries end -->/{print; inblock=0; next}
  {if(!inblock) print}
' "$INDEX" > "$INDEX.tmp"

# Remove existing update date and add new one
UPDATE_DATE=$(date +"%Y年%m月%d日 %H:%M")

# Remove all existing update date divs and add the new one before </body>
awk -v date="$UPDATE_DATE" '
  BEGIN { in_update_div = 0; skip_next = 0 }
  /<div style="text-align: center; margin-top: 40px; padding: 20px 0; color: #666; font-size: 0.9rem;">/ {
    # Check if next line contains 最終更新
    getline next_line
    if (next_line ~ /最終更新:/) {
      in_update_div = 1
      next
    } else {
      print $0
      print next_line
    }
    next
  }
  in_update_div && /<\/div>/ { in_update_div = 0; next }
  in_update_div { next }
  /<\/body>/ {
    print "  <div style=\"text-align: center; margin-top: 40px; padding: 20px 0; color: #666; font-size: 0.9rem;\">"
    print "    最終更新: " date
    print "  </div>"
    print
    next
  }
  { print }
' "$INDEX.tmp" > "$INDEX"
rm -f "$INDEX.tmp"

rm -f "$TMP_SUMMARY"

# Generate mini-panel.html
MINI_PANEL="$WORKDIR/mini-panel.html"
cat > "$MINI_PANEL" << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSS Projects</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif;
            font-size: 13px;
            line-height: 1.4;
            color: #333;
            background: #f8f9fa;
            padding: 12px;
            width: 300px;
        }
        h2 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #222;
            text-align: center;
        }
        .project-list {
            background: white;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            overflow: hidden;
        }
        .project-item {
            padding: 8px 12px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s;
        }
        .project-item:hover {
            background-color: #f3f4f6;
        }
        .project-item:last-child {
            border-bottom: none;
        }
        .project-name {
            font-weight: 500;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 8px;
        }
        .project-version {
            font-size: 11px;
            color: #666;
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            white-space: nowrap;
        }
        .no-version {
            color: #999;
        }
        .footer {
            margin-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #666;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h2>OSS Projects</h2>
    <div class="project-list">
EOF

# Process each project for mini panel
for project_dir in "$WORKDIR/target-projects"/*; do
    if [ -d "$project_dir" ]; then
        project_name="$(basename "$project_dir")"
        name=""
        version=""
        
        case "$project_name" in
            "books")
                name="Books"
                version=$(get_node_version "$project_dir")
                ;;
            "check-nc-licenses")
                name="check-nc-licenses"
                version=$(get_node_version "$project_dir")
                ;;
            "cpu-harmony")
                name="CPU Harmony"
                version=$(get_go_version "$project_dir")
                ;;
            "portman")
                name="Portman"
                version=$(get_go_version "$project_dir")
                ;;
            "vscode-port-monitor")
                name="Port Monitor"
                version=$(get_node_version "$project_dir")
                ;;
            "vscode-web-panel")
                name="Web Panel"
                version=$(get_node_version "$project_dir")
                ;;
        esac
        
        if [ -n "$name" ]; then
            echo "        <div class=\"project-item\">" >> "$MINI_PANEL"
            echo "            <span class=\"project-name\">$name</span>" >> "$MINI_PANEL"
            if [ -n "$version" ]; then
                echo "            <span class=\"project-version\">$version</span>" >> "$MINI_PANEL"
            else
                echo "            <span class=\"project-version no-version\">-</span>" >> "$MINI_PANEL"
            fi
            echo "        </div>" >> "$MINI_PANEL"
        fi
    fi
done

cat >> "$MINI_PANEL" << EOF
    </div>
    <div class="footer">
        <a href="https://github.com/dkurokawa" target="_blank">GitHub</a>
        <div style="margin-top: 8px; font-size: 10px; color: #999;">
            最終更新: $UPDATE_DATE
        </div>
    </div>
</body>
</html>
EOF

echo "All project summaries updated!"
echo "Mini panel generated: mini-panel.html"
echo "File URL: file://$MINI_PANEL"