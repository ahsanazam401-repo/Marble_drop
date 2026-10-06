import Phaser from 'phaser';
import { BackgroundScene, GameScene, HudScene, SceneHandler } from '../scenes';
import { Colors } from './colors';
import { Debug } from './debug';

export const Config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  dom: {
    createContainer: true,
  },
  width: 1080,
  height: 1920,
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  backgroundColor: Colors.LIGHT_BLUE.HEX,
  pixelArt: true,
  roundPixels: true,
  render: {
    antialias: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: Debug.physics,
      gravity: {
        x: 0,
        y: 0,
      },
    },
  },
  scene: [SceneHandler, BackgroundScene, HudScene, GameScene],
};
