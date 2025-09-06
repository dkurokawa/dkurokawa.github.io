# 各環境でのシークレット管理

## 1. Next.js プロジェクト

### 開発環境（.env.local）
```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
PPN_PAGE_TRIGGER_TOKEN=github_pat_xxxxxxxxxxxx
```

### 本番環境（Vercel）
- Vercel Dashboard → Settings → Environment Variables
- 変数を追加して全環境で有効化

### GitHub Actions
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  PPN_PAGE_TRIGGER_TOKEN: ${{ secrets.PPN_PAGE_TRIGGER_TOKEN }}
```

## 2. Vitest（Node.js/TypeScript）

### テスト環境（.env.test）
```bash
# .env.test
GITHUB_TOKEN=test_token_xxxxxxxxxxxx
PPN_PAGE_TRIGGER_TOKEN=test_pat_xxxxxxxxxxxx
```

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

// テスト用の環境変数を読み込み
config({ path: '.env.test' })

export default defineConfig({
  test: {
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      PPN_PAGE_TRIGGER_TOKEN: process.env.PPN_PAGE_TRIGGER_TOKEN,
    },
  },
})
```

### テストでの使用
```typescript
describe('GitHub API', () => {
  const token = process.env.GITHUB_TOKEN
  // または import.meta.env.GITHUB_TOKEN（Vite環境）
})
```

## 3. Go プロジェクト

### 開発環境（.env）
```bash
# .env （.gitignoreに追加）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
PPN_PAGE_TRIGGER_TOKEN=github_pat_xxxxxxxxxxxx
```

### godotenv を使用
```bash
go get github.com/joho/godotenv
```

```go
package main

import (
    "os"
    "log"
    "github.com/joho/godotenv"
)

func init() {
    // 開発環境でのみ.envを読み込み
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }
}

func main() {
    token := os.Getenv("GITHUB_TOKEN")
    triggerToken := os.Getenv("PPN_PAGE_TRIGGER_TOKEN")
}
```

### 環境変数で直接指定
```bash
# 実行時に指定
GITHUB_TOKEN=xxx PPN_PAGE_TRIGGER_TOKEN=yyy go run main.go

# または export
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
export PPN_PAGE_TRIGGER_TOKEN=github_pat_xxxxxxxxxxxx
go run main.go
```

### direnv を使用（推奨）
```bash
# .envrc （.gitignoreに追加）
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
export PPN_PAGE_TRIGGER_TOKEN=github_pat_xxxxxxxxxxxx

# 有効化
direnv allow
```

## 4. GitHub Actions（全プロジェクト共通）

### リポジトリシークレットの設定
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `PPN_PAGE_TRIGGER_TOKEN`
4. Value: 作成したトークンを貼り付け

### ワークフローでの使用
```yaml
- name: Trigger update
  env:
    TOKEN: ${{ secrets.PPN_PAGE_TRIGGER_TOKEN }}
  run: |
    curl -X POST \
      -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/repos/dkurokawa/ppn-page/dispatches \
      -d '{"event_type":"project-update"}'
```

## セキュリティのベストプラクティス

1. **絶対にコミットしない**
   ```gitignore
   .env
   .env.*
   .envrc
   ```

2. **最小権限の原則**
   - 必要最小限のスコープのみ付与
   - 定期的にトークンをローテーション

3. **環境ごとに異なるトークン**
   - 開発用、CI/CD用、本番用で分離

4. **アクセスログの確認**
   - GitHub Settings → Security log
   - 不審なアクセスがないか定期確認