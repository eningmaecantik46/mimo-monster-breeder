// Monster types
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary'

export interface Skill {
  name: string
  description: string
  modifier: number
}

export interface Monster {
  id: string
  name: string
  rarity: Rarity
  personality: string
  level: number
  experience: number
  stats: {
    hp: number
    atk: number
    def: number
  }
  currentHp: number
  skills: Skill[]
  evolved: boolean
  evolvedName?: string
  createdAt: number
  type?: string
}

export interface PlayerState {
  monsters: Monster[]
  essence: number
  totalBattles: number
  totalWins: number
}

// API types
export interface GenerateMonsterRequest {
  rarity: Rarity
}

export interface GenerateMonsterResponse {
  name: string
  personality: string
  baseStats: {
    hp: number
    atk: number
    def: number
  }
  startingSkill: Skill
  type?: string
}

export interface GenerateSkillRequest {
  monsterName: string
  monsterType: string
  skillType: 'attack' | 'defense' | 'special'
}

export interface GenerateEvolutionRequest {
  monsterName: string
  currentLevel: number
}

export interface GenerateEvolutionResponse {
  evolvedName: string
  description: string
  newSkill: Skill
}

export interface GenerateBattleCommentaryRequest {
  playerMonster: string
  enemyMonster: string
  action: string
  damage: number
  isCritical: boolean
}

export interface GenerateBattleCommentaryResponse {
  commentary: string
}
