'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Shield, Save, X } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Permission {
  id: string
  name: string
  description: string | null
  can_view_forecast: boolean
  can_edit_forecast: boolean
  can_add_new_hire: boolean
  can_access_settings: boolean
  is_admin: boolean
}

export default function PermissionSettingsClient() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  
  // フォーム状態
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [formData, setFormData] = useState<Partial<Permission>>({
    name: '',
    description: '',
    can_view_forecast: false,
    can_edit_forecast: false,
    can_add_new_hire: false,
    can_access_settings: false,
    is_admin: false
  })

  // データ取得
  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions')
      if (!response.ok) throw new Error('権限の取得に失敗しました')
      const result = await response.json()
      setPermissions(result.data || [])
    } catch (error) {
      showToast('権限の取得に失敗しました', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  // 権限追加/更新
  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      showToast('権限名を入力してください', 'error')
      return
    }

    setSaving(true)
    try {
      const url = editingPermission 
        ? '/api/permissions' 
        : '/api/permissions'
      
      const method = editingPermission ? 'PUT' : 'POST'
      const body = editingPermission 
        ? { ...formData, id: editingPermission.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('権限の保存に失敗しました')
      
      await fetchPermissions()
      setShowAddModal(false)
      setEditingPermission(null)
      resetForm()
      showToast(
        editingPermission ? '権限を更新しました' : '権限を追加しました',
        'success'
      )
    } catch (error) {
      showToast('権限の保存に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // 権限削除
  const handleDelete = async (id: string) => {
    if (!confirm('この権限を削除してもよろしいですか？')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/permissions?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('権限の削除に失敗しました')
      
      await fetchPermissions()
      showToast('権限を削除しました', 'success')
    } catch (error) {
      showToast('権限の削除に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // フォームリセット
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      can_view_forecast: false,
      can_edit_forecast: false,
      can_add_new_hire: false,
      can_access_settings: false,
      is_admin: false
    })
  }

  // 編集開始
  const startEdit = (permission: Permission) => {
    setEditingPermission(permission)
    setFormData(permission)
    setShowAddModal(true)
  }

  const featureLabels = {
    can_view_forecast: '予実データ閲覧',
    can_edit_forecast: '予実データ編集',
    can_add_new_hire: '新規入社者追加',
    can_access_settings: '設定画面アクセス',
    is_admin: '管理者権限'
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
        <h2 className="text-2xl font-bold text-gray-800">権限管理</h2>
        <p className="text-gray-600 mt-1">ユーザーに割り当てる権限を管理します</p>
      </div>

      <div className="space-y-6">
        {/* 権限一覧 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">権限一覧</h3>
            <button
              onClick={() => {
                resetForm()
                setEditingPermission(null)
                setShowAddModal(true)
              }}
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規権限追加</span>
            </button>
          </div>

          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-gray-800">{permission.name}</h4>
                      {permission.is_admin && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">管理者</span>
                      )}
                    </div>
                    {permission.description && (
                      <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(featureLabels).map(([key, label]) => {
                        const hasPermission = permission[key as keyof Permission]
                        return (
                          <span
                            key={key}
                            className={`text-xs px-2 py-1 rounded ${
                              hasPermission
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => startEdit(permission)}
                      disabled={saving}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(permission.id)}
                      disabled={saving}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {permissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                権限が登録されていません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 追加/編集モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingPermission ? '権限編集' : '新規権限追加'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    権限名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="例：採用人事権限"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="権限の説明を入力"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    機能権限
                  </label>
                  <div className="space-y-2">
                    {Object.entries(featureLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData[key as keyof Permission] as boolean || false}
                          onChange={(e) => {
                            if (key === 'is_admin' && e.target.checked) {
                              // 管理者権限を有効にした場合、すべての権限を有効にする
                              setFormData({
                                ...formData,
                                can_view_forecast: true,
                                can_edit_forecast: true,
                                can_add_new_hire: true,
                                can_access_settings: true,
                                is_admin: true
                              })
                            } else {
                              setFormData({ ...formData, [key]: e.target.checked })
                            }
                          }}
                          disabled={saving}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPermission(null)
                    resetForm()
                  }}
                  disabled={saving}
                  className="btn-secondary"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !formData.name?.trim()}
                  className="btn-primary"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    editingPermission ? '更新' : '追加'
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