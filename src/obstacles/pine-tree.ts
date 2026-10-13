import Phaser from 'phaser';
import { Colors, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class PineTree extends BaseObstacle {
  public static randomLength(): number {
    return Phaser.Math.Between(ObstacleAttrs.PINE_TREE.LENGTH.MIN, ObstacleAttrs.PINE_TREE.LENGTH.MAX);
  }

  // Grows sideways out of the left (direction 1) or right (direction -1) screen edge at x.
  constructor(scene: Phaser.Scene, x: number, y: number, length: number, direction: 1 | -1) {
    super(scene, x, y);
    const height = Phaser.Math.Between(ObstacleAttrs.PINE_TREE.HEIGHT.MIN, ObstacleAttrs.PINE_TREE.HEIGHT.MAX);
    const trunk = ObstacleAttrs.PINE_TREE.TRUNK;
    this.halfHeight = height / 2;
    const at = (distance: number, offset: number) => ({ x: distance * direction, y: offset });

    // Trunk coming out of the cliff.
    const trunkPoints = [
      at(0, -trunk.THICKNESS / 2),
      at(trunk.LENGTH + 20, -trunk.THICKNESS / 2),
      at(trunk.LENGTH + 20, trunk.THICKNESS / 2),
      at(0, trunk.THICKNESS / 2),
    ];
    this.parts.push({
      kind: 'polygon',
      points: trunkPoints,
      fill: Colors.WOOD.DECIMAL,
      outline: Colors.WOOD_OUTLINE.DECIMAL,
    });
    const trunkLeft = direction === 1 ? 0 : -(trunk.LENGTH + 20);
    this.hitShapes.push(
      BaseObstacle.insetRectangle(trunkLeft, -trunk.THICKNESS / 2, trunk.LENGTH + 20, trunk.THICKNESS),
    );

    // Three layers of branches, each pointing away from the cliff.
    const foliage = length - trunk.LENGTH;
    const layers = [
      { start: 0, end: 0.55, size: 1 },
      { start: 0.3, end: 0.8, size: 0.8 },
      { start: 0.55, end: 1, size: 0.6 },
    ];
    layers.forEach((layer) => {
      const baseDistance = trunk.LENGTH + foliage * layer.start;
      const half = (height / 2) * layer.size;
      const a = at(baseDistance, -half);
      const b = at(baseDistance, half);
      const tip = at(trunk.LENGTH + foliage * layer.end, 0);
      this.parts.push({
        kind: 'polygon',
        points: [a, tip, b],
        fill: Colors.PINE.DECIMAL,
        outline: Colors.PINE_OUTLINE.DECIMAL,
      });
      this.hitShapes.push(BaseObstacle.shrinkTriangle(a, b, tip, ObstacleAttrs.HITBOX.RATIO));
    });

    this.redraw();
  }
}
