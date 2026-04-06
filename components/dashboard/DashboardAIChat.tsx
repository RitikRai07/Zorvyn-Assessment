'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Transaction } from '@/lib/types'
import { MessageCircle, Send, Sparkles, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { getTotalIncome, getTotalExpenses, getTopExpenseCategory } from '@/lib/utils/calculations'
import { formatCurrency } from '@/lib/utils/formatting'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface DashboardAIChatProps {
  transactions: Transaction[]
  accountBalance: number
}

export function DashboardAIChat({ transactions, accountBalance }: DashboardAIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    const totalIncome = getTotalIncome(transactions)
    const totalExpense = getTotalExpenses(transactions)
    const topCategory = getTopExpenseCategory(transactions)
    const savings = totalIncome - totalExpense

    // More knowledgeable AI responses with detailed insights
    if (message.includes('income')) {
      const incomeTransactions = transactions.filter(t => t.type === 'income')
      const avgIncome = totalIncome / (incomeTransactions.length || 1)
      const lastIncome = incomeTransactions.length > 0 ? incomeTransactions[0].amount : 0
      const monthlyPattern = (totalIncome / 12).toFixed(0)
      
      return `📈 **Income Analysis & Insights**\n\n**Total Income**: ${formatCurrency(totalIncome)}\n**Number of Transactions**: ${incomeTransactions.length}\n**Average per Transaction**: ${formatCurrency(avgIncome)}\n**Last Income**: ${formatCurrency(lastIncome)}\n**Estimated Monthly**: ${formatCurrency(parseFloat(monthlyPattern))}\n\n💡 **Insight**: Your income is ${totalIncome > totalExpense ? 'exceeding' : 'falling short of'} your expenses by ${formatCurrency(Math.abs(savings))}`
    }

    if (message.includes('expense') || message.includes('spent')) {
      const expenseTransactions = transactions.filter(t => t.type === 'expense')
      const avgExpense = totalExpense / (expenseTransactions.length || 1)
      const monthlyAvg = (totalExpense / 12).toFixed(0)
      const expensePercentNum = totalIncome > 0 ? parseFloat(((totalExpense / totalIncome) * 100).toFixed(1)) : 0
      
      return `📉 **Expense Analysis & Insights**\n\n**Total Expenses**: ${formatCurrency(totalExpense)}\n**Number of Transactions**: ${expenseTransactions.length}\n**Average per Transaction**: ${formatCurrency(avgExpense)}\n**Monthly Average**: ${formatCurrency(parseFloat(monthlyAvg))}\n**% of Income**: ${expensePercentNum.toFixed(1)}%\n\n💡 **Insight**: You're spending ${expensePercentNum.toFixed(1)}% of your income. ${expensePercentNum > 70 ? '⚠️ Consider reducing expenses.' : '✅ Good expense management!'}`
    }

    if (message.includes('summary') || message.includes('overview') || message === 'hi' || message === 'hello') {
      const expensePercentNum = totalIncome > 0 ? parseFloat(((totalExpense / totalIncome) * 100).toFixed(1)) : 0
      const savingsRateNum = totalIncome > 0 ? parseFloat(((savings / totalIncome) * 100).toFixed(1)) : 0
      
      return `📊 **Complete Financial Dashboard Summary**\n\n💰 **Account Balance**: ${formatCurrency(accountBalance)}\n📈 **Total Income**: ${formatCurrency(totalIncome)}\n📉 **Total Expenses**: ${formatCurrency(totalExpense)}\n✅ **Total Savings**: ${formatCurrency(savings)}\n\n**Metrics**:\n• Savings Rate: **${savingsRateNum.toFixed(1)}%**\n• Expense Ratio: **${expensePercentNum.toFixed(1)}%**\n• Transactions: **${transactions.length}**\n\n${savings > 0 ? '✨ Excellent! Keep up the good saving habits!' : '⚠️ Your expenses exceed income. Review your spending.'}`
    }

    if (message.includes('category') || message.includes('spending')) {
      if (topCategory) {
        const categoryPercent = totalExpense > 0 ? ((topCategory.amount / totalExpense) * 100).toFixed(1) : 0
        return `🏆 **Top Spending Category Analysis**\n\n**Category**: ${topCategory.category}\n**Amount**: ${formatCurrency(topCategory.amount)}\n**% of Total**: ${categoryPercent}%\n\n💡 **Recommendation**: ${topCategory.amount > totalExpense * 0.3 ? '⚠️ This category is consuming more than 30% of your expenses. Consider budget optimization.' : '✅ Reasonable allocation for this category.'}`
      }
      return `No expense data available yet.`
    }

    if (message.includes('savings') || message.includes('save')) {
      const savingsRateNum = totalIncome > 0 ? parseFloat(((savings / totalIncome) * 100).toFixed(1)) : 0
      const savingsGoal = (totalIncome * 0.2).toFixed(0) // 20% savings goal
      const onTrack = savings >= parseFloat(savingsGoal)
      
      return `💚 **Comprehensive Savings Analysis**\n\n**Total Savings**: ${formatCurrency(savings)}\n**Savings Rate**: **${savingsRateNum.toFixed(1)}%**\n**Savings Goal (20%)**: ${formatCurrency(parseFloat(savingsGoal))}\n**Status**: ${onTrack ? '✅ On Track!' : '📍 ' + formatCurrency(parseFloat(savingsGoal) - savings) + ' away from goal'}\n\n${savingsRateNum > 20 ? '🎉 Excellent savings rate! Keep it up!' : savingsRateNum > 10 ? '👍 Good progress! Aim for 20%.' : '📈 Focus on increasing your savings rate.'}`
    }

    if (message.includes('advice') || message.includes('suggest') || message.includes('recommend')) {
      const savingsRateNum = totalIncome > 0 ? parseFloat(((savings / totalIncome) * 100).toFixed(1)) : 0
      const expensePercentNum = totalIncome > 0 ? parseFloat(((totalExpense / totalIncome) * 100).toFixed(1)) : 0
      
      let recommendations = `💡 **Personalized Financial Recommendations**\n\n`
      
      // Based on spending patterns
      if (expensePercentNum > 80) {
        recommendations += `⚠️ **Urgent**: Your expenses are **${expensePercentNum.toFixed(1)}%** of income!\n`
        recommendations += `• Cut non-essential spending in ${topCategory?.category || 'major categories'}\n`
        recommendations += `• Review subscriptions and memberships\n`
        recommendations += `• Set strict budget limits\n\n`
      }
      
      if (savingsRateNum < 5) {
        recommendations += `📈 **Increase Savings**:\n`
        recommendations += `• Aim for 10-20% savings rate (${formatCurrency(totalIncome * 0.1)} - ${formatCurrency(totalIncome * 0.2)})\n`
        recommendations += `• Automate transfers to savings\n`
        recommendations += `• Build 3-month emergency fund\n\n`
      } else if (savingsRateNum >= 20) {
        recommendations += `🎉 **Excellent Work!** You're saving **${savingsRateNum.toFixed(1)}%** - Keep it up!\n`
        recommendations += `• Invest surplus funds for growth\n`
        recommendations += `• Build long-term wealth\n\n`
      }
      
      if (topCategory && topCategory.amount > totalExpense * 0.3) {
        recommendations += `🔍 **Optimize ${topCategory.category}**:\n`
        recommendations += `• This category is **${((topCategory.amount / totalExpense) * 100).toFixed(1)}%** of total spending\n`
        recommendations += `• Look for ways to reduce this expense\n`
        recommendations += `• Set monthly limit\n`
      }
      
      return recommendations
    }

    if (message.includes('how') || message.includes('help') || message.includes('?')) {
      return `🤖 **AI Assistant Features**\n\nTry asking about:\n• **Income**: Details about your earnings and trends\n• **Expenses**: Spending breakdown and analysis\n• **Savings**: Savings rate and goals\n• **Categories**: Spending by category\n• **Summary**: Full financial overview\n• **Advice**: Financial recommendations\n• **Budget**: Budget planning help\n\n📊 I analyze your data to provide actionable insights!`
    }

    return `📊 I'm your Financial Intelligence Assistant! Ask me about income, expenses, savings, budget, or get personalized financial recommendations based on your actual spending data.`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 500)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 gap-2"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 max-h-96 shadow-2xl border-primary/20 z-40 flex flex-col">
      <CardHeader className="border-b border-border/50 pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Finance Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-3 py-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Ask me about your finances!</p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none border border-border/50'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-2 rounded-lg text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t border-border/50 p-3 shrink-0 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your finances..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            className="text-sm border-border/50"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="gap-1"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">Powered by Dashboard Analytics</p>
      </div>
    </Card>
  )
}
