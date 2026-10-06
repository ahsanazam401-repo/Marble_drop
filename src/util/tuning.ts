import Phaser from 'phaser';
import { FallAttrs, MarbleAttrs, TuningAttrs } from '../config';
import { TuningValues } from '../interfaces';
import { Util } from './index';

// Built on first use, because config is still loading when this file is imported.
const getDefaults = (): TuningValues => ({
  fallSpeed: FallAttrs.SPEED,
  sensitivity: MarbleAttrs.DRAG.SENSITIVITY,
  smoothing: MarbleAttrs.DRAG.SMOOTHING,
  marbleHeight: Math.round(MarbleAttrs.Y_RATIO * 100),
});

export class Tuning {
  private static current: TuningValues | null = null;

  // Current values, read every frame by the game.
  public static get values(): TuningValues {
    if (!this.current) {
      this.current = getDefaults();
    }
    return this.current;
  }

  public static async load(registry: Phaser.Data.DataManager): Promise<void> {
    // Load saved values, ignoring anything missing or out of range.
    const stored = await Util.getStorage(TuningAttrs.STORAGE_KEY, registry);
    if (!stored) {
      return;
    }
    try {
      const saved = JSON.parse(stored) as Partial<TuningValues>;
      TuningAttrs.SLIDERS.forEach(({ KEY, MIN, MAX }) => {
        const value = saved[KEY];
        if (typeof value === 'number' && Number.isFinite(value)) {
          this.values[KEY] = Phaser.Math.Clamp(value, MIN, MAX);
        }
      });
    } catch {
      // Keep defaults if the saved data is unreadable.
    }
  }

  public static set(key: keyof TuningValues, value: number): void {
    // Apply a value immediately.
    this.values[key] = value;
  }

  public static save(registry: Phaser.Data.DataManager): void {
    // Save current values on the device.
    Util.updateStorage(TuningAttrs.STORAGE_KEY, JSON.stringify(this.values), registry);
  }

  public static reset(registry: Phaser.Data.DataManager): void {
    // Restore and save the starting values.
    this.current = getDefaults();
    this.save(registry);
  }
}
