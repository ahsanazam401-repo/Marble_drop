import Phaser from 'phaser';
import { Colors, FallAttrs, ObstacleAttrs, Registry, Scenes } from '../config';
import { MarbleSprite } from '../sprites';
import { Tuning } from '../util/tuning';

export class GameScene extends Phaser.Scene {
  private marble: MarbleSprite;
  private obstacles: Phaser.GameObjects.Rectangle[];
  private distance: number;
  private nextObstacleAt: number;
  private marbleHitbox = new Phaser.Geom.Circle();
  private obstacleHitbox = new Phaser.Geom.Rectangle();

  constructor() {
    super(Scenes.GAME);
  }

  public create(): void {
    // Start game.
    this.startGame();
  }

  public update(_time: number, delta: number): void {
    if (!this.marble) {
      return;
    }

    // Update marble.
    this.marble.update(delta);

    // Fall: the world scrolls upward past the marble.
    const scroll = (Tuning.values.fallSpeed * delta) / 1000;
    this.distance += scroll;

    // Update depth in whole metres.
    const depth = Math.floor(this.distance / FallAttrs.PIXELS_PER_METRE);
    if (depth !== this.registry.get(Registry.DEPTH)) {
      this.registry.set(Registry.DEPTH, depth);
    }

    // Add new obstacles below the screen.
    while (this.distance >= this.nextObstacleAt) {
      this.addObstacle();
      this.nextObstacleAt += ObstacleAttrs.SPACING;
    }

    // Move obstacles and check for touches.
    this.updateObstacles(scroll);
  }

  private startGame(): void {
    // Reset run.
    this.obstacles = [];
    this.distance = 0;
    this.nextObstacleAt = 0;
    this.registry.set(Registry.DEPTH, 0);

    // Add marble.
    this.marble = new MarbleSprite(this);
  }

  private addObstacle(): void {
    // Add a placeholder block with a random width and position.
    const width = Phaser.Math.Between(ObstacleAttrs.WIDTH.MIN, ObstacleAttrs.WIDTH.MAX);
    const x = Phaser.Math.Between(width / 2, Number(this.game.config.width) - width / 2);
    const y = Number(this.game.config.height) + ObstacleAttrs.OFFSCREEN;
    const obstacle = this.add.rectangle(x, y, width, ObstacleAttrs.HEIGHT, Colors.GREY.DECIMAL);
    this.obstacles.push(obstacle);
  }

  private updateObstacles(scroll: number): void {
    const marbleHitbox = this.marble.getHitbox(this.marbleHitbox);

    this.obstacles = this.obstacles.filter((obstacle) => {
      obstacle.y -= scroll;

      // Remove obstacles that left the top of the screen.
      if (obstacle.y < -ObstacleAttrs.OFFSCREEN) {
        obstacle.destroy();
        return false;
      }

      // Flash red while the marble touches the (slightly smaller) hitbox.
      const inset = ObstacleAttrs.HITBOX_INSET;
      this.obstacleHitbox.setTo(
        obstacle.x - obstacle.width / 2 + inset,
        obstacle.y - obstacle.height / 2 + inset,
        obstacle.width - inset * 2,
        obstacle.height - inset * 2,
      );
      const touching = Phaser.Geom.Intersects.CircleToRectangle(marbleHitbox, this.obstacleHitbox);
      obstacle.setFillStyle(touching ? Colors.RED.DECIMAL : Colors.GREY.DECIMAL);

      return true;
    });
  }
}
