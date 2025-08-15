'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Shield } from 'lucide-react'

export default function PermissionSettings() {
  const [permissions, setPermissions] = useState([
    { 
      id: '1', 
      name: '管理者権限', 
      description: '全機能アクセス可能',
      features: {
        can_view_forecast: true,
        can_edit_forecast: true,
        can_add_new_hire: true,
        can_access_settings: true,
        is_admin: true
      }
    },
    { 
      id: '2', 
      name: '採用人事権限', 
      description: '採用関連機能メイン',
      features: {
        can_view_forecast: true,
        can_edit_forecast: true,
        can_add_new_hire: true,
        can_access_settings: false,
        is_admin: false
      }
    },
    { 
      id: '3', 
      name: '情シス権限', 
      description: 'IT関連項目中心',
      features: {
        can_view_forecast: true,
        can_edit_forecast: true,
        can_add_new_hire: false,
        can_access_settings: false,
        is_admin: false
      }
    },
    { 
      id: '4', 
      name: '閲覧権限', 
      description: '閲覧のみ可能',
      features: {
        can_view_forecast: true,
        can_edit_forecast: false,
        can_add_new_hire: false,
        can_access_settings: false,
        is_admin: false
      }
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPermission, setEditingPermission] = useState<any>(null)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">権限管理</h2>
        <p className="text-gray-600 mt-1">システムの権限を管理します</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">権限一覧</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>新規権限追加</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  権限名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  権限内容
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  予実閲覧
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  予実編集
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  新規追加
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  設定
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  管理者
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">{permission.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {permission.description}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {permission.features.can_view_forecast && (
                      <span className="text-green-600">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {permission.features.can_edit_forecast && (
                      <span className="text-green-600">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {permission.features.can_add_new_hire && (
                      <span className="text-green-600">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {permission.features.can_access_settings && (
                      <span className="text-green-600">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {permission.features.is_admin && (
                      <span className="text-green-600">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingPermission(permission)}
                        className="text-gray-400 hover:text-gray-600"
                      >
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

      {/* データ権限設定 */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">データ権限設定</h3>
        <div className="text-sm text-gray-600">
          <p>各権限に対して、アクセス可能なカテゴリ・項目を細かく設定できます。</p>
          <p className="mt-2">権限を選択して「編集」ボタンをクリックすることで、詳細な設定が可能です。</p>
        </div>
      </div>
    </div>
  )
}