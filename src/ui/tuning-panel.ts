import Phaser from 'phaser';
import { HudAttrs, TuningAttrs } from '../config';
import { TuningValues } from '../interfaces';
import { Tuning } from '../util/tuning';

// Sizes are in game pixels; the DOM container scales them with the game.
const STYLES = `
.tuning-button {
  font: bold 40px sans-serif;
  padding: 20px 32px;
  border: 5px solid #000;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
  color: #000;
}
.tuning-panel {
  width: 1000px;
  box-sizing: border-box;
  padding: 32px 40px;
  border: 5px solid #000;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  color: #000;
  font: 34px sans-serif;
  touch-action: none;
}
.tuning-label {
  display: flex;
  justify-content: space-between;
}
.tuning-value {
  font-weight: bold;
}
.tuning-panel input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 24px;
  margin: 36px 0 44px;
  border-radius: 12px;
  background: #90a4ae;
}
.tuning-panel input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 72px;
  height: 72px;
  border: 5px solid #000;
  border-radius: 50%;
  background: #1976d2;
}
.tuning-panel input[type='range']::-moz-range-thumb {
  width: 72px;
  height: 72px;
  border: 5px solid #000;
  border-radius: 50%;
  background: #1976d2;
}
.tuning-actions {
  display: flex;
  justify-content: space-between;
}
`;

// Touches on the panel must not also steer the marble.
const STOPPED_EVENTS = ['mousedown', 'touchstart', 'pointerdown'];

export class TuningPanel {
  private scene: Phaser.Scene;
  private button: Phaser.GameObjects.DOMElement;
  private panel: Phaser.GameObjects.DOMElement;
  private rows = new Map<keyof TuningValues, { input: HTMLInputElement; value: HTMLElement }>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.addStyles();
    this.addButton();
    this.addPanel();
  }

  public setVisible(visible: boolean): void {
    // Show the tune button during play; always start with the panel closed.
    this.button.setVisible(visible);
    this.panel.setVisible(false);
  }

  private addStyles(): void {
    // Add panel styles once.
    if (!document.getElementById('tuning-styles')) {
      const style = document.createElement('style');
      style.id = 'tuning-styles';
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  }

  private addButton(): void {
    // Add tune button below the FPS counter.
    const button = this.createButton('TUNE', () => {
      this.refresh();
      this.panel.setVisible(!this.panel.visible);
    });
    this.button = this.scene.add
      .dom(Number(this.scene.game.config.width) + HudAttrs.TUNE_BUTTON.X, HudAttrs.TUNE_BUTTON.Y, button)
      .setOrigin(1, 0);
  }

  private addPanel(): void {
    const panel = document.createElement('div');
    panel.className = 'tuning-panel';
    STOPPED_EVENTS.forEach((type) => panel.addEventListener(type, (event) => event.stopPropagation()));

    // Add one slider per tuning value.
    TuningAttrs.SLIDERS.forEach((slider) => {
      const label = document.createElement('div');
      label.className = 'tuning-label';
      const name = document.createElement('span');
      name.textContent = slider.LABEL;
      const value = document.createElement('span');
      value.className = 'tuning-value';
      label.append(name, value);

      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(slider.MIN);
      input.max = String(slider.MAX);
      input.step = String(slider.STEP);

      // Apply while dragging; save when released.
      input.addEventListener('input', () => {
        Tuning.set(slider.KEY, Number(input.value));
        this.refresh();
      });
      input.addEventListener('change', () => Tuning.save(this.scene.registry));

      panel.append(label, input);
      this.rows.set(slider.KEY, { input, value });
    });

    // Add reset and close buttons.
    const actions = document.createElement('div');
    actions.className = 'tuning-actions';
    actions.append(
      this.createButton('Reset', () => {
        Tuning.reset(this.scene.registry);
        this.refresh();
      }),
      this.createButton('Close', () => this.panel.setVisible(false)),
    );
    panel.append(actions);

    // Place panel at the bottom, leaving the middle of the screen free for steering.
    this.panel = this.scene.add
      .dom(
        Number(this.scene.game.config.width) / 2,
        Number(this.scene.game.config.height) + HudAttrs.TUNING_PANEL.Y,
        panel,
      )
      .setOrigin(0.5, 1)
      .setVisible(false);
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tuning-button';
    button.textContent = text;
    button.addEventListener('click', onClick);
    STOPPED_EVENTS.forEach((type) => button.addEventListener(type, (event) => event.stopPropagation()));
    return button;
  }

  private refresh(): void {
    // Show current values on the sliders and labels.
    TuningAttrs.SLIDERS.forEach((slider) => {
      const row = this.rows.get(slider.KEY);
      if (row) {
        const current = Tuning.values[slider.KEY];
        row.input.value = String(current);
        row.value.textContent = `${current.toFixed(slider.DECIMALS)}${slider.UNIT}`;
      }
    });
  }
}
