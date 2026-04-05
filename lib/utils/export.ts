import { Transaction } from '../types'
import { formatDate, formatCurrency } from './formatting'

export function exportToCSV(transactions: Transaction[]): void {
  if (transactions.length === 0) {
    alert('No transactions to export')
    return
  }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (₹)']
  
  const rows = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(t => [
      formatDate(t.date),
      t.description,
      t.category,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      formatCurrency(t.amount)
    ])

  // Add summary section
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    '', // Empty line for separation
    'Summary,,,',
    `Total Income,${formatCurrency(totalIncome)},`,
    `Total Expenses,${formatCurrency(totalExpense)},`,
    `Net Balance,${formatCurrency(totalIncome - totalExpense)},`,
    '', // Empty line
    `Export Date: ${new Date().toLocaleString('en-IN')}`
  ].join('\n')

  downloadFile(csv, `Zorvyn_Transactions_${getDayMonthYear()}.csv`, 'text/csv;charset=utf-8;')
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
