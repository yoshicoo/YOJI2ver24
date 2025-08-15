'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'

export default function CategorySettings() {
  const [categories, setCategories] = useState([
    { id: '1', name: '管理項目', order: 1, expanded: false, fields: [
      { id: '1-1', name: 'No.', type: 'text', required: true, width: 80 },
      { id: '1-2', name: '採用責任者', type: 'select', required: false, width: 120 },
      { id: '1-3', name: '採用担当者', type: 'select', required: false, width: 120 },
    ]},
    { id: '2', name: '入社者情報', order: 2, expanded: true, fields: [
      { id: '2-1', name: '社員番号', type: 'text', required: false, width: 100 },
      { id: '2-2', name: '氏名', type: 'text', required: true, width: 150 },
      { id: '2-3', name: 'ふりがな', type: 'text', required: false, width: 150 },
      { id: '2-4', name: '性別', type: 'select', required: false, width: 80 },
      { id: '2-5', name: '年齢', type: 'text', required: false, width: 80 },
    ]},
    { id: '3', name: '採用情報', order: 3, expanded: false, fields: [
      { id: '3-1', name: '採用区分', type: 'select', required: true, width: 120 },
      { id: '3-2', name: '雇用形態', type: 'select', required: true, width: 120 },
      { id: '3-3', name: 'ロール', type: 'text', required: false, width: 120 },
      { id: '3-4', name: '応募経路', type: 'select', required: false, width: 120 },
      { id: '3-5', name: '採用コスト', type: 'text', required: false, width: 120 },
    ]},
    { id: '4', name: 'ステータス', order: 4, expanded: false, fields: [
      { id: '4-1', name: '採用人事ステータス', type: 'select', required: false, width: 150 },
      { id: '4-2', name: '情シスステータス', type: 'select', required: false, width: 150 },
      { id: '4-3', name: '労務ステータス', type: 'select', required: false, width: 150 },
    ]},
  ])

  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddField, setShowAddField] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    ))
  }

  const fieldTypeLabels: { [key: string]: string } = {
    text: 'テキスト',
    select: '選択',
    multiselect: '複数選択',
    date: '日付',
    checkbox: 'チェックボックス'
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
            <button
              onClick={() => setShowAddCategory(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規カテゴリ追加</span>
            </button>
          </div>

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
                        {category.expanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      <span className="font-medium text-gray-800">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {category.expanded && (
                  <div className="p-4 bg-white">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">項目一覧</h4>
                      <button
                        onClick={() => setShowAddField(category.id)}
                        className="text-sm text-primary hover:underline"
                      >
                        + 項目を追加
                      </button>
                    </div>

                    <div className="space-y-2">
                      {category.fields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <span className="text-sm text-gray-800">{field.name}</span>
                            <span className="px-2 py-1 text-xs bg-white rounded border border-gray-200">
                              {fieldTypeLabels[field.type]}
                            </span>
                            {field.required && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                                必須
                              </span>
                            )}
                            <span className="text-xs text-gray-500">幅: {field.width}px</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setEditingField(field.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {showAddField === category.id && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">新規項目追加</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="項目名"
                            className="input-field"
                          />
                          <select className="input-field">
                            <option>項目タイプを選択</option>
                            <option value="text">テキスト形式</option>
                            <option value="select">選択形式</option>
                            <option value="multiselect">選択形式（複数選択可能）</option>
                            <option value="date">日付入力</option>
                            <option value="checkbox">チェックボックス</option>
                          </select>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input type="radio" name="required" value="required" className="mr-2" />
                              <span className="text-sm">必須項目</span>
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name="required" value="optional" className="mr-2" defaultChecked />
                              <span className="text-sm">任意項目</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">列幅:</label>
                            <input
                              type="number"
                              defaultValue="120"
                              className="input-field w-20"
                            />
                            <span className="text-sm text-gray-600">px</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <button
                            onClick={() => setShowAddField(null)}
                            className="btn-secondary text-sm"
                          >
                            キャンセル
                          </button>
                          <button className="btn-primary text-sm">
                            追加
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}