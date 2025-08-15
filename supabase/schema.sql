-- YOJI2 採用人事予実管理システム データベーススキーマ
-- Supabase用SQL

-- 拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. ユーザー・認証関連テーブル
-- ====================================

-- ユーザーテーブル（Supabase Authと連携）
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- 権限テーブル
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  -- 機能権限
  can_view_forecast BOOLEAN DEFAULT false,
  can_edit_forecast BOOLEAN DEFAULT false,
  can_add_new_hire BOOLEAN DEFAULT false,
  can_access_settings BOOLEAN DEFAULT false,
  -- システム権限
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ユーザー権限関連テーブル
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(user_id, permission_id)
);

-- IP制限テーブル
CREATE TABLE ip_restrictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES users(id)
);

-- ====================================
-- 2. カテゴリ・項目管理テーブル
-- ====================================

-- カテゴリテーブル
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES users(id)
);

-- 項目タイプENUM
CREATE TYPE field_type AS ENUM ('text', 'select', 'multiselect', 'date', 'checkbox');

-- 項目テーブル
CREATE TABLE fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  field_type field_type NOT NULL,
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL,
  column_width INTEGER DEFAULT 120,
  is_active BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES users(id)
);

-- 選択肢テーブル（選択形式項目用）
CREATE TABLE field_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  color TEXT, -- HEXカラーコード
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 権限別のカテゴリアクセス制御
CREATE TABLE permission_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  UNIQUE(permission_id, category_id)
);

-- 権限別の項目アクセス制御
CREATE TABLE permission_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  UNIQUE(permission_id, field_id)
);

-- ====================================
-- 3. 入社者管理テーブル
-- ====================================

-- 採用区分ENUM
CREATE TYPE recruitment_type AS ENUM ('new_graduate', 'mid_career', 'contract', 'part_time', 'intern');

-- 雇用形態ENUM
CREATE TYPE employment_type AS ENUM ('full_time', 'contract', 'part_time', 'temporary', 'intern');

-- 入社者基本情報テーブル
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_number TEXT UNIQUE,
  name TEXT NOT NULL,
  name_kana TEXT,
  gender TEXT,
  age INTEGER,
  recruitment_type recruitment_type,
  employment_type employment_type,
  role TEXT,
  department TEXT,
  join_date DATE,
  recruitment_cost DECIMAL(12, 2),
  application_source TEXT,
  recruiter_id UUID REFERENCES users(id),
  hr_status TEXT,
  it_status TEXT,
  hr_admin_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- 動的フィールドデータテーブル（JSONBで柔軟に格納）
CREATE TABLE employee_field_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_by UUID REFERENCES users(id),
  UNIQUE(employee_id, field_id)
);

-- ====================================
-- 4. 履歴・コメント管理テーブル
-- ====================================

-- 変更履歴テーブル
CREATE TABLE change_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  changed_by UUID REFERENCES users(id)
);

-- コメントテーブル
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES users(id)
);

-- ====================================
-- 5. マスタテーブル
-- ====================================

-- 部署マスタ
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 職種マスタ
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================
-- 6. セッション管理テーブル
-- ====================================

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================
-- 7. ユーザー設定テーブル
-- ====================================

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  table_columns_visible JSONB DEFAULT '{}',
  table_page_size INTEGER DEFAULT 25,
  dashboard_date_range JSONB DEFAULT '{"from": null, "to": null}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================
-- インデックス作成
-- ====================================

-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_employees_join_date ON employees(join_date);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_recruitment_type ON employees(recruitment_type);
CREATE INDEX idx_employees_employment_type ON employees(employment_type);
CREATE INDEX idx_employee_field_values_employee_id ON employee_field_values(employee_id);
CREATE INDEX idx_employee_field_values_field_id ON employee_field_values(field_id);
CREATE INDEX idx_change_history_employee_id ON change_history(employee_id);
CREATE INDEX idx_change_history_changed_at ON change_history(changed_at);
CREATE INDEX idx_comments_employee_id ON comments(employee_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ====================================
-- Row Level Security (RLS) ポリシー
-- ====================================

-- RLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_field_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- 基本的なRLSポリシー（認証済みユーザーのみアクセス可能）
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view permissions" ON permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view employees" ON employees
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view departments" ON departments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view roles" ON roles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ====================================
-- 初期データ投入
-- ====================================

-- デフォルト権限
INSERT INTO permissions (name, description, can_view_forecast, can_edit_forecast, can_add_new_hire, can_access_settings, is_admin)
VALUES 
  ('管理者権限', '全機能アクセス可能', true, true, true, true, true),
  ('採用人事権限', '採用関連機能メイン', true, true, true, false, false),
  ('情シス権限', 'IT関連項目中心', true, true, false, false, false),
  ('閲覧権限', '閲覧のみ可能', true, false, false, false, false);

-- デフォルトカテゴリ
INSERT INTO categories (name, display_order) VALUES
  ('管理項目', 1),
  ('入社者情報', 2),
  ('採用情報', 3),
  ('ステータス', 4);

-- デフォルト部署マスタ
INSERT INTO departments (name, display_order) VALUES
  ('営業部', 1),
  ('開発部', 2),
  ('人事部', 3),
  ('経理部', 4),
  ('マーケティング部', 5),
  ('カスタマーサポート部', 6);

-- デフォルト職種マスタ
INSERT INTO roles (name, category, display_order) VALUES
  ('エンジニア', '技術職', 1),
  ('デザイナー', '技術職', 2),
  ('営業', '営業職', 3),
  ('マーケター', 'マーケティング職', 4),
  ('人事', '管理部門', 5),
  ('経理', '管理部門', 6);

-- ====================================
-- トリガー関数
-- ====================================

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();