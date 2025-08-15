import { createClient } from '@/lib/supabase/server'
import ForecastPageClient from '@/components/forecast/ForecastPageClient'

export default async function ForecastPage() {
  const supabase = await createClient()
  
  // 初期データと総件数を取得
  const [employeesRes, countRes, departmentsRes, rolesRes, categoriesRes] = await Promise.all([
    supabase.from('employees').select('*').order('created_at', { ascending: false }).limit(25),
    supabase.from('employees').select('*', { count: 'exact', head: true }),
    supabase.from('departments').select('*').eq('is_active', true).order('display_order'),
    supabase.from('roles').select('*').eq('is_active', true).order('display_order'),
    supabase.from('categories').select('*, fields (*)').eq('is_active', true).order('display_order')
  ])

  return (
    <ForecastPageClient
      initialEmployees={employeesRes.data || []}
      initialTotalCount={countRes.count || 0}
      departments={departmentsRes.data || []}
      roles={rolesRes.data || []}
      categories={categoriesRes.data || []}
    />
  )
}