# DESIGN.md — MiMo Monster Breeder

## Design System

### Colors
```css
/* Primary */
--color-primary: #8B5CF6; /* Purple */
--color-primary-light: #A78BFA;
--color-primary-dark: #7C3AED;

/* Rarity Colors */
--rarity-common: #9CA3AF; /* Gray */
--rarity-rare: #3B82F6; /* Blue */
--rarity-epic: #8B5CF6; /* Purple */
--rarity-legendary: #F59E0B; /* Gold */

/* Backgrounds */
--bg-primary: #0F172A; /* Dark blue */
--bg-secondary: #1E293B;
--bg-card: #334155;

/* Text */
--text-primary: #F1F5F9;
--text-secondary: #CBD5E1;
--text-muted: #94A3B8;

/* Status */
--success: #10B981;
--warning: #F59E0B;
--danger: #EF4444;
```

### Typography
- **Headings:** Inter, 600 weight
- **Body:** Inter, 400 weight
- **Monospace:** JetBrains Mono (for stats/code)

### Spacing Scale
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

### Border Radius
```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 1rem;     /* 16px */
--radius-xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

---

## Component Library

### 1. Button
```jsx
<Button 
  variant="primary" | "secondary" | "ghost"
  size="sm" | "md" | "lg"
  disabled={false}
  onClick={() => {}}
>
  Hatch Egg
</Button>
```

**Variants:**
- **Primary:** Purple gradient, hover glow
- **Secondary:** Dark bg, purple border
- **Ghost:** Transparent, text only

### 2. Monster Card
```jsx
<MonsterCard
  monster={monster}
  onClick={() => {}}
  showActions={true}
/>
```

**Features:**
- Rarity border color
- Monster image placeholder (emoji/icon)
- Name, level, stats
- Quick actions: Train, Battle, Evolve
- Hover: scale up + shadow

### 3. Stat Bar
```jsx
<StatBar
  label="HP"
  value={45}
  max={100}
  color="--success"
/>
```

**Visual:** Horizontal bar with label + value

### 4. Battle Log
```jsx
<BattleLog
  messages={[
    { text: "Flamewing attacks!", type: "player" },
    { text: "Aqua Sprite takes 35 damage!", type: "damage" }
  ]}
/>
```

**Features:** Scrollable, auto-scroll to bottom, colored by type

### 5. Egg Hatch Animation
```jsx
<EggHatch
  onComplete={(monster) => {}}
  duration={3000}
/>
```

**Animation:**
1. Egg shake (2s)
2. Crack animation (1s)
3. Reveal monster with glow

---

## Screen Designs

### Screen 1: Home
```
┌─────────────────────────────────────┐
│  MiMo Monster Breeder               │
│  Essence: 1,250                     │
├─────────────────────────────────────┤
│                                     │
│          [HATCH EGG]                │
│          (big purple button)        │
│                                     │
│  Your Monsters (3)                  │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │     │ │     │ │     │           │
│  │  🔥 │ │  💧 │ │  🌿 │           │
│  │     │ │     │ │     │           │
│  └─────┘ └─────┘ └─────┘           │
│                                     │
│  Quick Stats                        │
│  • Battles: 12                      │
│  • Wins: 8                          │
│  • Evolved: 1                       │
│                                     │
└─────────────────────────────────────┘
```

### Screen 2: Collection
```
┌─────────────────────────────────────┐
│  ← Back   Collection                │
├─────────────────────────────────────┤
│  Filter: [All] [Common] [Rare]      │
│          [Epic] [Legendary]         │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │  Flamewing      Lv. 12      │    │
│  │  🔥 Rare                    │    │
│  │  HP: 45/45  ATK: 52  DEF: 38│    │
│  │  [Train] [Battle] [Evolve]  │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  Aqua Sprite    Lv. 8       │    │
│  │  💧 Common                  │    │
│  │  HP: 38/38  ATK: 41  DEF: 45│    │
│  │  [Train] [Battle] [Evolve]  │    │
│  └─────────────────────────────┘    │
│                                      │
└─────────────────────────────────────┘
```

### Screen 3: Monster Detail
```
┌─────────────────────────────────────┐
│  ← Back   Flamewing                 │
├─────────────────────────────────────┤
│  🔥 RARE • Lv. 12                   │
│                                     │
│  Personality:                       │
│  "Fiery and bold, loves to charge   │
│   headfirst into battle."           │
│                                     │
│  Stats:                             │
│  ┌─────────┬─────────┬─────────┐   │
│  │   HP    │   ATK   │   DEF   │   │
│  │  45/45  │   52    │   38    │   │
│  └─────────┴─────────┴─────────┘   │
│                                     │
│  Skills:                            │
│  • Flame Burst (1.2x ATK)           │
│  • Inferno Strike (1.5x ATK)        │
│                                     │
│  [TRAIN]  [BATTLE]  [EVOLVE]        │
│                                     │
└─────────────────────────────────────┘
```

### Screen 4: Training
```
┌─────────────────────────────────────┐
│  ← Back   Train Flamewing           │
├─────────────────────────────────────┤
│  Essence: 1,250                     │
│                                     │
│  HP: 45 → 50 (Cost: 100) [↑]        │
│  ATK: 52 → 57 (Cost: 100) [↑]       │
│  DEF: 38 → 43 (Cost: 100) [↑]       │
│                                     │
│  [TRAIN ALL] (Cost: 300)            │
│                                     │
│  Training Log:                      │
│  • Flamewing trained hard and       │
│    gained +5 HP!                    │
│  • MiMo: "This monster shows great  │
│    potential in defense."           │
│                                     │
└─────────────────────────────────────┘
```

### Screen 5: Battle
```
┌─────────────────────────────────────┐
│  Battle: Flamewing vs Aqua Sprite   │
├─────────────────────────────────────┤
│  Player                            │
│  ┌─────────────────────────────┐   │
│  │  Flamewing      HP: 45/45   │   │
│  │  🔥                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  VS                                 │
│                                     │
│  Enemy                             │
│  ┌─────────────────────────────┐   │
│  │  Aqua Sprite    HP: 38/38   │   │
│  │  💧                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  Battle Log:                       │
│  • Flamewing uses Flame Burst!      │
│  • Aqua Sprite takes 35 damage!     │
│  • Aqua Sprite uses Water Blast!    │
│  • Flamewing takes 28 damage!       │
│                                     │
│  [ATTACK]  [USE SKILL]  [FLEE]      │
│                                     │
└─────────────────────────────────────┘
```

### Screen 6: Evolution
```
┌─────────────────────────────────────┐
│  Evolution Ready!                   │
├─────────────────────────────────────┤
│  Flamewing has reached level 25!    │
│                                     │
│  Current:                           │
│  ┌─────────────────────────────┐   │
│  │  Flamewing                  │   │
│  │  🔥 Rare • Lv. 25          │   │
│  │  HP: 65  ATK: 72  DEF: 58   │
│  └─────────────────────────────┘   │
│                                     │
│  → Evolves to →                    │
│                                     │
│  New:                              │
│  ┌─────────────────────────────┐   │
│  │  Inferno Dragon             │   │
│  │  🔥 Epic • Lv. 25          │   │
│  │  HP: 78  ATK: 86  DEF: 70   │
│  └─────────────────────────────┘   │
│                                     │
│  New Skill:                        │
│  • Meteor Shower (2.0x ATK)        │
│                                     │
│  Evolution Story:                  │
│  "Flamewing has evolved into a     │
│   mighty dragon, its flames now    │
│   uncontrollable."                 │
│                                     │
│  [EVOLVE NOW]                      │
│                                     │
└─────────────────────────────────────┘
```

---

## Animations

### 1. Egg Hatch Sequence
```css
/* 1. Egg shake */
@keyframes eggShake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* 2. Crack reveal */
@keyframes crack {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

/* 3. Monster glow */
@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 5px var(--color-primary)); }
  50% { filter: drop-shadow(0 0 20px var(--color-primary)); }
}
```

### 2. Stat Level Up
```css
@keyframes statBump {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

### 3. Battle Damage
```css
@keyframes damageFlash {
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(239, 68, 68, 0.3); }
}
```

---

## Responsive Breakpoints

```css
/* Mobile (default) */
.container { padding: var(--space-4); }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { padding: var(--space-6); }
  .monster-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { padding: var(--space-8); }
  .monster-grid { grid-template-columns: repeat(3, 1fr); }
  .battle-screen { display: grid; grid-template-columns: 1fr 1fr; }
}
```

---

## Icon Set

- 🥚 Egg
- 🔥 Fire monster
- 💧 Water monster  
- 🌿 Grass monster
- ⚡ Electric monster
- 🪨 Rock monster
- ❤️ HP
- ⚔️ ATK
- 🛡️ DEF
- ⭐ Rarity
- 📈 Level up
- 🔄 Evolution
- ⚔️ Battle
- 🏆 Win
- 💀 Lose
- 💎 Essence

---

## Accessibility

### 1. Keyboard Navigation
- Tab through interactive elements
- Space/Enter to activate buttons
- Arrow keys for stat selection

### 2. Screen Readers
- ARIA labels for monster cards
- Live region for battle commentary
- Status announcements for training/evolution

### 3. Color Contrast
- Minimum 4.5:1 for text
- Rarity colors have sufficient contrast
- Battle status colors distinguishable

---

## Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** < 200KB (gzipped)
- **API Response Time:** < 500ms

---

## Assets Needed

### 1. Placeholder Images
- Egg variants (by rarity)
- Monster silhouettes (5 types)
- Background patterns

### 2. Sound Effects (optional)
- Egg crack
- Stat level up
- Battle hit
- Evolution fanfare

### 3. Fonts
- Inter (Google Fonts)
- JetBrains Mono (Google Fonts)

---

## Implementation Notes

### 1. State Management
- Use React Context for global state (monsters, essence)
- localStorage for persistence
- Optimistic updates for training/battle

### 2. API Integration
- Mock API for development
- Error handling with fallback content
- Loading states for all AI calls

### 3. Animation Performance
- Use CSS transforms (GPU accelerated)
- Debounce rapid button clicks
- Lazy load battle animations

---

## Testing Checklist

### Visual
- [ ] All screens render correctly on mobile/desktop
- [ ] Rarity colors display properly
- [ ] Animations run smoothly
- [ ] No layout shifts during interactions

### Functional
- [ ] Egg hatch generates monster
- [ ] Training increases stats
- [ ] Battle system works (win/lose)
- [ ] Evolution triggers at level 25
- [ ] localStorage saves/loads correctly

### AI Integration
- [ ] All MiMo endpoints return valid JSON
- [ ] Error states handled gracefully
- [ ] Loading indicators show during API calls
