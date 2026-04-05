import { MainLayout } from '@/components/MainLayout'
import { InsightsPage } from '@/components/insights/InsightsPage'

export const metadata = {
  title: 'Insights - Finance',
  description: 'View your financial insights and analytics',
}

export default function InsightsRoute() {
  return (
    <MainLayout>
      <InsightsPage />
    </MainLayout>
  )
}
