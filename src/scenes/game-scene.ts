import Phaser from 'phaser';
import { Scenes } from '../config';
import { MarbleSprite } from '../sprites';

export class GameScene extends Phaser.Scene {
  private marble: MarbleSprite;

  constructor() {
    super(Scenes.GAME);
  }

  public create(): void {
    // Start game.
    this.startGame();
  }

  public update(_time: number, delta: number): void {
    if (this.marble) {
      // Update marble.
      this.marble.update(delta);
    }
  }

  private startGame(): void {
    // Add marble.
    this.marble = new MarbleSprite(this);
  }
}
