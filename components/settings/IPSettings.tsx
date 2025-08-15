'use client'

import { useState } from 'react'
import { Plus, Trash2, Globe, Wifi } from 'lucide-react'

export default function IPSettings() {
  const [ipList, setIpList] = useState([
    { id: '1', name: '本社オフィス', ip: '192.168.1.0/24', createdAt: '2024/01/01' },
    { id: '2', name: 'VPN接続', ip: '10.0.0.0/8', createdAt: '2024/01/01' },
    { id: '3', name: '在宅ワーク用', ip: '203.104.1.100', createdAt: '2024/02/01' },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newIp, setNewIp] = useState({ name: '', ip: '' })

  const handleAdd = () => {
    if (newIp.name && newIp.ip) {
      setIpList([
        ...ipList,
        {
          id: Date.now().toString(),
          name: newIp.name,
          ip: newIp.ip,
          createdAt: new Date().toLocaleDateString('ja-JP')
        }
      ])
      setNewIp({ name: '', ip: '' })
      setShowAddForm(false)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('このIPアドレスを削除してもよろしいですか？')) {
      setIpList(ipList.filter(item => item.id !== id))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">IP制限設定</h2>
        <p className="text-gray-600 mt-1">システムへのアクセスを許可するIPアドレスを管理します</p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
          <Wifi className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">IP制限について</p>
            <p className="text-yellow-700 mt-1">
              登録されたIPアドレスからのみシステムへのアクセスが可能になります。
              VPNや固定IPアドレスを登録してセキュリティを強化してください。
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">許可IPアドレス一覧</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>新規IP追加</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">新規IPアドレス追加</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="名前（例：本社オフィス）"
                value={newIp.name}
                onChange={(e) => setNewIp({ ...newIp, name: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="IPアドレス（例：192.168.1.1）"
                value={newIp.ip}
                onChange={(e) => setNewIp({ ...newIp, ip: e.target.value })}
                className="input-field"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAdd}
                  className="btn-primary text-sm flex-1"
                >
                  追加
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewIp({ name: '', ip: '' })
                  }}
                  className="btn-secondary text-sm flex-1"
                >
                  キャンセル
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ※ CIDR形式（例：192.168.1.0/24）または単一IPアドレスを入力してください
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  名前
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  IPアドレス
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
              {ipList.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-1 bg-gray-100 text-sm rounded">
                      {item.ip}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.createdAt}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ipList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            許可IPアドレスが登録されていません
          </div>
        )}
      </div>
    </div>
  )
}