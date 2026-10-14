import Phaser from 'phaser';
import { ObstacleArts, ObstacleAttrs, Textures } from '../config';
import { BaseObstacle } from './base-obstacle';

export class Snowball extends BaseObstacle {
  private baseX: number;
  private phase = Phaser.Math.FloatBetween(0, Math.PI * 2);

  public static randomRadius(): number {
    return Phaser.Math.Between(ObstacleAttrs.SNOWBALL.RADIUS.MIN, ObstacleAttrs.SNOWBALL.RADIUS.MAX);
  }

  // x is the centre of the swirl; the snowball loops left and right around it.
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    super(scene, x, y, Phaser.Math.RND.pick(ObstacleArts.SNOWBALLS), radius * 2);
    this.baseX = x;
    this.addTrail();
  }

  public static swirlMargin(radius: number): number {
    // Half-width the swirl needs, so the snowball stays on screen.
    return radius + ObstacleAttrs.SNOWBALL.SWIRL.RADIUS;
  }

  public move({ scroll, delta }: { scroll: number; delta: number }): void {
    // Rise faster than the world, swirl in loops and spin.
    const { RISE_SPEED, SWIRL, SPIN } = ObstacleAttrs.SNOWBALL;
    this.y -= scroll + (RISE_SPEED * delta) / 1000;
    this.phase += (delta / SWIRL.PERIOD) * Math.PI * 2;
    this.x = this.baseX + Math.sin(this.phase) * SWIRL.RADIUS;
    this.angle += (SPIN * delta) / 1000;
  }

  private addTrail(): void {
    // Puffs of snow left behind as it rushes upward.
    const { TRAIL } = ObstacleAttrs.SNOWBALL;
    const scene = this.scene;
    const trail = scene.add
      .particles(0, 0, Textures.SNOW_PUFF.NAME, {
        follow: this,
        lifespan: TRAIL.LIFESPAN,
        frequency: TRAIL.FREQUENCY,
        speedX: { min: -TRAIL.SPREAD, max: TRAIL.SPREAD },
        speedY: { min: -TRAIL.SPEED * 1.3, max: -TRAIL.SPEED },
        scale: { start: (this.displayWidth / Textures.SNOW_PUFF.SIZE) * TRAIL.SCALE, end: 0 },
        alpha: { start: TRAIL.ALPHA, end: 0 },
      })
      .setDepth(-1);

    // Stop the trail with the snowball and remove it once the last puffs fade.
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      trail.stop();
      scene.time.delayedCall(TRAIL.LIFESPAN, () => trail.destroy());
    });
  }
}
