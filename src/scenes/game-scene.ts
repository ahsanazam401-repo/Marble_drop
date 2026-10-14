import Phaser from 'phaser';
import { Colors, CrashAttrs, FallAttrs, Font, FontSizes, GameStates, ObstacleAttrs, Registry, Scenes } from '../config';
import { BaseObstacle, IceSpikes, PineTree, Rock, Snowball, Stick } from '../obstacles';
import { MarbleSprite } from '../sprites';
import { Tuning } from '../util/tuning';

export class GameScene extends Phaser.Scene {
  private marble: MarbleSprite;
  private obstacles: BaseObstacle[];
  private distance: number;
  private nextObstacleAt: number;
  private crashed: boolean;
  private marbleHitbox = new Phaser.Geom.Circle();
  private hitObstacles = new WeakSet<BaseObstacle>();

  constructor() {
    super(Scenes.GAME);
  }

  public create(): void {
    // Start game.
    this.startGame();
  }

  public update(_time: number, delta: number): void {
    // The world stops while the crash plays.
    if (!this.marble || this.crashed) {
      return;
    }

    // Update marble.
    this.marble.update(delta);

    // Fall: the world scrolls upward past the marble.
    const scroll = (Tuning.values.fallSpeed * delta) / 1000;
    this.distance += scroll;

    // Update depth in whole metres.
    const depth = Math.floor(this.distance / FallAttrs.PIXELS_PER_METRE);
    if (depth !== this.registry.get(Registry.DEPTH)) {
      this.registry.set(Registry.DEPTH, depth);
    }

    // Add new obstacles below the screen.
    while (this.distance >= this.nextObstacleAt) {
      this.addObstacle();
      this.nextObstacleAt += ObstacleAttrs.SPACING;
    }

    // Move obstacles and check for hits.
    this.updateObstacles(scroll, delta);
  }

  private startGame(): void {
    // Reset run.
    this.obstacles = [];
    this.distance = 0;
    this.nextObstacleAt = ObstacleAttrs.START_DISTANCE;
    this.crashed = false;
    this.registry.set(Registry.DEPTH, 0);
    this.registry.set(Registry.HITS, 0);

    // Add marble above the obstacles.
    this.marble = new MarbleSprite(this);
    this.marble.setDepth(1);
  }

  private addObstacle(): void {
    // Sometimes send a rising snowball instead (not in the first part of a run).
    const { SNOWBALL } = ObstacleAttrs;
    if (this.distance >= SNOWBALL.MIN_DISTANCE && Math.random() < SNOWBALL.CHANCE) {
      this.warnSnowball();
      return;
    }

    // Add a random mountain obstacle below the screen. Each one leaves room for the marble to pass.
    const y = Number(this.game.config.height) + ObstacleAttrs.OFFSCREEN;
    const Type = Phaser.Math.RND.pick([Rock, Stick, IceSpikes, PineTree]);
    const obstacle = new Type(this, y);

    // Start fully below the screen.
    obstacle.y += obstacle.halfHeight;
    this.obstacles.push(obstacle);
  }

  private warnSnowball(): void {
    // Show a blinking warning where the snowball will come from, then launch it.
    const { WARNING } = ObstacleAttrs.SNOWBALL;
    const radius = Snowball.randomRadius();
    const x = BaseObstacle.freeX(this, Snowball.swirlMargin(radius));
    const height = Number(this.game.config.height);

    const sign = this.add.container(x, height - WARNING.Y, [
      this.add.circle(0, 0, WARNING.RADIUS, Colors.RED.DECIMAL).setStrokeStyle(6, Colors.WHITE.DECIMAL),
      this.add.text(0, 0, '!', { ...Font(FontSizes.LARGE), color: Colors.WHITE.HEX }).setOrigin(0.5),
    ]);
    this.tweens.add({ targets: sign, alpha: 0.3, duration: WARNING.BLINK, yoyo: true, repeat: -1 });

    this.time.delayedCall(WARNING.TIME, () => {
      sign.destroy();
      if (this.crashed) {
        return;
      }
      const snowball = new Snowball(this, x, height + ObstacleAttrs.OFFSCREEN, radius);
      snowball.y += snowball.halfHeight;
      this.obstacles.push(snowball);
    });
  }

  private updateObstacles(scroll: number, delta: number): void {
    const marbleHitbox = this.marble.getHitbox(this.marbleHitbox);

    this.obstacles = this.obstacles.filter((obstacle) => {
      // Forget obstacles that finished being knocked away.
      if (!obstacle.active) {
        return false;
      }
      obstacle.move({ scroll, delta });

      // Remove obstacles that left the top of the screen.
      if (obstacle.y < -obstacle.halfHeight - ObstacleAttrs.OFFSCREEN) {
        obstacle.destroy();
        return false;
      }

      if (obstacle.knocked || this.crashed) {
        return true;
      }

      const touching = obstacle.hits(marbleHitbox);
      if (touching && obstacle.slows) {
        // Slowing obstacle: marble and obstacle bounce apart, and the marble wobbles.
        const away = Math.sign(this.marble.x - obstacle.x) || Phaser.Math.RND.sign();
        this.marble.wobble(away);
        obstacle.knockAway(-away);
        if (Tuning.practice) {
          this.registry.inc(Registry.HITS, 1);
        }
      } else if (touching && !Tuning.practice) {
        // A hit ends the run.
        this.crash();
      } else {
        // Practice mode: turn red and count each obstacle once.
        obstacle.setTouching(touching);
        if (touching && !this.hitObstacles.has(obstacle)) {
          this.hitObstacles.add(obstacle);
          this.registry.inc(Registry.HITS, 1);
        }
      }

      return true;
    });
  }

  private crash(): void {
    // Flash, shake and crash the marble, then show game over.
    this.crashed = true;
    this.registry.set(Registry.GAME_STATE, GameStates.CRASHING);
    this.cameras.main.flash(CrashAttrs.FLASH);
    this.cameras.main.shake(CrashAttrs.SHAKE.DURATION, CrashAttrs.SHAKE.INTENSITY);
    this.marble.crash();
    this.time.delayedCall(CrashAttrs.DURATION, () => {
      this.registry.set(Registry.GAME_STATE, GameStates.GAME_OVER);
    });
  }
}
