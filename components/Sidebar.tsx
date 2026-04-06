'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFinance } from '@/lib/hooks/useFinance'
import { BarChart3, LayoutDashboard, TrendingUp, Crown, Eye, LogOut, Settings, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { SidebarSharePanel } from './SidebarSharePanel'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview & summary',
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: BarChart3,
    description: 'Manage transactions',
  },
  {
    label: 'Insights',
    href: '/insights',
    icon: TrendingUp,
    description: 'Analytics & trends',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { role, setRole } = useFinance()
  const [showProfile, setShowProfile] = useState(false)

  const userName = role === 'admin' ? 'Ritik' : 'Viewer User'
  const userEmoji = role === 'admin' ? '👑' : '👁️'
  const userRole = role === 'admin' ? 'Administrator' : 'Viewer'

  const handleRoleSwitch = (newRole: 'admin' | 'viewer') => {
    setRole(newRole)
    setShowProfile(false)
  }

  return (
    <aside className="w-56 border-r border-border/40 bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-2xl min-h-screen flex flex-col sticky top-0 shadow-xl hover:shadow-2xl transition-shadow">
      {/* Premium Profile Card */}
      <div className="p-4">
        <button
          onClick={() => setShowProfile(true)}
          className="w-full p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border-2 border-primary/30 hover:from-primary/35 hover:to-secondary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-lg group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300 shadow-lg ring-2 ring-primary/30 group-hover:ring-primary/60">
              {userEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate text-foreground">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground/80 truncate font-semibold">
                {userRole}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-bold group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl'
                  : 'text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/5 hover:border hover:border-primary/20'
              )}
            >
              {/* Animated background */}
              <div 
                className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  isActive ? 'opacity-0' : 'bg-linear-to-r from-primary/5 to-transparent'
                )}
              />
              
              <Icon className={cn(
                'w-5 h-5 transition-transform duration-300 relative z-10',
                isActive ? 'text-primary-foreground' : 'group-hover:scale-110 group-hover:-translate-y-0.5'
              )} />
              <span className="tracking-tight relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground opacity-80 animate-pulse"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Admin Share Session Links - Only for Admin */}
      {role === 'admin' && (
        <div className="px-4 py-3 border-y border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">🔗 Share Links</h3>
          </div>
          <SidebarSharePanel />
        </div>
      )}

      {/* Helpful Tip */}
      <div className="p-3 border-t border-border/30">
        <div className="p-3 bg-accent/10 rounded-lg text-accent-foreground border border-accent/20 hover:border-accent/40 transition-colors">
          <p className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">💡 Tip</p>
          <p className="text-xs leading-relaxed opacity-80">
            Click your profile to switch between Admin and Viewer roles.
          </p>
        </div>
      </div>

      {/* Profile Modal */}
      <AlertDialog open={showProfile} onOpenChange={setShowProfile}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Switch User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a role to continue as
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-4">
            {/* Admin Option */}
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                role === 'admin'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center text-lg">
                  👑
                </div>
                <div>
                  <p className="font-semibold text-sm">Harshita</p>
                  <p className="text-xs text-muted-foreground">Administrator • Full Access</p>
                </div>
                {role === 'admin' && (
                  <div className="ml-auto text-primary text-lg">✓</div>
                )}
              </div>
            </button>

            {/* Viewer Option */}
            <button
              onClick={() => handleRoleSwitch('viewer')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                role === 'viewer'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-lg">
                  👁️
                </div>
                <div>
                  <p className="font-semibold text-sm">Viewer</p>
                  <p className="text-xs text-muted-foreground">Read-only • Limited Access</p>
                </div>
                {role === 'viewer' && (
                  <div className="ml-auto text-primary text-lg">✓</div>
                )}
              </div>
            </button>
          </div>

          <AlertDialogCancel className="w-full">
            Close
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  )
}
