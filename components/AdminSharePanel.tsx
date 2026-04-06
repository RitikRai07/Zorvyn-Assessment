'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link as LinkIcon, Copy, Trash2, Share2, Clock } from 'lucide-react'
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
  useCount: number
  maxUses?: number
  label: string
}

export function AdminSharePanel() {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [selectedExpiryMinutes, setSelectedExpiryMinutes] = useState(5)
  const [linkLabel, setLinkLabel] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const expiryOptions = [
    { minutes: 5, label: '5 Minutes' },
    { minutes: 10, label: '10 Minutes' },
    { minutes: 15, label: '15 Minutes' },
    { minutes: 30, label: '30 Minutes' },
    { minutes: 60, label: '1 Hour' },
    { minutes: 300, label: '5 Hours' },
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
      useCount: 0,
      label: linkLabel,
    }

    setShareLinks([newLink, ...shareLinks])
    setLinkLabel('')
    setShowForm(false)
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
    if (minutes < 1) return 'Expiring soon'
    if (minutes < 60) return `${minutes}m left`
    
    const hours = Math.ceil(minutes / 60)
    return `${hours}h left`
  }

  const getStatusColor = (link: ShareLink) => {
    const timeLeft = link.expiresAt.getTime() - new Date().getTime()
    if (timeLeft <= 0) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    if (timeLeft <= 300000) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  }

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Share2 className="w-5 h-5" />
              🔗 Share Session Links
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Admin only: Create shareable links with time limits</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
          >
            <LinkIcon className="w-4 h-4" />
            New Link
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Form */}
        {showForm && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Link Label</label>
              <Input
                placeholder="e.g., Report Viewing, Temporary Access"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className="border-2"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Expiry Time</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {expiryOptions.map((option) => (
                  <Button
                    key={option.minutes}
                    variant={selectedExpiryMinutes === option.minutes ? 'default' : 'outline'}
                    className="text-sm"
                    onClick={() => setSelectedExpiryMinutes(option.minutes)}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={generateShareLink}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 font-bold"
              >
                Generate Link
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Links List */}
        {shareLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-3">🔗</div>
            <p className="text-foreground font-bold">No Share Links Yet</p>
            <p className="text-sm text-muted-foreground">Create your first shareable link for temporary access</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shareLinks.map((link) => {
              const isExpired = link.expiresAt.getTime() < new Date().getTime()
              return (
                <div
                  key={link.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 border-2 border-border/50 hover:border-border/80 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-bold text-foreground">{link.label}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(link)}`}>
                          {getTimeRemaining(link.expiresAt)}
                        </span>
                      </div>
                      <code className="text-xs text-muted-foreground break-all bg-muted/50 px-2 py-1 rounded">
                        {link.token}
                      </code>
                      <div className="text-xs text-muted-foreground mt-2">
                        Created: {link.createdAt.toLocaleTimeString('en-IN')}
                        {' • '}
                        Expires: {link.expiresAt.toLocaleTimeString('en-IN')}
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link)}
                        className="gap-1 border-2"
                        disabled={isExpired}
                      >
                        <Copy className="w-3 h-3" />
                        {copiedId === link.id ? '✓' : 'Copy'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(link.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Share Link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will invalidate the link. Anyone trying to use it will not be able to access the session.
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
    </Card>
  )
}
