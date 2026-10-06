import Phaser from 'phaser';
import { Colors, MarbleAttrs } from '../config';

export class MarbleSprite extends Phaser.GameObjects.Arc {
  private targetX: number;
  private minX: number;
  private maxX: number;
  private dragPointerId: number | null = null;
  private lastPointerX = 0;

  constructor(scene: Phaser.Scene) {
    // Start centered, just above the top of the screen.
    const x = Number(scene.game.config.width) / 2;
    super(scene, x, -MarbleAttrs.RADIUS, MarbleAttrs.RADIUS, 0, 360, false, Colors.ORANGE.DECIMAL);

    // Initialize marble.
    this.setStrokeStyle(MarbleAttrs.STROKE, Colors.BLACK.DECIMAL);
    this.targetX = x;

    // Keep the whole marble inside the screen edges.
    const edge = MarbleAttrs.RADIUS + MarbleAttrs.STROKE / 2;
    this.minX = edge;
    this.maxX = Number(scene.game.config.width) - edge;

    this.initInput();
    this.dropIn();

    // Add marble to scene.
    this.scene.add.existing(this);
  }

  public update(delta: number): void {
    // Follow the target position smoothly, independent of frame rate.
    const follow = 1 - Math.exp(-delta / MarbleAttrs.DRAG.SMOOTHING);
    this.x += (this.targetX - this.x) * follow;
  }

  private dropIn(): void {
    // Drop in from the top and come to rest one third down the screen.
    this.scene.tweens.add({
      targets: this,
      y: Number(this.scene.game.config.height) * MarbleAttrs.Y_RATIO,
      duration: MarbleAttrs.DROP.DURATION,
      ease: MarbleAttrs.DROP.EASE,
    });
  }

  private initInput(): void {
    const input = this.scene.input;

    // Relative drag: only the first finger down steers, from anywhere on the screen.
    const onDown = (pointer: Phaser.Input.Pointer) => {
      if (this.dragPointerId === null) {
        this.dragPointerId = pointer.id;
        this.lastPointerX = pointer.x;
      }
    };

    // Move the target by the same horizontal distance the finger moved.
    const onMove = (pointer: Phaser.Input.Pointer) => {
      if (pointer.id !== this.dragPointerId) {
        return;
      }
      const deltaX = pointer.x - this.lastPointerX;
      this.lastPointerX = pointer.x;
      this.targetX = Phaser.Math.Clamp(this.targetX + deltaX * MarbleAttrs.DRAG.SENSITIVITY, this.minX, this.maxX);
    };

    // Lifting the finger leaves the marble where it is.
    const onUp = (pointer: Phaser.Input.Pointer) => {
      if (pointer.id === this.dragPointerId) {
        this.dragPointerId = null;
      }
    };

    input.on(Phaser.Input.Events.POINTER_DOWN, onDown);
    input.on(Phaser.Input.Events.POINTER_MOVE, onMove);
    input.on(Phaser.Input.Events.POINTER_UP, onUp);
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, onUp);

    // Remove input handlers when the game scene stops.
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      input.off(Phaser.Input.Events.POINTER_DOWN, onDown);
      input.off(Phaser.Input.Events.POINTER_MOVE, onMove);
      input.off(Phaser.Input.Events.POINTER_UP, onUp);
      input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, onUp);
    });
  }
}
