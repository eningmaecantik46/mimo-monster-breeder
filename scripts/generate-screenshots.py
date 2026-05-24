#!/usr/bin/env python3
"""Generate screenshots of MiMo Monster Breeder UI mockups using Playwright."""

import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

# Create screenshots directory
screenshots_dir = Path(__file__).parent.parent / "public" / "screenshots"
screenshots_dir.mkdir(parents=True, exist_ok=True)

# HTML mockup with all 5 screens
html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiMo Monster Breeder - Screenshots</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0F172A; color: #F1F5F9; }
        .screen { width: 1200px; height: 800px; background: #0F172A; padding: 40px; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
        .screen h1 { font-size: 2.5em; margin-bottom: 20px; color: #8B5CF6; }
        .screen p { font-size: 1.1em; color: #CBD5E1; margin-bottom: 30px; }
        
        /* Home Screen */
        .home-header { text-align: center; margin-bottom: 40px; }
        .home-header .emoji { font-size: 4em; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: #334155; padding: 20px; border-radius: 12px; text-align: center; }
        .stat-card .value { font-size: 2em; font-weight: bold; color: #8B5CF6; margin-top: 10px; }
        .stat-card .label { color: #94A3B8; font-size: 0.9em; }
        .hatch-btn { background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; padding: 20px 40px; border-radius: 12px; font-size: 1.3em; font-weight: bold; border: none; cursor: pointer; margin: 20px auto; display: block; }
        
        /* Collection Screen */
        .collection-header { margin-bottom: 30px; }
        .monster-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .monster-card { background: #334155; border: 2px solid #8B5CF6; border-radius: 12px; padding: 20px; }
        .monster-card .name { font-size: 1.3em; font-weight: bold; margin-bottom: 10px; }
        .monster-card .rarity { display: inline-block; background: #8B5CF6; color: white; padding: 4px 12px; border-radius: 6px; font-size: 0.8em; margin-bottom: 15px; }
        .monster-card .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; font-size: 0.9em; }
        .monster-card .stat { background: #1E293B; padding: 10px; border-radius: 6px; text-align: center; }
        .monster-card .stat-label { color: #94A3B8; font-size: 0.8em; }
        .monster-card .stat-value { font-weight: bold; color: #8B5CF6; }
        .monster-card .buttons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
        .monster-card button { background: #1E293B; color: #8B5CF6; border: 1px solid #8B5CF6; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 0.85em; }
        
        /* Battle Screen */
        .battle-container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
        .battle-monster { text-align: center; }
        .battle-monster .emoji { font-size: 5em; margin-bottom: 20px; }
        .battle-monster .name { font-size: 1.5em; font-weight: bold; margin-bottom: 10px; }
        .battle-monster .hp { font-size: 1.2em; color: #EF4444; margin-bottom: 20px; }
        .hp-bar { background: #1E293B; height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
        .hp-fill { background: linear-gradient(90deg, #10B981, #34D399); height: 100%; width: 75%; }
        .vs-text { text-align: center; font-size: 2em; font-weight: bold; color: #8B5CF6; }
        .battle-log { background: #1E293B; padding: 20px; border-radius: 12px; margin-top: 30px; max-height: 200px; overflow-y: auto; }
        .battle-log-entry { margin-bottom: 10px; font-size: 0.95em; color: #CBD5E1; }
        .battle-log-entry.damage { color: #EF4444; }
        .battle-log-entry.heal { color: #10B981; }
        
        /* Training Screen */
        .training-container { max-width: 600px; margin: 0 auto; }
        .training-stat { background: #334155; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .training-stat .label { font-size: 1.1em; }
        .training-stat .values { text-align: right; }
        .training-stat .current { color: #8B5CF6; font-weight: bold; font-size: 1.2em; }
        .training-stat .arrow { color: #10B981; margin: 0 10px; }
        .training-stat .next { color: #10B981; }
        .training-stat .cost { color: #F59E0B; font-size: 0.9em; margin-top: 5px; }
        .train-btn { background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; padding: 15px 30px; border-radius: 12px; font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; margin-top: 30px; width: 100%; }
        
        /* Evolution Screen */
        .evolution-container { text-align: center; }
        .evolution-before { margin-bottom: 40px; }
        .evolution-before .emoji { font-size: 4em; margin-bottom: 15px; }
        .evolution-before .name { font-size: 1.5em; font-weight: bold; margin-bottom: 10px; }
        .evolution-before .level { color: #94A3B8; }
        .evolution-arrow { font-size: 3em; color: #8B5CF6; margin: 20px 0; }
        .evolution-after { margin-bottom: 40px; }
        .evolution-after .emoji { font-size: 4em; margin-bottom: 15px; }
        .evolution-after .name { font-size: 1.5em; font-weight: bold; color: #F59E0B; margin-bottom: 10px; }
        .evolution-after .rarity { display: inline-block; background: #F59E0B; color: #0F172A; padding: 6px 15px; border-radius: 6px; font-size: 0.9em; font-weight: bold; }
        .evolution-skill { background: #334155; padding: 20px; border-radius: 12px; margin-top: 30px; text-align: left; }
        .evolution-skill .name { font-weight: bold; color: #8B5CF6; margin-bottom: 8px; }
        .evolution-skill .desc { color: #CBD5E1; font-size: 0.95em; }
        .evolve-btn { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 15px 40px; border-radius: 12px; font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; margin-top: 30px; }
    </style>
</head>
<body>
    <!-- Screen 1: Home -->
    <div class="screen">
        <div class="home-header">
            <div class="emoji">🥚</div>
            <h1>MiMo Monster Breeder</h1>
            <p>Collect, train, and battle AI-generated monsters</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">Essence</div>
                <div class="value">1,250</div>
            </div>
            <div class="stat-card">
                <div class="label">Monsters</div>
                <div class="value">3</div>
            </div>
            <div class="stat-card">
                <div class="label">Battles</div>
                <div class="value">12</div>
            </div>
            <div class="stat-card">
                <div class="label">Win Rate</div>
                <div class="value">67%</div>
            </div>
        </div>
        
        <button class="hatch-btn">🥚 Hatch Egg</button>
    </div>
    
    <!-- Screen 2: Collection -->
    <div class="screen">
        <div class="collection-header">
            <h1>Your Monsters</h1>
            <p>3 monsters in your collection</p>
        </div>
        
        <div class="monster-grid">
            <div class="monster-card">
                <div class="name">🔥 Flamewing</div>
                <div class="rarity">Rare</div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">HP</div>
                        <div class="stat-value">45/45</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">ATK</div>
                        <div class="stat-value">52</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">DEF</div>
                        <div class="stat-value">38</div>
                    </div>
                </div>
                <div class="buttons">
                    <button>Train</button>
                    <button>Battle</button>
                    <button>Evolve</button>
                </div>
            </div>
            
            <div class="monster-card">
                <div class="name">💧 Aqua Sprite</div>
                <div class="rarity">Common</div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">HP</div>
                        <div class="stat-value">30/30</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">ATK</div>
                        <div class="stat-value">35</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">DEF</div>
                        <div class="stat-value">30</div>
                    </div>
                </div>
                <div class="buttons">
                    <button>Train</button>
                    <button>Battle</button>
                    <button>Evolve</button>
                </div>
            </div>
            
            <div class="monster-card">
                <div class="name">⚡ Volt</div>
                <div class="rarity">Epic</div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">HP</div>
                        <div class="stat-value">60/60</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">ATK</div>
                        <div class="stat-value">68</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">DEF</div>
                        <div class="stat-value">50</div>
                    </div>
                </div>
                <div class="buttons">
                    <button>Train</button>
                    <button>Battle</button>
                    <button>Evolve</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Screen 3: Battle -->
    <div class="screen">
        <h1 style="text-align: center; margin-bottom: 40px;">⚔️ Battle Arena</h1>
        
        <div class="battle-container">
            <div class="battle-monster">
                <div class="emoji">🔥</div>
                <div class="name">Flamewing</div>
                <div class="hp">HP: 38/45</div>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: 84%;"></div>
                </div>
            </div>
            
            <div class="vs-text">VS</div>
            
            <div class="battle-monster">
                <div class="emoji">💧</div>
                <div class="name">Aqua Sprite</div>
                <div class="hp">HP: 22/30</div>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: 73%;"></div>
                </div>
            </div>
        </div>
        
        <div class="battle-log">
            <div class="battle-log-entry">Flamewing uses Flame Burst!</div>
            <div class="battle-log-entry damage">Aqua Sprite takes 35 damage!</div>
            <div class="battle-log-entry">Aqua Sprite uses Water Blast!</div>
            <div class="battle-log-entry damage">Flamewing takes 28 damage!</div>
            <div class="battle-log-entry">Flamewing uses Inferno Strike!</div>
            <div class="battle-log-entry damage">Critical hit! Aqua Sprite takes 52 damage!</div>
        </div>
    </div>
    
    <!-- Screen 4: Training -->
    <div class="screen">
        <h1 style="margin-bottom: 40px;">📈 Train Flamewing</h1>
        
        <div class="training-container">
            <div class="training-stat">
                <div class="label">❤️ HP</div>
                <div class="values">
                    <div class="current">45 <span class="arrow">→</span> 50</div>
                    <div class="cost">Cost: 100 Essence</div>
                </div>
            </div>
            
            <div class="training-stat">
                <div class="label">⚔️ ATK</div>
                <div class="values">
                    <div class="current">52 <span class="arrow">→</span> 57</div>
                    <div class="cost">Cost: 100 Essence</div>
                </div>
            </div>
            
            <div class="training-stat">
                <div class="label">🛡️ DEF</div>
                <div class="values">
                    <div class="current">38 <span class="arrow">→</span> 43</div>
                    <div class="cost">Cost: 100 Essence</div>
                </div>
            </div>
            
            <button class="train-btn">Train All (300 Essence)</button>
        </div>
    </div>
    
    <!-- Screen 5: Evolution -->
    <div class="screen">
        <h1 style="text-align: center; margin-bottom: 40px;">🔄 Evolution Ready!</h1>
        
        <div class="evolution-container">
            <div class="evolution-before">
                <div class="emoji">🔥</div>
                <div class="name">Flamewing</div>
                <div class="level">Lv. 25 • Rare</div>
            </div>
            
            <div class="evolution-arrow">↓</div>
            
            <div class="evolution-after">
                <div class="emoji">🐉</div>
                <div class="name">Inferno Dragon</div>
                <div class="rarity">Legendary</div>
            </div>
            
            <div class="evolution-skill">
                <div class="name">🌟 New Skill: Meteor Shower</div>
                <div class="desc">Rain meteors of fire upon the enemy. Deals 2.0x ATK damage.</div>
            </div>
            
            <button class="evolve-btn">✨ Evolve Now</button>
        </div>
    </div>
</body>
</html>
"""

async def generate_screenshots():
    """Generate screenshots using Playwright."""
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1200, "height": 800})
        
        # Write HTML to temp file
        html_file = Path("/tmp/mimo-screenshots.html")
        html_file.write_text(html_content)
        
        # Navigate to HTML file
        await page.goto(f"file://{html_file}", wait_until="networkidle")
        
        # Get all screens
        screens = await page.query_selector_all(".screen")
        
        screenshots = [
            ("home", "Home - Hatch & Stats"),
            ("collection", "Collection - Your Monsters"),
            ("battle", "Battle - 1v1 Combat"),
            ("training", "Training - Level Up Stats"),
            ("evolution", "Evolution - Unlock New Forms"),
        ]
        
        for i, (name, title) in enumerate(screenshots):
            screen = screens[i]
            screenshot_path = screenshots_dir / f"{i+1}-{name}.png"
            await screen.screenshot(path=str(screenshot_path))
            print(f"✅ Generated: {screenshot_path.name}")
        
        await browser.close()
        print(f"\n✅ All screenshots saved to: {screenshots_dir}")

if __name__ == "__main__":
    asyncio.run(generate_screenshots())
