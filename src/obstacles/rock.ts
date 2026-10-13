import Phaser from 'phaser';
import { ObstacleArts, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class Rock extends BaseObstacle {
  constructor(scene: Phaser.Scene, y: number) {
    // Random boulder picture and size, placed anywhere it fits.
    const radius = Phaser.Math.Between(ObstacleAttrs.ROCK.RADIUS.MIN, ObstacleAttrs.ROCK.RADIUS.MAX);
    const x = BaseObstacle.freeX(scene, radius);
    super(scene, x, y, Phaser.Math.RND.pick(ObstacleArts.ROCKS), radius * 2);
  }
}
