import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 従業員データの取得
export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  
  let query = supabase.from('employees').select('*')
  
  // 名前検索
  const name = searchParams.get('name')
  if (name) {
    query = query.ilike('name', `%${name}%`)
  }
  
  // 部署フィルタ
  const department = searchParams.get('department')
  if (department) {
    query = query.eq('department', department)
  }
  
  // 日付範囲フィルタ
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  if (dateFrom) {
    query = query.gte('join_date', dateFrom)
  }
  if (dateTo) {
    query = query.lte('join_date', dateTo)
  }
  
  // ステータスフィルタ
  const status = searchParams.get('status')
  if (status) {
    query = query.or(`hr_status.eq.${status},it_status.eq.${status},hr_admin_status.eq.${status}`)
  }
  
  // 採用区分フィルタ
  const recruitmentType = searchParams.get('recruitmentType')
  if (recruitmentType) {
    query = query.eq('recruitment_type', recruitmentType)
  }
  
  // ソート
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  
  // ページネーション
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '25')
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  // カウント取得用のクエリ
  const countQuery = supabase.from('employees').select('*', { count: 'exact', head: true })
  
  // 同じフィルタを適用
  if (name) countQuery.ilike('name', `%${name}%`)
  if (department) countQuery.eq('department', department)
  if (dateFrom) countQuery.gte('join_date', dateFrom)
  if (dateTo) countQuery.lte('join_date', dateTo)
  if (status) countQuery.or(`hr_status.eq.${status},it_status.eq.${status},hr_admin_status.eq.${status}`)
  if (recruitmentType) countQuery.eq('recruitment_type', recruitmentType)
  
  const { count } = await countQuery
  
  // データ取得
  query = query.range(from, to)
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
  
  return NextResponse.json({
    data,
    success: true,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  })
}

// 従業員データの作成
export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('employees')
    .insert(body)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}

// 従業員データの更新
export async function PUT(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updateData } = body
  
  const { data, error } = await supabase
    .from('employees')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}