import { NextRequest, NextResponse } from 'next/server'
import { GenerateEvolutionResponse } from '@/lib/types'

const EVOLUTION_SUFFIXES = ['Prime', 'Dragon', 'King', 'Lord', 'Master', 'Alpha', 'Omega']

const EVOLUTION_SKILLS = [
  { name: 'Meteor Shower', description: 'Rain meteors of fire upon the enemy.', modifier: 2.0 },
  { name: 'Tsunami', description: 'Summons a massive tidal wave.', modifier: 2.0 },
  { name: 'Solar Flare', description: 'Unleashes the power of the sun.', modifier: 2.0 },
  { name: 'Lightning Storm', description: 'Calls down multiple lightning strikes.', modifier: 2.0 },
  { name: 'Avalanche', description: 'Causes a massive rockslide.', modifier: 2.0 },
  { name: 'Ultimate Strike', description: 'A devastating attack with immense power.', modifier: 2.0 },
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { monsterName, currentLevel } = body

    if (!monsterName || !currentLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const suffix = getRandomElement(EVOLUTION_SUFFIXES)
    const evolvedName = `${monsterName} ${suffix}`
    const newSkill = getRandomElement(EVOLUTION_SKILLS)

    const response: GenerateEvolutionResponse = {
      evolvedName,
      description: `${monsterName} has evolved into ${evolvedName}, its power now uncontrollable!`,
      newSkill,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating evolution:', error)
    return NextResponse.json(
      { error: 'Failed to generate evolution' },
      { status: 500 }
    )
  }
}
