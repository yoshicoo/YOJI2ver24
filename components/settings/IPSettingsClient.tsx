'use client'

import { useState, useEffect } from 'react'
import { Globe, Plus, Trash2, AlertTriangle, Shield, X } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface IPRestriction {
  id: string
  ip_address: string
  type: 'allow' | 'deny'
  description: string | null
  is_active: boolean
  created_at: string
}

export default function IPSettingsClient() {
  const [restrictions, setRestrictions] = useState<IPRestriction[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  
  // フォーム状態
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    ip_address: '',
    type: 'allow' as 'allow' | 'deny',
    description: '',
    is_active: true
  })

  // データ取得
  const fetchRestrictions = async () => {
    try {
      const response = await fetch('/api/ip-restrictions')
      if (!response.ok) throw new Error('IP制限の取得に失敗しました')
      const result = await response.json()
      setRestrictions(result.data || [])
    } catch (error) {
      showToast('IP制限の取得に失敗しました', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestrictions()
  }, [])

  // IP制限追加
  const handleAdd = async () => {
    if (!formData.ip_address) {
      showToast('IPアドレスを入力してください', 'error')
      return
    }

    // IPアドレスの簡易検証
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/
    
    if (!ipRegex.test(formData.ip_address) && !cidrRegex.test(formData.ip_address)) {
      showToast('正しいIPアドレス形式で入力してください', 'error')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/ip-restrictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('IP制限の追加に失敗しました')
      
      await fetchRestrictions()
      setShowAddModal(false)
      resetForm()
      showToast('IP制限を追加しました', 'success')
    } catch (error) {
      showToast('IP制限の追加に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // IP制限削除
  const handleDelete = async (id: string) => {
    if (!confirm('このIP制限を削除してもよろしいですか？')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/ip-restrictions?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('IP制限の削除に失敗しました')
      
      await fetchRestrictions()
      showToast('IP制限を削除しました', 'success')
    } catch (error) {
      showToast('IP制限の削除に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // 有効/無効切り替え
  const handleToggle = async (restriction: IPRestriction) => {
    setSaving(true)
    try {
      const response = await fetch('/api/ip-restrictions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: restriction.id,
          is_active: !restriction.is_active
        })
      })

      if (!response.ok) throw new Error('更新に失敗しました')
      
      await fetchRestrictions()
      showToast('IP制限を更新しました', 'success')
    } catch (error) {
      showToast('更新に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // フォームリセット
  const resetForm = () => {
    setFormData({
      ip_address: '',
      type: 'allow',
      description: '',
      is_active: true
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">IP制限設定</h2>
        <p className="text-gray-600 mt-1">システムへのアクセスをIPアドレスで制限します</p>
      </div>

      {/* 警告メッセージ */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">IP制限設定に関する注意</p>
            <ul className="list-disc list-inside space-y-1">
              <li>誤った設定により、システムにアクセスできなくなる可能性があります</li>
              <li>設定変更は慎重に行ってください</li>
              <li>CIDR記法（例：192.168.1.0/24）もサポートしています</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* IP制限一覧 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">IP制限一覧</h3>
            <button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規IP制限追加</span>
            </button>
          </div>

          <div className="space-y-2">
            {restrictions.map((restriction) => (
              <div key={restriction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      restriction.type === 'allow' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      <Shield className={`w-5 h-5 ${
                        restriction.type === 'allow' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">
                          {restriction.ip_address}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          restriction.type === 'allow'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {restriction.type === 'allow' ? '許可' : '拒否'}
                        </span>
                        {!restriction.is_active && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            無効
                          </span>
                        )}
                      </div>
                      {restriction.description && (
                        <p className="text-sm text-gray-600 mt-1">{restriction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={restriction.is_active}
                        onChange={() => handleToggle(restriction)}
                        disabled={saving}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <button
                      onClick={() => handleDelete(restriction.id)}
                      disabled={saving}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {restrictions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>IP制限が設定されていません</p>
                <p className="text-sm mt-1">すべてのIPアドレスからアクセス可能です</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  新規IP制限追加
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IPアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    className="input-field"
                    placeholder="例：192.168.1.1 または 192.168.1.0/24"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    制限タイプ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'allow' | 'deny' })}
                    className="input-field"
                    disabled={saving}
                  >
                    <option value="allow">許可</option>
                    <option value="deny">拒否</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="例：本社オフィス"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      disabled={saving}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">有効にする</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  disabled={saving}
                  className="btn-secondary"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving || !formData.ip_address}
                  className="btn-primary"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    '追加'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}