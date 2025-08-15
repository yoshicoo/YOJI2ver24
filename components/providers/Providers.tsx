'use client'

import { ToastProvider } from '@/components/ui/ToastContainer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  )
}