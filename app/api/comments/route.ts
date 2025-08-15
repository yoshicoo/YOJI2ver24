import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('comments')
    .insert({
      employee_id: body.employee_id,
      content: body.content,
      created_by: user.id
    })
    .select(`
      *,
      users:created_by (name)
    `)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
  
  return NextResponse.json({ data, success: true })
}