'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

interface ColumnSettingsModalProps {
  onClose: () => void
}

const defaultColumns = [
  { id: 'no', label: 'No.', visible: true, required: true },
  { id: 'name', label: '氏名', visible: true, required: true },
  { id: 'department', label: '部署', visible: true, required: false },
  { id: 'join_date', label: '入社日', visible: true, required: false },
  { id: 'age', label: '年齢', visible: false, required: false },
  { id: 'gender', label: '性別', visible: false, required: false },
  { id: 'recruitment_type', label: '採用区分', visible: true, required: false },
  { id: 'employment_type', label: '雇用形態', visible: true, required: false },
  { id: 'role', label: '役職', visible: false, required: false },
  { id: 'hr_status', label: '採用人事ステータス', visible: true, required: false },
  { id: 'it_status', label: '情シスステータス', visible: true, required: false },
  { id: 'hr_admin_status', label: '労務ステータス', visible: true, required: false },
  { id: 'recruitment_cost', label: '採用コスト', visible: false, required: false },
  { id: 'application_source', label: '応募経路', visible: false, required: false },
]

export default function ColumnSettingsModal({ onClose }: ColumnSettingsModalProps) {
  const [columns, setColumns] = useState(defaultColumns)

  useEffect(() => {
    // Load column settings from localStorage on mount
    const saved = localStorage.getItem('columnSettings')
    if (saved) {
      try {
        const parsedColumns = JSON.parse(saved)
        setColumns(parsedColumns)
      } catch (error) {
        // If parsing fails, use default columns
        setColumns(defaultColumns)
      }
    }
  }, [])

  const handleToggle = (id: string) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, visible: !col.visible } : col
    ))
  }

  const handleSave = () => {
    // Save column settings to localStorage
    localStorage.setItem('columnSettings', JSON.stringify(columns))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">列表示設定</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              {columns.map(column => (
                <div 
                  key={column.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <label className="flex items-center cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={() => handleToggle(column.id)}
                      disabled={column.required}
                      className="mr-3"
                    />
                    <span className={`text-sm ${column.required ? 'text-gray-500' : 'text-gray-700'}`}>
                      {column.label}
                      {column.required && (
                        <span className="ml-2 text-xs text-gray-400">(必須)</span>
                      )}
                    </span>
                  </label>
                  {column.visible ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                適用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}