import { MainLayout } from '@/components/MainLayout'
import { DashboardOverview } from '@/components/dashboard/Overview'

export const metadata = {
  title: 'Dashboard - Finance',
  description: 'Personal finance dashboard overview',
}

export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardOverview />
    </MainLayout>
  )
}
