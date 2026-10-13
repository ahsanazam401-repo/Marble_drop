import Phaser from 'phaser';
import { ObstacleArts, ObstacleAttrs } from '../config';
import { BaseObstacle } from './base-obstacle';

export class IceSpikes extends BaseObstacle {
  constructor(scene: Phaser.Scene, y: number) {
    // Random spike picture and height, pointing up at the falling marble.
    const art = Phaser.Math.RND.pick(ObstacleArts.ICE_SPIKES);
    const height = Phaser.Math.Between(ObstacleAttrs.ICE_SPIKES.HEIGHT.MIN, ObstacleAttrs.ICE_SPIKES.HEIGHT.MAX);
    const source = scene.textures.get(art.NAME).getSourceImage();
    const width = (height * source.width) / source.height;
    super(scene, BaseObstacle.freeX(scene, width / 2), y, art, width);
  }

  // Sharp tips are extra forgiving.
  protected triangleRatio(): number {
    return ObstacleAttrs.HITBOX.SPIKE_RATIO;
  }
}
