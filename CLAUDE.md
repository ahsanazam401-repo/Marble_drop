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
1. Falling and drag control (done)
2. Obstacles and losing (done)
3. Moving and slowing obstacles (each obstacle type is its own separate piece with its own size and speed, so speeds mix: e.g. block scrolls with the world, riser rises faster from below, crosser moves in from the sides. Mountain obstacle pictures already exist from Task 2; new moving types can use placeholders until their art is made. Done so far: sticks are a slowing obstacle; touching one knocks the marble about 160 px sideways away from it and makes it wobble for 1.28 s with 36% steering and a 21 degree side-to-side tilt, while the stick spins away. Ahsan approved the feel. Still to do: crossers from the sides and risers from below)
4. Endless levels and speed (speed ramp must rise smoothly, no jumps. Start speed is now 1000 px/s (chosen in Task 1). Earlier proposal: 1000 px/s at 500 m, then +10% every 100 m, capped at 1800 px/s; needs re-planning from the new start. Still to decide: +10% of current speed or fixed +100 px/s steps. Ahsan's test at sensitivity 1.6, hits per 500 m: 1250 px/s = 1, 1750 = 7, 1800 = 10, 2000 = 20+)
5. Coins and power-ups
6. Screens and flow
7. Sceneries and store
8. Art and sound
9. Playtesting and tuning
10. App packaging and publishing

## Task 1 (done)
Goal: steering feels precise and comfortable.
Includes: hero as a plain circle fixed one third from the top; world scrolling up; relative drag control; scrolling background lines to show speed; depth counter in metres; a few placeholder obstacles that only flash when touched (no death); a tuning panel to adjust fall speed, drag sensitivity and smoothness while playing. Remove the template's demo game content (fox) but keep the project structure.
Not included: death, coins, power-ups, art, sceneries, sound, menus.
Done when: Ahsan plays it on his phone, steering feels precise, and he picks his preferred settings.
Chosen settings (now the defaults): fall speed 1000 px/s, drag sensitivity 1.6, smoothness 60 ms, marble height 33% from top. Marble radius 72 (locked). Obstacles 20% smaller than first version. A temporary hit counter (Debug.hitCounter) helps tuning.

## Task 2 (done)
Built: mountain scenery obstacles (rock, stick, ice spikes, pine tree growing from the cliff edges), all deadly, each its own class in src/obstacles with hitboxes slightly smaller than the picture. Every obstacle leaves a gap for the marble; about 2 seconds with no obstacles at the start. Mountain cliff walls in two parallax layers on the blue sky. Crash under 1 second (flash, shake, squash, stars, tumble), then Game Over with depth, best depth (saved on device), NEW BEST message and a big instant Retry. Practice mode switch in the TUNE panel (no crashing, hit counter shown; practice runs do not count for best depth).
Art: generated by Ahsan, originals kept in art-source/, cleaned transparent PNGs in public/assets/images (hero/ and obstacles/). In game the marble is the falling hero (only the round ball is the hitbox). Start screen shows the thumbs-up menu hero; Game Over shows the bandaged hero, or the flying hero on a new best. Sticks are stretched 1.5x thicker; ice spikes 210-290 px tall. Two pictures each for rocks, sticks, ice spikes and pine trees. Only use art Ahsan generated or properly licensed (no watermarked stock images).
Postponed: coins (planned earlier, moved to Task 5).
