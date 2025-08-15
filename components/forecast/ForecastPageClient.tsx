'use client'

import { useState, useEffect, useCallback } from 'react'
import ForecastTable from './ForecastTable'
import ForecastFilters from './ForecastFilters'
import ForecastActions from './ForecastActions'
import { useToast } from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ForecastPageClientProps {
  initialEmployees: any[]
  initialTotalCount: number
  departments: any[]
  roles: any[]
  categories: any[]
}

export default function ForecastPageClient({
  initialEmployees,
  initialTotalCount,
  departments,
  roles,
  categories
}: ForecastPageClientProps) {
  const [employees, setEmployees] = useState(initialEmployees)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const { showToast } = useToast()

  // データを再取得
  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value))
      })
      params.append('page', String(currentPage))
      params.append('limit', String(pageSize))

      const response = await fetch(`/api/employees?${params}`)
      if (!response.ok) throw new Error('データの取得に失敗しました')
      
      const result = await response.json()
      setEmployees(result.data || [])
      if (result.pagination) {
        setTotalCount(result.pagination.total || 0)
      }
    } catch (error) {
      showToast('データの取得に失敗しました', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage, pageSize, showToast])

  // フィルタ、ページ、ページサイズが変更されたら再取得
  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1) // フィルタ変更時は1ページ目に戻る
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1) // ページサイズ変更時は1ページ目に戻る
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">予実管理</h1>
        <p className="text-gray-600 mt-1">入社者情報の管理と編集</p>
      </div>

      <div className="space-y-4">
        {/* フィルタエリア */}
        <ForecastFilters 
          departments={departments}
          roles={roles}
          onFilter={handleFilter}
          employees={employees}
        />

        {/* アクションエリア */}
        <ForecastActions 
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* テーブルエリア */}
        {loading ? (
          <div className="card">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ForecastTable 
            employees={employees}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}