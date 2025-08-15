import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// IPアドレスマッチング関数
function isIpMatch(clientIp: string, pattern: string): boolean {
  // CIDR記法の場合
  if (pattern.includes('/')) {
    return isIpInCidr(clientIp, pattern)
  }
  // 単一IPの場合
  return clientIp === pattern
}

// CIDR記法でのIPマッチング
function isIpInCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/')
  const mask = ~(2 ** (32 - parseInt(bits)) - 1)
  
  const ipNum = ipToNumber(ip)
  const rangeNum = ipToNumber(range)
  
  return (ipNum & mask) === (rangeNum & mask)
}

// IPアドレスを数値に変換
function ipToNumber(ip: string): number {
  const parts = ip.split('.')
  return parts.reduce((acc, part, i) => acc + (parseInt(part) << (8 * (3 - i))), 0)
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // IP制限チェック
  const clientIp = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || ''
  
  // IP制限が有効な場合のチェック（開発環境では無効化）
  if (process.env.NODE_ENV === 'production' && user) {
    // IP制限設定を取得
    const { data: ipRestrictions } = await supabase
      .from('ip_restrictions')
      .select('*')
      .eq('is_active', true)
    
    if (ipRestrictions && ipRestrictions.length > 0) {
      // Allow/Deny リストのチェック
      const allowList = ipRestrictions.filter(r => r.type === 'allow')
      const denyList = ipRestrictions.filter(r => r.type === 'deny')
      
      // Denyリストに含まれている場合は拒否
      const isDenied = denyList.some(restriction => {
        return isIpMatch(clientIp, restriction.ip_address)
      })
      
      if (isDenied) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
      
      // Allowリストがある場合、含まれていないIPは拒否
      if (allowList.length > 0) {
        const isAllowed = allowList.some(restriction => {
          return isIpMatch(clientIp, restriction.ip_address)
        })
        
        if (!isAllowed) {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }
  }
  
  // 認証が必要なパスの定義
  const protectedPaths = ['/dashboard', '/forecast', '/settings']
  const authPaths = ['/login', '/']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname === path
  )

  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}