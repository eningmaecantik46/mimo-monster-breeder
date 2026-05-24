'use client'

import { useState, useEffect } from 'react'
import { Filter, Search } from 'lucide-react'
import Link from 'next/link'
import useGameStore from '@/lib/store'
import MonsterCard from '@/components/ui/MonsterCard'
import Button from '@/components/ui/Button'
import { Rarity } from '@/lib/types'

export default function CollectionPage() {
  const { monsters } = useGameStore()
  const [search, setSearch] = useState('')
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'All'>('All')
  const [typeFilter, setTypeFilter] = useState<string>('All')

  const rarities: (Rarity | 'All')[] = ['All', 'Common', 'Rare', 'Epic', 'Legendary']
  const types = ['All', 'Fire', 'Water', 'Grass', 'Electric', 'Rock']

  const filteredMonsters = monsters.filter((monster) => {
    const matchesSearch = monster.name.toLowerCase().includes(search.toLowerCase()) ||
                         monster.personality.toLowerCase().includes(search.toLowerCase())
    const matchesRarity = rarityFilter === 'All' || monster.rarity === rarityFilter
    const matchesType = typeFilter === 'All' || monster.type === typeFilter
    
    return matchesSearch && matchesRarity && matchesType
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Monster Collection</h1>
        <p className="text-text-secondary">
          {monsters.length} monster{monsters.length !== 1 ? 's' : ''} in your collection
        </p>
      </div>

      {/* Filters */}
      <div className="bg-bg-card p-6 rounded-xl space-y-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Filters</h2>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by name or personality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-bg-secondary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Rarity</label>
          <div className="flex flex-wrap gap-2">
            {rarities.map((rarity) => (
              <Button
                key={rarity}
                variant={rarityFilter === rarity ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setRarityFilter(rarity)}
              >
                {rarity}
              </Button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTypeFilter(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Monster Grid */}
      {filteredMonsters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonsters.map((monster) => (
            <MonsterCard key={monster.id} monster={monster} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🥚</div>
          <h3 className="text-xl font-bold mb-2">No monsters found</h3>
          <p className="text-text-secondary mb-6">
            {monsters.length === 0
              ? 'Hatch your first egg to get started!'
              : 'Try adjusting your filters or search term.'}
          </p>
          {monsters.length === 0 && (
            <Link href="/">
              <Button>Hatch Your First Monster</Button>
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="bg-bg-card p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Collection Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{monsters.length}</div>
            <div className="text-text-secondary text-sm">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rarity-common">
              {monsters.filter(m => m.rarity === 'Common').length}
            </div>
            <div className="text-text-secondary text-sm">Common</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rarity-rare">
              {monsters.filter(m => m.rarity === 'Rare').length}
            </div>
            <div className="text-text-secondary text-sm">Rare</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rarity-epic">
              {monsters.filter(m => m.rarity === 'Epic').length}
            </div>
            <div className="text-text-secondary text-sm">Epic</div>
          </div>
        </div>
      </div>
    </div>
  )
}
