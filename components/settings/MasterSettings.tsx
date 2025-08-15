'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Building, Briefcase } from 'lucide-react'

export default function MasterSettings() {
  const [departments, setDepartments] = useState([
    { id: '1', name: '営業部', order: 1 },
    { id: '2', name: '開発部', order: 2 },
    { id: '3', name: '人事部', order: 3 },
    { id: '4', name: '経理部', order: 4 },
    { id: '5', name: 'マーケティング部', order: 5 },
    { id: '6', name: 'カスタマーサポート部', order: 6 },
  ])

  const [roles, setRoles] = useState([
    { id: '1', name: 'エンジニア', category: '技術職', order: 1 },
    { id: '2', name: 'デザイナー', category: '技術職', order: 2 },
    { id: '3', name: '営業', category: '営業職', order: 3 },
    { id: '4', name: 'マーケター', category: 'マーケティング職', order: 4 },
    { id: '5', name: '人事', category: '管理部門', order: 5 },
    { id: '6', name: '経理', category: '管理部門', order: 6 },
  ])

  const [showAddDept, setShowAddDept] = useState(false)
  const [showAddRole, setShowAddRole] = useState(false)
  const [newDept, setNewDept] = useState('')
  const [newRole, setNewRole] = useState({ name: '', category: '' })

  const handleAddDepartment = () => {
    if (newDept) {
      setDepartments([
        ...departments,
        {
          id: Date.now().toString(),
          name: newDept,
          order: departments.length + 1
        }
      ])
      setNewDept('')
      setShowAddDept(false)
    }
  }

  const handleAddRole = () => {
    if (newRole.name) {
      setRoles([
        ...roles,
        {
          id: Date.now().toString(),
          name: newRole.name,
          category: newRole.category,
          order: roles.length + 1
        }
      ])
      setNewRole({ name: '', category: '' })
      setShowAddRole(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">マスタ管理</h2>
        <p className="text-gray-600 mt-1">部署・職種のマスタデータを管理します</p>
      </div>

      <div className="space-y-6">
        {/* 部署マスタ */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">部署マスタ</h3>
            <button
              onClick={() => setShowAddDept(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規部署追加</span>
            </button>
          </div>

          {showAddDept && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="部署名を入力"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="input-field flex-1"
                />
                <button
                  onClick={handleAddDepartment}
                  className="btn-primary text-sm"
                >
                  追加
                </button>
                <button
                  onClick={() => {
                    setShowAddDept(false)
                    setNewDept('')
                  }}
                  className="btn-secondary text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    部署名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    表示順
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    登録日
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-800">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {dept.order}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      2024/01/01
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 職種マスタ */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">職種マスタ</h3>
            <button
              onClick={() => setShowAddRole(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規職種追加</span>
            </button>
          </div>

          {showAddRole && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="職種名を入力"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="input-field flex-1"
                />
                <input
                  type="text"
                  placeholder="カテゴリ（例：技術職）"
                  value={newRole.category}
                  onChange={(e) => setNewRole({ ...newRole, category: e.target.value })}
                  className="input-field flex-1"
                />
                <button
                  onClick={handleAddRole}
                  className="btn-primary text-sm"
                >
                  追加
                </button>
                <button
                  onClick={() => {
                    setShowAddRole(false)
                    setNewRole({ name: '', category: '' })
                  }}
                  className="btn-secondary text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    職種名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    表示順
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    登録日
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-800">{role.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {role.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {role.order}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      2024/01/01
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}