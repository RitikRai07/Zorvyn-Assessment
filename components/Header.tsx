'use client'

import { useFinance } from '@/lib/hooks/useFinance'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun, Download, Settings } from 'lucide-react'
import { exportToCSV, exportToJSON } from '@/lib/utils/export'

export function Header() {
  const { role, setRole, isDarkMode, toggleDarkMode, transactions } = useFinance()

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCSV(transactions)
    } else {
      exportToJSON(transactions)
    }
  }

  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-2xl sticky top-0 z-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Branding - Zorvyn Finance */}
        <div className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
          <div className="relative px-4 py-2 rounded-2xl bg-gradient-to-br from-teal-600/30 to-cyan-500/20 border-2 border-teal-500/50 group-hover:from-teal-600/50 group-hover:to-cyan-500/35 group-hover:border-teal-500/70 transition-all duration-300 shadow-2xl">
            <h1 className="text-3xl font-black bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">⚡</h1>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity drop-shadow-lg">Zorvyn Finance</h1>
            <p className="text-xs text-muted-foreground/80 font-bold tracking-widest">💳 Professional Finance Manager</p>
          </div>
        </div>

        {/* Right-side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 sm:gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-700 dark:text-green-300 border-green-500/40 hover:border-green-500/60 font-bold shadow-sm hover:shadow-md transition-all"
                title="Export your transactions"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-bold">📊 Export Data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleExport('csv')}
                className="cursor-pointer flex items-center gap-2 py-2 px-3"
              >
                <span>📋</span> <span>CSV Format (Excel)</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleExport('json')}
                className="cursor-pointer flex items-center gap-2 py-2 px-3"
              >
                <span>🔗</span> <span>JSON Format</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-border/50"></div>

          {/* Role Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground hover:bg-blue-500/10 rounded-xl font-bold transition-all"
                title="Switch user role"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm capitalize font-medium">
                  {role === 'admin' ? '👑 Ritik' : '👁️ Viewer'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setRole('viewer')}
                className={`cursor-pointer flex items-center gap-3 ${role === 'viewer' ? 'bg-accent/20' : ''}`}
              >
                <span className="text-lg">👁️</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">Viewer</div>
                  <div className="text-xs text-muted-foreground">Read-only access</div>
                </div>
                {role === 'viewer' && <span className="text-lg">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setRole('admin')}
                className={`cursor-pointer flex items-center gap-3 ${role === 'admin' ? 'bg-accent/20' : ''}`}
              >
                <span className="text-lg">👑</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">Ritik (Admin)</div>
                  <div className="text-xs text-muted-foreground">Full access</div>
                </div>
                {role === 'admin' && <span className="text-lg">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className="gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-700 dark:text-amber-300 border-amber-500/40 hover:border-amber-500/60 font-bold shadow-sm hover:shadow-md transition-all"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
