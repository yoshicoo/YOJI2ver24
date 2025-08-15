'use client'

import { useState, useEffect } from 'react'
import { X, Clock, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ChangeHistoryModalProps {
  employeeId: string
  employeeName: string
  isOpen: boolean
  onClose: () => void
}

interface ChangeHistory {
  id: string
  field_name: string
  old_value: string | null
  new_value: string | null
  changed_at: string
  changed_by: string
  users?: {
    name: string
  }
}

export default function ChangeHistoryModal({
  employeeId,
  employeeName,
  isOpen,
  onClose
}: ChangeHistoryModalProps) {
  const [history, setHistory] = useState<ChangeHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchHistory()
    }
  }, [isOpen, employeeId])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/employees/${employeeId}`)
      if (!response.ok) throw new Error('履歴の取得に失敗しました')
      
      const result = await response.json()
      setHistory(result.data?.change_history || [])
    } catch (error) {
      console.error('Error fetching history:', error)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const fieldLabels: { [key: string]: string } = {
    name: '氏名',
    name_kana: 'ふりがな',
    employee_number: '社員番号',
    gender: '性別',
    age: '年齢',
    department: '部署',
    role: 'ロール',
    recruitment_type: '採用区分',
    employment_type: '雇用形態',
    join_date: '入社日',
    recruitment_cost: '採用コスト',
    application_source: '応募経路',
    hr_status: '採用人事ステータス',
    it_status: '情シスステータス',
    hr_admin_status: '労務ステータス'
  }

  const formatValue = (fieldName: string, value: any): string => {
    if (value === null || value === undefined) return '-'
    
    if (fieldName === 'join_date' && value) {
      try {
        return format(new Date(value), 'yyyy年MM月dd日', { locale: ja })
      } catch {
        return value
      }
    }
    
    if (fieldName === 'recruitment_cost' && value) {
      return `¥${Number(value).toLocaleString()}`
    }
    
    if (fieldName === 'recruitment_type') {
      const types: { [key: string]: string } = {
        new_graduate: '新卒',
        mid_career: '中途',
        contract: '契約',
        part_time: 'パート',
        intern: 'インターン'
      }
      return types[value] || value
    }
    
    if (fieldName === 'employment_type') {
      const types: { [key: string]: string } = {
        full_time: '正社員',
        contract: '契約社員',
        part_time: 'パート',
        temporary: '派遣',
        intern: 'インターン'
      }
      return types[value] || value
    }
    
    return String(value)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] mx-4 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">変更履歴</h2>
            <p className="text-sm text-gray-600 mt-1">{employeeName}の変更履歴</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>変更履歴がありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(item.changed_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {item.users?.name || '不明'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {fieldLabels[item.field_name] || item.field_name}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">変更前</span>
                        <div className="mt-1 text-sm text-gray-800 bg-white rounded px-2 py-1 border border-gray-200">
                          {formatValue(item.field_name, item.old_value)}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">変更後</span>
                        <div className="mt-1 text-sm text-gray-800 bg-green-50 rounded px-2 py-1 border border-green-200">
                          {formatValue(item.field_name, item.new_value)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}