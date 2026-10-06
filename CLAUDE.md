# Marble Drop: Project Instructions

## How we work (most important)
- The owner, Ahsan, is not a programmer. Explain things briefly in plain words.
- Planning happens in a separate chat. Never build or change game code unless Ahsan clearly says "build" for a specific task.
- Work on one task at a time. Do not start the next task or add unrequested features.
- Before building, restate the task plan in a few lines and wait for confirmation.
- After each task: run the game to check it works, commit with a clear message, push to GitHub, and summarize what changed and how to test it.
- Keep the template's LICENSE file. Do not change unrelated files.
- If something fails or a decision is unclear, stop and ask instead of guessing.

## The game
Working title: Marble Drop. A portrait mobile game, Android first.
One sentence: steer a daredevil marble falling endlessly through obstacles and see how deep you can go.

Hero: a daredevil marble who loves jumping from extreme heights (mountains, buildings, waterfalls, clouds). He wears blue goggles and a red cape. In gameplay he appears small, so use a simplified falling version (ball, goggles, cape fluttering above). The full character is used on menus and game over.

## Core rules
- The hero stays at a fixed height, about one third from the top of the screen. The world scrolls upward past him to create the feeling of falling.
- Controls: relative drag is the default. The thumb slides anywhere on the screen and the hero moves the same horizontal distance (with sensitivity setting), following smoothly with a slight delay. Lifting the thumb leaves him in place. Screen edges stop him. Tilt is an optional control in settings (added later).
- Most obstacles are deadly: one hit ends the run (unless a shield is active).
- Some obstacles only slow him down: they cause a short wobble where steering is weaker for about one second.
- Obstacles can be static or move in from the sides (for example, fish swimming across).
- Some obstacles rise from below, moving upward toward the hero faster than the world scrolls (for example, bubbles, birds flying up, rocks bursting upward). They must be visible early enough to dodge fairly.
- Hitboxes are slightly smaller than the drawn objects, so near misses feel fair and thrilling.
- Fall speed increases with distance or time (to be tuned).
- Crash: a quick moment under one second (impact flash, small screen shake, hero squashes, dizzy stars, tumbles away), then game over.
- Game over: bandaged hero with a cheeky grin or thumbs up, depth, best depth, coins, and a big one-tap retry. Restart must be instant.

## Coins and power-ups
- Coins appear in trails that tempt risky moves. Total coins are saved.
- Coin magnet: pulls nearby coins to the hero.
- Shield: a glowing bubble that absorbs one hit.
- Blast: a shockwave that destroys obstacles around the hero.
- Split balls: the hero splits into 2 or 3 marbles that move together with the drag. The run continues while at least one survives. They collect more coins. After a few seconds the survivors merge back.
- Every power-up has a clear visual animation so players see what is active.

## Sceneries, skins and store
- Each scenery has its own background and obstacle set. Example, waterfall: fish from left and right, whirlpools, plants, stones, sticks.
- Backgrounds use parallax: several still layers scrolling at different speeds to create depth and speed.
- Mountain scenery is free. Waterfall unlocks at a distance milestone. Later sceneries are bought with coins in the in-game store. New sceneries can be released in updates ("New scenery available!").
- Different marble styles are skins (store or progress unlocks).
- Retention: a progress bar on game over shows how close the next unlock is.

## Screens (maximum 6)
Home, Game, Game over, Pause, Settings (sound, music, vibration, controls), Store.

## Not in scope for now
Online leaderboards, ads, in-app purchases, multiplayer, story mode.

## Tech
Phaser 4 + TypeScript + Vite (from the phaser-typescript-template), Capacitor for the Android app later. Portrait, 9:16 play area. Progress saved on the device. Test builds will be published to GitHub Pages. Use the Phaser skills in this project.

## Task list
0. Project setup (done)
1. Falling and drag control
2. Obstacles and losing
3. Moving and slowing obstacles
4. Endless levels and speed (speed ramp must rise smoothly, no jumps. Proposed: start 900 px/s, 1000 px/s at 500 m, then +10% every 100 m, capped at 1800 px/s. Still to decide: +10% of current speed or fixed +100 px/s steps)
5. Coins and power-ups
6. Screens and flow
7. Sceneries and store
8. Art and sound
9. Playtesting and tuning
10. App packaging and publishing

## Task 1 plan (approved, not built yet)
Goal: steering feels precise and comfortable.
Includes: hero as a plain circle fixed one third from the top; world scrolling up; relative drag control; scrolling background lines to show speed; depth counter in metres; a few placeholder obstacles that only flash when touched (no death); a tuning panel to adjust fall speed, drag sensitivity and smoothness while playing. Remove the template's demo game content (fox) but keep the project structure.
Not included: death, coins, power-ups, art, sceneries, sound, menus.
Done when: Ahsan plays it on his phone, steering feels precise, and he picks his preferred settings.
