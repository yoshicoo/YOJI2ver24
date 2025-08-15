'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  user: any
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navigation = [
    {
      name: 'ダッシュボード',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname?.startsWith('/dashboard')
    },
    {
      name: '予実管理',
      href: '/forecast',
      icon: FileSpreadsheet,
      active: pathname?.startsWith('/forecast')
    },
    {
      name: '設定',
      href: '/settings',
      icon: Settings,
      active: pathname?.startsWith('/settings')
    }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // 権限情報を安全に取得
  const permissionName = user?.permission?.name || '権限なし'

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* ロゴ */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Y2</span>
          </div>
          <span className="ml-3 font-semibold text-gray-800">YOJI2</span>
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${item.active 
                      ? 'bg-blue-50 text-primary border-l-3 border-primary' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                  {item.active && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ユーザー情報 */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-800">{user?.name || 'ユーザー'}</p>
          <p className="text-xs text-gray-500">{permissionName}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          ログアウト
        </button>
      </div>
    </div>
  )
}