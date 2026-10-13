import Phaser from 'phaser';
import { Colors, MountainAttrs } from '../config';

interface MountainLayerConfig {
  color: number;
  width: { MIN: number; MAX: number };
  speedFactor: number;
}

// Jagged mountain walls on both screen edges, built from pieces that loop from top to bottom.
export class MountainWalls {
  private scene: Phaser.Scene;
  private config: MountainLayerConfig;
  private chunks: Phaser.GameObjects.Graphics[] = [];
  private lastLeft: number;
  private lastRight: number;

  constructor(scene: Phaser.Scene, config: MountainLayerConfig) {
    this.scene = scene;
    this.config = config;
    this.lastLeft = this.randomWidth();
    this.lastRight = this.randomWidth();

    // Stack enough pieces to cover the screen, plus one spare below.
    const count = Math.ceil(Number(scene.game.config.height) / MountainAttrs.CHUNK_HEIGHT) + 1;
    for (let i = 0; i < count; i++) {
      const chunk = scene.add.graphics({ x: 0, y: i * MountainAttrs.CHUNK_HEIGHT });
      this.drawChunk(chunk);
      this.chunks.push(chunk);
    }
  }

  public update(distance: number): void {
    // Scroll up; move pieces that left the top to the bottom with new jagged edges.
    this.chunks.forEach((chunk) => {
      chunk.y -= distance * this.config.speedFactor;
    });
    const top = this.chunks[0];
    if (top.y + MountainAttrs.CHUNK_HEIGHT < 0) {
      this.chunks.shift();
      top.y = this.chunks[this.chunks.length - 1].y + MountainAttrs.CHUNK_HEIGHT;
      this.drawChunk(top);
      this.chunks.push(top);
    }
  }

  private randomWidth(): number {
    return Phaser.Math.Between(this.config.width.MIN, this.config.width.MAX);
  }

  private drawChunk(chunk: Phaser.GameObjects.Graphics): void {
    const screenWidth = Number(this.scene.game.config.width);
    const height = MountainAttrs.CHUNK_HEIGHT;
    const steps = height / MountainAttrs.STEP;

    // Edge widths, continuing from where the previous piece ended.
    const left = [this.lastLeft];
    const right = [this.lastRight];
    for (let i = 1; i <= steps; i++) {
      left.push(this.randomWidth());
      right.push(this.randomWidth());
    }
    this.lastLeft = left[steps];
    this.lastRight = right[steps];

    chunk.clear();
    chunk.fillStyle(this.config.color);

    // Overlap pieces slightly so no seam shows between them.
    // Plain x/y points are all fillPoints needs.
    const fill = (points: Phaser.Types.Math.Vector2Like[]) => chunk.fillPoints(points as Phaser.Math.Vector2[], true);
    const y = (i: number) => (i === steps ? height + 2 : i * MountainAttrs.STEP);
    fill([{ x: 0, y: 0 }, ...left.map((w, i) => ({ x: w, y: y(i) })), { x: 0, y: height + 2 }]);
    fill([
      { x: screenWidth, y: 0 },
      ...right.map((w, i) => ({ x: screenWidth - w, y: y(i) })),
      { x: screenWidth, y: height + 2 },
    ]);

    // Snow on the points that stick out furthest.
    chunk.fillStyle(Colors.WHITE.DECIMAL);
    const snow = MountainAttrs.SNOW;
    for (let i = 1; i < steps; i++) {
      if (left[i] > left[i - 1] && left[i] > left[i + 1]) {
        chunk.fillTriangle(
          left[i],
          y(i),
          left[i] - snow.WIDTH,
          y(i) - snow.HEIGHT,
          left[i] - snow.WIDTH,
          y(i) + snow.HEIGHT,
        );
      }
      if (right[i] > right[i - 1] && right[i] > right[i + 1]) {
        const x = screenWidth - right[i];
        chunk.fillTriangle(x, y(i), x + snow.WIDTH, y(i) - snow.HEIGHT, x + snow.WIDTH, y(i) + snow.HEIGHT);
      }
    }
  }
}
