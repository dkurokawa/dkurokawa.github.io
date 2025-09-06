# Vitest 環境でのシークレット管理完全ガイド

## 1. 基本設定

### 1.1 必要なパッケージのインストール

```bash
# dotenvパッケージをインストール（通常はviteに含まれている）
npm install -D dotenv
```

### 1.2 環境変数ファイルの作成

```bash
# プロジェクトルートに作成
touch .env.test
touch .env.test.local  # ローカル専用（gitignore対象）
```

### 1.3 .gitignoreに追加

```gitignore
# 環境変数ファイル
.env
.env.local
.env.*.local
.env.test.local

# IDEの設定
.vscode/settings.json
.idea/
```

## 2. Vitest設定

### 2.1 vitest.config.ts の設定

```typescript
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 環境変数を読み込み（第3引数を''にすることで全ての環境変数を読み込む）
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    test: {
      // テスト環境の設定
      environment: 'node',
      
      // 環境変数の設定
      env: {
        // Viteのプレフィックスなしで環境変数を使う場合
        GITHUB_TOKEN: env.GITHUB_TOKEN,
        PPN_PAGE_TRIGGER_TOKEN: env.PPN_PAGE_TRIGGER_TOKEN,
        API_KEY: env.API_KEY,
      },
      
      // setupファイルの指定
      setupFiles: ['./tests/setup.ts'],
      
      // グローバル設定
      globals: true,
    },
    
    // エイリアスの設定
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  }
})
```

### 2.2 別の方法：dotenvを直接使用

```typescript
import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'
import { resolve } from 'path'

// 環境に応じて異なる.envファイルを読み込む
const envFile = process.env.NODE_ENV === 'test' 
  ? '.env.test' 
  : '.env.test.local'

config({ path: resolve(__dirname, envFile) })

export default defineConfig({
  test: {
    env: {
      // process.envから直接読み込み
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
      PPN_PAGE_TRIGGER_TOKEN: process.env.PPN_PAGE_TRIGGER_TOKEN || '',
    },
  },
})
```

## 3. テストでの使用方法

### 3.1 環境変数ファイル（.env.test）

```bash
# .env.test - コミット可能な設定（ダミー値）
NODE_ENV=test
API_URL=http://localhost:3000
TIMEOUT=5000

# .env.test.local - 実際のシークレット（gitignore対象）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
PPN_PAGE_TRIGGER_TOKEN=github_pat_xxxxxxxxxxxx
API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

### 3.2 テストファイルでの使用

```typescript
// tests/api/github.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { GitHubClient } from '@/lib/github'

describe('GitHub API Tests', () => {
  let client: GitHubClient
  
  beforeAll(() => {
    // 環境変数の確認
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error('GITHUB_TOKEN is not set in environment variables')
    }
    
    client = new GitHubClient(token)
  })
  
  it('should fetch user repositories', async () => {
    const repos = await client.getUserRepos('dkurokawa')
    expect(repos).toBeDefined()
    expect(Array.isArray(repos)).toBe(true)
  })
})
```

### 3.3 モック用の環境変数

```typescript
// tests/setup.ts
import { vi } from 'vitest'

// テスト用のグローバル設定
beforeAll(() => {
  // 環境変数のモック（必要に応じて）
  vi.stubEnv('NODE_ENV', 'test')
  
  // デフォルト値の設定
  if (!process.env.API_URL) {
    process.env.API_URL = 'http://localhost:3000'
  }
})

// 各テスト後のクリーンアップ
afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
})
```

## 4. TypeScriptの型定義

### 4.1 環境変数の型定義（env.d.ts）

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_PUBLIC_KEY: string
  // Viteプレフィックスなしの環境変数
  readonly GITHUB_TOKEN?: string
  readonly PPN_PAGE_TRIGGER_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// process.envの型定義
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    GITHUB_TOKEN?: string
    PPN_PAGE_TRIGGER_TOKEN?: string
    API_KEY?: string
    API_URL?: string
  }
}
```

### 4.2 環境変数のバリデーション

```typescript
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  GITHUB_TOKEN: z.string().min(1),
  PPN_PAGE_TRIGGER_TOKEN: z.string().min(1),
  API_URL: z.string().url().optional(),
})

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env)
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format())
    throw new Error('Invalid environment variables')
  }
  
  return parsed.data
}

// 使用例
export const env = validateEnv()
```

## 5. CI/CD環境での設定

### 5.1 GitHub Actions

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        env:
          # GitHub Secretsから環境変数を設定
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PPN_PAGE_TRIGGER_TOKEN: ${{ secrets.PPN_PAGE_TRIGGER_TOKEN }}
          API_KEY: ${{ secrets.API_KEY }}
        run: npm test
```

### 5.2 ローカルでのCI環境再現

```bash
# act を使用してローカルでGitHub Actionsを実行
brew install act

# .secrets ファイルを作成
cat > .secrets <<EOF
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
PPN_PAGE_TRIGGER_TOKEN=github_pat_xxxxxxxxxxxx
API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
EOF

# ローカルで実行
act -s .secrets
```

## 6. 高度な使用例

### 6.1 環境ごとの設定切り替え

```typescript
// tests/config/env-loader.ts
import { config } from 'dotenv'
import { resolve } from 'path'

export function loadTestEnv(environment: 'unit' | 'integration' | 'e2e' = 'unit') {
  const envFiles = {
    unit: '.env.test',
    integration: '.env.test.integration',
    e2e: '.env.test.e2e',
  }
  
  // ベースの環境変数を読み込み
  config({ path: resolve(process.cwd(), '.env.test') })
  
  // 環境固有の設定を上書き
  config({ 
    path: resolve(process.cwd(), envFiles[environment]),
    override: true 
  })
  
  // ローカル環境の設定を最優先
  config({ 
    path: resolve(process.cwd(), `${envFiles[environment]}.local`),
    override: true 
  })
}
```

### 6.2 シークレットのマスキング

```typescript
// tests/utils/logger.ts
export function logWithMaskedSecrets(message: string, data: any) {
  const secrets = [
    process.env.GITHUB_TOKEN,
    process.env.API_KEY,
    process.env.PPN_PAGE_TRIGGER_TOKEN,
  ].filter(Boolean)
  
  let maskedData = JSON.stringify(data, null, 2)
  
  secrets.forEach(secret => {
    if (secret) {
      const regex = new RegExp(secret, 'g')
      maskedData = maskedData.replace(regex, '***REDACTED***')
    }
  })
  
  console.log(message, JSON.parse(maskedData))
}
```

## 7. トラブルシューティング

### 7.1 環境変数が読み込まれない

```typescript
// デバッグ用のヘルパー
export function debugEnv() {
  console.log('Current environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VITEST: process.env.VITEST,
    TEST: process.env.TEST,
    CI: process.env.CI,
  })
  
  console.log('Available env vars:', Object.keys(process.env)
    .filter(key => !key.startsWith('npm_'))
    .sort()
  )
}
```

### 7.2 テスト実行スクリプト

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:debug": "vitest --inspect-brk --inspect --logHeapUsage --threads=false",
    "test:ci": "vitest run --reporter=junit --reporter=default",
    "test:watch": "vitest watch"
  }
}
```

## 8. ベストプラクティス

1. **環境変数の分離**
   - 公開可能な設定: `.env.test`
   - シークレット: `.env.test.local`
   - CI用: GitHub Secrets

2. **バリデーション**
   - 起動時に必須の環境変数をチェック
   - zodやjoiでスキーマ定義

3. **セキュリティ**
   - シークレットをログに出力しない
   - エラーメッセージにシークレットを含めない
   - 定期的なトークンローテーション

4. **ドキュメント**
   - 必要な環境変数をREADMEに記載
   - `.env.example`を提供