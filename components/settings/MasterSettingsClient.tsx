'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, GripVertical, Building, Briefcase } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Department {
  id: string
  name: string
  display_order: number | null
  is_active: boolean
}

interface Role {
  id: string
  name: string
  category: string | null
  display_order: number | null
  is_active: boolean
}

type MasterType = 'departments' | 'roles'

export default function MasterSettingsClient() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<MasterType>('departments')
  const { showToast } = useToast()

  // 編集状態
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')

  // データ取得
  const fetchData = async () => {
    setLoading(true)
    try {
      const [deptRes, roleRes] = await Promise.all([
        fetch('/api/departments'),
        fetch('/api/roles')
      ])

      if (deptRes.ok) {
        const deptData = await deptRes.json()
        setDepartments(deptData.data || [])
      }

      if (roleRes.ok) {
        const roleData = await roleRes.json()
        setRoles(roleData.data || [])
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

  // 追加
  const handleAdd = async () => {
    if (!newItemName.trim()) return

    setSaving(true)
    try {
      const endpoint = activeTab === 'departments' ? '/api/departments' : '/api/roles'
      const body = activeTab === 'departments' 
        ? { name: newItemName }
        : { name: newItemName, category: newItemCategory || null }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('追加に失敗しました')
      
      await fetchData()
      setNewItemName('')
      setNewItemCategory('')
      setShowAddForm(false)
      showToast(
        activeTab === 'departments' ? '部署を追加しました' : 'ロールを追加しました',
        'success'
      )
    } catch (error) {
      showToast('追加に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // 更新
  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return

    setSaving(true)
    try {
      const endpoint = activeTab === 'departments' ? '/api/departments' : '/api/roles'
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editValue })
      })

      if (!response.ok) throw new Error('更新に失敗しました')
      
      await fetchData()
      setEditingId(null)
      setEditValue('')
      showToast('更新しました', 'success')
    } catch (error) {
      showToast('更新に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // 削除（非アクティブ化）
  const handleDelete = async (id: string) => {
    if (!confirm('削除してもよろしいですか？')) return

    setSaving(true)
    try {
      const endpoint = activeTab === 'departments' 
        ? `/api/departments?id=${id}`
        : `/api/roles?id=${id}`
      
      const response = await fetch(endpoint, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('削除に失敗しました')
      
      await fetchData()
      showToast('削除しました', 'success')
    } catch (error) {
      showToast('削除に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const currentItems = activeTab === 'departments' ? departments : roles

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
        <h2 className="text-2xl font-bold text-gray-800">マスタ管理</h2>
        <p className="text-gray-600 mt-1">システムで使用する部署とロールの管理</p>
      </div>

      <div className="space-y-6">
        {/* タブ */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('departments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'departments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              部署
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              ロール
            </button>
          </nav>
        </div>

        {/* コンテンツ */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {activeTab === 'departments' ? '部署一覧' : 'ロール一覧'}
            </h3>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>新規追加</span>
              </button>
            )}
          </div>

          {/* 新規追加フォーム */}
          {showAddForm && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={activeTab === 'departments' ? '部署名' : 'ロール名'}
                  className="input-field flex-1"
                  disabled={saving}
                />
                {activeTab === 'roles' && (
                  <input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    placeholder="カテゴリ（任意）"
                    className="input-field"
                    disabled={saving}
                  />
                )}
                <button
                  onClick={handleAdd}
                  disabled={saving || !newItemName.trim()}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewItemName('')
                    setNewItemCategory('')
                  }}
                  disabled={saving}
                  className="btn-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 一覧 */}
          <div className="space-y-2">
            {currentItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  {editingId === item.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="input-field"
                        disabled={saving}
                      />
                      <button
                        onClick={() => handleUpdate(item.id)}
                        disabled={saving}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditValue('')
                        }}
                        disabled={saving}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      {activeTab === 'roles' && item.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {editingId !== item.id && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(item.id)
                        setEditValue(item.name)
                      }}
                      disabled={saving}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {currentItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {activeTab === 'departments' ? '部署' : 'ロール'}が登録されていません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}