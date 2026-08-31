# Project Afterlight Prototype

Playable Godot 4.x vertical-slice prototype for **PROJECT AFTERLIGHT**.

## Launch

Open `project.godot` in Godot 4.x, or run:

```bash
godot --path .
```

## Controls

- WASD: move
- Mouse: look
- Space: jump
- Shift: sprint
- E: interact
- Q: start/stop Echo recording
- R: remove latest Echo
- Hold R: reset current checkpoint
- Esc: pause/settings
- F2: developer HUD
- F3: skip to next major section

## Prototype flow

The level is generated from `scripts/levels/afterlight_level.gd` and connects:

1. Opening transit station and Maya radio beat.
2. Puzzle 1: two pressure plates and the Afterlight device.
3. Puzzle 2: timed switch, moving platform, and timed door.
4. Puzzle 3: Echo distraction against a reusable sentinel AI.
5. Story beat identifying the player as Project Director.
6. Puzzle 4: two Echoes plus the real player coordinating bridge, beam, and final plate.
7. Observation-room climax with the first corrupted Echo playback.

Active Echo recordings are intentionally not persisted; checkpoints store section, settings, and Echo capacity only.
