import { NextRequest, NextResponse } from 'next/server'
import { GenerateMonsterResponse, Rarity } from '@/lib/types'

const RARITY_STATS: Record<Rarity, { hp: number; atk: number; def: number }> = {
  Common: { hp: 30, atk: 35, def: 30 },
  Rare: { hp: 45, atk: 52, def: 38 },
  Epic: { hp: 60, atk: 68, def: 50 },
  Legendary: { hp: 80, atk: 90, def: 70 },
}

const MONSTER_NAMES = {
  Fire: ['Flamewing', 'Inferno', 'Blaze', 'Pyro', 'Scorch'],
  Water: ['Aqua Sprite', 'Tidal', 'Wave', 'Splash', 'Torrent'],
  Grass: ['Verdant', 'Leafling', 'Sprout', 'Thornbeast', 'Vinewhip'],
  Electric: ['Volt', 'Spark', 'Zapper', 'Thunder', 'Bolt'],
  Rock: ['Stone Guardian', 'Boulder', 'Granite', 'Cliff', 'Bedrock'],
}

const PERSONALITIES = {
  Fire: 'Fiery and bold, loves to charge headfirst into battle.',
  Water: 'Calm and collected, prefers strategic thinking.',
  Grass: 'Peaceful and nurturing, grows stronger with care.',
  Electric: 'Energetic and quick, always ready for action.',
  Rock: 'Solid and dependable, stands firm against any challenge.',
}

const SKILLS = {
  Fire: {
    name: 'Flame Burst',
    description: 'A burst of flames that deals 1.2x ATK damage.',
    modifier: 1.2,
  },
  Water: {
    name: 'Water Blast',
    description: 'A powerful water attack that deals 1.2x ATK damage.',
    modifier: 1.2,
  },
  Grass: {
    name: 'Vine Whip',
    description: 'Strikes with vines that deal 1.2x ATK damage.',
    modifier: 1.2,
  },
  Electric: {
    name: 'Thunder Shock',
    description: 'An electric attack that deals 1.2x ATK damage.',
    modifier: 1.2,
  },
  Rock: {
    name: 'Rock Throw',
    description: 'Hurls rocks that deal 1.2x ATK damage.',
    modifier: 1.2,
  },
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rarity } = body

    if (!rarity || !RARITY_STATS[rarity]) {
      return NextResponse.json(
        { error: 'Invalid rarity' },
        { status: 400 }
      )
    }

    const types = Object.keys(MONSTER_NAMES) as Array<keyof typeof MONSTER_NAMES>
    const type = getRandomElement(types)

    const response: GenerateMonsterResponse = {
      name: getRandomElement(MONSTER_NAMES[type]),
      personality: PERSONALITIES[type],
      baseStats: RARITY_STATS[rarity],
      startingSkill: SKILLS[type],
      type,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating monster:', error)
    return NextResponse.json(
      { error: 'Failed to generate monster' },
      { status: 500 }
    )
  }
}
