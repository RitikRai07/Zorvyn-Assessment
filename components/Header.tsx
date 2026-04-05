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
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <span className="text-primary-foreground font-bold text-lg">₹</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Zorvyn</h1>
            <p className="text-xs text-muted-foreground">Finance Dashboard</p>
          </div>
        </div>

        {/* Right-side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                title="Export your transactions"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Export transactions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleExport('csv')}
                className="cursor-pointer flex items-center gap-2"
              >
                <span>📊</span> CSV Format
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleExport('json')}
                className="cursor-pointer flex items-center gap-2"
              >
                <span>📋</span> JSON Format
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
                className="gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                title="Switch user role"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm capitalize font-medium">
                  {role === 'admin' ? '👑 Admin' : '👁️ Viewer'}
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
                  <div className="font-medium text-sm">Admin</div>
                  <div className="text-xs text-muted-foreground">Full access</div>
                </div>
                {role === 'admin' && <span className="text-lg">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
