import Phaser from 'phaser';
import { Colors, KnockAttrs, ObstacleArt, ObstacleAttrs } from '../config';

type HitShape = Phaser.Geom.Circle | Phaser.Geom.Rectangle | Phaser.Geom.Triangle;

export abstract class BaseObstacle extends Phaser.GameObjects.Image {
  // Half of the drawn height, used to spawn and remove obstacles off screen.
  public halfHeight: number;
  // Slowing obstacles make the marble wobble instead of crashing.
  public slows = false;
  // Set once knocked away; it no longer collides.
  public knocked = false;
  private hitShapes: HitShape[] = [];
  private localCircle = new Phaser.Geom.Circle();

  // Shows the art at the given width (heightScale stretches it taller); flipX mirrors it and its hitbox.
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    art: ObstacleArt,
    width: number,
    flipX = false,
    heightScale = 1,
  ) {
    super(scene, x, y, art.NAME);
    const scale = width / this.width;
    this.setScale(scale, scale * heightScale);
    this.setFlipX(flipX);
    this.halfHeight = this.displayHeight / 2;
    this.buildHitShapes(art, flipX);
    scene.add.existing(this);
  }

  public static freeX(scene: Phaser.Scene, halfWidth: number): number {
    // Random x for a free-floating obstacle, keeping it inside the screen edges.
    const margin = halfWidth + ObstacleAttrs.EDGE_MARGIN;
    return Phaser.Math.Between(margin, Number(scene.game.config.width) - margin);
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

  public knockAway(direction: number): void {
    // Snap out of the way: spin off to the side and fade, then disappear.
    this.knocked = true;
    this.scene.tweens.add({
      targets: this,
      x: this.x + direction * KnockAttrs.DISTANCE,
      angle: direction * KnockAttrs.ANGLE,
      alpha: 0,
      duration: KnockAttrs.DURATION,
      ease: 'Quad.easeOut',
      onComplete: () => this.destroy(),
    });
  }

  public setTouching(touching: boolean): void {
    // Highlight red while touched (practice mode).
    if (touching) {
      this.setTint(Colors.RED.DECIMAL);
    } else {
      this.clearTint();
    }
  }

  // Hitboxes are smaller than the drawing so near misses feel fair.
  protected triangleRatio(): number {
    return ObstacleAttrs.HITBOX.RATIO;
  }

  private buildHitShapes(art: ObstacleArt, flipX: boolean): void {
    // Convert image fractions to positions relative to the obstacle centre.
    const w = this.displayWidth;
    const h = this.displayHeight;
    const px = (fx: number) => (fx - 0.5) * w * (flipX ? -1 : 1);
    const py = (fy: number) => (fy - 0.5) * h;

    art.HIT.forEach(({ circle, rect, triangle }) => {
      if (circle) {
        const [cx, cy, radius] = circle;
        this.hitShapes.push(new Phaser.Geom.Circle(px(cx), py(cy), radius * w * ObstacleAttrs.HITBOX.RATIO));
      }
      if (rect) {
        const [x, y, rw, rh] = rect;
        const inset = ObstacleAttrs.HITBOX.INSET;
        const left = Math.min(px(x), px(x + rw));
        this.hitShapes.push(
          new Phaser.Geom.Rectangle(left + inset, py(y) + inset, rw * w - inset * 2, Math.max(rh * h - inset * 2, 1)),
        );
      }
      if (triangle) {
        const points = [0, 2, 4].map((i) => ({ x: px(triangle[i]), y: py(triangle[i + 1]) }));
        this.hitShapes.push(BaseObstacle.shrinkTriangle(points, this.triangleRatio()));
      }
    });
  }

  private static shrinkTriangle(points: { x: number; y: number }[], ratio: number): Phaser.Geom.Triangle {
    // Shrink a triangle towards its centre.
    const cx = (points[0].x + points[1].x + points[2].x) / 3;
    const cy = (points[0].y + points[1].y + points[2].y) / 3;
    const [a, b, c] = points.map((p) => [cx + (p.x - cx) * ratio, cy + (p.y - cy) * ratio]);
    return new Phaser.Geom.Triangle(a[0], a[1], b[0], b[1], c[0], c[1]);
  }
}
