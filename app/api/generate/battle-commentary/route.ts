import { NextRequest, NextResponse } from 'next/server'

const BATTLE_COMMENTARIES = [
  '{player} uses {action}! {enemy} takes {damage} damage!',
  '{player} attacks with {action}! {enemy} is hit for {damage} damage!',
  '{player} unleashes {action}! {enemy} recoils from {damage} damage!',
  'A powerful {action} from {player}! {enemy} takes {damage} damage!',
  '{player} strikes with {action}! {enemy} suffers {damage} damage!',
]

const CRITICAL_COMMENTARIES = [
  'Critical hit! {player}\'s {action} deals {damage} damage to {enemy}!',
  'A devastating critical strike! {player}\'s {action} hits {enemy} for {damage} damage!',
  'Direct hit! {player}\'s {action} critically strikes {enemy} for {damage} damage!',
  'Bullseye! {player}\'s {action} critically damages {enemy} for {damage} damage!',
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { playerMonster, enemyMonster, action, damage, isCritical } = body

    if (!playerMonster || !enemyMonster || !action || damage === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const templates = isCritical ? CRITICAL_COMMENTARIES : BATTLE_COMMENTARIES
    const template = getRandomElement(templates)

    const commentary = template
      .replace('{player}', playerMonster)
      .replace('{enemy}', enemyMonster)
      .replace('{action}', action)
      .replace('{damage}', damage.toString())

    return NextResponse.json({ commentary })
  } catch (error) {
    console.error('Error generating battle commentary:', error)
    return NextResponse.json(
      { error: 'Failed to generate commentary' },
      { status: 500 }
    )
  }
}
