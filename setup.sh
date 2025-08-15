#!/bin/bash

echo "YOJI2 採用人事予実管理システム セットアップスクリプト"
echo "==========================================="
echo ""

# Node.jsのバージョンチェック
echo "Node.jsのバージョンをチェック中..."
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.jsがインストールされていません。"
    echo "   https://nodejs.org/ からインストールしてください。"
    exit 1
fi
echo "✅ Node.js バージョン: $node_version"
echo ""

# npmパッケージのインストール
echo "依存関係をインストール中..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ パッケージのインストールに失敗しました。"
    exit 1
fi
echo "✅ パッケージのインストール完了"
echo ""

# 環境変数ファイルのセットアップ
if [ ! -f .env.local ]; then
    echo "環境変数ファイルを作成中..."
    cp .env.local.example .env.local
    echo "✅ .env.localを作成しました。"
    echo ""
    echo "⚠️  重要: .env.localファイルを編集してSupabaseの認証情報を設定してください："
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
else
    echo "✅ .env.localは既に存在します。"
fi
echo ""

echo "==========================================="
echo "セットアップが完了しました！"
echo ""
echo "次の手順："
echo "1. Supabaseプロジェクトを作成"
echo "2. supabase/schema.sqlをSupabaseで実行"
echo "3. .env.localに認証情報を設定"
echo "4. npm run dev で開発サーバーを起動"
echo ""
echo "詳細はREADME.mdを参照してください。"