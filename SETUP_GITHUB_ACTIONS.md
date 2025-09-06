# GitHub Actions 自動更新のセットアップ手順

## 1. GitHub Personal Access Token の作成

1. GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. 新しいトークンを作成：
   - Token name: `ppn-page-trigger`
   - Expiration: 90 days（または任意）
   - Repository access: 各プロジェクトリポジトリを選択
   - Permissions:
     - Contents: Read
     - Actions: Write
3. トークンをコピー

## 2. ppn-page リポジトリの設定

1. ppn-page リポジトリの Settings → Secrets and variables → Actions
2. 何も追加する必要なし（GITHUB_TOKEN で十分）

## 3. 各プロジェクトリポジトリの設定

各プロジェクト（check-nc-licenses, portman など）で：

1. `.github/workflows/trigger-from-release.yml` をコピー
2. Settings → Secrets and variables → Actions
3. 新しいシークレットを追加：
   - Name: `PPN_PAGE_TRIGGER_TOKEN`
   - Value: 手順1で作成したトークン

## 4. 初回実行

ppn-page リポジトリで：
1. Actions タブ → "Update Project Information"
2. "Run workflow" → "Run workflow" をクリック

## 動作確認

- 毎日自動で更新される
- 各プロジェクトでリリースすると自動で更新される
- 手動でも実行可能

## メリット

1. **完全自動化**: 手動更新が不要
2. **リアルタイム**: リリース時に即座に反映
3. **メンテナンスフリー**: プロジェクトを追加する時だけ `projects.json` を更新
4. **バージョン管理**: GitHubのAPIから正確なバージョンを取得
5. **拡張性**: 新しいプロジェクトタイプも簡単に追加可能