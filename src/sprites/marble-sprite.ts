import Phaser from 'phaser';
import { Colors, CrashAttrs, MarbleAttrs, Textures, WobbleAttrs } from '../config';
import { Tuning } from '../util/tuning';

export class MarbleSprite extends Phaser.GameObjects.Image {
  private targetX: number;
  private minX: number;
  private maxX: number;
  private dragPointerId: number | null = null;
  private lastPointerX = 0;
  private dropped = false;
  private crashed = false;
  private wobbleEnd = 0;

  constructor(scene: Phaser.Scene) {
    // Start centered, just above the top of the screen.
    const x = Number(scene.game.config.width) / 2;
    const art = Textures.HERO.FALLING;
    super(scene, x, -MarbleAttrs.RADIUS, art.NAME);

    // Size the picture so the ball matches the marble radius, with the ball centre as the origin.
    this.setScale(MarbleAttrs.RADIUS / (art.BALL.RADIUS * this.width));
    this.setOrigin(art.BALL.X, art.BALL.Y);
    this.targetX = x;

    // Keep the whole ball inside the screen edges.
    const edge = MarbleAttrs.RADIUS;
    this.minX = edge;
    this.maxX = Number(scene.game.config.width) - edge;

    this.initInput();
    this.dropIn();

    // Add marble to scene.
    this.scene.add.existing(this);
  }

  public update(delta: number): void {
    if (this.crashed) {
      return;
    }

    // Follow the target position smoothly, independent of frame rate (slower while wobbling).
    const weakness = this.wobbleWeakness();
    const smoothing = Tuning.values.smoothing + WobbleAttrs.EXTRA_DELAY * weakness;
    const follow = smoothing > 0 ? 1 - Math.exp(-delta / smoothing) : 1;
    this.x += (this.targetX - this.x) * follow;

    // Rock side to side while wobbling.
    const phase = (this.scene.time.now / WobbleAttrs.PERIOD) * Math.PI * 2;
    this.angle = Math.sin(phase) * WobbleAttrs.ANGLE * weakness;

    // After dropping in, stay at the tuned height.
    if (this.dropped) {
      this.y = this.restingY();
    }
  }

  public getHitbox(circle: Phaser.Geom.Circle): Phaser.Geom.Circle {
    // Hitbox is slightly smaller than the drawn marble.
    return circle.setTo(this.x, this.y, MarbleAttrs.RADIUS * MarbleAttrs.HITBOX_RATIO);
  }

  public wobble(direction: number): void {
    // Get knocked sideways (direction -1 = left, 1 = right) and start (or restart) a wobble with weaker steering.
    this.targetX = Phaser.Math.Clamp(this.targetX + direction * WobbleAttrs.DEFLECTION, this.minX, this.maxX);
    this.wobbleEnd = this.scene.time.now + WobbleAttrs.DURATION;
  }

  private wobbleWeakness(): number {
    // 1 = full wobble, easing to 0 (normal) over the second part of the wobble.
    const remaining = (this.wobbleEnd - this.scene.time.now) / WobbleAttrs.DURATION;
    if (remaining <= 0) {
      return 0;
    }
    return Math.min(1, remaining / (1 - WobbleAttrs.FULL_PART));
  }

  public crash(): void {
    // Stop steering and play the crash: squash, dizzy stars, then tumble away.
    this.crashed = true;
    this.scene.tweens.killTweensOf(this);

    this.scene.tweens.add({
      targets: this,
      scaleX: this.scaleX * CrashAttrs.SQUASH.SCALE_X,
      scaleY: this.scaleY * CrashAttrs.SQUASH.SCALE_Y,
      duration: CrashAttrs.SQUASH.DURATION,
      yoyo: true,
    });

    const stars = Array.from({ length: CrashAttrs.STARS.COUNT }, () =>
      this.scene.add
        .star(this.x, this.y, 5, CrashAttrs.STARS.SIZE / 2, CrashAttrs.STARS.SIZE, Colors.YELLOW.DECIMAL)
        .setStrokeStyle(4, Colors.BLACK.DECIMAL),
    );
    const orbit = { angle: 0 };
    this.scene.tweens.add({
      targets: orbit,
      angle: Math.PI * 2,
      duration: CrashAttrs.STARS.SPIN,
      repeat: -1,
      onUpdate: () => {
        stars.forEach((star, i) => {
          const angle = orbit.angle + (i * Math.PI * 2) / stars.length;
          star.setPosition(
            this.x + Math.cos(angle) * CrashAttrs.STARS.ORBIT,
            this.y - MarbleAttrs.RADIUS + Math.sin(angle) * CrashAttrs.STARS.ORBIT * 0.4,
          );
          star.setAlpha(this.alpha);
        });
      },
    });

    this.scene.tweens.add({
      targets: this,
      y: this.y + CrashAttrs.TUMBLE.DISTANCE,
      angle: CrashAttrs.TUMBLE.ANGLE,
      alpha: 0,
      delay: CrashAttrs.TUMBLE.DELAY,
      duration: CrashAttrs.TUMBLE.DURATION,
      ease: 'Quad.easeIn',
    });
  }

  private restingY(): number {
    return (Number(this.scene.game.config.height) * Tuning.values.marbleHeight) / 100;
  }

  private dropIn(): void {
    // Drop in from the top and come to rest at the tuned height.
    this.scene.tweens.add({
      targets: this,
      y: this.restingY(),
      duration: MarbleAttrs.DROP.DURATION,
      ease: MarbleAttrs.DROP.EASE,
      onComplete: () => {
        this.dropped = true;
      },
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
      const steering = 1 - (1 - WobbleAttrs.STEERING) * this.wobbleWeakness();
      this.targetX = Phaser.Math.Clamp(
        this.targetX + deltaX * Tuning.values.sensitivity * steering,
        this.minX,
        this.maxX,
      );
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
