import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ユーザー一覧の取得
export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_permissions (
        permission_id,
        permissions (*)
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// ユーザーの作成
export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 注意: 実際の本番環境では、Supabase Admin SDKを使用するか、
  // またはSupabase Dashboardから手動でユーザーを作成し、
  // このAPIではusersテーブルへの登録のみを行う設計にすることを推奨
  
  // 仮のユーザーIDを生成（実際はSupabase Authから取得）
  const userId = crypto.randomUUID()
  
  // usersテーブルにレコード作成
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email: body.email,
      name: body.name,
      department: body.department,
      is_active: true
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // 権限を割り当て
  if (body.permission_ids && body.permission_ids.length > 0) {
    const permissions = body.permission_ids.map((permission_id: string) => ({
      user_id: userId,
      permission_id,
      assigned_by: user.id
    }))
    
    await supabase.from('user_permissions').insert(permissions)
  }
  
  return NextResponse.json({ data, success: true })
}

// ユーザーの更新
export async function PUT(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, permission_ids, ...updateData } = body
  
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // 権限を更新
  if (permission_ids !== undefined) {
    // 既存の権限を削除
    await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', id)
    
    // 新しい権限を追加
    if (permission_ids.length > 0) {
      const { data: { user } } = await supabase.auth.getUser()
      const permissions = permission_ids.map((permission_id: string) => ({
        user_id: id,
        permission_id,
        assigned_by: user?.id
      }))
      
      await supabase.from('user_permissions').insert(permissions)
    }
  }
  
  return NextResponse.json({ data, success: true })
}

// ユーザーの削除（非アクティブ化）
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }
  
  // ユーザーを非アクティブ化
  const { error } = await supabase
    .from('users')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}