'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Category {
  id: string
  name: string
  display_order: number
  is_active: boolean
  fields?: Field[]
}

interface Field {
  id: string
  category_id: string
  name: string
  field_type: 'text' | 'select' | 'multiselect' | 'date' | 'checkbox'
  is_required: boolean
  display_order: number
  column_width: number
  is_active: boolean
}

export default function CategorySettingsClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  // 編集状態
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddField, setShowAddField] = useState<string | null>(null)

  // 新規フィールドのフォーム状態
  const [newField, setNewField] = useState<Partial<Field>>({
    name: '',
    field_type: 'text',
    is_required: false,
    column_width: 120,
    display_order: 0
  })

  // 編集中のデータ
  const [editData, setEditData] = useState<any>({})

  // データ取得
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/settings/categories')
      if (!response.ok) throw new Error('データの取得に失敗しました')
      const result = await response.json()
      setCategories(result.data || [])
    } catch (error) {
      showToast('カテゴリの取得に失敗しました', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // カテゴリの展開/折りたたみ
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // カテゴリ追加
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    setSaving(true)
    try {
      const response = await fetch('/api/settings/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          display_order: categories.length + 1,
          is_active: true
        })
      })

      if (!response.ok) throw new Error('カテゴリの追加に失敗しました')
      
      await fetchCategories()
      setNewCategoryName('')
      setShowAddCategory(false)
      showToast('カテゴリを追加しました', 'success')
    } catch (error) {
      showToast('カテゴリの追加に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // カテゴリ編集
  const handleEditCategory = async (categoryId: string) => {
    if (!editData[categoryId]) return

    setSaving(true)
    try {
      const response = await fetch('/api/settings/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: categoryId,
          name: editData[categoryId]
        })
      })

      if (!response.ok) throw new Error('カテゴリの更新に失敗しました')
      
      await fetchCategories()
      setEditingCategory(null)
      setEditData({})
      showToast('カテゴリを更新しました', 'success')
    } catch (error) {
      showToast('カテゴリの更新に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // カテゴリ削除
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('このカテゴリを削除してもよろしいですか？')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/settings/categories?id=${categoryId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('カテゴリの削除に失敗しました')
      
      await fetchCategories()
      showToast('カテゴリを削除しました', 'success')
    } catch (error) {
      showToast('カテゴリの削除に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // フィールド追加
  const handleAddField = async (categoryId: string) => {
    if (!newField.name?.trim()) return

    setSaving(true)
    try {
      const category = categories.find(c => c.id === categoryId)
      const maxOrder = Math.max(0, ...(category?.fields || []).map(f => f.display_order))

      const response = await fetch('/api/settings/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newField,
          category_id: categoryId,
          display_order: maxOrder + 1,
          is_active: true
        })
      })

      if (!response.ok) throw new Error('項目の追加に失敗しました')
      
      await fetchCategories()
      setShowAddField(null)
      setNewField({
        name: '',
        field_type: 'text',
        is_required: false,
        column_width: 120,
        display_order: 0
      })
      showToast('項目を追加しました', 'success')
    } catch (error) {
      showToast('項目の追加に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // フィールド編集
  const handleEditField = async (fieldId: string) => {
    if (!editData[fieldId]) return

    setSaving(true)
    try {
      const response = await fetch('/api/settings/fields', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: fieldId,
          ...editData[fieldId]
        })
      })

      if (!response.ok) throw new Error('項目の更新に失敗しました')
      
      await fetchCategories()
      setEditingField(null)
      setEditData({})
      showToast('項目を更新しました', 'success')
    } catch (error) {
      showToast('項目の更新に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // フィールド削除
  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('この項目を削除してもよろしいですか？')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/settings/fields?id=${fieldId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('項目の削除に失敗しました')
      
      await fetchCategories()
      showToast('項目を削除しました', 'success')
    } catch (error) {
      showToast('項目の削除に失敗しました', 'error')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const fieldTypeLabels: { [key: string]: string } = {
    text: 'テキスト',
    select: '選択',
    multiselect: '複数選択',
    date: '日付',
    checkbox: 'チェックボックス'
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
        <h2 className="text-2xl font-bold text-gray-800">カテゴリ・項目管理</h2>
        <p className="text-gray-600 mt-1">データ入力項目のカテゴリと項目を管理します</p>
      </div>

      <div className="space-y-6">
        {/* カテゴリ管理 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">カテゴリ一覧</h3>
            {!showAddCategory && (
              <button
                onClick={() => setShowAddCategory(true)}
                className="btn-primary flex items-center space-x-2"
                disabled={saving}
              >
                <Plus className="w-4 h-4" />
                <span>新規カテゴリ追加</span>
              </button>
            )}
          </div>

          {/* 新規カテゴリ追加フォーム */}
          {showAddCategory && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="カテゴリ名を入力"
                  className="input-field flex-1"
                  disabled={saving}
                />
                <button
                  onClick={handleAddCategory}
                  disabled={saving || !newCategoryName.trim()}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false)
                    setNewCategoryName('')
                  }}
                  disabled={saving}
                  className="btn-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg">
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      {editingCategory === category.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editData[category.id] || category.name}
                            onChange={(e) => setEditData({ ...editData, [category.id]: e.target.value })}
                            className="input-field"
                            disabled={saving}
                          />
                          <button
                            onClick={() => handleEditCategory(category.id)}
                            disabled={saving}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null)
                              setEditData({})
                            }}
                            disabled={saving}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium text-gray-800">{category.name}</span>
                      )}
                    </div>
                    {editingCategory !== category.id && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category.id)
                            setEditData({ [category.id]: category.name })
                          }}
                          disabled={saving}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={saving}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* フィールド一覧 */}
                {expandedCategories.has(category.id) && (
                  <div className="p-4 bg-white">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">項目一覧</h4>
                      {showAddField !== category.id && (
                        <button
                          onClick={() => setShowAddField(category.id)}
                          disabled={saving}
                          className="text-sm text-primary hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          項目追加
                        </button>
                      )}
                    </div>

                    {/* 新規フィールド追加フォーム */}
                    {showAddField === category.id && (
                      <div className="mb-4 p-3 border border-gray-200 rounded bg-gray-50">
                        <div className="grid grid-cols-6 gap-2">
                          <input
                            type="text"
                            value={newField.name}
                            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                            placeholder="項目名"
                            className="input-field col-span-2"
                            disabled={saving}
                          />
                          <select
                            value={newField.field_type}
                            onChange={(e) => setNewField({ ...newField, field_type: e.target.value as Field['field_type'] })}
                            className="input-field"
                            disabled={saving}
                          >
                            {Object.entries(fieldTypeLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={newField.column_width}
                            onChange={(e) => setNewField({ ...newField, column_width: parseInt(e.target.value) })}
                            placeholder="幅"
                            className="input-field"
                            disabled={saving}
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newField.is_required}
                              onChange={(e) => setNewField({ ...newField, is_required: e.target.checked })}
                              disabled={saving}
                              className="mr-2"
                            />
                            <span className="text-sm">必須</span>
                          </label>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleAddField(category.id)}
                              disabled={saving || !newField.name?.trim()}
                              className="btn-primary"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setShowAddField(null)
                                setNewField({
                                  name: '',
                                  field_type: 'text',
                                  is_required: false,
                                  column_width: 120,
                                  display_order: 0
                                })
                              }}
                              disabled={saving}
                              className="btn-secondary"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {category.fields?.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            {editingField === field.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editData[field.id]?.name || field.name}
                                  onChange={(e) => setEditData({
                                    ...editData,
                                    [field.id]: { ...editData[field.id], name: e.target.value }
                                  })}
                                  className="input-field"
                                  disabled={saving}
                                />
                                <select
                                  value={editData[field.id]?.field_type || field.field_type}
                                  onChange={(e) => setEditData({
                                    ...editData,
                                    [field.id]: { ...editData[field.id], field_type: e.target.value }
                                  })}
                                  className="input-field"
                                  disabled={saving}
                                >
                                  {Object.entries(fieldTypeLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  value={editData[field.id]?.column_width || field.column_width}
                                  onChange={(e) => setEditData({
                                    ...editData,
                                    [field.id]: { ...editData[field.id], column_width: parseInt(e.target.value) }
                                  })}
                                  placeholder="幅"
                                  className="input-field w-20"
                                  disabled={saving}
                                />
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={editData[field.id]?.is_required ?? field.is_required}
                                    onChange={(e) => setEditData({
                                      ...editData,
                                      [field.id]: { ...editData[field.id], is_required: e.target.checked }
                                    })}
                                    disabled={saving}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">必須</span>
                                </label>
                                <button
                                  onClick={() => handleEditField(field.id)}
                                  disabled={saving}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingField(null)
                                    setEditData({})
                                  }}
                                  disabled={saving}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="text-sm font-medium">{field.name}</span>
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                  {fieldTypeLabels[field.field_type]}
                                </span>
                                <span className="text-xs text-gray-500">幅: {field.column_width}px</span>
                                {field.is_required && (
                                  <span className="text-xs text-red-500">必須</span>
                                )}
                              </>
                            )}
                          </div>
                          {editingField !== field.id && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingField(field.id)
                                  setEditData({
                                    [field.id]: {
                                      name: field.name,
                                      field_type: field.field_type,
                                      column_width: field.column_width,
                                      is_required: field.is_required
                                    }
                                  })
                                }}
                                disabled={saving}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteField(field.id)}
                                disabled={saving}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!category.fields || category.fields.length === 0) && (
                        <p className="text-sm text-gray-500 py-2">項目がありません</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              カテゴリがありません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}