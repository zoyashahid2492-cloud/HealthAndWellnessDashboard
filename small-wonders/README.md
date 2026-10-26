# Small Wonders

A cooperative puzzle-platformer for two players on one keyboard. Pip and Pebble, two toy friends, cross an oversized bedroom and mend a broken mechanical firefly.

The game is a 2D browser prototype built with TypeScript, Phaser 3, and Vite. Art is drawn with shapes at runtime, so it does not download images or use paid services.

This folder is the game. The repository root also contains an unrelated wellness dashboard; leave that alone if you only want to play.

## Setup

```bash
cd small-wonders
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

From the repository root, after `npm install` inside `small-wonders/`:

```bash
npm run game
npm run game:build
npm run game:preview
```

Production build:

```bash
cd small-wonders
npm run build
npm run preview
```

`npm run build` typechecks, then writes `dist/`.

## How to play

On the title screen, choose **Play together**. Options:

| Key | Option |
| --- | --- |
| 1 | Pip: Normal or Assisted jumps |
| 2 | Pebble: Normal or Assisted jumps |
| 3 | Motion: Full or Reduced |
| 4 | Sound: On or Off |

Assisted mode gives that player a higher jump, longer coyote time, a longer jump buffer, and wider interaction zones. Reduced motion cuts extra bobbing, particles, and camera smoothing. The system setting “reduce motion” is the default when the browser asks for it. Choices are saved in this browser only.

### Controls

| | Pip (stretchy) | Pebble (round) |
| --- | --- | --- |
| Move | A / D | Left / Right |
| Jump | W | Up arrow |
| Ability | Hold E | Hold Enter (or numpad Enter) |
| Pause | Esc | Esc |

The arrow keys, space, and Enter do not scroll the page while the game is open.

Pip’s ability turns Pip into a bridge at a blue anchor (a post, a diamond, and a bridge mark). Keep holding E. The bridge stays up a little longer if Pebble is still crossing.

Pebble’s ability pushes a wooden block while walking into it, and also works on call levers. Standing on a round floor button is enough; Pebble does not have to tap it.

### The bedroom

1. **The Book Gap.** Pip bridges the gap. Pebble crosses, then stands on the round button. A picture book rises and stays, so Pip can walk across too.
2. **The Block Elevator.** Pebble pushes the block onto the square pad. Pip stands on the lift, rides up, and holds E on the red ribbon to open the bookcase door. Hold the ability button on the lift to ride down. A blue post on the ground can send the lift up or call it down.
3. **The Firefly Workshop.** Pip jumps up for the teal lens. Pebble pushes the block aside and picks up the amber cog. Each piece fits only the socket with the same shape. Then both players hold their ability buttons. They do not have to press at the same instant. If someone lets go, the mend pauses, then slowly eases back.

Falling into the pillow gap pops that player back to their own checkpoint. The other player stays where they are, and finished steps stay finished.

**Esc** pauses. **Restart puzzle** puts both players at the start of the current room and resets only that room. **Replay**, on the ending screen, starts the bedroom over.

## Project layout

```text
src/config.ts            tuning and room layout
src/entities/player.ts   movement, jump forgiveness, bridge and respawn
src/systems/controls.ts  keyboard mapping
src/systems/checkpoints.ts
src/puzzles/             book gap, elevator, workshop
src/scenes/              title, play, HUD
src/world/               bedroom drawing and static bodies
```

A debug snapshot is available in the browser console as `window.__WONDERS__.state()`.

## Known limitations

- Local co-op on one keyboard only. There is no gamepad and no online play.
- Some laptop keyboards cannot register every combination of Pip’s keys and Pebble’s keys at once (ghosting). The mend only needs E and Enter held together; both players can stand still for that part.
- One bedroom, about five to ten minutes. There is no second level.
- Art and sound are procedural. There is no music bed, and the shapes are placeholders rather than finished illustration.
- Checkpoints are tripwires. A long fall respawns each player at the last tripwire they crossed, which can be a previous ledge if they never passed a closer one.
- English only.
- The debug hook on `window.__WONDERS__` is always present. It only reads state.
- Restarting a room that is already solved sets that room back so it can be played again. Later rooms are left as they are, which can mean walking through an earlier gap again.
