'use client'

import Link from 'next/link'
import { Home, Users, Sword, TrendingUp } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-bg-secondary border-b border-bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl">🥚</span>
              <span className="text-xl font-bold text-primary">
                MiMo Monster Breeder
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </div>
            </Link>

            <Link href="/collection">
              <div className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer">
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Collection</span>
              </div>
            </Link>

            <Link href="/battle">
              <div className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer">
                <Sword className="w-5 h-5" />
                <span className="hidden sm:inline">Battle</span>
              </div>
            </Link>

            <Link href="/training">
              <div className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer">
                <TrendingUp className="w-5 h-5" />
                <span className="hidden sm:inline">Training</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
