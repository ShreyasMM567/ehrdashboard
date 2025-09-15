"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log("🔒 Protected route check:", {
      status,
      user: session?.user,
      isAuthenticated: !!session
    })

    if (status === 'unauthenticated') {
      console.log("❌ Redirecting to login - no session")
      router.push('/auth/login')
    }
  }, [status, session, router])

  const handleLogout = async () => {
    console.log("🚪 Logging out user:", session?.user)
    await signOut({ callbackUrl: '/auth/login' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2">Loading...</div>
          <div className="text-sm text-gray-600">Checking authentication...</div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  // Add logout button to all protected pages
  return (
    <div className="relative">
      {/* Logout button in top right */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        title={`Logout ${session?.user?.name || session?.user?.email}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
      
      {children}
    </div>
  )
}
