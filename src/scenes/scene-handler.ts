import Phaser from 'phaser';
import { Colors, GameStates, ObstacleArts, Registry, Scenes, Sounds, Textures } from '../config';
import { Util } from '../util';

export class SceneHandler extends Phaser.Scene {
  private startGameSound: Phaser.Sound.BaseSound;
  private gameOverSound: Phaser.Sound.BaseSound;

  constructor() {
    super(Scenes.HANDLER);
  }

  public preload(): void {
    // Load HUD sprite sheet.
    this.load.spritesheet(Textures.HUD.NAME, Textures.HUD.FILE, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Load hero images.
    Object.values(Textures.HERO).forEach((art) => this.load.image(art.NAME, art.FILE));

    // Load obstacle images.
    Object.values(ObstacleArts)
      .flat()
      .forEach((art) => this.load.image(art.NAME, art.FILE));

    // Load sounds.
    this.load.audio(Sounds.MENU_SELECT.NAME, Sounds.MENU_SELECT.FILE);
    this.load.audio(Sounds.START_GAME.NAME, Sounds.START_GAME.FILE);
    this.load.audio(Sounds.GAME_OVER.NAME, Sounds.GAME_OVER.FILE);
  }

  public create(): void {
    // Draw the soft snow puff used by snowball trails.
    const puff = this.add.graphics();
    const size = Textures.SNOW_PUFF.SIZE;
    puff.fillStyle(Colors.WHITE.DECIMAL).fillCircle(size / 2, size / 2, size / 2);
    puff.generateTexture(Textures.SNOW_PUFF.NAME, size, size);
    puff.destroy();

    // Keep the pixel-art HUD icons sharp while everything else is smooth.
    this.textures.get(Textures.HUD.NAME).setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Start Background scene.
    this.scene.launch(Scenes.BACKGROUND);

    // Start HUD scene.
    this.scene.launch(Scenes.HUD);

    // Update game state to menu.
    this.registry.set(Registry.GAME_STATE, GameStates.MENU);

    // Initialize sounds.
    this.initSounds();

    // Initialize events.
    this.initEvents();
  }

  private initSounds(): void {
    // Initialize sounds.
    this.startGameSound = this.sound.add(Sounds.START_GAME.NAME);
    this.gameOverSound = this.sound.add(Sounds.GAME_OVER.NAME);
  }

  private initEvents(): void {
    // Game state change handler.
    this.registry.events.on(
      `changedata-${Registry.GAME_STATE}`,
      (parent: Phaser.Data.DataManager, gameState: string) => {
        switch (gameState) {
          case GameStates.STARTED:
            // Start game.
            this.scene.start(Scenes.GAME);

            // Play start game sound.
            Util.playSound(this.startGameSound);
            break;
          case GameStates.MENU:
            // Stop game.
            this.scene.stop(Scenes.GAME);
            break;
          case GameStates.GAME_OVER:
            // Stop game.
            this.scene.stop(Scenes.GAME);

            // Play game over sound.
            Util.playSound(this.gameOverSound);
            break;
          default:
            break;
        }
      },
    );
  }
}
