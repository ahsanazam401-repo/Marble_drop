import i18n, { __ } from 'i18n-for-browser';
import Phaser from 'phaser';
import {
  Colors,
  Debug,
  Font,
  FontSizes,
  Frames,
  GameStates,
  HudAttrs,
  Registry,
  Scenes,
  Sounds,
  Textures,
} from '../config';
import { TuningPanel } from '../ui/tuning-panel';
import { Util } from '../util';
import { Tuning } from '../util/tuning';

export class HudScene extends Phaser.Scene {
  private startGameContainer: Phaser.GameObjects.Container;
  private startGameText: Phaser.GameObjects.Text;
  private gameOverContainer: Phaser.GameObjects.Container;
  private escapeButton: Phaser.GameObjects.Image;
  private depthText: Phaser.GameObjects.Text;
  private hitsText: Phaser.GameObjects.Text;
  private tuningPanel: TuningPanel;
  private fpsText: Phaser.GameObjects.Text;
  private menuSelectSound: Phaser.Sound.BaseSound;

  constructor() {
    super(Scenes.HUD);
  }

  public create(): void {
    // Add start game container.
    this.addStartGameContainer();

    // Add escape button.
    this.addEscapeButton();

    // Add depth counter.
    this.addDepth();

    // Add hit counter.
    this.addHits();

    // Add tuning panel.
    this.tuningPanel = new TuningPanel(this);

    // Add FPS.
    this.addFps();

    // Toggle HUD elements.
    this.toggleElements();

    // Update text.
    this.updateText();

    // Initialize sounds.
    this.initSounds();

    // Initialize events.
    this.initEvents();
  }

  public update(): void {
    // Hit counter only matters in practice mode, where hits don't end the run.
    this.hitsText.setVisible(
      Debug.hitCounter && Tuning.practice && this.registry.get(Registry.GAME_STATE) === GameStates.STARTED,
    );

    if (Debug.fps && this.fpsText?.visible) {
      // Update FPS text.
      this.fpsText?.setText(`${__('FPS')}: ${Math.round(this.game.loop.actualFps)}`);
    }
  }

  private addDepth(): void {
    // Add depth counter at the top center.
    this.depthText = this.add
      .text(Number(this.game.config.width) / 2, HudAttrs.DEPTH.Y, '0 m', {
        ...Font(FontSizes.LARGE),
        color: Colors.WHITE.HEX,
        stroke: Colors.BLACK.HEX,
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5, 0);

    // Update depth counter when the depth changes.
    this.registry.events.on(`changedata-${Registry.DEPTH}`, (_parent: Phaser.Data.DataManager, depth: number) => {
      this.depthText.setText(`${depth} m`);
    });
  }

  private addHits(): void {
    // Add temporary hit counter under the depth counter.
    this.hitsText = this.add
      .text(Number(this.game.config.width) / 2, HudAttrs.HITS.Y, `${__('HITS')}: 0`, {
        ...Font(FontSizes.SMALL),
        color: Colors.WHITE.HEX,
        stroke: Colors.BLACK.HEX,
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5, 0);

    // Update hit counter when the count changes.
    const updateHits = (_parent: Phaser.Data.DataManager, hits: number) => {
      this.hitsText.setText(`${__('HITS')}: ${hits}`);
    };
    this.registry.events.on(`setdata-${Registry.HITS}`, updateHits);
    this.registry.events.on(`changedata-${Registry.HITS}`, updateHits);
  }

  private initSounds(): void {
    // Initialize sounds.
    this.menuSelectSound = this.sound.add(Sounds.MENU_SELECT.NAME);
  }

  private initEvents(): void {
    // Game state change handler
    this.registry.events.on(
      `changedata-${Registry.GAME_STATE}`,
      (parent: Phaser.Data.DataManager, gameState: string) => {
        switch (gameState) {
          case GameStates.STARTED:
          case GameStates.MENU:
            // Toggle HUD elements.
            this.toggleElements();
            break;
          case GameStates.GAME_OVER:
            // Toggle HUD elements.
            this.toggleElements();

            // Show game over container.
            this.addGameOverContainer();
            break;
          default:
            break;
        }
      },
    );
  }

  private toggleElements(): void {
    // Toggle HUD elements.
    const gameState = this.registry.get(Registry.GAME_STATE);
    this.startGameContainer.setVisible(gameState === GameStates.MENU);
    this.escapeButton.setVisible(gameState === GameStates.STARTED);
    this.depthText.setVisible(gameState === GameStates.STARTED);
    this.tuningPanel.setVisible(gameState === GameStates.STARTED);
  }

  private addStartGameContainer(): void {
    // Add rectangle.
    const rectangle = this.add
      .rectangle(0, 0, HudAttrs.CONTAINER.WIDTH, HudAttrs.CONTAINER.HEIGHT)
      .setFillStyle(Colors.WHITE.DECIMAL)
      .setStrokeStyle(HudAttrs.CONTAINER.STROKE, Colors.BLACK.DECIMAL)
      .setAlpha(HudAttrs.CONTAINER.ALPHA)
      .setOrigin(0);

    // Add start game text.
    this.startGameText = this.add
      .text(0, HudAttrs.START_GAME.Y, '', {
        ...Font(FontSizes.LARGE),
        color: Colors.BLUE.HEX,
        align: 'center',
        fixedWidth: HudAttrs.CONTAINER.WIDTH,
      })
      .setInteractive()
      .on('pointerdown', () => {
        // Update game state to started.
        this.registry.set(Registry.GAME_STATE, GameStates.STARTED);
      });

    // Add locale images.
    const enFlag = this.addLocaleImage('en', Frames.HUD.FLAGS.EN, HudAttrs.FLAGS.EN.X, HudAttrs.FLAGS.EN.Y);
    const esFlag = this.addLocaleImage(
      'es',
      Frames.HUD.FLAGS.ES,
      HudAttrs.CONTAINER.WIDTH + HudAttrs.FLAGS.ES.X,
      HudAttrs.FLAGS.ES.Y,
    );

    // Add container to scene.
    this.startGameContainer = this.add.container(
      Number(this.game.config.width) / 2 - HudAttrs.CONTAINER.WIDTH / 2,
      Number(this.game.config.height) / 2 - HudAttrs.CONTAINER.HEIGHT / 2,
      [this.addHero(Textures.HERO.MENU.NAME), rectangle, this.startGameText, enFlag, esFlag],
    );
  }

  private addGameOverContainer(): void {
    const width = HudAttrs.CONTAINER.WIDTH;
    const height = HudAttrs.GAME_OVER.HEIGHT;

    // Save a new best depth (practice runs don't count).
    const depth = Number(this.registry.get(Registry.DEPTH)) || 0;
    const previousBest = Number(this.registry.get(Registry.BEST_DEPTH)) || 0;
    const isNewBest = !Tuning.practice && depth > previousBest;
    if (isNewBest) {
      Util.updateStorage(Registry.BEST_DEPTH, String(depth), this.registry);
    }
    const best = Math.max(depth, previousBest);

    // Add rectangle.
    const rectangle = this.add
      .rectangle(0, 0, width, height)
      .setFillStyle(Colors.WHITE.DECIMAL)
      .setStrokeStyle(HudAttrs.CONTAINER.STROKE, Colors.BLACK.DECIMAL)
      .setAlpha(HudAttrs.CONTAINER.ALPHA)
      .setOrigin(0);

    // Add a centred line of text.
    const addLine = (y: number, text: string, fontSize: number, color: string) =>
      this.add.text(0, y, text, { ...Font(fontSize), color, align: 'center', fixedWidth: width });

    // Add game over, depth and best depth.
    const gameOverText = addLine(HudAttrs.GAME_OVER.Y, __('GAME OVER'), FontSizes.LARGE, Colors.BLUE.HEX);
    const depthText = addLine(
      HudAttrs.GAME_OVER.DEPTH_Y,
      `${__('DEPTH')}: ${depth} m`,
      FontSizes.SMALL,
      Colors.BLACK.HEX,
    );
    const bestText = addLine(HudAttrs.GAME_OVER.BEST_Y, `${__('BEST')}: ${best} m`, FontSizes.SMALL, Colors.BLACK.HEX);
    // Show the flying hero for a new best, otherwise the bandaged hero.
    const hero = this.addHero(isNewBest ? Textures.HERO.FLYING.NAME : Textures.HERO.GAME_OVER.NAME);
    const items: Phaser.GameObjects.GameObject[] = [hero, rectangle, gameOverText, depthText, bestText];
    if (isNewBest) {
      items.push(addLine(HudAttrs.GAME_OVER.NEW_BEST_Y, __('NEW BEST!'), FontSizes.MEDIUM, Colors.GREEN.HEX));
    } else if (Tuning.practice) {
      items.push(addLine(HudAttrs.GAME_OVER.NEW_BEST_Y, __('PRACTICE'), FontSizes.SMALL, Colors.RED.HEX));
    }

    // Add a big retry button that restarts instantly.
    const retryText = this.add
      .text(width / 2, HudAttrs.RETRY.Y, __('RETRY'), {
        ...Font(FontSizes.LARGE),
        color: Colors.GREEN.HEX,
        align: 'center',
      })
      .setPadding(HudAttrs.RETRY.PADDING)
      .setOrigin(0.5, 1)
      .setInteractive()
      .on('pointerdown', () => {
        // Destroy game over container.
        this.gameOverContainer.destroy();

        // Update game state to started.
        this.registry.set(Registry.GAME_STATE, GameStates.STARTED);
      });

    // Add quit text.
    const quitText = this.add
      .text(width / 2, HudAttrs.QUIT.Y, __('QUIT'), {
        ...Font(FontSizes.SMALL),
        color: Colors.RED.HEX,
        align: 'center',
      })
      .setOrigin(0.5, 1)
      .setInteractive()
      .on('pointerdown', () => {
        // Destroy game over container.
        this.gameOverContainer.destroy();

        // Update game state to menu.
        this.registry.set(Registry.GAME_STATE, GameStates.MENU);

        // Play menu select sound.
        Util.playSound(this.menuSelectSound);
      });
    items.push(retryText, quitText);

    // Add container to scene.
    this.gameOverContainer = this.add.container(
      Number(this.game.config.width) / 2 - width / 2,
      Number(this.game.config.height) / 2 - height / 2,
      items,
    );
  }

  private addHero(texture: string): Phaser.GameObjects.Image {
    // Hero picture standing on top of a box (local container coordinates).
    const hero = this.add.image(HudAttrs.CONTAINER.WIDTH / 2, -HudAttrs.HERO.GAP, texture).setOrigin(0.5, 1);
    return hero.setScale(HudAttrs.HERO.WIDTH / hero.width);
  }

  private addLocaleImage(locale: string, frame: number, x: number, y: number): Phaser.GameObjects.Image {
    // Add locale image.
    return this.add
      .image(x, y, Textures.HUD.NAME, frame)
      .setScale(HudAttrs.FLAGS.SCALE)
      .setOrigin(0.5, 1)
      .setInteractive()
      .on('pointerdown', () => {
        // Update locale.
        Util.updateStorage('locale', locale, this.registry);
        i18n.setLocale(locale);

        // Update text.
        this.updateText();

        // Play menu select sound.
        Util.playSound(this.menuSelectSound);
      });
  }

  private addEscapeButton(): void {
    // Add escape button.
    this.escapeButton = this.add
      .image(HudAttrs.ESCAPE_BUTTON.X, HudAttrs.ESCAPE_BUTTON.Y, Textures.HUD.NAME, Frames.HUD.ESCAPE)
      .setScale(HudAttrs.ESCAPE_BUTTON.SCALE)
      .setOrigin(0)
      .setInteractive()
      .on('pointerdown', () => {
        // Update game state to game over.
        this.registry.set(Registry.GAME_STATE, GameStates.GAME_OVER);
      });
  }

  private addFps(): void {
    // Add FPS if enabled.
    if (Debug.fps) {
      this.fpsText?.destroy();

      this.fpsText = this.add
        .text(Number(this.game.config.width) + HudAttrs.FPS.X, HudAttrs.FPS.Y, '', {
          ...Font(FontSizes.SMALL),
          color: Colors.RED.HEX,
          align: 'center',
        })
        .setOrigin(1, 0);
    }
  }

  private updateText(): void {
    // Update start game text.
    if (this.startGameText?.visible) {
      this.startGameText?.setText(__('START GAME'));
    }
  }
}
