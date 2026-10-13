import Phaser from 'phaser';
import { Colors, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class IceSpikes extends BaseObstacle {
  public static randomSpikes(): { width: number; height: number }[] {
    const count = Phaser.Math.Between(ObstacleAttrs.ICE_SPIKES.COUNT.MIN, ObstacleAttrs.ICE_SPIKES.COUNT.MAX);
    return Array.from({ length: count }, () => ({
      width: Phaser.Math.Between(ObstacleAttrs.ICE_SPIKES.WIDTH.MIN, ObstacleAttrs.ICE_SPIKES.WIDTH.MAX),
      height: Phaser.Math.Between(ObstacleAttrs.ICE_SPIKES.HEIGHT.MIN, ObstacleAttrs.ICE_SPIKES.HEIGHT.MAX),
    }));
  }

  public static totalWidth(spikes: { width: number }[]): number {
    return spikes.reduce((sum, spike) => sum + spike.width, 0);
  }

  constructor(scene: Phaser.Scene, x: number, y: number, spikes: { width: number; height: number }[]) {
    super(scene, x, y);
    const width = IceSpikes.totalWidth(spikes);
    const maxHeight = Math.max(...spikes.map((spike) => spike.height));
    const base = ObstacleAttrs.ICE_SPIKES.BASE;

    // Centre the group: spikes point up towards the falling marble.
    const baseY = (maxHeight + base) / 2 - base;
    this.halfHeight = (maxHeight + base) / 2;
    let left = -width / 2;

    spikes.forEach((spike) => {
      const a = { x: left, y: baseY };
      const b = { x: left + spike.width, y: baseY };
      const tip = { x: left + spike.width / 2, y: baseY - spike.height };
      this.parts.push({
        kind: 'polygon',
        points: [a, b, tip],
        fill: Colors.ICE.DECIMAL,
        outline: Colors.ICE_OUTLINE.DECIMAL,
      });

      // Shine on the left face.
      this.parts.push({
        kind: 'polygon',
        points: [
          { x: left + spike.width * 0.2, y: baseY - 6 },
          { x: left + spike.width * 0.4, y: baseY - 6 },
          { x: tip.x - 2, y: tip.y + spike.height * 0.25 },
        ],
        fill: Colors.WHITE.DECIMAL,
      });

      this.hitShapes.push(BaseObstacle.shrinkTriangle(a, b, tip, ObstacleAttrs.HITBOX.SPIKE_RATIO));
      left += spike.width;
    });

    // Icy base joining the spikes.
    const baseRect = { x: -width / 2, y: baseY, w: width, h: base };
    this.parts.push({
      kind: 'polygon',
      points: [
        { x: baseRect.x, y: baseRect.y },
        { x: baseRect.x + baseRect.w, y: baseRect.y },
        { x: baseRect.x + baseRect.w, y: baseRect.y + baseRect.h },
        { x: baseRect.x, y: baseRect.y + baseRect.h },
      ],
      fill: Colors.ICE.DECIMAL,
      outline: Colors.ICE_OUTLINE.DECIMAL,
    });
    this.hitShapes.push(BaseObstacle.insetRectangle(baseRect.x, baseRect.y - 4, baseRect.w, baseRect.h + 8));

    this.redraw();
  }
}
