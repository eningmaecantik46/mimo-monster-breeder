'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Heart, Sword, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import useGameStore from '@/lib/store'
import Button from '@/components/ui/Button'
import { Monster } from '@/lib/types'
import { generateBattleCommentary } from '@/lib/api/monster'

interface BattleLog {
  message: string
  type: 'action' | 'damage' | 'heal' | 'win' | 'lose'
}

function BattleContent() {
  const searchParams = useSearchParams()
  const monsterId = searchParams.get('monster')
  
  const { monsters, updateMonster, addEssence, recordBattle } = useGameStore()
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null)
  const [enemyMonster, setEnemyMonster] = useState<Monster | null>(null)
  const [battleLog, setBattleLog] = useState<BattleLog[]>([])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [battleActive, setBattleActive] = useState(false)
  const [battleEnded, setBattleEnded] = useState(false)

  useEffect(() => {
    if (monsterId) {
      const monster = monsters.find(m => m.id === monsterId)
      if (monster) {
        setSelectedMonster(monster)
      }
    }
  }, [monsterId, monsters])

  const generateEnemy = () => {
    const types = ['Fire', 'Water', 'Grass', 'Electric', 'Rock']
    const names = {
      Fire: ['Inferno Beast', 'Flame Demon', 'Pyro'],
      Water: ['Tidal Wave', 'Aqua Beast', 'Hydro'],
      Grass: ['Forest Guardian', 'Leaf Beast', 'Flora'],
      Electric: ['Thunder Beast', 'Zapper', 'Electro'],
      Rock: ['Stone Golem', 'Boulder', 'Terra'],
    }

    const type = types[Math.floor(Math.random() * types.length)] as keyof typeof names
    const name = names[type][Math.floor(Math.random() * names[type].length)]

    const baseStats = {
      hp: 30 + Math.floor(Math.random() * 50),
      atk: 30 + Math.floor(Math.random() * 50),
      def: 30 + Math.floor(Math.random() * 50),
    }

    const enemy: Monster = {
      id: 'enemy',
      name,
      rarity: 'Common',
      personality: 'A wild monster',
      level: 1 + Math.floor(Math.random() * 10),
      experience: 0,
      stats: baseStats,
      currentHp: baseStats.hp,
      skills: [
        {
          name: `${type} Attack`,
          description: 'A basic attack',
          modifier: 1.2,
        },
      ],
      evolved: false,
      createdAt: Date.now(),
      type,
    }

    return enemy
  }

  const startBattle = () => {
    if (!selectedMonster) return

    const enemy = generateEnemy()
    setEnemyMonster(enemy)
    setBattleLog([{ message: `Battle started! ${selectedMonster.name} vs ${enemy.name}`, type: 'action' }])
    setBattleActive(true)
    setBattleEnded(false)
    setIsPlayerTurn(true)

    // Reset HP
    updateMonster(selectedMonster.id, { currentHp: selectedMonster.stats.hp })
  }

  const attack = async (skill: any) => {
    if (!selectedMonster || !enemyMonster || !isPlayerTurn || battleEnded) return

    // Player attack
    const isCritical = Math.random() < 0.15
    const damage = Math.floor(selectedMonster.stats.atk * skill.modifier * (isCritical ? 1.5 : 1))
    const newEnemyHp = Math.max(0, enemyMonster.currentHp - damage)

    const commentary = await generateBattleCommentary(
      selectedMonster.name,
      enemyMonster.name,
      skill.name,
      damage,
      isCritical
    )

    setBattleLog(prev => [...prev, { message: commentary, type: 'damage' }])
    setEnemyMonster({ ...enemyMonster, currentHp: newEnemyHp })

    // Check if enemy defeated
    if (newEnemyHp <= 0) {
      endBattle(true)
      return
    }

    setIsPlayerTurn(false)

    // Enemy turn after delay
    setTimeout(() => {
      enemyAttack()
    }, 1500)
  }

  const enemyAttack = async () => {
    if (!selectedMonster || !enemyMonster || battleEnded) return

    const skill = enemyMonster.skills[0]
    const isCritical = Math.random() < 0.15
    const damage = Math.floor(enemyMonster.stats.atk * skill.modifier * (isCritical ? 1.5 : 1))
    const newPlayerHp = Math.max(0, selectedMonster.currentHp - damage)

    const commentary = await generateBattleCommentary(
      enemyMonster.name,
      selectedMonster.name,
      skill.name,
      damage,
      isCritical
    )

    setBattleLog(prev => [...prev, { message: commentary, type: 'damage' }])
    updateMonster(selectedMonster.id, { currentHp: newPlayerHp })

    // Check if player defeated
    if (newPlayerHp <= 0) {
      endBattle(false)
      return
    }

    setIsPlayerTurn(true)
  }

  const endBattle = (playerWon: boolean) => {
    setBattleEnded(true)
    setBattleActive(false)

    if (playerWon) {
      const essenceGained = 50 + Math.floor(Math.random() * 50)
      const xpGained = 100
      
      setBattleLog(prev => [
        ...prev,
        { message: `Victory! You gained ${essenceGained} essence and ${xpGained} XP!`, type: 'win' },
      ])
      
      addEssence(essenceGained)
      updateMonster(selectedMonster!.id, {
        experience: selectedMonster!.experience + xpGained,
      })
      recordBattle(true)
    } else {
      const xpGained = 50
      
      setBattleLog(prev => [
        ...prev,
        { message: `Defeat! You gained ${xpGained} XP.`, type: 'lose' },
      ])
      
      updateMonster(selectedMonster!.id, {
        experience: selectedMonster!.experience + xpGained,
      })
      recordBattle(false)
    }
  }

  if (!selectedMonster) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚔️</div>
        <h2 className="text-2xl font-bold mb-4">Select a Monster</h2>
        <p className="text-text-secondary mb-6">Choose a monster from your collection to battle</p>
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
          <h1 className="text-3xl font-bold">Battle Arena</h1>
          <p className="text-text-secondary">Test your monster in 1v1 combat</p>
        </div>
      </div>

      {/* Battle Area */}
      {!battleActive && !battleEnded && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold mb-4">Ready to Battle?</h2>
          <p className="text-text-secondary mb-6">
            {selectedMonster.name} is ready to fight!
          </p>
          <Button onClick={startBattle} size="lg">
            Start Battle
          </Button>
        </div>
      )}

      {(battleActive || battleEnded) && enemyMonster && (
        <div className="space-y-8">
          {/* Battle Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Player Monster */}
            <div className="bg-bg-card p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">
                  {selectedMonster.type === 'Fire' && '🔥'}
                  {selectedMonster.type === 'Water' && '💧'}
                  {selectedMonster.type === 'Grass' && '🌿'}
                  {selectedMonster.type === 'Electric' && '⚡'}
                  {selectedMonster.type === 'Rock' && '🪨'}
                </div>
                <h3 className="text-xl font-bold">{selectedMonster.name}</h3>
                <p className="text-text-secondary">Lv. {selectedMonster.level}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>HP</span>
                    <span>{selectedMonster.currentHp}/{selectedMonster.stats.hp}</span>
                  </div>
                  <div className="bg-bg-primary h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(selectedMonster.currentHp / selectedMonster.stats.hp) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Sword className="w-4 h-4 text-amber-400" />
                    <span>ATK: {selectedMonster.stats.atk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>DEF: {selectedMonster.stats.def}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enemy Monster */}
            <div className="bg-bg-card p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">
                  {enemyMonster.type === 'Fire' && '🔥'}
                  {enemyMonster.type === 'Water' && '💧'}
                  {enemyMonster.type === 'Grass' && '🌿'}
                  {enemyMonster.type === 'Electric' && '⚡'}
                  {enemyMonster.type === 'Rock' && '🪨'}
                </div>
                <h3 className="text-xl font-bold">{enemyMonster.name}</h3>
                <p className="text-text-secondary">Lv. {enemyMonster.level}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>HP</span>
                    <span>{enemyMonster.currentHp}/{enemyMonster.stats.hp}</span>
                  </div>
                  <div className="bg-bg-primary h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-rose-500 h-full transition-all duration-300"
                      style={{ width: `${(enemyMonster.currentHp / enemyMonster.stats.hp) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Sword className="w-4 h-4 text-amber-400" />
                    <span>ATK: {enemyMonster.stats.atk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>DEF: {enemyMonster.stats.def}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Battle Log */}
          <div className="bg-bg-card p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Battle Log</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {battleLog.map((log, index) => (
                <div
                  key={index}
                  className={`text-sm ${
                    log.type === 'win' ? 'text-green-400' :
                    log.type === 'lose' ? 'text-red-400' :
                    log.type === 'damage' ? 'text-amber-400' :
                    'text-text-secondary'
                  }`}
                >
                  {log.message}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {battleActive && isPlayerTurn && (
            <div className="bg-bg-card p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Your Turn - Choose a Skill</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMonster.skills.map((skill, index) => (
                  <Button
                    key={index}
                    onClick={() => attack(skill)}
                    variant="primary"
                    size="lg"
                  >
                    <div className="text-left w-full">
                      <div className="font-bold">{skill.name}</div>
                      <div className="text-sm opacity-80">{skill.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {battleActive && !isPlayerTurn && (
            <div className="text-center py-6">
              <div className="text-lg text-text-secondary">Enemy is attacking...</div>
            </div>
          )}

          {battleEnded && (
            <div className="text-center">
              <Button onClick={startBattle} size="lg">
                Battle Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BattlePage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <BattleContent />
    </Suspense>
  )
}
