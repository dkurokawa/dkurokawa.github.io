# Go 環境でのシークレット管理完全ガイド

## 1. 環境変数管理の選択肢

### 1.1 各手法の比較

| 手法 | メリット | デメリット | 推奨用途 |
|------|--------|------------|----------|
| os.Getenv() | 標準ライブラリのみ | .envファイル非対応 | CI/CD、本番環境 |
| godotenv | シンプル、人気 | 追加依存 | 開発環境 |
| viper | 多機能、設定管理 | 学習コスト | 大規模アプリ |
| direnv | シェル統合 | 初期設定必要 | ローカル開発 |

## 2. godotenv を使った実装

### 2.1 インストール

```bash
go get github.com/joho/godotenv
```

### 2.2 基本的な使い方

```go
// main.go
package main

import (
    "fmt"
    "log"
    "os"
    
    "github.com/joho/godotenv"
)

func init() {
    // .envファイルを読み込む
    if err := godotenv.Load(); err != nil {
        log.Printf("Warning: .env file not found")
    }
}

func main() {
    // 環境変数を取得
    githubToken := os.Getenv("GITHUB_TOKEN")
    apiKey := os.Getenv("API_KEY")
    
    if githubToken == "" {
        log.Fatal("GITHUB_TOKEN is required")
    }
    
    fmt.Printf("Token loaded: %s...\n", githubToken[:10])
}
```

### 2.3 環境別の設定

```go
// config/env.go
package config

import (
    "fmt"
    "os"
    
    "github.com/joho/godotenv"
)

// LoadEnv loads the appropriate .env file based on environment
func LoadEnv() error {
    env := os.Getenv("GO_ENV")
    if env == "" {
        env = "development"
    }
    
    // 環境別のファイルを試行
    files := []string{
        fmt.Sprintf(".env.%s.local", env), // 最優先（gitignore）
        fmt.Sprintf(".env.%s", env),       // 環境別
        ".env.local",                       // ローカル共通（gitignore）
        ".env",                            // デフォルト
    }
    
    for _, file := range files {
        if _, err := os.Stat(file); err == nil {
            return godotenv.Load(file)
        }
    }
    
    return nil
}
```

### 2.4 環境変数ファイルの例

```bash
# .env - デフォルト設定（コミット可）
APP_NAME=ppn-updater
LOG_LEVEL=info
API_TIMEOUT=30s

# .env.local - ローカル用シークレット（gitignore）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
PPN_PAGE_TRIGGER_TOKEN=github_pat_xxxxxxxxxxxx
DATABASE_URL=postgres://user:pass@localhost/dbname
API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

# .env.test - テスト環境
DATABASE_URL=postgres://test:test@localhost/test_db
API_MOCK=true
LOG_LEVEL=debug

# .env.production - 本番環境（シークレットは含めない）
LOG_LEVEL=warn
API_TIMEOUT=10s
ENABLE_METRICS=true
```

## 3. viper を使った高度な設定管理

### 3.1 インストール

```bash
go get github.com/spf13/viper
```

### 3.2 Viperの実装

```go
// config/config.go
package config

import (
    "fmt"
    "strings"
    
    "github.com/spf13/viper"
)

type Config struct {
    App      AppConfig
    GitHub   GitHubConfig
    Database DatabaseConfig
}

type AppConfig struct {
    Name     string
    Version  string
    LogLevel string
}

type GitHubConfig struct {
    Token       string
    TriggerToken string
    BaseURL     string
}

type DatabaseConfig struct {
    URL         string
    MaxConn     int
    MaxIdleConn int
}

// LoadConfig reads configuration from files and environment variables
func LoadConfig() (*Config, error) {
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath(".")
    viper.AddConfigPath("./config")
    
    // 環境変数のプレフィックス
    viper.SetEnvPrefix("PPN")
    viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
    viper.AutomaticEnv()
    
    // デフォルト値
    viper.SetDefault("app.name", "ppn-updater")
    viper.SetDefault("app.loglevel", "info")
    viper.SetDefault("github.baseurl", "https://api.github.com")
    viper.SetDefault("database.maxconn", 10)
    
    // 設定ファイルを読み込む（オプション）
    if err := viper.ReadInConfig(); err != nil {
        if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
            return nil, err
        }
    }
    
    var config Config
    if err := viper.Unmarshal(&config); err != nil {
        return nil, err
    }
    
    return &config, nil
}
```

### 3.3 設定ファイル（config.yaml）

```yaml
# config.yaml
app:
  name: ppn-updater
  version: 1.0.0
  loglevel: info

github:
  baseurl: https://api.github.com
  
database:
  maxconn: 25
  maxidleconn: 5
```

### 3.4 使用例

```go
// main.go
package main

import (
    "log"
    
    "myapp/config"
)

func main() {
    cfg, err := config.LoadConfig()
    if err != nil {
        log.Fatal("Failed to load config:", err)
    }
    
    // 環境変数 PPN_GITHUB_TOKEN または config.yamlのgithub.token
    if cfg.GitHub.Token == "" {
        log.Fatal("GitHub token is required")
    }
    
    log.Printf("Starting %s v%s", cfg.App.Name, cfg.App.Version)
}
```

## 4. 構造化された環境変数管理

### 4.1 環境変数の定義と検証

```go
// internal/env/env.go
package env

import (
    "fmt"
    "os"
    "strconv"
    "time"
)

// Env holds all environment variables
type Env struct {
    // Required
    GitHubToken      string
    PPNTriggerToken  string
    
    // Optional with defaults
    Port             int
    LogLevel         string
    APITimeout       time.Duration
    MaxRetries       int
    
    // Feature flags
    EnableMetrics    bool
    EnableProfiling  bool
}

// Load reads and validates environment variables
func Load() (*Env, error) {
    env := &Env{}
    
    // Required variables
    env.GitHubToken = os.Getenv("GITHUB_TOKEN")
    if env.GitHubToken == "" {
        return nil, fmt.Errorf("GITHUB_TOKEN is required")
    }
    
    env.PPNTriggerToken = os.Getenv("PPN_PAGE_TRIGGER_TOKEN")
    if env.PPNTriggerToken == "" {
        return nil, fmt.Errorf("PPN_PAGE_TRIGGER_TOKEN is required")
    }
    
    // Optional with defaults
    env.Port = getEnvAsInt("PORT", 8080)
    env.LogLevel = getEnvAsString("LOG_LEVEL", "info")
    env.APITimeout = getEnvAsDuration("API_TIMEOUT", 30*time.Second)
    env.MaxRetries = getEnvAsInt("MAX_RETRIES", 3)
    
    // Feature flags
    env.EnableMetrics = getEnvAsBool("ENABLE_METRICS", false)
    env.EnableProfiling = getEnvAsBool("ENABLE_PROFILING", false)
    
    return env, nil
}

// Helper functions
func getEnvAsString(key, defaultVal string) string {
    if val := os.Getenv(key); val != "" {
        return val
    }
    return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
    valStr := os.Getenv(key)
    if val, err := strconv.Atoi(valStr); err == nil {
        return val
    }
    return defaultVal
}

func getEnvAsBool(key string, defaultVal bool) bool {
    valStr := os.Getenv(key)
    if val, err := strconv.ParseBool(valStr); err == nil {
        return val
    }
    return defaultVal
}

func getEnvAsDuration(key string, defaultVal time.Duration) time.Duration {
    valStr := os.Getenv(key)
    if val, err := time.ParseDuration(valStr); err == nil {
        return val
    }
    return defaultVal
}
```

### 4.2 シークレット管理のベストプラクティス

```go
// internal/secrets/secrets.go
package secrets

import (
    "crypto/rand"
    "encoding/base64"
    "errors"
    "fmt"
    "os"
    "strings"
)

// SecretManager handles sensitive data
type SecretManager struct {
    secrets map[string]string
}

// NewSecretManager creates a new secret manager
func NewSecretManager() *SecretManager {
    return &SecretManager{
        secrets: make(map[string]string),
    }
}

// LoadFromEnv loads secrets from environment variables
func (sm *SecretManager) LoadFromEnv(keys []string) error {
    for _, key := range keys {
        value := os.Getenv(key)
        if value == "" {
            return fmt.Errorf("secret %s not found in environment", key)
        }
        sm.secrets[key] = value
    }
    return nil
}

// Get retrieves a secret value
func (sm *SecretManager) Get(key string) (string, error) {
    value, ok := sm.secrets[key]
    if !ok {
        return "", errors.New("secret not found")
    }
    return value, nil
}

// Redact masks sensitive parts of a string
func (sm *SecretManager) Redact(text string) string {
    result := text
    for _, secret := range sm.secrets {
        if len(secret) > 10 {
            masked := secret[:4] + "****" + secret[len(secret)-4:]
            result = strings.ReplaceAll(result, secret, masked)
        }
    }
    return result
}
```

## 5. direnv を使った開発環境設定

### 5.1 direnvのインストールと設定

```bash
# macOS
brew install direnv

# Ubuntu/Debian
sudo apt-get install direnv

# シェルへの統合（.zshrc または .bashrc に追加）
eval "$(direnv hook zsh)"  # Zsh
eval "$(direnv hook bash)" # Bash
```

### 5.2 .envrcファイルの作成

```bash
# .envrc
# プロジェクトディレクトリに入ると自動的に読み込まれる

# Go環境の設定
export GO_ENV=development
export CGO_ENABLED=0
export GOFLAGS="-mod=readonly"

# アプリケーション設定
export APP_NAME="ppn-updater"
export LOG_LEVEL=debug

# シークレット（.gitignoreに追加）
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
export PPN_PAGE_TRIGGER_TOKEN="github_pat_xxxxxxxxxxxx"
export DATABASE_URL="postgres://localhost/ppn_dev"

# PATH の拡張
PATH_add bin
PATH_add scripts

# 関数定義
ppn-test() {
    go test -v ./...
}

ppn-run() {
    go run cmd/updater/main.go "$@"
}
```

### 5.3 direnvの承認

```bash
# .envrcを信頼する
direnv allow

# 環境変数の確認
direnv status
```

## 6. テストでの環境変数

### 6.1 テスト用の環境設定

```go
// internal/testutil/env.go
package testutil

import (
    "os"
    "testing"
)

// SetupTestEnv sets up environment variables for testing
func SetupTestEnv(t *testing.T) func() {
    t.Helper()
    
    // 現在の環境変数を保存
    originalEnv := make(map[string]string)
    testEnvVars := map[string]string{
        "GITHUB_TOKEN":          "test-github-token",
        "PPN_PAGE_TRIGGER_TOKEN": "test-trigger-token",
        "LOG_LEVEL":             "debug",
        "DATABASE_URL":          "postgres://test@localhost/test_db",
    }
    
    // テスト用の値を設定
    for key, value := range testEnvVars {
        originalEnv[key] = os.Getenv(key)
        os.Setenv(key, value)
    }
    
    // クリーンアップ関数を返す
    return func() {
        for key, value := range originalEnv {
            if value == "" {
                os.Unsetenv(key)
            } else {
                os.Setenv(key, value)
            }
        }
    }
}

// WithEnv temporarily sets environment variables for a test
func WithEnv(t *testing.T, envVars map[string]string, fn func()) {
    t.Helper()
    
    original := make(map[string]string)
    for key, value := range envVars {
        original[key] = os.Getenv(key)
        os.Setenv(key, value)
    }
    
    defer func() {
        for key, value := range original {
            if value == "" {
                os.Unsetenv(key)
            } else {
                os.Setenv(key, value)
            }
        }
    }()
    
    fn()
}
```

### 6.2 テストでの使用例

```go
// config_test.go
package config

import (
    "testing"
    
    "myapp/internal/testutil"
)

func TestLoadConfig(t *testing.T) {
    cleanup := testutil.SetupTestEnv(t)
    defer cleanup()
    
    cfg, err := LoadConfig()
    if err != nil {
        t.Fatalf("LoadConfig failed: %v", err)
    }
    
    if cfg.GitHub.Token != "test-github-token" {
        t.Errorf("expected test-github-token, got %s", cfg.GitHub.Token)
    }
}

func TestConfigWithCustomEnv(t *testing.T) {
    testutil.WithEnv(t, map[string]string{
        "API_TIMEOUT": "5s",
        "MAX_RETRIES": "10",
    }, func() {
        cfg, _ := LoadConfig()
        // テスト実行
    })
}
```

## 7. CI/CDでの環境変数

### 7.1 GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    env:
      GO_VERSION: "1.21"
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: ${{ env.GO_VERSION }}
          
      - name: Run tests
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PPN_PAGE_TRIGGER_TOKEN: ${{ secrets.PPN_PAGE_TRIGGER_TOKEN }}
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
        run: |
          go test -v -race -coverprofile=coverage.out ./...
          go tool cover -html=coverage.out -o coverage.html
```

### 7.2 Dockerfile での環境変数

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 依存関係のキャッシュ
COPY go.mod go.sum ./
RUN go mod download

# ソースコードのコピー
COPY . .

# ビルド時の環境変数
ARG VERSION=dev
ARG BUILD_TIME

# ビルド
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-w -s -X main.version=${VERSION} -X main.buildTime=${BUILD_TIME}" \
    -o updater cmd/updater/main.go

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/updater .

# 実行時の環境変数（デフォルト値）
ENV LOG_LEVEL=info
ENV PORT=8080

EXPOSE 8080

CMD ["./updater"]
```

### 7.3 docker-compose での設定

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "${PORT:-8080}:8080"
    environment:
      - LOG_LEVEL=${LOG_LEVEL:-info}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - PPN_PAGE_TRIGGER_TOKEN=${PPN_PAGE_TRIGGER_TOKEN}
      - DATABASE_URL=postgres://postgres:password@db:5432/ppn_db
    env_file:
      - .env
      - .env.local  # gitignore対象
    depends_on:
      - db
      
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ppn_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 8. セキュリティのベストプラクティス

### 8.1 シークレットの暗号化

```go
// internal/crypto/encrypt.go
package crypto

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "encoding/base64"
    "errors"
    "io"
)

// EncryptSecret encrypts a secret using AES-GCM
func EncryptSecret(plaintext string, key []byte) (string, error) {
    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }
    
    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return "", err
    }
    
    ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
    return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// DecryptSecret decrypts a secret using AES-GCM
func DecryptSecret(ciphertext string, key []byte) (string, error) {
    data, err := base64.StdEncoding.DecodeString(ciphertext)
    if err != nil {
        return "", err
    }
    
    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }
    
    nonceSize := gcm.NonceSize()
    if len(data) < nonceSize {
        return "", errors.New("ciphertext too short")
    }
    
    nonce, ciphertext := data[:nonceSize], data[nonceSize:]
    plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        return "", err
    }
    
    return string(plaintext), nil
}
```

### 8.2 環境変数の監査ログ

```go
// internal/audit/env.go
package audit

import (
    "log"
    "os"
    "strings"
    "time"
)

// LogEnvironmentAccess logs when sensitive environment variables are accessed
func LogEnvironmentAccess(key string) {
    sensitiveKeys := []string{
        "TOKEN",
        "KEY",
        "SECRET",
        "PASSWORD",
        "CREDENTIAL",
    }
    
    for _, sensitive := range sensitiveKeys {
        if strings.Contains(strings.ToUpper(key), sensitive) {
            log.Printf("[AUDIT] %s - Sensitive environment variable accessed: %s",
                time.Now().Format(time.RFC3339),
                key,
            )
            break
        }
    }
}

// GetenvWithAudit wraps os.Getenv with audit logging
func GetenvWithAudit(key string) string {
    LogEnvironmentAccess(key)
    return os.Getenv(key)
}
```

## 9. トラブルシューティング

### 9.1 デバッグヘルパー

```go
// cmd/debug/main.go
package main

import (
    "fmt"
    "os"
    "sort"
    "strings"
)

func main() {
    fmt.Println("=== Environment Variables Debug ===")
    fmt.Println()
    
    // すべての環境変数を取得
    envVars := os.Environ()
    sort.Strings(envVars)
    
    // グループ別に分類
    appVars := []string{}
    systemVars := []string{}
    
    for _, env := range envVars {
        if strings.HasPrefix(env, "PPN_") || 
           strings.Contains(env, "GITHUB") ||
           strings.Contains(env, "API") {
            appVars = append(appVars, env)
        } else {
            systemVars = append(systemVars, env)
        }
    }
    
    fmt.Println("Application Variables:")
    for _, v := range appVars {
        parts := strings.SplitN(v, "=", 2)
        key := parts[0]
        value := parts[1]
        
        // センシティブな値をマスク
        if strings.Contains(key, "TOKEN") || strings.Contains(key, "KEY") {
            if len(value) > 10 {
                value = value[:4] + "..." + value[len(value)-4:]
            }
        }
        
        fmt.Printf("  %s=%s\n", key, value)
    }
    
    fmt.Printf("\nTotal environment variables: %d\n", len(envVars))
    fmt.Printf("Application variables: %d\n", len(appVars))
}
```

### 9.2 よくある問題と解決方法

1. **環境変数が読み込まれない**
   ```bash
   # 確認コマンド
   go run -ldflags="-X main.debug=true" main.go
   
   # 環境変数の確認
   env | grep PPN
   ```

2. **direnvが動作しない**
   ```bash
   # direnvの再読み込み
   direnv reload
   
   # 設定の確認
   direnv status
   ```

3. **Dockerで環境変数が渡らない**
   ```bash
   # デバッグ実行
   docker run --rm -e DEBUG=true myapp env
   ```