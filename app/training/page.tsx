'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Heart, Sword, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import useGameStore from '@/lib/store'
import Button from '@/components/ui/Button'
import { Monster } from '@/lib/types'

function TrainingContent() {
  const searchParams = useSearchParams()
  const monsterId = searchParams.get('monster')

  const { monsters, updateMonster, addEssence, essence } = useGameStore()
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null)
  const [hpIncrease, setHpIncrease] = useState(0)
  const [atkIncrease, setAtkIncrease] = useState(0)
  const [defIncrease, setDefIncrease] = useState(0)

  useEffect(() => {
    if (monsterId) {
      const monster = monsters.find(m => m.id === monsterId)
      if (monster) {
        setSelectedMonster(monster)
      }
    }
  }, [monsterId, monsters])

  const ESSENCE_COST_PER_STAT = 100

  const totalCost = (hpIncrease + atkIncrease + defIncrease) * ESSENCE_COST_PER_STAT
  const canTrain = essence >= totalCost && totalCost > 0

  const handleTrain = () => {
    if (!selectedMonster || !canTrain) return

    const newStats = {
      hp: selectedMonster.stats.hp + hpIncrease * 5,
      atk: selectedMonster.stats.atk + atkIncrease * 5,
      def: selectedMonster.stats.def + defIncrease * 5,
    }

    updateMonster(selectedMonster.id, {
      stats: newStats,
      currentHp: Math.max(selectedMonster.currentHp, newStats.hp),
    })

    addEssence(-totalCost)

    // Reset
    setHpIncrease(0)
    setAtkIncrease(0)
    setDefIncrease(0)

    // Update selected monster
    setSelectedMonster({
      ...selectedMonster,
      stats: newStats,
      currentHp: Math.max(selectedMonster.currentHp, newStats.hp),
    })
  }

  if (!selectedMonster) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h2 className="text-2xl font-bold mb-4">Select a Monster</h2>
        <p className="text-text-secondary mb-6">Choose a monster from your collection to train</p>
        <Link href="/collection">
          <Button>Go to Collection</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/collection">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Train {selectedMonster.name}</h1>
          <p className="text-text-secondary">Increase your monster&apos;s stats with essence</p>
        </div>
      </div>

      {/* Current Stats */}
      <div className="bg-bg-card p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Current Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{selectedMonster.stats.hp}</div>
            <div className="text-text-secondary text-sm">HP</div>
          </div>
          <div className="text-center">
            <Sword className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{selectedMonster.stats.atk}</div>
            <div className="text-text-secondary text-sm">ATK</div>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{selectedMonster.stats.def}</div>
            <div className="text-text-secondary text-sm">DEF</div>
          </div>
        </div>
      </div>

      {/* Training Options */}
      <div className="bg-bg-card p-6 rounded-xl space-y-6">
        <h2 className="text-xl font-bold">Training Options</h2>

        {/* HP Training */}
        <div className="border-b border-bg-secondary pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-400" />
              <div>
                <div className="font-bold">HP Training</div>
                <div className="text-text-secondary text-sm">+5 HP per level</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {selectedMonster.stats.hp} <span className="text-primary">→</span> {selectedMonster.stats.hp + hpIncrease * 5}
              </div>
              <div className="text-text-secondary text-sm">{hpIncrease * ESSENCE_COST_PER_STAT} essence</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={hpIncrease}
              onChange={(e) => setHpIncrease(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="text-lg font-bold w-12 text-right">{hpIncrease}</div>
          </div>
        </div>

        {/* ATK Training */}
        <div className="border-b border-bg-secondary pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sword className="w-6 h-6 text-amber-400" />
              <div>
                <div className="font-bold">ATK Training</div>
                <div className="text-text-secondary text-sm">+5 ATK per level</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {selectedMonster.stats.atk} <span className="text-primary">→</span> {selectedMonster.stats.atk + atkIncrease * 5}
              </div>
              <div className="text-text-secondary text-sm">{atkIncrease * ESSENCE_COST_PER_STAT} essence</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={atkIncrease}
              onChange={(e) => setAtkIncrease(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="text-lg font-bold w-12 text-right">{atkIncrease}</div>
          </div>
        </div>

        {/* DEF Training */}
        <div className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-bold">DEF Training</div>
                <div className="text-text-secondary text-sm">+5 DEF per level</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {selectedMonster.stats.def} <span className="text-primary">→</span> {selectedMonster.stats.def + defIncrease * 5}
              </div>
              <div className="text-text-secondary text-sm">{defIncrease * ESSENCE_COST_PER_STAT} essence</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={defIncrease}
              onChange={(e) => setDefIncrease(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="text-lg font-bold w-12 text-right">{defIncrease}</div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-bg-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-text-secondary">Total Cost</div>
            <div className="text-3xl font-bold text-primary">{totalCost} Essence</div>
          </div>
          <div>
            <div className="text-text-secondary">Available</div>
            <div className="text-3xl font-bold text-green-400">{essence} Essence</div>
          </div>
        </div>

        {totalCost > 0 && (
          <div className="text-sm text-text-secondary mb-4">
            {canTrain ? '✅ You have enough essence to train' : '❌ Not enough essence'}
          </div>
        )}

        <Button
          onClick={handleTrain}
          disabled={!canTrain}
          size="lg"
          className="w-full"
        >
          {totalCost === 0 ? 'Select stats to train' : `Train for ${totalCost} Essence`}
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-bg-card p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-3">💡 Training Tips</h3>
        <ul className="space-y-2 text-text-secondary text-sm">
          <li>• Each stat level increases by 5 points</li>
          <li>• Each level costs 100 essence</li>
          <li>• You can train up to 10 levels per stat at a time</li>
          <li>• Earn essence by winning battles</li>
          <li>• Stronger stats help you win more battles</li>
        </ul>
      </div>
    </div>
  )
}

export default function TrainingPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <TrainingContent />
    </Suspense>
  )
}
