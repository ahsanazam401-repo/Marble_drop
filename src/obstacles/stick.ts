import Phaser from 'phaser';
import { Colors, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class Stick extends BaseObstacle {
  public static randomLength(): number {
    return Phaser.Math.Between(ObstacleAttrs.STICK.LENGTH.MIN, ObstacleAttrs.STICK.LENGTH.MAX);
  }

  constructor(scene: Phaser.Scene, x: number, y: number, length: number) {
    super(scene, x, y);
    const thickness = Phaser.Math.Between(ObstacleAttrs.STICK.THICKNESS.MIN, ObstacleAttrs.STICK.THICKNESS.MAX);
    const half = length / 2;
    const t = thickness / 2;

    // Twig growing up from the branch.
    const twigLength = Phaser.Math.Between(ObstacleAttrs.STICK.TWIG_LENGTH.MIN, ObstacleAttrs.STICK.TWIG_LENGTH.MAX);
    const twigX = Phaser.Math.FloatBetween(-0.25, 0.25) * length;
    const twigSide = Phaser.Math.RND.sign();
    this.parts.push({
      kind: 'polygon',
      points: [
        { x: twigX - 8, y: -t + 4 },
        { x: twigX + twigSide * twigLength * 0.6, y: -t - twigLength },
        { x: twigX + twigSide * twigLength * 0.6 + 10, y: -t - twigLength + 6 },
        { x: twigX + 10, y: -t + 4 },
      ],
      fill: Colors.WOOD.DECIMAL,
      outline: Colors.WOOD_OUTLINE.DECIMAL,
    });
    this.halfHeight = t + twigLength;

    // Branch with a slightly uneven outline and tapered ends.
    const top: Phaser.Types.Math.Vector2Like[] = [];
    const bottom: Phaser.Types.Math.Vector2Like[] = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const x = -half + (length * i) / steps;
      const taper = i === 0 || i === steps ? 0.6 : 1;
      top.push({ x, y: -t * taper + Phaser.Math.FloatBetween(-3, 3) });
      bottom.push({ x, y: t * taper + Phaser.Math.FloatBetween(-3, 3) });
    }
    this.parts.push({
      kind: 'polygon',
      points: [...top, ...bottom.reverse()],
      fill: Colors.WOOD.DECIMAL,
      outline: Colors.WOOD_OUTLINE.DECIMAL,
    });

    // A couple of knots.
    [-0.3, 0.2].forEach((position) => {
      this.parts.push({
        kind: 'circle',
        x: position * length + Phaser.Math.FloatBetween(-15, 15),
        y: Phaser.Math.FloatBetween(-t / 3, t / 3),
        radius: t * 0.35,
        fill: Colors.WOOD_DARK.DECIMAL,
      });
    });

    // Hitbox covers the branch only; the small twig is forgiving.
    this.hitShapes.push(BaseObstacle.insetRectangle(-half, -t, length, thickness));
    this.redraw();
  }
}
