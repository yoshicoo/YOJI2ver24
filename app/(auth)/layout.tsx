import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layouts/Sidebar'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ユーザー情報を取得（権限情報は一旦シンプルに）
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // 権限情報を取得
  let permission = null
  if (userData) {
    const { data: permissionData } = await supabase
      .from('user_permissions')
      .select('*, permissions(*)')
      .eq('user_id', user.id)
      .single()
    
    if (permissionData) {
      permission = permissionData.permissions
    }
  }

  const userWithPermission = {
    ...userData,
    permission
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={userWithPermission} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}