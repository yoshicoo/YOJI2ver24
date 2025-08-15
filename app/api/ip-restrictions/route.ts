import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// IP制限一覧の取得
export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ip_restrictions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// IP制限の追加
export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // IPアドレスの検証
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/
  
  if (!ipRegex.test(body.ip_address) && !cidrRegex.test(body.ip_address)) {
    return NextResponse.json({ error: 'Invalid IP address format' }, { status: 400 })
  }
  
  const { data, error } = await supabase
    .from('ip_restrictions')
    .insert({
      ...body,
      created_by: user.id
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// IP制限の更新
export async function PUT(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updateData } = body
  
  const { data, error } = await supabase
    .from('ip_restrictions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// IP制限の削除
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }
  
  const { error } = await supabase
    .from('ip_restrictions')
    .delete()
    .eq('id', id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}