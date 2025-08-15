'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Shield, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface User {
  id: string
  email: string
  name: string
  department: string | null
  is_active: boolean
  created_at: string
  last_login_at: string | null
  user_permissions?: {
    permission_id: string
    permissions: Permission
  }[]
}

interface Permission {
  id: string
  name: string
  description: string | null
}

export default function AccountSettingsClient() {
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  
  // フォーム状態
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department: '',
    password: '',
    permission_ids: [] as string[]
  })

  // データ取得
  const fetchData = async () => {
    try {
      const [usersRes, permissionsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/permissions')
      ])
      
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.data || [])
      }
      
      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json()
        setPermissions(permissionsData.data || [])
      }
    } catch (error) {
      showToast('データの取得に失敗しました', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ユーザー追加/更新
  const handleSubmit = async () => {
    if (!formData.email || !formData.name) {
      showToast('必須項目を入力してください', 'error')
      return
    }

    if (!editingUser && !formData.password) {
      showToast('パスワードを入力してください', 'error')
      return
    }

    setSaving(true)
    try {
      const url = editingUser ? '/api/users' : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'
      const body = editingUser 
        ? { ...formData, id: editingUser.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('保存に失敗しました')
      
      await fetchData()
      setShowAddModal(false)
      setEditingUser(null)
      resetForm()
      showToast(
        editingUser ? 'ユーザーを更新しました' : 'ユーザーを追加しました',
        'success'
      )
    } catch (error) {
      showToast('保存に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // ユーザー削除（非アクティブ化）
  const handleDelete = async (id: string) => {
    if (!confirm('このユーザーを削除してもよろしいですか？')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('削除に失敗しました')
      
      await fetchData()
      showToast('ユーザーを削除しました', 'success')
    } catch (error) {
      showToast('削除に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // フォームリセット
  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      department: '',
      password: '',
      permission_ids: []
    })
    setShowPassword(false)
  }

  // 編集開始
  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      department: user.department || '',
      password: '',
      permission_ids: user.user_permissions?.map(up => up.permission_id) || []
    })
    setShowAddModal(true)
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
        <h2 className="text-2xl font-bold text-gray-800">アカウント管理</h2>
        <p className="text-gray-600 mt-1">システムユーザーの管理と権限の割り当て</p>
      </div>

      <div className="space-y-6">
        {/* ユーザー一覧 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">ユーザー一覧</h3>
            <button
              onClick={() => {
                resetForm()
                setEditingUser(null)
                setShowAddModal(true)
              }}
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規ユーザー追加</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部署
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    権限
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終ログイン
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.department || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.user_permissions?.map(up => (
                          <span key={up.permission_id} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {up.permissions?.name}
                          </span>
                        ))}
                        {(!user.user_permissions || user.user_permissions.length === 0) && (
                          <span className="text-xs text-gray-500">権限なし</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.is_active ? 'アクティブ' : '無効'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.last_login_at 
                        ? new Date(user.last_login_at).toLocaleDateString('ja-JP')
                        : '未ログイン'
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(user)}
                        disabled={saving}
                        className="text-gray-400 hover:text-gray-600 mr-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={saving}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ユーザーが登録されていません
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
                {editingUser ? 'ユーザー編集' : '新規ユーザー追加'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    部署
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-field"
                    disabled={saving}
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Lock className="w-4 h-4 inline mr-1" />
                      パスワード <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input-field pr-10"
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    権限
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.permission_ids.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permission_ids: [...formData.permission_ids, permission.id]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                permission_ids: formData.permission_ids.filter(id => id !== permission.id)
                              })
                            }
                          }}
                          disabled={saving}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingUser(null)
                    resetForm()
                  }}
                  disabled={saving}
                  className="btn-secondary"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !formData.email || !formData.name || (!editingUser && !formData.password)}
                  className="btn-primary"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    editingUser ? '更新' : '追加'
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