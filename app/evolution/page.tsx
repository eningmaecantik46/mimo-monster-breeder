'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import useGameStore from '@/lib/store'
import Button from '@/components/ui/Button'
import { Monster } from '@/lib/types'
import { generateEvolution } from '@/lib/api/monster'

interface EvolutionData {
  evolvedName: string
  description: string
  newSkill: {
    name: string
    description: string
    modifier: number
  }
}

function EvolutionContent() {
  const searchParams = useSearchParams()
  const monsterId = searchParams.get('monster')

  const { monsters, updateMonster } = useGameStore()
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null)
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(null)
  const [isEvolving, setIsEvolving] = useState(false)

  useEffect(() => {
    if (monsterId) {
      const monster = monsters.find(m => m.id === monsterId)
      if (monster) {
        setSelectedMonster(monster)
        if (monster.level >= 25 && !monster.evolved) {
          loadEvolutionData(monster)
        }
      }
    }
  }, [monsterId, monsters])

  const loadEvolutionData = async (monster: Monster) => {
    try {
      const data = await generateEvolution(monster.name, monster.level)
      setEvolutionData(data)
    } catch (error) {
      console.error('Failed to load evolution data:', error)
    }
  }

  const handleEvolve = () => {
    if (!selectedMonster || !evolutionData) return

    setIsEvolving(true)

    // Simulate evolution animation
    setTimeout(() => {
      const newStats = {
        hp: Math.floor(selectedMonster.stats.hp * 1.2),
        atk: Math.floor(selectedMonster.stats.atk * 1.2),
        def: Math.floor(selectedMonster.stats.def * 1.2),
      }

      updateMonster(selectedMonster.id, {
        name: evolutionData.evolvedName,
        stats: newStats,
        currentHp: newStats.hp,
        skills: [...selectedMonster.skills, evolutionData.newSkill],
        evolved: true,
        evolvedName: evolutionData.evolvedName,
      })

      setIsEvolving(false)
    }, 2000)
  }

  if (!selectedMonster) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold mb-4">Select a Monster</h2>
        <p className="text-text-secondary mb-6">Choose a monster from your collection to evolve</p>
        <Link href="/collection">
          <Button>Go to Collection</Button>
        </Link>
      </div>
    )
  }

  if (selectedMonster.evolved) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="text-2xl font-bold mb-4">Already Evolved!</h2>
        <p className="text-text-secondary mb-6">
          {selectedMonster.name} has already evolved into {selectedMonster.evolvedName}
        </p>
        <Link href="/collection">
          <Button>Go to Collection</Button>
        </Link>
      </div>
    )
  }

  if (selectedMonster.level < 25) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h2 className="text-2xl font-bold mb-4">Not Ready Yet</h2>
        <p className="text-text-secondary mb-6">
          {selectedMonster.name} needs to reach level 25 to evolve. Current level: {selectedMonster.level}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/training">
            <Button>Train Now</Button>
          </Link>
          <Link href="/collection">
            <Button variant="secondary">Go to Collection</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!evolutionData) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌀</div>
        <h2 className="text-2xl font-bold mb-4">Loading Evolution Data...</h2>
        <p className="text-text-secondary">Generating evolution details for {selectedMonster.name}</p>
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
          <h1 className="text-3xl font-bold">Evolution Ready!</h1>
          <p className="text-text-secondary">Evolve {selectedMonster.name} into a more powerful form</p>
        </div>
      </div>

      {/* Evolution Display */}
      <div className="bg-bg-card p-8 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Before */}
          <div className="text-center">
            <div className="text-6xl mb-4">
              {selectedMonster.type === 'Fire' && '🔥'}
              {selectedMonster.type === 'Water' && '💧'}
              {selectedMonster.type === 'Grass' && '🌿'}
              {selectedMonster.type === 'Electric' && '⚡'}
              {selectedMonster.type === 'Rock' && '🪨'}
            </div>
            <h3 className="text-xl font-bold mb-2">{selectedMonster.name}</h3>
            <div className="text-text-secondary">
              <div>Lv. {selectedMonster.level}</div>
              <div className="text-sm opacity-80">{selectedMonster.rarity}</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>HP:</span>
                <span className="font-bold">{selectedMonster.stats.hp}</span>
              </div>
              <div className="flex justify-between">
                <span>ATK:</span>
                <span className="font-bold">{selectedMonster.stats.atk}</span>
              </div>
              <div className="flex justify-between">
                <span>DEF:</span>
                <span className="font-bold">{selectedMonster.stats.def}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="text-center">
            <div className="text-4xl text-primary mb-2">→</div>
            <div className="text-text-secondary text-sm">Evolves to</div>
          </div>

          {/* After */}
          <div className="text-center">
            <div className="text-6xl mb-4">
              {selectedMonster.type === 'Fire' && '🐉'}
              {selectedMonster.type === 'Water' && '🐋'}
              {selectedMonster.type === 'Grass' && '🌳'}
              {selectedMonster.type === 'Electric' && '⚡️'}
              {selectedMonster.type === 'Rock' && '🗿'}
            </div>
            <h3 className="text-xl font-bold mb-2 text-amber-400">{evolutionData.evolvedName}</h3>
            <div className="text-text-secondary">
              <div>Lv. {selectedMonster.level}</div>
              <div className="text-sm opacity-80">Legendary</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>HP:</span>
                <span className="font-bold text-green-400">
                  {Math.floor(selectedMonster.stats.hp * 1.2)} (+20%)
                </span>
              </div>
              <div className="flex justify-between">
                <span>ATK:</span>
                <span className="font-bold text-green-400">
                  {Math.floor(selectedMonster.stats.atk * 1.2)} (+20%)
                </span>
              </div>
              <div className="flex justify-between">
                <span>DEF:</span>
                <span className="font-bold text-green-400">
                  {Math.floor(selectedMonster.stats.def * 1.2)} (+20%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Story */}
      <div className="bg-bg-card p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Evolution Story</h3>
        <p className="text-text-secondary italic">{evolutionData.description}</p>
      </div>

      {/* New Skill */}
      <div className="bg-bg-card p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">🌟 New Skill</h3>
        <div className="bg-bg-primary p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-bold text-lg">{evolutionData.newSkill.name}</div>
              <div className="text-text-secondary text-sm">{evolutionData.newSkill.description}</div>
            </div>
            <div className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">
              {evolutionData.newSkill.modifier}x ATK
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Button */}
      <div className="text-center">
        <Button
          onClick={handleEvolve}
          disabled={isEvolving}
          size="lg"
          className="relative overflow-hidden"
        >
          {isEvolving ? (
            <>
              <div className="animate-pulse">
                <Sparkles className="w-6 h-6 mr-2" />
              </div>
              Evolving...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-2" />
              Evolve Now
            </>
          )}
        </Button>
        {isEvolving && (
          <p className="text-text-secondary mt-4">
            {selectedMonster.name} is evolving into {evolutionData.evolvedName}...
          </p>
        )}
      </div>

      {/* Evolution Benefits */}
      <div className="bg-bg-card p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">✨ Evolution Benefits</h3>
        <ul className="space-y-3 text-text-secondary">
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>+20% to all stats (HP, ATK, DEF)</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>New powerful skill: {evolutionData.newSkill.name}</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Rarity upgrade to Legendary</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>New name and appearance</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>One-time evolution per monster</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default function EvolutionPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <EvolutionContent />
    </Suspense>
  )
}
