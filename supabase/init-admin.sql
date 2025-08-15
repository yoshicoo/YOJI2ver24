-- 初期管理者アカウント作成用SQL
-- Supabase AuthenticationでユーザーをManuallyで作成後、このSQLを実行

-- 1. まず、Supabase Dashboardの Authentication > Users で
--    手動でユーザーを作成してください（例: admin@example.com）

-- 2. 作成したユーザーのUIDをコピーして、以下の[USER_ID]を置き換えてください

-- ユーザー情報を追加
INSERT INTO users (id, email, name, department, is_active)
VALUES (
  '[USER_ID]', -- ← ここにSupabase AuthのユーザーIDを入力
  'admin@example.com', -- ← メールアドレス
  '管理者', -- ← 名前
  'システム管理',
  true
);

-- 管理者権限を付与
INSERT INTO user_permissions (user_id, permission_id)
SELECT 
  '[USER_ID]', -- ← ここにも同じユーザーIDを入力
  id 
FROM permissions 
WHERE name = '管理者権限';

-- 確認
SELECT 
  u.*, 
  p.name as permission_name
FROM users u
JOIN user_permissions up ON u.id = up.user_id
JOIN permissions p ON up.permission_id = p.id
WHERE u.id = '[USER_ID]'; -- ← ここにも同じユーザーIDを入力