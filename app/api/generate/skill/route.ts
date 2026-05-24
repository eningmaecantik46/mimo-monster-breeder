import { NextRequest, NextResponse } from 'next/server'

const SKILL_TEMPLATES = {
  Fire: [
    { name: 'Inferno Strike', description: 'A powerful fire attack that can burn enemies.', modifier: 1.5 },
    { name: 'Fireball', description: 'Launches a ball of fire at the enemy.', modifier: 1.3 },
    { name: 'Flame Wall', description: 'Creates a wall of flames that damages enemies over time.', modifier: 1.4 },
  ],
  Water: [
    { name: 'Tidal Wave', description: 'Summons a massive wave that crashes down on enemies.', modifier: 1.5 },
    { name: 'Water Cutter', description: 'Slices through enemies with pressurized water.', modifier: 1.3 },
    { name: 'Aqua Prison', description: 'Traps enemies in a bubble of water.', modifier: 1.4 },
  ],
  Grass: [
    { name: 'Solar Beam', description: 'Channels sunlight into a powerful beam attack.', modifier: 1.5 },
    { name: 'Leaf Storm', description: 'Creates a storm of sharp leaves.', modifier: 1.3 },
    { name: 'Root Bind', description: 'Binds enemies with strong roots.', modifier: 1.4 },
  ],
  Electric: [
    { name: 'Thunderbolt', description: 'Strikes with a powerful bolt of lightning.', modifier: 1.5 },
    { name: 'Electro Ball', description: 'Fires a ball of concentrated electricity.', modifier: 1.3 },
    { name: 'Shock Wave', description: 'Releases a wave of electric energy.', modifier: 1.4 },
  ],
  Rock: [
    { name: 'Earthquake', description: 'Shakes the ground, damaging all enemies.', modifier: 1.5 },
    { name: 'Rock Slide', description: 'Causes rocks to fall on the enemy.', modifier: 1.3 },
    { name: 'Stone Edge', description: 'Strikes with sharp stone edges.', modifier: 1.4 },
  ],
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { monsterName, monsterType, skillType = 'attack' } = body

    if (!monsterName || !monsterType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const type = monsterType as keyof typeof SKILL_TEMPLATES
    const skills = SKILL_TEMPLATES[type] || SKILL_TEMPLATES.Fire

    const skill = getRandomElement(skills)

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error generating skill:', error)
    return NextResponse.json(
      { error: 'Failed to generate skill' },
      { status: 500 }
    )
  }
}
