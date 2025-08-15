'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/ToastContainer'

interface NewEmployeeModalProps {
  onClose: () => void
}

export default function NewEmployeeModal({ onClose }: NewEmployeeModalProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    name_kana: '',
    employee_number: '',
    gender: '',
    age: '',
    recruitment_type: '',
    employment_type: '',
    department: '',
    role: '',
    join_date: '',
    recruitment_cost: '',
    application_source: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('登録に失敗しました')
      }
      
      showToast('入社者情報を登録しました', 'success')
      onClose()
      router.refresh()
    } catch (error) {
      showToast('登録に失敗しました', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">新規入社者追加</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* 基本情報 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">基本情報</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        氏名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ふりがな
                      </label>
                      <input
                        type="text"
                        value={formData.name_kana}
                        onChange={(e) => setFormData({ ...formData, name_kana: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        社員番号
                      </label>
                      <input
                        type="text"
                        value={formData.employee_number}
                        onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        性別
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="input-field w-full"
                      >
                        <option value="">選択してください</option>
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                        <option value="other">その他</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        年齢
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* 採用情報 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">採用情報</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        採用区分 <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.recruitment_type}
                        onChange={(e) => setFormData({ ...formData, recruitment_type: e.target.value })}
                        className="input-field w-full"
                      >
                        <option value="">選択してください</option>
                        <option value="new_graduate">新卒</option>
                        <option value="mid_career">中途</option>
                        <option value="contract">契約社員</option>
                        <option value="part_time">パート・アルバイト</option>
                        <option value="intern">インターン</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        雇用形態 <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.employment_type}
                        onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                        className="input-field w-full"
                      >
                        <option value="">選択してください</option>
                        <option value="full_time">正社員</option>
                        <option value="contract">契約社員</option>
                        <option value="part_time">パートタイム</option>
                        <option value="temporary">派遣</option>
                        <option value="intern">インターン</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        部署 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        役職
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        入社日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.join_date}
                        onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        採用コスト
                      </label>
                      <input
                        type="number"
                        value={formData.recruitment_cost}
                        onChange={(e) => setFormData({ ...formData, recruitment_cost: e.target.value })}
                        className="input-field w-full"
                        placeholder="¥"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        応募経路
                      </label>
                      <input
                        type="text"
                        value={formData.application_source}
                        onChange={(e) => setFormData({ ...formData, application_source: e.target.value })}
                        className="input-field w-full"
                        placeholder="例：転職サイト、紹介"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? '登録中...' : '登録'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}