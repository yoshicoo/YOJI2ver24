import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ロール一覧の取得
export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// ロールの作成
export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  // 最大のdisplay_orderを取得
  const { data: maxOrder } = await supabase
    .from('roles')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()
  
  const { data, error } = await supabase
    .from('roles')
    .insert({
      ...body,
      display_order: (maxOrder?.display_order || 0) + 1,
      is_active: true
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// ロールの更新
export async function PUT(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updateData } = body
  
  const { data, error } = await supabase
    .from('roles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// ロールの削除（非アクティブ化）
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }
  
  const { error } = await supabase
    .from('roles')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}