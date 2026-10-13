import Phaser from 'phaser';
import { CrashAttrs, FallAttrs, GameStates, ObstacleAttrs, Registry, Scenes } from '../config';
import { BaseObstacle, IceSpikes, PineTree, Rock, Stick } from '../obstacles';
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
    this.updateObstacles(scroll);
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
    // Pick a random mountain obstacle. Each one leaves room for the marble to pass.
    const width = Number(this.game.config.width);
    const y = Number(this.game.config.height) + ObstacleAttrs.OFFSCREEN;
    const freeX = (halfWidth: number) =>
      Phaser.Math.Between(halfWidth + ObstacleAttrs.EDGE_MARGIN, width - halfWidth - ObstacleAttrs.EDGE_MARGIN);

    let obstacle: BaseObstacle;
    switch (Phaser.Math.Between(0, 3)) {
      case 0: {
        const radius = Rock.randomRadius();
        obstacle = new Rock(this, freeX(radius), y, radius);
        break;
      }
      case 1: {
        const length = Stick.randomLength();
        obstacle = new Stick(this, freeX(length / 2), y, length);
        break;
      }
      case 2: {
        const spikes = IceSpikes.randomSpikes();
        obstacle = new IceSpikes(this, freeX(IceSpikes.totalWidth(spikes) / 2), y, spikes);
        break;
      }
      default: {
        const fromLeft = Phaser.Math.RND.pick([true, false]);
        obstacle = new PineTree(this, fromLeft ? 0 : width, y, PineTree.randomLength(), fromLeft ? 1 : -1);
        break;
      }
    }

    // Start fully below the screen.
    obstacle.y += obstacle.halfHeight;
    this.obstacles.push(obstacle);
  }

  private updateObstacles(scroll: number): void {
    const marbleHitbox = this.marble.getHitbox(this.marbleHitbox);

    this.obstacles = this.obstacles.filter((obstacle) => {
      obstacle.y -= scroll;

      // Remove obstacles that left the top of the screen.
      if (obstacle.y < -obstacle.halfHeight - ObstacleAttrs.OFFSCREEN) {
        obstacle.destroy();
        return false;
      }

      const touching = obstacle.hits(marbleHitbox);
      if (touching && !Tuning.practice && !this.crashed) {
        // A hit ends the run.
        this.crash();
      } else if (!this.crashed) {
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
