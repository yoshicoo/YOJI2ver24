import { createClient } from '@/lib/supabase/server'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // 現在の月のデータを取得
  const currentDate = new Date()
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  // 入社者データを取得
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .gte('join_date', startOfMonth.toISOString())
    .lte('join_date', endOfMonth.toISOString())

  // 部署データを取得
  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .eq('is_active', true)

  // 過去12ヶ月のデータを取得（グラフ用）
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
  
  const { data: historicalData } = await supabase
    .from('employees')
    .select('*')
    .gte('join_date', twelveMonthsAgo.toISOString())

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">採用状況の概要とトレンドを確認</p>
      </div>

      <DashboardContent 
        currentMonthEmployees={employees || []}
        departments={departments || []}
        historicalData={historicalData || []}
      />
    </div>
  )
}