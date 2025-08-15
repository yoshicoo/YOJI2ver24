'use client'

import { useState } from 'react'
import { Plus, Edit2, User, Mail, Calendar } from 'lucide-react'

export default function AccountSettings() {
  const [accounts, setAccounts] = useState([
    { 
      id: '1', 
      name: '田中太郎', 
      email: 'tanaka@example.com',
      department: '人事部',
      permission: '管理者権限',
      lastLogin: '2024/03/15 14:30',
      isActive: true
    },
    { 
      id: '2', 
      name: '佐藤花子', 
      email: 'sato@example.com',
      department: '情報システム部',
      permission: '情シス権限',
      lastLogin: '2024/03/14 09:15',
      isActive: true
    },
    { 
      id: '3', 
      name: '山田次郎', 
      email: 'yamada@example.com',
      department: '労務部',
      permission: '採用人事権限',
      lastLogin: '2024/03/13 18:45',
      isActive: true
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">アカウント管理</h2>
        <p className="text-gray-600 mt-1">システム利用者のアカウントを管理します</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">アカウント一覧</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>新規アカウント追加</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ユーザー
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  所属
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  権限
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  最終ログイン
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-800">{account.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {account.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {account.department}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {account.permission}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {account.lastLogin}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {account.isActive ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        有効
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        無効
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
          
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">新規アカウント追加</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="input-field w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input type="email" className="input-field w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    所属部署
                  </label>
                  <input type="text" className="input-field w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    権限 <span className="text-red-500">*</span>
                  </label>
                  <select className="input-field w-full">
                    <option>権限を選択</option>
                    <option>管理者権限</option>
                    <option>採用人事権限</option>
                    <option>情シス権限</option>
                    <option>閲覧権限</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    初期パスワード <span className="text-red-500">*</span>
                  </label>
                  <input type="password" className="input-field w-full" />
                  <p className="text-xs text-gray-500 mt-1">
                    ※ 8文字以上で設定してください
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  キャンセル
                </button>
                <button className="btn-primary">
                  作成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}