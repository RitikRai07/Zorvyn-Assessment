'use client'

import { useFinance } from '@/lib/hooks/useFinance'
import { SummaryCards } from './SummaryCards'
import { BalanceTrendChart } from './BalanceTrendChart'
import { SpendingBreakdownChart } from './SpendingBreakdownChart'
import { DashboardAIChat } from './DashboardAIChat'
import { TipSection } from '@/components/TipSection'
import { QuickStats } from './QuickStats'
import { SpendingAnalytics } from './SpendingAnalytics'
import { TimeGreeting } from './TimeGreeting'
import { BudgetPlanner } from './BudgetPlanner'
import { BillingReports } from './BillingReports'
import { calculateTotalBalance } from '@/lib/utils/mockData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function DashboardOverview() {
  const { transactions, accounts, setFilters, role } = useFinance()
  const totalBalance = calculateTotalBalance(accounts)

  const handleCategoryClick = (category: string) => {
    setFilters({ category })
    // Would navigate to transactions page in a real app
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Time Greeting Section */}
      <div>
        <TimeGreeting />
      </div>

      {/* Hero Header Section */}
      <div className="space-y-3 relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-secondary/10 rounded-2xl blur-3xl opacity-30 -z-10" />
        
        <h1 className="text-5xl sm:text-5xl font-black bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground font-medium">
          Welcome back! Here&apos;s your financial snapshot and insights
        </p>
      </div>

      {/* Tabs for Dashboard/Reports */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="billing">📄 Billing & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8 mt-8">

        {/* Summary Cards with Better Spacing */}
        <div>
          <SummaryCards transactions={transactions} accountBalance={totalBalance} />
        </div>

        {/* Quick Stats - This Month Breakdown */}
        <div>
          <QuickStats transactions={transactions} />
        </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <BalanceTrendChart transactions={transactions} accounts={accounts} />
        </div>
        <div className="lg:col-span-4">
          <SpendingBreakdownChart
            transactions={transactions}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      {/* Tips Section with Expandable Cards */}
      <TipSection />

      {/* Spending Analytics */}
      <div>
        <SpendingAnalytics transactions={transactions} />
      </div>

      {/* AI Chat Widget */}
      <DashboardAIChat transactions={transactions} accountBalance={totalBalance} />
        </TabsContent>

        <TabsContent value="billing" className="mt-8">
          <BillingReports transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
