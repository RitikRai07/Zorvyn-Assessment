import { Transaction } from '../types'
import { formatDate, formatCurrency } from './formatting'

export function exportToCSV(transactions: Transaction[]): void {
  if (transactions.length === 0) {
    alert('No transactions to export')
    return
  }

  let csvContent = ''
  
  // Header with metadata
  csvContent += '═══════════════════════════════════════════════════\n'
  csvContent += 'ZORVYN - FINANCIAL TRANSACTIONS REPORT\n'
  csvContent += `Generated: ${new Date().toLocaleString('en-IN')}\n`
  csvContent += '═══════════════════════════════════════════════════\n\n'

  // Summary section
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpense

  csvContent += 'SUMMARY REPORT\n'
  csvContent += '───────────────────────────────────────────────────\n'
  csvContent += `Total Transactions,${transactions.length}\n`
  csvContent += `Total Income,${formatCurrency(totalIncome)}\n`
  csvContent += `Total Expenses,${formatCurrency(totalExpense)}\n`
  csvContent += `Net Balance,${formatCurrency(netBalance)}\n`
  csvContent += `Balance Status,${netBalance >= 0 ? '✓ Positive' : '⚠ Negative'}\n\n`

  // Category breakdown
  const categoryData: Record<string, { count: number; amount: number; type: string }> = {}
  
  transactions.forEach(t => {
    if (!categoryData[t.category]) {
      categoryData[t.category] = { count: 0, amount: 0, type: t.type }
    }
    categoryData[t.category].count += 1
    categoryData[t.category].amount += t.amount
  })

  csvContent += 'CATEGORY BREAKDOWN\n'
  csvContent += '───────────────────────────────────────────────────\n'
  csvContent += 'Category,Type,Transaction Count,Total Amount\n'
  
  Object.entries(categoryData).forEach(([category, data]) => {
    csvContent += `"${category}","${data.type}","${data.count}","${formatCurrency(data.amount)}"\n`
  })

  csvContent += '\n'
  csvContent += 'TRANSACTION DETAILS\n'
  csvContent += '═══════════════════════════════════════════════════\n'

  const headers = ['Date', 'Time', 'Description', 'Category', 'Type', 'Amount']
  csvContent += headers.join(',') + '\n'
  csvContent += '───────────────────────────────────────────────────\n'
  
  const rows = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(t => {
      const dateObj = new Date(t.date)
      const dateStr = formatDate(t.date)
      const timeStr = dateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      return [
        dateStr,
        timeStr,
        t.description,
        t.category,
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        formatCurrency(t.amount)
      ]
    })

  rows.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
  })

  csvContent += '\n═══════════════════════════════════════════════════\n'
  csvContent += `Export Date: ${new Date().toLocaleString('en-IN')}\n`
  csvContent += 'Data Format: Clear, Detailed, Ready for Analysis\n'

  downloadFile(csvContent, `Zorvyn_Transactions_${getDayMonthYear()}.csv`, 'text/csv;charset=utf-8;')
}

export function exportToJSON(transactions: Transaction[]): void {
  if (transactions.length === 0) {
    alert('No transactions to export')
    return
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const data = {
    exportDate: new Date().toISOString(),
    summary: {
      totalTransactions: transactions.length,
      totalIncome: totalIncome,
      totalExpenses: totalExpense,
      netBalance: totalIncome - totalExpense,
      formattedIncome: formatCurrency(totalIncome),
      formattedExpenses: formatCurrency(totalExpense),
      formattedBalance: formatCurrency(totalIncome - totalExpense)
    },
    transactions: transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(t => ({
        date: formatDate(t.date),
        description: t.description,
        category: t.category,
        type: t.type,
        amount: t.amount,
        formattedAmount: formatCurrency(t.amount)
      }))
  }

  const json = JSON.stringify(data, null, 2)
  downloadFile(json, `Zorvyn_Transactions_${getDayMonthYear()}.json`, 'application/json')
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  try {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)

    // Show toast-like notification
    console.log(`✓ Downloaded: ${filename}`)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Failed to download file. Please try again.')
  }
}

function getDayMonthYear(): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${day}-${month}-${year}`
}
