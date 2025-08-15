@echo off
echo YOJI2 採用人事予実管理システム セットアップスクリプト
echo ===========================================
echo.

REM Node.jsのバージョンチェック
echo Node.jsのバージョンをチェック中...
node -v >nul 2>&1
if errorlevel 1 (
    echo × Node.jsがインストールされていません。
    echo   https://nodejs.org/ からインストールしてください。
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ○ Node.js バージョン: %NODE_VERSION%
echo.

REM npmパッケージのインストール
echo 依存関係をインストール中...
call npm install
if errorlevel 1 (
    echo × パッケージのインストールに失敗しました。
    pause
    exit /b 1
)
echo ○ パッケージのインストール完了
echo.

REM 環境変数ファイルのセットアップ
if not exist .env.local (
    echo 環境変数ファイルを作成中...
    copy .env.local.example .env.local >nul
    echo ○ .env.localを作成しました。
    echo.
    echo 重要: .env.localファイルを編集してSupabaseの認証情報を設定してください：
    echo   - NEXT_PUBLIC_SUPABASE_URL
    echo   - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo   - SUPABASE_SERVICE_ROLE_KEY
) else (
    echo ○ .env.localは既に存在します。
)
echo.

echo ===========================================
echo セットアップが完了しました！
echo.
echo 次の手順：
echo 1. Supabaseプロジェクトを作成
echo 2. supabase/schema.sqlをSupabaseで実行
echo 3. .env.localに認証情報を設定
echo 4. npm run dev で開発サーバーを起動
echo.
echo 詳細はREADME.mdを参照してください。
pause