import { Suspense } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import FloatingMenu from '@/components/ui/FloatingMenu'
import ChartClient from './_components/ChartClient'

export default function ChartPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <Topbar />
      <FloatingMenu />
      <main className="ml-[260px] pt-16">
        <div className="p-6 space-y-6">
          <Suspense fallback={<div className="card p-6">Carregando gráfico…</div>}>
            <ChartClient />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
