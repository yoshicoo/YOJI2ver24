import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ユーザー設定の取得
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data: data || {}, success: true })
}

// ユーザー設定の保存/更新
export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Upsert (存在すれば更新、なければ作成)
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      settings: body,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}