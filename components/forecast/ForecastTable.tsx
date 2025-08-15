'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, MoreVertical, Edit2, MessageSquare, Clock, Loader2 } from 'lucide-react'
import EmployeeDetailModal from './EmployeeDetailModal'
import ChangeHistoryModal from './ChangeHistoryModal'
import { useToast } from '@/components/ui/ToastContainer'

interface ForecastTableProps {
  employees: any[]
  categories: any[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

export default function ForecastTable({ 
  employees, 
  categories,
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange
}: ForecastTableProps) {
  const { showToast } = useToast()
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyEmployee, setHistoryEmployee] = useState<any>(null)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleCellClick = (rowIndex: number, field: string, currentValue: string) => {
    setEditingCell({ row: rowIndex, col: field })
    setEditValue(currentValue || '')
  }

  const handleCellSave = async (employeeId: string, field: string, value: string) => {
    if (value === editValue) {
      setEditingCell(null)
      return
    }
    
    setSaving(true)
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })
      
      if (!response.ok) throw new Error('更新に失敗しました')
      
      showToast('更新しました', 'success')
      // ローカルデータを更新
      const updatedEmployee = employees.find(emp => emp.id === employeeId)
      if (updatedEmployee) {
        updatedEmployee[field] = value
      }
    } catch (error) {
      showToast('更新に失敗しました', 'error')
    } finally {
      setSaving(false)
      setEditingCell(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800'
      case '進行中':
        return 'bg-blue-100 text-blue-800'
      case '未着手':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const recruitmentTypeLabels: { [key: string]: string } = {
    new_graduate: '新卒',
    mid_career: '中途',
    contract: '契約',
    part_time: 'パート',
    intern: 'インターン'
  }

  const employmentTypeLabels: { [key: string]: string } = {
    full_time: '正社員',
    contract: '契約社員',
    part_time: 'パート',
    temporary: '派遣',
    intern: 'インターン'
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div 
                    className="flex items-center cursor-pointer text-xs font-medium text-gray-600 uppercase tracking-wider"
                    onClick={() => handleSort('id')}
                  >
                    No.
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div 
                    className="flex items-center cursor-pointer text-xs font-medium text-gray-600 uppercase tracking-wider"
                    onClick={() => handleSort('name')}
                  >
                    氏名
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    部署
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div 
                    className="flex items-center cursor-pointer text-xs font-medium text-gray-600 uppercase tracking-wider"
                    onClick={() => handleSort('join_date')}
                  >
                    入社日
                    {sortField === 'join_date' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    採用区分
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    雇用形態
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    採用人事ST
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    情シスST
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    労務ST
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    操作
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee, index) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button 
                      className="text-primary hover:underline font-medium"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      {String((currentPage - 1) * pageSize + index + 1).padStart(3, '0')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {editingCell?.row === index && editingCell?.col === 'name' ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(employee.id, 'name', editValue)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellSave(employee.id, 'name', editValue)
                            if (e.key === 'Escape') setEditingCell(null)
                          }}
                          className="input-field w-full"
                          autoFocus
                          disabled={saving}
                        />
                        {saving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 -my-1 rounded"
                        onClick={() => handleCellClick(index, 'name', employee.name)}
                      >
                        {employee.name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingCell?.row === index && editingCell?.col === 'department' ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleCellSave(employee.id, 'department', editValue)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellSave(employee.id, 'department', editValue)
                            if (e.key === 'Escape') setEditingCell(null)
                          }}
                          className="input-field w-full"
                          autoFocus
                          disabled={saving}
                        />
                        {saving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 -my-1 rounded"
                        onClick={() => handleCellClick(index, 'department', employee.department)}
                      >
                        {employee.department || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {employee.join_date ? new Date(employee.join_date).toLocaleDateString('ja-JP') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {recruitmentTypeLabels[employee.recruitment_type] || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      {employmentTypeLabels[employee.employment_type] || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.hr_status || '未着手')}`}>
                      {employee.hr_status || '未着手'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.it_status || '未着手')}`}>
                      {employee.it_status || '未着手'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.hr_admin_status || '未着手')}`}>
                      {employee.hr_admin_status || '未着手'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        title="編集"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        title="コメント"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        title="履歴"
                        onClick={() => {
                          setHistoryEmployee(employee)
                          setShowHistoryModal(true)
                        }}
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium mb-1">データがありません</p>
              <p className="text-sm">フィルタ条件を変更するか、新規入社者を追加してください</p>
            </div>
          )}
        </div>

        {/* ページネーション */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {totalCount}件中 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}件を表示
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="btn-secondary px-3 py-1 text-sm" 
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
              >
                &lt;&lt;
              </button>
              <button 
                className="btn-secondary px-3 py-1 text-sm" 
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              >
                &lt;
              </button>
              
              {/* ページ番号の表示 */}
              {(() => {
                const pages = []
                const maxVisible = 5
                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                let end = Math.min(totalPages, start + maxVisible - 1)
                
                if (end - start < maxVisible - 1) {
                  start = Math.max(1, end - maxVisible + 1)
                }
                
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={i === currentPage ? "btn-primary px-3 py-1 text-sm" : "btn-secondary px-3 py-1 text-sm"}
                      onClick={() => onPageChange(i)}
                    >
                      {i}
                    </button>
                  )
                }
                return pages
              })()}
              
              <button 
                className="btn-secondary px-3 py-1 text-sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              >
                &gt;
              </button>
              <button 
                className="btn-secondary px-3 py-1 text-sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* 変更履歴モーダル */}
      {historyEmployee && (
        <ChangeHistoryModal
          employeeId={historyEmployee.id}
          employeeName={historyEmployee.name}
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false)
            setHistoryEmployee(null)
          }}
        />
      )}
    </>
  )
}