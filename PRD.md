# PRD — MiMo Monster Breeder

## Overview

**MiMo Monster Breeder** adalah collection game berbasis AI di mana pemain menetas monster, melatih mereka, dan bertarung. Setiap monster di-generate dengan personality, skills, dan evolution path unik menggunakan MiMo AI V2.5 Pro.

**Target:** Casual players yang suka collection mechanics + AI-generated content.

---

## Core Gameplay Loop

```
Hatch Egg → Get Monster → Train → Battle → Evolve → Repeat
```

### 1. Hatch Egg
- User klik "Hatch Egg" → random egg animation
- MiMo generate:
  - **Name** (personality-based)
  - **Rarity** (Common, Rare, Epic, Legendary)
  - **Base Stats** (HP, ATK, DEF — scaled by rarity)
  - **Personality** (short description, 1-2 sentences)
  - **Starting Skill** (1 attack skill)
- Monster disimpan ke localStorage
- Egg animation → reveal monster

### 2. Monster Collection
- Daftar semua monster yang di-hatch
- Tampilkan: Name, Rarity, Level, Stats, Personality
- Bisa pilih monster untuk training/battle

### 3. Training
- Pilih monster → increase stats (HP, ATK, DEF)
- Cost: "Essence" (earned dari battle)
- Stat boost: +5 per level (capped at level 50)
- MiMo generate training flavor text ("Your [Name] trained hard...")

### 4. Battle (1v1 Random)
- Player monster vs random AI monster
- Turn-based:
  - Player attack (skill damage = ATK + skill modifier)
  - AI attack (random skill)
  - Repeat until one HP = 0
- MiMo generate battle commentary (real-time, per turn)
- Win → +Essence, +XP
- Lose → -Essence (min 0), +XP (half)

### 5. Evolution
- Monster reach level 25 → unlock evolution
- MiMo generate:
  - **New Name** (evolved form)
  - **Evolution Description** (lore-based)
  - **New Skill** (evolved attack)
  - **Stat Boost** (+20% all stats)
- One-time per monster

---

## MVP Features

| Feature | Priority | Status |
|---------|----------|--------|
| Hatch Egg (UI + MiMo integration) | P0 | - |
| Monster Collection View | P0 | - |
| Training System | P0 | - |
| Battle System (1v1) | P0 | - |
| Evolution System | P0 | - |
| localStorage Persistence | P0 | - |
| MiMo AI Integration (all endpoints) | P0 | - |

---

## AI Integration Points

### 1. Generate Monster (Hatch)
**Endpoint:** `POST /api/generate/monster`

**Input:**
```json
{
  "rarity": "Rare"
}
```

**Output (MiMo):**
```json
{
  "name": "Flamewing",
  "personality": "Fiery and bold, loves to charge headfirst into battle.",
  "baseStats": {
    "hp": 45,
    "atk": 52,
    "def": 38
  },
  "startingSkill": {
    "name": "Flame Burst",
    "description": "A burst of flames that deals 1.2x ATK damage.",
    "modifier": 1.2
  }
}
```

### 2. Generate Skill (Training/Evolution)
**Endpoint:** `POST /api/generate/skill`

**Input:**
```json
{
  "monsterName": "Flamewing",
  "monsterType": "Fire",
  "skillType": "attack"
}
```

**Output:**
```json
{
  "name": "Inferno Strike",
  "description": "A powerful fire attack that can burn enemies.",
  "modifier": 1.5
}
```

### 3. Generate Evolution
**Endpoint:** `POST /api/generate/evolution`

**Input:**
```json
{
  "monsterName": "Flamewing",
  "currentLevel": 25
}
```

**Output:**
```json
{
  "evolvedName": "Inferno Dragon",
  "description": "Flamewing has evolved into a mighty dragon, its flames now uncontrollable.",
  "newSkill": {
    "name": "Meteor Shower",
    "description": "Rain meteors of fire upon the enemy.",
    "modifier": 2.0
  }
}
```

### 4. Generate Battle Commentary
**Endpoint:** `POST /api/generate/battle-commentary`

**Input:**
```json
{
  "playerMonster": "Flamewing",
  "enemyMonster": "Aqua Sprite",
  "action": "attack",
  "damage": 35,
  "isCritical": false
}
```

**Output:**
```json
{
  "commentary": "Flamewing unleashes a Flame Burst! Aqua Sprite takes 35 damage and looks scorched!"
}
```

---

## Data Model

### Monster
```javascript
{
  id: "uuid",
  name: string,
  rarity: "Common" | "Rare" | "Epic" | "Legendary",
  personality: string,
  level: number (1-50),
  experience: number,
  stats: {
    hp: number,
    atk: number,
    def: number
  },
  currentHp: number,
  skills: [
    {
      name: string,
      description: string,
      modifier: number
    }
  ],
  evolved: boolean,
  evolvedName?: string,
  createdAt: timestamp
}
```

### Player State
```javascript
{
  monsters: [Monster],
  essence: number,
  totalBattles: number,
  totalWins: number
}
```

---

## UI/UX Flow

### Screens
1. **Home** — Hatch button, essence counter, quick stats
2. **Collection** — Grid/list of all monsters
3. **Monster Detail** — Stats, skills, training, battle, evolve buttons
4. **Battle** — Real-time turn-based battle with commentary
5. **Training** — Stat upgrade UI with essence cost

### Design Language
- **Cute, playful** — rounded corners, pastel colors
- **Monster cards** — rarity-based color coding (Common: gray, Rare: blue, Epic: purple, Legendary: gold)
- **Animations** — egg hatch, stat level-up, evolution glow
- **Responsive** — mobile-first (works on phone + desktop)

---

## Success Metrics

- [ ] Hatch 5+ unique monsters
- [ ] Win 3 battles
- [ ] Evolve 1 monster
- [ ] All MiMo endpoints respond correctly
- [ ] localStorage persists across sessions
- [ ] No API errors in console

---

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **AI:** MiMo AI V2.5 Pro (API)
- **Storage:** localStorage (MVP)
- **Deployment:** Netlify (static export)

---

## Timeline

- **Phase 1 (Day 1):** Hatch + Collection UI
- **Phase 2 (Day 1-2):** Training + Battle System
- **Phase 3 (Day 2):** Evolution + Polish
- **Phase 4 (Day 2-3):** Deploy + Testing

---

## Open Questions

- [ ] Rarity distribution? (e.g., 60% Common, 25% Rare, 12% Epic, 3% Legendary)
- [ ] Max monsters per player? (unlimited for MVP)
- [ ] Essence economy? (how much per win, cost per stat point)
- [ ] Battle difficulty scaling? (random AI stats or player-level matched)
