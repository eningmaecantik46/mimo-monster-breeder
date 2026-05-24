import { create } from 'zustand'
import { Monster, PlayerState } from './types'

interface GameStore extends PlayerState {
  addMonster: (monster: Monster) => void
  updateMonster: (id: string, monster: Partial<Monster>) => void
  addEssence: (amount: number) => void
  recordBattle: (won: boolean) => void
  loadFromStorage: () => void
  saveToStorage: () => void
}

const useGameStore = create<GameStore>((set, get) => ({
  monsters: [],
  essence: 0,
  totalBattles: 0,
  totalWins: 0,

  addMonster: (monster: Monster) => {
    set((state) => ({
      monsters: [...state.monsters, monster],
    }))
    get().saveToStorage()
  },

  updateMonster: (id: string, updates: Partial<Monster>) => {
    set((state) => ({
      monsters: state.monsters.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }))
    get().saveToStorage()
  },

  addEssence: (amount: number) => {
    set((state) => ({
      essence: Math.max(0, state.essence + amount),
    }))
    get().saveToStorage()
  },

  recordBattle: (won: boolean) => {
    set((state) => ({
      totalBattles: state.totalBattles + 1,
      totalWins: won ? state.totalWins + 1 : state.totalWins,
    }))
    get().saveToStorage()
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('gameState')
    if (stored) {
      try {
        const state = JSON.parse(stored)
        set(state)
      } catch (error) {
        console.error('Failed to load game state:', error)
      }
    }
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return

    const state = get()
    localStorage.setItem(
      'gameState',
      JSON.stringify({
        monsters: state.monsters,
        essence: state.essence,
        totalBattles: state.totalBattles,
        totalWins: state.totalWins,
      })
    )
  },
}))

export default useGameStore
