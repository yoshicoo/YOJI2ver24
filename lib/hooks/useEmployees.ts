'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/ToastContainer'

interface FilterParams {
  name?: string
  department?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  recruitmentType?: string
}

export function useEmployees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterParams>({})
  const { showToast } = useToast()

  // データ取得
  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/employees?${params}`)
      if (!response.ok) throw new Error('データの取得に失敗しました')
      
      const result = await response.json()
      setEmployees(result.data || [])
    } catch (error) {
      showToast('データの取得に失敗しました', 'error')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, [filters, showToast])

  // 新規作成
  const createEmployee = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('作成に失敗しました')
      
      const result = await response.json()
      setEmployees(prev => [result.data, ...prev])
      showToast('入社者情報を登録しました', 'success')
      return result.data
    } catch (error) {
      showToast('登録に失敗しました', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 更新
  const updateEmployee = async (id: string, data: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('更新に失敗しました')
      
      const result = await response.json()
      setEmployees(prev => prev.map(emp => 
        emp.id === id ? result.data : emp
      ))
      showToast('更新しました', 'success')
      return result.data
    } catch (error) {
      showToast('更新に失敗しました', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 削除
  const deleteEmployee = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('削除に失敗しました')
      
      setEmployees(prev => prev.filter(emp => emp.id !== id))
      showToast('削除しました', 'success')
    } catch (error) {
      showToast('削除に失敗しました', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return {
    employees,
    loading,
    filters,
    setFilters,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}