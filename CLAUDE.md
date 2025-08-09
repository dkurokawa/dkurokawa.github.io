# Project Summary Display Instructions

## update_summaries_direct.sh の機能

このスクリプトは target-projects 内の各プロジェクトの情報を収集し、以下を生成します：

1. **index.html** - プロジェクト一覧を表示
2. **mini-panel.html** - 300px幅のコンパクトなプロジェクト一覧

### .instruction.txt の仕様

各プロジェクトのルートディレクトリの `.instruction.txt` ファイルには以下を記載できます：

1. **説明文** - プロジェクトの簡潔な説明（1行）
2. **URL** - `https://` または `http://` で始まる行は「詳細はこちら」リンクとして表示

例：
```
npm依存関係に含まれる非商用（NC）ライセンスを検出
https://github.com/dkurokawa/check-nc-licenses
```

### npm パッケージの特別処理

環境が「npm package」のプロジェクトには、自動的にインストールコマンドが表示されます：
- 表示形式: `npm install -g [パッケージ名]`
- パッケージ名は表示名から自動生成（小文字、スペースをハイフンに変換）

例：
- check-nc-licenses → `npm install -g check-nc-licenses`

## プロジェクトの追加方法

1. target-projects ディレクトリにプロジェクトのシンボリックリンクを作成
2. プロジェクトのルートディレクトリに `.instruction.txt` ファイルを作成
3. `./update_summaries_direct.sh` を実行

## サポートされるプロジェクトタイプ

- **Node.js プロジェクト** - package.json からバージョンを取得
- **Go プロジェクト** - git タグからバージョンを取得
- **その他** - バージョン表示なし