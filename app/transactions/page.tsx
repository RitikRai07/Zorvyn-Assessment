import { MainLayout } from '@/components/MainLayout'
import { TransactionsPage } from '@/components/transactions/TransactionsPage'

export const metadata = {
  title: 'Transactions - Finance',
  description: 'Manage your financial transactions',
}

export default function TransactionsRoute() {
  return (
    <MainLayout>
      <TransactionsPage />
    </MainLayout>
  )
}
