import Phaser from 'phaser';
import { ObstacleArts, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class Stick extends BaseObstacle {
  constructor(scene: Phaser.Scene, y: number) {
    // Random branch picture and length, sometimes facing the other way.
    const length = Phaser.Math.Between(ObstacleAttrs.STICK.LENGTH.MIN, ObstacleAttrs.STICK.LENGTH.MAX);
    const x = BaseObstacle.freeX(scene, length / 2);
    super(scene, x, y, Phaser.Math.RND.pick(ObstacleArts.STICKS), length, Phaser.Math.RND.pick([true, false]));
  }
}
