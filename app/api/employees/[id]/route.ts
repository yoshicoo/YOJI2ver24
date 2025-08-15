import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 個別の従業員データ取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      comments (
        id,
        content,
        created_at,
        created_by,
        users (name)
      ),
      change_history (
        id,
        field_name,
        old_value,
        new_value,
        changed_at,
        changed_by,
        users:changed_by (name)
      )
    `)
    .eq('id', params.id)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// 従業員データの更新
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await request.json()
  
  // 現在のユーザー取得
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
  }
  
  // 現在のデータを取得（履歴記録用）
  const { data: currentData } = await supabase
    .from('employees')
    .select('*')
    .eq('id', params.id)
    .single()
  
  // データ更新
  const { data, error } = await supabase
    .from('employees')
    .update({
      ...body,
      updated_at: new Date().toISOString(),
      updated_by: user.id
    })
    .eq('id', params.id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
  
  // 変更履歴を記録
  if (currentData) {
    const changes = []
    for (const key in body) {
      if (currentData[key] !== body[key]) {
        changes.push({
          employee_id: params.id,
          field_name: key,
          old_value: currentData[key],
          new_value: body[key],
          changed_by: user.id
        })
      }
    }
    
    if (changes.length > 0) {
      await supabase.from('change_history').insert(changes)
    }
  }
  
  return NextResponse.json({ data, success: true })
}

// 従業員データの削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', params.id)
  
  if (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}