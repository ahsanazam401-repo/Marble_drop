import Phaser from 'phaser';
import { Colors, GameStates, MountainAttrs, Registry, Scenes, SpeedLineAttrs } from '../config';
import { MountainWalls } from '../scenery/mountain-walls';
import { Tuning } from '../util/tuning';

interface SpeedLine {
  line: Phaser.GameObjects.Rectangle;
  speedFactor: number;
}

export class BackgroundScene extends Phaser.Scene {
  private speedLines: SpeedLine[] = [];
  private mountains: MountainWalls[] = [];

  constructor() {
    super(Scenes.BACKGROUND);
  }

  public create(): void {
    // Add mountain walls: a lighter far layer behind a darker near layer.
    this.mountains = [
      new MountainWalls(this, {
        color: Colors.MOUNTAIN_FAR.DECIMAL,
        width: MountainAttrs.FAR.WIDTH,
        speedFactor: MountainAttrs.FAR.SPEED_FACTOR,
      }),
      new MountainWalls(this, {
        color: Colors.MOUNTAIN_NEAR.DECIMAL,
        width: MountainAttrs.NEAR.WIDTH,
        speedFactor: MountainAttrs.NEAR.SPEED_FACTOR,
      }),
    ];

    // Add speed lines in front.
    this.addSpeedLines();
  }

  public update(_time: number, delta: number): void {
    // Scroll everything upward: fast while falling, slowly on menus.
    const gameState = this.registry.get(Registry.GAME_STATE);
    const speed = gameState === GameStates.STARTED ? Tuning.values.fallSpeed : SpeedLineAttrs.MENU_SPEED;
    const distance = (speed * delta) / 1000;

    this.mountains.forEach((mountain) => mountain.update(distance));

    this.speedLines.forEach(({ line, speedFactor }) => {
      line.y -= distance * speedFactor;

      // Move lines that left the top back below the bottom.
      if (line.y + line.height < 0) {
        this.placeLine(line, Number(this.game.config.height));
      }
    });
  }

  private addSpeedLines(): void {
    // Alternate between faint, slower far lines and brighter, faster near lines.
    for (let i = 0; i < SpeedLineAttrs.COUNT; i++) {
      const layer = i % 2 === 0 ? SpeedLineAttrs.FAR : SpeedLineAttrs.NEAR;
      const line = this.add.rectangle(0, 0, layer.WIDTH, 1, Colors.WHITE.DECIMAL, layer.ALPHA).setOrigin(0.5, 0);
      this.placeLine(line, Phaser.Math.Between(0, Number(this.game.config.height)));
      this.speedLines.push({ line, speedFactor: layer.SPEED_FACTOR });
    }
  }

  private placeLine(line: Phaser.GameObjects.Rectangle, y: number): void {
    // Give the line a random length and horizontal position.
    line.setSize(line.width, Phaser.Math.Between(SpeedLineAttrs.LENGTH.MIN, SpeedLineAttrs.LENGTH.MAX));
    line.setPosition(Phaser.Math.Between(0, Number(this.game.config.width)), y);
  }
}
