'use client'

import { useState } from 'react'
import { Plus, Settings, Eye } from 'lucide-react'
import NewEmployeeModal from './NewEmployeeModal'
import ColumnSettingsModal from './ColumnSettingsModal'

interface ForecastActionsProps {
  pageSize: number
  onPageSizeChange: (size: number) => void
}

export default function ForecastActions({ pageSize, onPageSizeChange }: ForecastActionsProps) {
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false)
  const [showColumnSettings, setShowColumnSettings] = useState(false)

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowNewEmployeeModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>新規入社者追加</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowColumnSettings(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>表示設定</span>
            </button>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">表示件数</label>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="input-field"
              >
                <option value={25}>25件</option>
                <option value={50}>50件</option>
                <option value={100}>100件</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* モーダル */}
      {showNewEmployeeModal && (
        <NewEmployeeModal onClose={() => setShowNewEmployeeModal(false)} />
      )}
      {showColumnSettings && (
        <ColumnSettingsModal onClose={() => setShowColumnSettings(false)} />
      )}
    </>
  )
}