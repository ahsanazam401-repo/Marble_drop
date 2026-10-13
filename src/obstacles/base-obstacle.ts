import Phaser from 'phaser';
import { Colors, ObstacleAttrs } from '../config';

type Point = Phaser.Types.Math.Vector2Like;

// A drawn piece of an obstacle, in local coordinates.
type Part =
  | { kind: 'circle'; x: number; y: number; radius: number; fill: number; outline?: number }
  | { kind: 'polygon'; points: Point[]; fill: number; outline?: number };

type HitShape = Phaser.Geom.Circle | Phaser.Geom.Rectangle | Phaser.Geom.Triangle;

export abstract class BaseObstacle extends Phaser.GameObjects.Graphics {
  // Half of the drawn height, used to spawn and remove obstacles off screen.
  public halfHeight = 0;
  protected parts: Part[] = [];
  protected hitShapes: HitShape[] = [];
  private touching = false;
  private localCircle = new Phaser.Geom.Circle();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, { x, y });
    scene.add.existing(this);
  }

  public hits(circle: Phaser.Geom.Circle): boolean {
    // Check a world-space circle against the hitbox shapes.
    const local = this.localCircle.setTo(circle.x - this.x, circle.y - this.y, circle.radius);
    return this.hitShapes.some((shape) => {
      if (shape instanceof Phaser.Geom.Circle) {
        return Phaser.Geom.Intersects.CircleToCircle(local, shape);
      }
      if (shape instanceof Phaser.Geom.Rectangle) {
        return Phaser.Geom.Intersects.CircleToRectangle(local, shape);
      }
      return Phaser.Geom.Intersects.TriangleToCircle(shape, local);
    });
  }

  public setTouching(touching: boolean): void {
    // Highlight red while touched (practice mode).
    if (touching !== this.touching) {
      this.touching = touching;
      this.redraw();
    }
  }

  protected redraw(): void {
    this.clear();
    this.parts.forEach((part) => {
      this.fillStyle(this.touching ? Colors.RED.DECIMAL : part.fill);
      if (part.kind === 'circle') {
        this.fillCircle(part.x, part.y, part.radius);
      } else {
        this.fillPoints(part.points as Phaser.Math.Vector2[], true);
      }

      if (part.outline !== undefined) {
        this.lineStyle(ObstacleAttrs.OUTLINE, part.outline);
        if (part.kind === 'circle') {
          this.strokeCircle(part.x, part.y, part.radius);
        } else {
          this.strokePoints(part.points as Phaser.Math.Vector2[], true);
        }
      }
    });
  }

  protected static shrinkTriangle(a: Point, b: Point, c: Point, ratio: number): Phaser.Geom.Triangle {
    // Shrink a triangle towards its centre.
    const cx = (a.x + b.x + c.x) / 3;
    const cy = (a.y + b.y + c.y) / 3;
    const scale = (p: Point) => [cx + (p.x - cx) * ratio, cy + (p.y - cy) * ratio];
    return new Phaser.Geom.Triangle(...scale(a), ...scale(b), ...scale(c));
  }

  protected static insetRectangle(x: number, y: number, width: number, height: number): Phaser.Geom.Rectangle {
    // Rectangle hitbox, smaller than the drawing on every side.
    const inset = ObstacleAttrs.HITBOX.INSET;
    return new Phaser.Geom.Rectangle(x + inset, y + inset, width - inset * 2, height - inset * 2);
  }
}
