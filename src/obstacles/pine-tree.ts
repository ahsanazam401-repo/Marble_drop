import Phaser from 'phaser';
import { ObstacleArts, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class PineTree extends BaseObstacle {
  constructor(scene: Phaser.Scene, y: number) {
    // Grows sideways out of a random screen edge; the picture faces right, so flip it on the right side.
    const length = Phaser.Math.Between(ObstacleAttrs.PINE_TREE.LENGTH.MIN, ObstacleAttrs.PINE_TREE.LENGTH.MAX);
    const fromLeft = Phaser.Math.RND.pick([true, false]);
    const screenWidth = Number(scene.game.config.width);
    const x = fromLeft ? length / 2 : screenWidth - length / 2;
    super(scene, x, y, Phaser.Math.RND.pick(ObstacleArts.PINE_TREES), length, !fromLeft);
  }
}
