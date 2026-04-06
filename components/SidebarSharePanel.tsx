'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link as LinkIcon, Copy, Trash2, Clock, ChevronUp, ChevronDown } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ShareLink {
  id: string
  token: string
  expiryMinutes: number
  createdAt: Date
  expiresAt: Date
  label: string
}

export function SidebarSharePanel() {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [selectedExpiryMinutes, setSelectedExpiryMinutes] = useState(5)
  const [linkLabel, setLinkLabel] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const expiryOptions = [
    { minutes: 5, label: '5m' },
    { minutes: 10, label: '10m' },
    { minutes: 15, label: '15m' },
    { minutes: 30, label: '30m' },
    { minutes: 60, label: '1h' },
    { minutes: 300, label: '5h' },
  ]

  const generateShareLink = () => {
    if (!linkLabel.trim()) {
      alert('Please enter a label for the link')
      return
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + selectedExpiryMinutes * 60000)
    const token = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newLink: ShareLink = {
      id: token,
      token,
      expiryMinutes: selectedExpiryMinutes,
      createdAt: now,
      expiresAt,
      label: linkLabel,
    }

    setShareLinks([newLink, ...shareLinks])
    setLinkLabel('')
  }

  const copyToClipboard = (link: ShareLink) => {
    const scrollableText = `${window.location.origin}?session=${link.token}`
    navigator.clipboard.writeText(scrollableText)
    setCopiedId(link.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteLink = (id: string) => {
    setShareLinks(shareLinks.filter(l => l.id !== id))
    setDeleteId(null)
  }

  const getTimeRemaining = (expiresAt: Date) => {
    const diff = expiresAt.getTime() - new Date().getTime()
    if (diff <= 0) return 'Expired'
    
    const minutes = Math.ceil(diff / 60000)
    if (minutes < 1) return 'Soon'
    if (minutes < 60) return `${minutes}m`
    
    const hours = Math.ceil(minutes / 60)
    return `${hours}h`
  }

  const getStatusColor = (link: ShareLink) => {
    const timeLeft = link.expiresAt.getTime() - new Date().getTime()
    if (timeLeft <= 0) return 'bg-red-600/20 text-red-700 dark:text-red-300'
    if (timeLeft <= 300000) return 'bg-orange-600/20 text-orange-700 dark:text-orange-300'
    return 'bg-green-600/20 text-green-700 dark:text-green-300'
  }

  return (
    <div className="space-y-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-bold text-foreground"
      >
        <span className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          Create Link
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Label</label>
            <Input
              placeholder="e.g., Report Access"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              className="h-8 text-xs border"
              onKeyPress={(e) => e.key === 'Enter' && generateShareLink()}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Expiry</label>
            <div className="grid grid-cols-3 gap-1">
              {expiryOptions.map((option) => (
                <Button
                  key={option.minutes}
                  variant={selectedExpiryMinutes === option.minutes ? 'default' : 'outline'}
                  className="h-7 text-xs"
                  onClick={() => setSelectedExpiryMinutes(option.minutes)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={generateShareLink}
            className="w-full h-8 text-xs bg-green-600 hover:bg-green-700"
            disabled={!linkLabel.trim()}
          >
            Generate
          </Button>
        </div>
      )}

      {/* Links List - Compact */}
      {shareLinks.length > 0 && (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {shareLinks.map((link) => {
            const isExpired = link.expiresAt.getTime() < new Date().getTime()
            return (
              <div
                key={link.id}
                className="p-2 rounded-lg bg-muted/50 border border-border/50 hover:border-border/80 transition-all text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-foreground truncate flex-1">{link.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getStatusColor(link)}`}>
                    {getTimeRemaining(link.expiresAt)}
                  </span>
                </div>
                <code className="text-xs text-muted-foreground break-all block bg-background/70 px-1.5 py-1 rounded mb-1 max-h-12 overflow-y-auto">
                  {link.token}
                </code>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(link)}
                    className="h-6 px-2 text-xs flex-1"
                    disabled={isExpired}
                  >
                    <Copy className="w-3 h-3" />
                    {copiedId === link.id ? '✓' : 'Copy'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(link.id)}
                    className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link?</AlertDialogTitle>
            <AlertDialogDescription>
              This share link will be invalidated
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteLink(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
