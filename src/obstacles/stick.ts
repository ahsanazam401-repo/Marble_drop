import Phaser from 'phaser';
import { ObstacleArts, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class Stick extends BaseObstacle {
  constructor(scene: Phaser.Scene, y: number) {
    // Random branch picture and length, sometimes facing the other way, stretched thicker.
    const { LENGTH, THICKNESS_SCALE } = ObstacleAttrs.STICK;
    const length = Phaser.Math.Between(LENGTH.MIN, LENGTH.MAX);
    const x = BaseObstacle.freeX(scene, length / 2);
    const flipX = Phaser.Math.RND.pick([true, false]);
    super(scene, x, y, Phaser.Math.RND.pick(ObstacleArts.STICKS), length, flipX, THICKNESS_SCALE);

    // Sticks only make the marble wobble.
    this.slows = true;
  }
}
