'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Transaction, UserRole } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/formatting'
import {
  getTotalIncome,
  getTotalExpenses,
  getNetIncome,
  getSavingsRate,
} from '@/lib/utils/calculations'
import { MessageCircle, X, Send, Minimize2, Maximize2, Mic, Copy, Check } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  { icon: '💰', text: 'Show my balance', query: 'What is my total balance?' },
  { icon: '📊', text: 'Spending insights', query: 'Where did I spend the most?' },
  { icon: '💎', text: 'Savings tips', query: 'How can I save more?' },
  { icon: '🎯', text: 'Financial goals', query: 'Tell me about goals' },
]

interface FloatingChatbotProps {
  transactions: Transaction[]
  role: UserRole
}

export function FloatingChatbot({ transactions, role }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `🎉 Welcome to **Zorvyn Finance**! I'm your intelligent financial assistant. Ask me anything about your finances! 💰`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    const totalIncome = getTotalIncome(transactions)
    const totalExpenses = getTotalExpenses(transactions)
    const netIncome = getNetIncome(transactions)
    const savingsRate = getSavingsRate(transactions)

    // Zorvyn Company Info
    if (lowerMessage.includes('zorvyn') || lowerMessage.includes('company') || lowerMessage.includes('about')) {
      return `🏢 **About Zorvyn Finance** 💳\n
📊 Your Professional Financial Dashboard\n✨ Real-time analytics & insights\n🎯 Smart Goals management\n💡 Personalized recommendations\n🔐 Enterprise-grade security\n🤖 AI-powered financial assistant\n\n**Features:**\n• Transaction tracking\n• Budget planning\n• Spending analytics\n• Financial goals\n• Performance insights\n• Share links for team access\n\nZorvyn: Manage finances like a pro! 🚀`
    }

    // Goals Information
    if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      return `🎯 **Financial Goals System** \n
✨ Create and track savings targets\n📈 Monitor progress with visual charts\n🏆 Set priority levels (High/Medium/Low)\n📅 Deadline tracking\n💰 Auto-calculate progress\n🔔 Smart notifications\n\n**How to use Goals:**\n1. Set a target amount\n2. Choose deadline\n3. Track contributions\n4. View progress bars\n5. Celebrate milestones! 🎉\n\nGoals help you achieve financial dreams! 💪`
    }

    // Financial queries
    if (lowerMessage.includes('total') || lowerMessage.includes('balance') || lowerMessage.includes('summary')) {
      return `💰 **Your Financial Snapshot** 📊\n\n📈 Total Income: **${formatCurrency(totalIncome)}**\n📉 Total Expenses: **${formatCurrency(totalExpenses)}**\n✨ Net Income: **${formatCurrency(netIncome)}**\n💎 Savings Rate: **${(savingsRate * 100).toFixed(1)}%**\n\n**Recommendations:**\n🎯 You're managing well!\n📊 Keep tracking transactions\n💪 Maintain your savings rate!\n🚀 Consider investment opportunities`
    }

    if (lowerMessage.includes('expense') || lowerMessage.includes('spending') || lowerMessage.includes('where')) {
      const categorySpending = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        }, {} as Record<string, number>)

      const topCategory = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])[0]

      return `📊 **Spending Analysis** 💳\n\n🏆 Top Category: **${topCategory?.[0] || 'N/A'}**\n💰 Amount: **${formatCurrency(topCategory?.[1] || 0)}**\n\n**Smart Tips:**\n💡 Set category budgets\n🎯 Reduce discretionary spending by 10-15%\n📱 Use real-time notifications\n🔍 Review weekly trends\n\nDashboard has detailed breakdown! 📈`
    }

    if (lowerMessage.includes('income')) {
      return `💵 **Income Overview** 📈\n\n💰 Total Income: **${formatCurrency(totalIncome)}**\n📊 Income Transactions: **${transactions.filter(t => t.type === 'income').length}**\n\n**Ways to Increase:**\n1️⃣ Side hustles\n2️⃣ Freelancing\n3️⃣ Passive income\n4️⃣ Investments\n5️⃣ Upskilling\n\nGreat job earning! Keep growing! 🚀`
    }

    if (lowerMessage.includes('saving') || lowerMessage.includes('savings') || lowerMessage.includes('save')) {
      const savingsAmount = netIncome
      const savingsPercentage = savingsRate * 100
      const savingsPercent = savingsPercentage.toFixed(1)
      return `💎 **Savings Insights** 🏆\n\n💰 Total Saved: **${formatCurrency(savingsAmount)}**\n📊 Savings Rate: **${savingsPercent}%**\n🎯 Goal Rate: **20%**\n\n**Status:** ${savingsPercentage >= 20 ? '✨ Excellent!' : savingsPercentage >= 10 ? '👍 Good!' : '📈 Keep improving!'}\n\n**Action Items:**\n• Automate savings\n• Review Goals\n• Set milestones\n• Celebrate wins! 🎉`
    }

    if (lowerMessage.includes('dashboard') || lowerMessage.includes('feature')) {
      return `📊 **Dashboard Features** 🎯\n\n📈 **Main Dashboard:**\n  • Real-time balance\n  • Spending trends\n  • Transaction list\n  • Quick stats\n\n💳 **Transactions:**\n  • Add/edit transactions\n  • Download reports\n  • Filter by category\n  • Advanced search\n\n📊 **Insights:**\n  • Monthly trends\n  • Category breakdown\n  • Performance metrics\n  • Smart recommendations\n\n🎯 **Goals:**\n  • Create goals\n  • Track progress\n  • Set deadlines\n  • Auto-calculations\n\n🔗 **Admin Features:**\n  • Generate share links\n  • Session control\n  • Role switching\n  • Advanced reports`
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('limit') || lowerMessage.includes('plan')) {
      return `💼 **Smart Budget Planning** 📋\n\n**Recommended Budget:**\n🏠 Housing: 30%\n🍔 Food: 12%\n🚗 Transportation: 15%\n💰 Savings: 20%\n🎲 Entertainment: 10%\n📚 Education: 8%\n🏥 Health: 5%\n\n**Budget Planner Tool:**\n✅ Set category limits\n📊 Real-time tracking\n🔔 Smart alerts\n📈 Performance analytics\n\nAccess via Dashboard! 🚀`
    }

    if (lowerMessage.includes('share') || lowerMessage.includes('link') || lowerMessage.includes('access')) {
      return `🔗 **Share Session Links** 👥\n\n**Admin Feature:** Create temporary session links\n\n⏱️ **Time Options:**\n  • 5 minutes\n  • 10 minutes\n  • 15 minutes\n  • 30 minutes\n  • 1 hour\n  • 5 hours\n\n**How to use:**\n1️⃣ Go to Sidebar → Share Links\n2️⃣ Click "Create Link"\n3️⃣ Set expiry time\n4️⃣ Copy link\n5️⃣ Share securely\n\n✨ Why use it?\n• Temporary team access\n• Secure sharing\n• Time-limited access\n• No password needed`
    }

    if (lowerMessage.includes('transaction') || lowerMessage.includes('add') || lowerMessage.includes('record')) {
      return `➕ **Add Transaction Guide** 📝\n\n**Steps:**\n1️⃣ Click "Transactions" tab\n2️⃣ Click "Add Transaction"\n3️⃣ Fill details:\n   • Date (when occurred)\n   • Amount (in rupees)\n   • Category (Food, Rent, etc)\n4️⃣ Select **Income** or **Expense**\n5️⃣ Add description (optional)\n6️⃣ Click Save!\n\n**Pro Tips:**\n💡 Add daily to stay updated\n📱 Use filters to find old transactions\n🔍 See real-time analytics\n📊 Download reports anytime`
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('assist')) {
      return `🆘 **I Can Help With:**\n\n💰 Financial summaries\n📊 Spending analysis\n💎 Savings strategies\n🏷️ Budget planning\n📈 Trend insights\n🎯 Goal management\n📱 Feature guidance\n🔗 Share links\n🏢 Company info\n💡 Recommendations\n\n**Just ask me about:**\n• Your finances\n• Dashboard features\n• Financial tips\n• Zorvyn info\n• Any questions!\n\nI'm always here! 😊`
    }

    if (lowerMessage.includes('recommendation') || lowerMessage.includes('suggest') || lowerMessage.includes('advice')) {
      const recommendationAmount = totalIncome * 0.3
      return `💡 **Personalized Recommendations** 🚀\n\n**Based on your data:**\n\n📊 Financial Health: ${savingsRate >= 0.2 ? '💪 Excellent' : savingsRate >= 0.1 ? '👍 Good' : '📈 Improving'}\n\n**Action Items:**\n✨ Set a savings goal: **${formatCurrency(recommendationAmount)}/month**\n🎯 Reduce top spending by **10-15%**\n💰 Build **6-month emergency** fund\n📚 Track expenses **daily**\n\n**Next Steps:**\n1️⃣ Create financial goals\n2️⃣ Set budget limits\n3️⃣ Review weekly\n4️⃣ Celebrate progress! 🎉`
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
      return `🙏 **You're welcome!** 😊\n\nI'm always happy to help! 💪\n\nFeel free to ask me about:\n✨ Zorvyn features\n📊 Financial insights\n💡 Budget tips\n🎯 Goal management\n🔗 Sharing links\n\nLet's grow your wealth together! 🚀`
    }

    // Time-based responses
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 5) {
      return `🌙 **Late night check!** 😴\n\nDon't forget to:\n✅ Review today's spending\n📊 Update transactions\n💤 Then get some rest!\n\nYour finances are in good hands. Sleep well! 🛌💤`
    }

    if (hour >= 8 && hour < 10) {
      return `☀️ **Good morning!** 🌅\n\n**Daily Finance Checklist:**\n✅ Check yesterday's spending\n📝 Review transactions\n📊 Monitor goals\n💡 Plan the day\n\nStart strong! 💪`
    }

    if (hour >= 18 && hour < 20) {
      return `🌆 **Evening Summary Time!** 📊\n\nLet's wrap up the day:\n📝 Add today's transactions\n💰 Check spending\n🎯 Review goals\n📈 Track progress\n\nGreat work today! 🎉`
    }

    // Default helpful response
    return `✨ **Smart Question!** 💭\n\nI have full knowledge of:\n📊 Your dashboard & features\n💰 All transactions & analytics\n🎯 Goals & targets\n📈 Spending patterns\n🏢 Zorvyn capabilities\n\n**I can help with:**\n• Zorvyn info & features\n• Goals management\n• Budget planning\n• Spending analysis\n• Financial tips\n• Recommendations\n• Share links\n• Dashboard guidance\n\nWhat would you like to know? 🚀`
  }

  const handleSendMessage = (message?: string) => {
    const textToSend = message || inputValue.trim()
    if (!textToSend || isLoading) return

    setInputValue('')
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const botResponse = generateBotResponse(textToSend)
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, newBotMessage])
      setIsLoading(false)
    }, 600)
  }

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input not supported in your browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.language = 'en-US'
    setIsListening(true)
    playSound('open')

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('')
      
      if (transcript.trim()) {
        setInputValue(transcript)
        setTimeout(() => handleSendMessage(transcript), 200)
      }
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      playSound('close')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      {/* Floating Button - Enhanced */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            playSound('open')
          }}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-primary shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-125 flex items-center justify-center text-white group animate-bounce hover:animate-pulse border-2 border-primary/50 hover:border-primary"
          title="Open AI Finance Assistant"
        >
          <MessageCircle className="w-8 h-8 group-hover:scale-125 transition-transform" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
        </button>
      )}

      {/* Chatbot Window - Enhanced */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-96'
        } w-96 animate-slideInRight`}>
          <Card className="w-full h-full flex flex-col shadow-2xl border-2 border-primary/30 bg-gradient-to-b from-background from-0% to-background/95 to-100%">
            {/* Header - Enhanced */}
            <CardHeader className="bg-gradient-to-r from-primary via-secondary to-primary text-white shrink-0 rounded-t-lg shadow-lg border-b-2 border-primary/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div>
                    <CardTitle className="text-lg font-black">🤖 Zorvyn AI Assistant</CardTitle>
                    <p className="text-xs opacity-90">Powered by Advanced Analytics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white/20 transition-all"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white/20 transition-all"
                    onClick={() => {
                      setIsOpen(false)
                      playSound('close')
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages - Enhanced */}
            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background/50 from-0% to-background to-100% overflow-y-auto">
                  <div className="space-y-3 pr-4">
                    {messages.length === 1 && !isLoading && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {SUGGESTIONS.map((sugg, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(sugg.query)}
                            className="text-left p-3 rounded-lg bg-muted/60 hover:bg-primary/20 transition-all border border-primary/20 hover:border-primary/50"
                          >
                            <div className="text-xl mb-1">{sugg.icon}</div>
                            <div className="text-xs font-medium text-foreground">{sugg.text}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn group`}
                      >
                        <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} gap-1 max-w-[85%]`}>
                          <div
                            className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none shadow-lg'
                                : 'bg-muted/80 text-foreground rounded-bl-none border border-primary/30 shadow-md'
                            }`}
                          >
                            {message.content}
                          </div>
                          <div className={`flex gap-2 items-center mx-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                            {message.type === 'bot' && (
                              <button
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-xs"
                              >
                                {copiedId === message.id ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                  <Copy className="w-3 h-3 text-muted-foreground" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start animate-fadeIn">
                        <div className="bg-muted/80 rounded-xl px-4 py-3 rounded-bl-none border border-primary/30">
                          <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                {/* Input - Enhanced */}
                <div className="p-3 border-t border-primary/10 space-y-2 shrink-0 bg-background/80 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything..."
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !isLoading && inputValue.trim()) {
                          handleSendMessage()
                        }
                      }}
                      disabled={isLoading || isListening}
                      className="text-sm border-primary/30 focus:border-primary focus:ring-primary/50 rounded-lg"
                    />
                    <Button
                      size="icon"
                      onClick={handleVoiceInput}
                      disabled={isLoading}
                      title="Voice input"
                      className={`shrink-0 transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-primary to-secondary'}`}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => {
                        handleSendMessage()
                        playSound('send')
                      }}
                      disabled={isLoading || !inputValue.trim()}
                      className="shrink-0 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Sound Effects */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(400px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  )

  function playSound(type: 'open' | 'close' | 'send') {
    if (typeof window === 'undefined') return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioContext.currentTime
      
      const createTone = (freq: number, duration: number, startTime: number, volume: number = 0.2) => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        osc.connect(gain)
        gain.connect(audioContext.destination)
        gain.gain.setValueAtTime(volume, startTime)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
        osc.start(startTime)
        osc.stop(startTime + duration)
      }
      
      if (type === 'open') {
        // Cheerful opening sound - 3 ascending notes
        createTone(523, 0.15, now, 0.2) // C5
        createTone(659, 0.15, now + 0.1, 0.2) // E5
        createTone(784, 0.2, now + 0.2, 0.2) // G5
      } else if (type === 'close') {
        // Soft closing sound - 2 descending notes
        createTone(659, 0.15, now, 0.15) // E5
        createTone(523, 0.2, now + 0.1, 0.15) // C5
      } else if (type === 'send') {
        // Quick notification send sound
        createTone(784, 0.08, now, 0.15) // G5
        createTone(880, 0.12, now + 0.08, 0.15) // A5
      }
    } catch (e) {
      // Audio context not available
    }
  }
}
