import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MiMo Monster Breeder',
  description: 'Collect, train, and battle AI-generated monsters',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'MiMo Monster Breeder',
    description: 'Collect, train, and battle AI-generated monsters',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiMo Monster Breeder',
    description: 'Collect, train, and battle AI-generated monsters',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-bg-primary`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
