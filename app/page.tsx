'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Egg, Sword, TrendingUp, Users } from 'lucide-react'
import useGameStore from '@/lib/store'
import MonsterCard from '@/components/ui/MonsterCard'
import Button from '@/components/ui/Button'
import { generateMonster } from '@/lib/api/monster'

export default function Home() {
  const { monsters, essence, totalBattles, totalWins, addMonster, loadFromStorage } = useGameStore()
  const [isHatching, setIsHatching] = useState(false)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const handleHatchEgg = async () => {
    if (isHatching) return

    setIsHatching(true)
    try {
      const monster = await generateMonster()
      addMonster(monster)
    } catch (error) {
      console.error('Failed to hatch monster:', error)
    } finally {
      setIsHatching(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          MiMo Monster Breeder
        </h1>
        <p className="text-text-secondary">
          Collect, train, and battle AI-generated monsters
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-card p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Egg className="w-5 h-5 text-primary" />
            <span className="text-text-secondary">Essence</span>
          </div>
          <div className="text-2xl font-bold mt-2">{essence}</div>
        </div>

        <div className="bg-bg-card p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-text-secondary">Monsters</span>
          </div>
          <div className="text-2xl font-bold mt-2">{monsters.length}</div>
        </div>

        <div className="bg-bg-card p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-primary" />
            <span className="text-text-secondary">Battles</span>
          </div>
          <div className="text-2xl font-bold mt-2">{totalBattles}</div>
        </div>

        <div className="bg-bg-card p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-text-secondary">Win Rate</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Hatch Button */}
      <div className="text-center">
        <Button
          onClick={handleHatchEgg}
          disabled={isHatching}
          size="lg"
          className="relative"
        >
          {isHatching ? (
            <>
              <div className="animate-egg-shake">
                <Egg className="w-6 h-6 mr-2" />
              </div>
              Hatching...
            </>
          ) : (
            <>
              <Egg className="w-6 h-6 mr-2" />
              Hatch Egg
            </>
          )}
        </Button>
        <p className="text-text-secondary mt-2">
          Get a new AI-generated monster with unique personality and skills
        </p>
      </div>

      {/* Recent Monsters */}
      {monsters.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Monsters</h2>
            <Link href="/collection">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {monsters.slice(0, 3).map((monster) => (
              <MonsterCard key={monster.id} monster={monster} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/collection">
          <div className="bg-bg-card p-6 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Collection</h3>
            <p className="text-text-secondary">
              View all your monsters, manage training, and prepare for battle
            </p>
          </div>
        </Link>

        <Link href="/battle">
          <div className="bg-bg-card p-6 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Battle Arena</h3>
            <p className="text-text-secondary">
              Test your monsters in 1v1 battles with AI-generated commentary
            </p>
          </div>
        </Link>

        <Link href="/training">
          <div className="bg-bg-card p-6 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Training Grounds</h3>
            <p className="text-text-secondary">
              Level up your monsters and unlock new skills with essence
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
