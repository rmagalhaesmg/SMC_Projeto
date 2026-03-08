import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMC Analysis Platform',
  description: 'Plataforma profissional de análise institucional baseada em Smart Money Concepts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}

