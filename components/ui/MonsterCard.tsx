'use client'

import { Monster } from '@/lib/types'
import { Heart, Sword, Shield } from 'lucide-react'
import Link from 'next/link'

interface MonsterCardProps {
  monster: Monster
  showActions?: boolean
}

export default function MonsterCard({ monster, showActions = true }: MonsterCardProps) {
  const rarityColors = {
    Common: 'border-rarity-common',
    Rare: 'border-rarity-rare',
    Epic: 'border-rarity-epic',
    Legendary: 'border-rarity-legendary',
  }

  const typeEmoji = {
    Fire: '🔥',
    Water: '💧',
    Grass: '🌿',
    Electric: '⚡',
    Rock: '🪨',
  }

  return (
    <div
      className={`bg-bg-card rounded-xl p-4 border-2 ${rarityColors[monster.rarity]} hover:scale-[1.02] transition-transform`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{monster.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded text-xs font-semibold bg-${monster.rarity.toLowerCase()}/20 text-${monster.rarity.toLowerCase()}-400`}>
              {monster.rarity}
            </span>
            <span className="text-text-secondary text-sm">Lv. {monster.level}</span>
            {monster.type && (
              <span className="text-lg">{typeEmoji[monster.type as keyof typeof typeEmoji] || '❓'}</span>
            )}
          </div>
        </div>
        {monster.evolved && (
          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
            Evolved
          </span>
        )}
      </div>

      {/* Personality */}
      <p className="text-text-secondary text-sm mb-4 italic">
        &ldquo;{monster.personality}&rdquo;
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-400" />
          <div>
            <div className="text-xs text-text-secondary">HP</div>
            <div className="font-bold">{monster.currentHp}/{monster.stats.hp}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Sword className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-xs text-text-secondary">ATK</div>
            <div className="font-bold">{monster.stats.atk}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-xs text-text-secondary">DEF</div>
            <div className="font-bold">{monster.stats.def}</div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Skills</h4>
        <div className="space-y-1">
          {monster.skills.slice(0, 2).map((skill, index) => (
            <div key={index} className="text-xs bg-bg-primary/50 p-2 rounded">
              <div className="font-medium">{skill.name}</div>
              <div className="text-text-secondary truncate">{skill.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="grid grid-cols-3 gap-2">
          <Link href={`/training?monster=${monster.id}`}>
            <button className="w-full py-2 bg-bg-primary hover:bg-bg-secondary rounded text-sm transition-colors">
              Train
            </button>
          </Link>
          <Link href={`/battle?monster=${monster.id}`}>
            <button className="w-full py-2 bg-bg-primary hover:bg-bg-secondary rounded text-sm transition-colors">
              Battle
            </button>
          </Link>
          {monster.level >= 25 && !monster.evolved && (
            <Link href={`/evolution?monster=${monster.id}`}>
              <button className="w-full py-2 bg-primary hover:bg-primary-dark rounded text-sm text-white transition-colors">
                Evolve
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
