import Phaser from 'phaser';
import { Colors, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class Rock extends BaseObstacle {
  public static randomRadius(): number {
    return Phaser.Math.Between(ObstacleAttrs.ROCK.RADIUS.MIN, ObstacleAttrs.ROCK.RADIUS.MAX);
  }

  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    super(scene, x, y);
    this.halfHeight = radius;

    // Lumpy boulder with a light highlight and a few darker spots.
    const { POINTS, LUMPINESS } = ObstacleAttrs.ROCK;
    const distances = Array.from({ length: POINTS }, () => radius * Phaser.Math.FloatBetween(1 - LUMPINESS, 1));
    this.parts.push({
      kind: 'polygon',
      points: distances.map((distance, i) => {
        const angle = (i / POINTS) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.15, 0.15);
        return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
      }),
      fill: Colors.ROCK.DECIMAL,
      outline: Colors.ROCK_OUTLINE.DECIMAL,
    });
    this.parts.push({
      kind: 'circle',
      x: -radius * 0.35,
      y: -radius * 0.35,
      radius: radius * 0.25,
      fill: Colors.ROCK_LIGHT.DECIMAL,
    });
    const spots = Phaser.Math.Between(2, 3);
    for (let i = 0; i < spots; i++) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.FloatBetween(0.3, 0.55) * radius;
      this.parts.push({
        kind: 'circle',
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: Phaser.Math.FloatBetween(0.1, 0.18) * radius,
        fill: Colors.ROCK_DARK.DECIMAL,
      });
    }

    // Hitbox circle stays inside the lumps.
    const averageDistance = distances.reduce((sum, distance) => sum + distance, 0) / POINTS;
    this.hitShapes.push(new Phaser.Geom.Circle(0, 0, averageDistance * ObstacleAttrs.HITBOX.RATIO));
    this.redraw();
  }
}
