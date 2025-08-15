'use client'

import { useState } from 'react'
import { Search, Filter, X, Download } from 'lucide-react'
import { exportToCSV } from '@/lib/utils/export-csv'
import { useToast } from '@/components/ui/ToastContainer'

interface ForecastFiltersProps {
  departments: any[]
  roles: any[]
  onFilter?: (filters: any) => void
  employees?: any[]
}

export default function ForecastFilters({ departments, roles, onFilter, employees = [] }: ForecastFiltersProps) {
  const { showToast } = useToast()
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    recruitmentType: ''
  })

  const handleSearch = () => {
    if (onFilter) {
      onFilter(filters)
    }
  }

  const handleClear = () => {
    setFilters({
      name: '',
      department: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      recruitmentType: ''
    })
  }

  const handleExport = () => {
    if (employees.length === 0) {
      showToast('エクスポートするデータがありません', 'warning')
      return
    }
    
    const exportData = employees.map(emp => ({
      '社員番号': emp.employee_number || '',
      '氏名': emp.name,
      'ふりがな': emp.name_kana || '',
      '性別': emp.gender || '',
      '年齢': emp.age || '',
      '部署': emp.department || '',
      '役職': emp.role || '',
      '入社日': emp.join_date || '',
      '採用区分': emp.recruitment_type || '',
      '雇用形態': emp.employment_type || '',
      '採用コスト': emp.recruitment_cost || '',
      '応募経路': emp.application_source || '',
      '採用人事ステータス': emp.hr_status || '',
      '情シスステータス': emp.it_status || '',
      '労務ステータス': emp.hr_admin_status || ''
    }))
    
    const filename = `入社者リスト_${new Date().toISOString().split('T')[0]}.csv`
    exportToCSV(exportData, filename)
    showToast('CSVファイルをダウンロードしました', 'success')
  }

  return (
    <div className="card">
      <div className="space-y-4">
        {/* 第一行 */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="氏名で検索"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="input-field w-full pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">入社日</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="input-field"
            />
            <span className="text-gray-500">〜</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* 第二行 */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="input-field"
          >
            <option value="">部署を選択</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field"
          >
            <option value="">ステータスを選択</option>
            <option value="pending">対応中</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
          </select>

          <select
            value={filters.recruitmentType}
            onChange={(e) => setFilters({ ...filters, recruitmentType: e.target.value })}
            className="input-field"
          >
            <option value="">採用区分を選択</option>
            <option value="new_graduate">新卒</option>
            <option value="mid_career">中途</option>
            <option value="contract">契約社員</option>
            <option value="part_time">パート・アルバイト</option>
            <option value="intern">インターン</option>
          </select>

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>検索</span>
            </button>
            <button
              onClick={handleClear}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>クリア</span>
            </button>
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>CSV出力</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}