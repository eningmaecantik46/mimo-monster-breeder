import { Rarity, Monster, Skill } from '../types'

const RARITY_STATS: Record<Rarity, { hp: number; atk: number; def: number }> = {
  Common: { hp: 30, atk: 35, def: 30 },
  Rare: { hp: 45, atk: 52, def: 38 },
  Epic: { hp: 60, atk: 68, def: 50 },
  Legendary: { hp: 80, atk: 90, def: 70 },
}

const RARITY_WEIGHTS = {
  Common: 0.6,
  Rare: 0.25,
  Epic: 0.12,
  Legendary: 0.03,
}

function getRandomRarity(): Rarity {
  const rand = Math.random()
  let cumulative = 0

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    cumulative += weight
    if (rand <= cumulative) {
      return rarity as Rarity
    }
  }

  return 'Common'
}

export async function generateMonster(): Promise<Monster> {
  const rarity = getRandomRarity()
  const baseStats = RARITY_STATS[rarity]

  // Call MiMo API to generate monster details
  try {
    const response = await fetch('/api/generate/monster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rarity }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate monster')
    }

    const data = await response.json()

    const monster: Monster = {
      id: crypto.randomUUID(),
      name: data.name,
      rarity,
      personality: data.personality,
      level: 1,
      experience: 0,
      stats: data.baseStats,
      currentHp: data.baseStats.hp,
      skills: [data.startingSkill],
      evolved: false,
      createdAt: Date.now(),
      type: data.type,
    }

    return monster
  } catch (error) {
    console.error('Failed to generate monster via API, using fallback:', error)

    // Fallback: generate locally
    const types = ['Fire', 'Water', 'Grass', 'Electric', 'Rock']
    const type = types[Math.floor(Math.random() * types.length)]

    const monster: Monster = {
      id: crypto.randomUUID(),
      name: `${type} Beast`,
      rarity,
      personality: 'A mysterious creature with unknown powers.',
      level: 1,
      experience: 0,
      stats: baseStats,
      currentHp: baseStats.hp,
      skills: [
        {
          name: `${type} Strike`,
          description: `A basic ${type.toLowerCase()} attack.`,
          modifier: 1.2,
        },
      ],
      evolved: false,
      createdAt: Date.now(),
      type,
    }

    return monster
  }
}

export async function generateSkill(
  monsterName: string,
  monsterType: string
): Promise<Skill> {
  try {
    const response = await fetch('/api/generate/skill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monsterName,
        monsterType,
        skillType: 'attack',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate skill')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to generate skill via API, using fallback:', error)

    return {
      name: `${monsterType} Blast`,
      description: `A powerful ${monsterType.toLowerCase()} attack.`,
      modifier: 1.5,
    }
  }
}

export async function generateEvolution(
  monsterName: string,
  currentLevel: number
) {
  try {
    const response = await fetch('/api/generate/evolution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monsterName, currentLevel }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate evolution')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to generate evolution via API, using fallback:', error)

    return {
      evolvedName: `${monsterName} Prime`,
      description: `${monsterName} has evolved into a more powerful form!`,
      newSkill: {
        name: 'Ultimate Strike',
        description: 'A devastating attack with immense power.',
        modifier: 2.0,
      },
    }
  }
}

export async function generateBattleCommentary(
  playerMonster: string,
  enemyMonster: string,
  action: string,
  damage: number,
  isCritical: boolean
): Promise<string> {
  try {
    const response = await fetch('/api/generate/battle-commentary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerMonster,
        enemyMonster,
        action,
        damage,
        isCritical,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate commentary')
    }

    const data = await response.json()
    return data.commentary
  } catch (error) {
    console.error('Failed to generate commentary via API, using fallback:', error)

    const critical = isCritical ? 'Critical hit! ' : ''
    return `${critical}${playerMonster} uses ${action}! ${enemyMonster} takes ${damage} damage!`
  }
}
