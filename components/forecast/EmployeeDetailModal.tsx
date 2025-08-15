'use client'

import { useState, useEffect } from 'react'
import { X, Clock, MessageSquare, Save, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useToast } from '@/components/ui/ToastContainer'
import { useRouter } from 'next/navigation'

interface EmployeeDetailModalProps {
  employee: any
  onClose: () => void
}

export default function EmployeeDetailModal({ employee, onClose }: EmployeeDetailModalProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('basic')
  const [comment, setComment] = useState('')
  const [formData, setFormData] = useState(employee)
  const [comments, setComments] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('更新に失敗しました')
      
      showToast('更新しました', 'success')
      router.refresh()
      onClose()
    } catch (error) {
      showToast('更新に失敗しました', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employee.id,
          content: comment
        })
      })
      
      if (!response.ok) throw new Error('コメントの追加に失敗しました')
      
      const newComment = await response.json()
      setComments(prev => [...prev, newComment])
      setComment('')
      showToast('コメントを追加しました', 'success')
    } catch (error) {
      showToast('コメントの追加に失敗しました', 'error')
    }
  }

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('削除に失敗しました')
      
      showToast('削除しました', 'success')
      router.refresh()
      onClose()
    } catch (error) {
      showToast('削除に失敗しました', 'error')
    } finally {
      setLoading(false)
    }
  }

  // 詳細データを取得
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/employees/${employee.id}`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.data?.comments || [])
          setHistory(data.data?.change_history || [])
        }
      } catch (error) {
        // Handle error silently
      }
    }
    fetchDetails()
  }, [employee.id])

  const tabs = [
    { id: 'basic', label: '基本情報' },
    { id: 'recruitment', label: '採用情報' },
    { id: 'status', label: 'ステータス' },
    { id: 'all', label: 'すべて' }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">{employee.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* タブ */}
            <div className="flex space-x-4 mt-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 overflow-y-auto p-6">
            {(activeTab === 'basic' || activeTab === 'all') && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  基本情報
                  <button className="ml-2 text-gray-400 hover:text-gray-600">
                    <Clock className="w-4 h-4" />
                  </button>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      社員番号
                    </label>
                    <input
                      type="text"
                      value={formData.employee_number || ''}
                      onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
                      className="input-field w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        氏名
                      </label>
                      <input
                        type="text"
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
                        value={formData.name_kana || ''}
                        onChange={(e) => setFormData({ ...formData, name_kana: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        性別
                      </label>
                      <select
                        value={formData.gender || ''}
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
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'recruitment' || activeTab === 'all') && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">採用情報</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        採用区分
                      </label>
                      <select
                        value={formData.recruitment_type || ''}
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
                        雇用形態
                      </label>
                      <select
                        value={formData.employment_type || ''}
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        部署
                      </label>
                      <input
                        type="text"
                        value={formData.department || ''}
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
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        入社日
                      </label>
                      <input
                        type="date"
                        value={formData.join_date ? formData.join_date.split('T')[0] : ''}
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
                        value={formData.recruitment_cost || ''}
                        onChange={(e) => setFormData({ ...formData, recruitment_cost: parseFloat(e.target.value) })}
                        className="input-field w-full"
                        placeholder="¥"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'status' || activeTab === 'all') && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ステータス</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      採用人事ステータス
                    </label>
                    <select
                      value={formData.hr_status || ''}
                      onChange={(e) => setFormData({ ...formData, hr_status: e.target.value })}
                      className="input-field w-full"
                    >
                      <option value="">選択してください</option>
                      <option value="未着手">未着手</option>
                      <option value="進行中">進行中</option>
                      <option value="完了">完了</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      情シスステータス
                    </label>
                    <select
                      value={formData.it_status || ''}
                      onChange={(e) => setFormData({ ...formData, it_status: e.target.value })}
                      className="input-field w-full"
                    >
                      <option value="">選択してください</option>
                      <option value="未着手">未着手</option>
                      <option value="進行中">進行中</option>
                      <option value="完了">完了</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      労務ステータス
                    </label>
                    <select
                      value={formData.hr_admin_status || ''}
                      onChange={(e) => setFormData({ ...formData, hr_admin_status: e.target.value })}
                      className="input-field w-full"
                    >
                      <option value="">選択してください</option>
                      <option value="未着手">未着手</option>
                      <option value="進行中">進行中</option>
                      <option value="完了">完了</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* コメントセクション */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                コメント
              </h3>
              
              {/* コメント履歴 */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500">コメントはありません</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800">{c.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {c.users?.name || '不明'} - {format(new Date(c.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* コメント入力 */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="コメントを入力"
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="btn-secondary"
                >
                  投稿
                </button>
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                閉じる
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center space-x-2"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                <span>削除</span>
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? '保存中...' : '保存'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}