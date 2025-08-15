# YOJI2 - 採用人事予実管理システム

採用人事における入社者情報の一元管理システムです。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase
- **デプロイ**: Vercel
- **状態管理**: Zustand
- **フォーム**: React Hook Form
- **グラフ**: Recharts

## セットアップ

### 1. 環境変数の設定

`.env.local.example` を `.env.local` にコピーして、Supabaseの認証情報を設定してください。

```bash
cp .env.local.example .env.local
```

以下の環境変数を設定：
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの公開用匿名キー
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseのサービスロールキー

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseデータベースのセットアップ

`supabase/schema.sql` のSQLをSupabaseのSQL Editorで実行してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## Vercelへのデプロイ

### 1. Vercelにプロジェクトをインポート

1. [Vercel](https://vercel.com) にログイン
2. "New Project" をクリック
3. GitHubリポジトリを連携
4. このプロジェクトを選択

### 2. 環境変数の設定

Vercelのプロジェクト設定で以下の環境変数を追加：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. デプロイ

設定が完了したら、自動的にデプロイが開始されます。

## 主な機能

### 認証・セキュリティ
- ID・パスワード認証
- IP制限機能
- セッション管理

### 権限管理
- 複数の権限レベル（管理者、採用人事、情シス、閲覧）
- 機能レベル・データレベルでのアクセス制御

### データ管理
- 入社者情報の登録・編集・削除
- 動的なカテゴリ・項目管理
- 履歴管理とコメント機能

### 分析・レポート
- ダッシュボードでの採用状況可視化
- CSVエクスポート機能
- 月別・部署別・経路別の分析

## ディレクトリ構造

```
yoji2-hr-system/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証済みページレイアウト
│   ├── dashboard/         # ダッシュボード
│   ├── forecast/          # 予実管理
│   ├── settings/          # 設定
│   └── login/             # ログイン
├── components/            # Reactコンポーネント
│   ├── dashboard/         # ダッシュボード関連
│   ├── forecast/          # 予実管理関連
│   ├── settings/          # 設定関連
│   ├── layouts/           # レイアウトコンポーネント
│   └── ui/                # 共通UIコンポーネント
├── lib/                   # ユーティリティ
│   ├── supabase/          # Supabaseクライアント
│   ├── hooks/             # カスタムフック
│   └── utils/             # ユーティリティ関数
├── types/                 # TypeScript型定義
└── supabase/              # データベーススキーマ
```

## ライセンス

プライベートプロジェクト