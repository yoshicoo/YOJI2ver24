'use client'

import { useState, useMemo } from 'react'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Filter
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ja } from 'date-fns/locale'

interface DashboardContentProps {
  currentMonthEmployees: any[]
  departments: any[]
  historicalData: any[]
}

export default function DashboardContent({
  currentMonthEmployees,
  departments,
  historicalData
}: DashboardContentProps) {
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM'),
    to: format(endOfMonth(new Date()), 'yyyy-MM')
  })

  // サマリーカードのデータ
  const summaryData = useMemo(() => {
    const employees = currentMonthEmployees || []
    const currentMonth = employees.length
    const totalCost = employees.reduce((sum, emp) => 
      sum + (emp?.recruitment_cost || 0), 0
    )
    const avgCost = currentMonth > 0 ? totalCost / currentMonth : 0

    return {
      totalHires: currentMonth,
      plannedHires: employees.filter(emp => emp?.hr_status === 'planned').length || 25,
      totalCost: totalCost,
      avgCost: avgCost
    }
  }, [currentMonthEmployees])

  // 月別推移データ
  const monthlyTrendData = useMemo(() => {
    const monthlyData: { [key: string]: { planned: number; actual: number } } = {}
    const historical = historicalData || []
    
    historical.forEach(emp => {
      if (emp?.join_date) {
        const month = format(new Date(emp.join_date), 'yyyy-MM')
        if (!monthlyData[month]) {
          monthlyData[month] = { planned: 0, actual: 0 }
        }
        monthlyData[month].actual += 1
      }
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => ({
        month: format(new Date(month), 'MM月', { locale: ja }),
        予定: data.planned || 0,
        実績: data.actual
      }))
  }, [historicalData])

  // 部署別データ
  const departmentData = useMemo(() => {
    const deptCounts: { [key: string]: number } = {}
    const employees = currentMonthEmployees || []
    
    employees.forEach(emp => {
      const dept = emp?.department || 'その他'
      deptCounts[dept] = (deptCounts[dept] || 0) + 1
    })

    return Object.entries(deptCounts).map(([name, value]) => ({
      name,
      value
    }))
  }, [currentMonthEmployees])

  // 応募経路データ
  const sourceData = useMemo(() => {
    const sourceCounts: { [key: string]: number } = {}
    const employees = currentMonthEmployees || []
    
    employees.forEach(emp => {
      const source = emp?.application_source || 'その他'
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })

    return Object.entries(sourceCounts).map(([name, value]) => ({
      name,
      value
    }))
  }, [currentMonthEmployees])

  const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月入社予定</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {summaryData.plannedHires}名
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月入社実績</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {summaryData.totalHires}名
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月採用コスト</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ¥{summaryData.totalCost.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">一人当たり採用コスト</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ¥{Math.round(summaryData.avgCost).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月別推移グラフ */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">月別入社者推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="予定" 
                stroke="#2563eb" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="実績" 
                stroke="#059669" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 部署別採用状況 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">部署別採用状況</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 応募経路分析 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">応募経路別分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 採用コスト推移 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">採用コスト推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="実績" 
                stroke="#d97706" 
                strokeWidth={2}
                dot={{ fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 期間フィルタ */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">期間選択</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-gray-600 mr-2">開始</label>
              <input
                type="month"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="input-field"
              />
            </div>
            <span className="text-gray-500">〜</span>
            <div>
              <label className="text-sm text-gray-600 mr-2">終了</label>
              <input
                type="month"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="input-field"
              />
            </div>
            <button className="btn-primary">
              適用
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}