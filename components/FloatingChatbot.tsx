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
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

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
      content: `Hello ${role === 'admin' ? '👑' : '👁️'}! I'm your financial assistant. Ask me anything about your finances!`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    const totalIncome = getTotalIncome(transactions)
    const totalExpenses = getTotalExpenses(transactions)
    const netIncome = getNetIncome(transactions)
    const savingsRate = getSavingsRate(transactions)

    // Financial queries
    if (lowerMessage.includes('total') || lowerMessage.includes('balance')) {
      return `💰 Your financial snapshot:\n\n📊 Total Income: ${formatCurrency(totalIncome)}\n📉 Total Expenses: ${formatCurrency(totalExpenses)}\n✨ Net Income: ${formatCurrency(netIncome)}\n\nYou're doing great! 🎯`
    }

    if (lowerMessage.includes('expense') || lowerMessage.includes('spending')) {
      const categorySpending = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        }, {} as Record<string, number>)

      const topCategory = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])[0]

      return `📊 Your top spending category is ${topCategory?.[0] || 'N/A'} with ${formatCurrency(topCategory?.[1] || 0)}.\n\nTip: Consider setting a budget limit for this category! 💡`
    }

    if (lowerMessage.includes('income')) {
      return `💵 Total Income: ${formatCurrency(totalIncome)}\n\nGreat job earning! Keep growing your income streams. 📈`
    }

    if (lowerMessage.includes('saving') || lowerMessage.includes('savings')) {
      const savingsAmount = netIncome
      const savingsPercent = (savingsRate * 100).toFixed(1)
      return `💎 Savings Rate: ${savingsPercent}%\n💰 Total Saved: ${formatCurrency(savingsAmount)}\n\nYou're on track to build wealth! 🚀`
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('limit')) {
      return `💼 Budget Planning Tips:\n\n1️⃣ Set category limits (30% expenses, 20% savings)\n2️⃣ Track weekly spending\n3️⃣ Review monthly trends\n4️⃣ Adjust based on goals\n\nWould you like a detailed budget plan? 📋`
    }

    if (lowerMessage.includes('transaction') || lowerMessage.includes('add')) {
      return `➕ To add a transaction:\n\n1. Click "Add Transaction" button\n2. Fill in details (date, amount, category)\n3. Select Income or Expense\n4. Save!\n\nNeed help with a specific transaction? 🤔`
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return `🆘 I can help you with:\n\n💰 Financial summaries\n📊 Spending analysis\n💎 Savings tips\n🏷️ Budget planning\n📈 Trend insights\n🎯 Financial goals\n\nJust ask me about any of these topics! 😊`
    }

    if (lowerMessage.includes('recommendation') || lowerMessage.includes('suggest')) {
      const recommendationAmount = totalIncome * 0.3
      return `🎯 Smart Recommendations:\n\n💡 Set savings goal: ${formatCurrency(recommendationAmount)}/month\n🎯 Reduce top spending by 10-15%\n📈 Increase income by side hustles\n💳 Use the budget planner tool\n\nImplement these and watch your wealth grow! 📈`
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return `You're welcome! 😊 I'm always here to help with your finances. Feel free to ask anything! 💪`
    }

    // Time-based responses
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 5) {
      return `🌙 It's late! Don't forget to review your finances before bed. Sleep well! 😴`
    }

    if (hour >= 8 && hour < 10) {
      return `☀️ Good morning! Start your day by reviewing yesterday's spending. 📊`
    }

    // Default helpful response
    return `✨ That's an interesting question! I can help you with financial insights, budget planning, spending analysis, and savings tips. What would you like to know? 💭`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue
    setInputValue('')

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage)
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, newBotMessage])
      setIsLoading(false)
    }, 500)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-white group animate-bounce"
          title="Open chatbot"
        >
          <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-96'
        } w-96 animate-slideInRight`}>
          <Card className="w-full h-full flex flex-col shadow-2xl border-primary/20">
            {/* Header */}
            <CardHeader className="bg-linear-to-r from-primary to-secondary text-white shrink-0 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div>
                    <CardTitle className="text-base">Finance Assistant</CardTitle>
                    <p className="text-xs opacity-80">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white/20"
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
                    className="h-8 w-8 hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                            message.type === 'user'
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-muted text-foreground rounded-bl-none'
                          } whitespace-pre-wrap`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2 rounded-bl-none">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-200" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-400" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t flex gap-2 shrink-0">
                  <Input
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="text-sm"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
