'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeEmployees(
  onUpdate: (payload: any) => void,
  onInsert: (payload: any) => void,
  onDelete: (payload: any) => void
) {
  useEffect(() => {
    const supabase = createClient()
    
    // Realtimeサブスクリプション
    const channel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'employees'
        },
        (payload) => {
          onInsert(payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'employees'
        },
        (payload) => {
          onUpdate(payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'employees'
        },
        (payload) => {
          onDelete(payload.old)
        }
      )
      .subscribe()

    // クリーンアップ
    return () => {
      supabase.removeChannel(channel)
    }
  }, [onUpdate, onInsert, onDelete])
}