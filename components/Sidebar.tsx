'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, LayoutDashboard, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <aside className="w-56 border-r border-border/50 bg-background/50 backdrop-blur-sm min-h-screen flex flex-col sticky top-0">
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative overflow-hidden',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-muted/60 hover:text-foreground'
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

      {/* Helpful Tip */}
      <div className="p-3 border-t border-border/30">
        <div className="p-3 bg-accent/10 rounded-lg text-accent-foreground border border-accent/20 hover:border-accent/40 transition-colors">
          <p className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">💡 Tip</p>
          <p className="text-xs leading-relaxed opacity-80">
            Switch between Admin and Viewer roles using the dropdown in the header to see different UI features.
          </p>
        </div>
      </div>
    </aside>
  )
}
