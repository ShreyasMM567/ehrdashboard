'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Bell, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Dashboard', href: '/' }]
    
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({ label, href })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Dynamic Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-black">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.href}>
              {index > 0 && <span>/</span>}
              <span className={index === breadcrumbs.length - 1 ? 'text-black' : 'text-black'}>
                {breadcrumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-black hover:text-gray-800 transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-black">Dr. Smith</p>
              <p className="text-xs text-black">Physician</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-black hover:text-gray-800 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-black hover:text-gray-800 transition-colors">
                <User className="h-5 w-5" />
              </button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
