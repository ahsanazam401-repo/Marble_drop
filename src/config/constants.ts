import { TuningValues } from '../interfaces';

export const Registry = {
  GAME_STATE: 'game-state',
  DEPTH: 'depth',
  HITS: 'hits',
  BEST_DEPTH: 'best-depth',
};

export const GameStates = {
  MENU: 'menu',
  STARTED: 'started',
  CRASHING: 'crashing',
  GAME_OVER: 'game-over',
};

export const MarbleAttrs = {
  RADIUS: 72,
  STROKE: 8,
  // Hitbox radius as a fraction of the drawn radius, so near misses feel fair.
  HITBOX_RATIO: 0.85,
  // Resting height as a fraction of the screen height (one third from the top).
  Y_RATIO: 1 / 3,
  DROP: {
    DURATION: 700,
    EASE: 'Cubic.easeOut',
  },
  DRAG: {
    // Marble moves this many pixels for each pixel the thumb moves.
    SENSITIVITY: 1.6,
    // Follow delay in milliseconds. Higher values feel smoother but slower.
    SMOOTHING: 60,
  },
};

export const FallAttrs = {
  // Speed the world scrolls upward past the marble, in pixels per second.
  SPEED: 1000,
  PIXELS_PER_METRE: 100,
};

export const ObstacleAttrs = {
  // Distance fallen between each new obstacle, in pixels.
  SPACING: 650,
  // Distance fallen before the first obstacle (about 2 seconds to get ready).
  START_DISTANCE: 800,
  // Spawn below and remove above the screen by this many pixels.
  OFFSCREEN: 100,
  // Keep free-floating obstacles this far from the screen edges.
  EDGE_MARGIN: 10,
  OUTLINE: 6,
  // Hitboxes are smaller than the drawings, so near misses feel fair.
  HITBOX: {
    RATIO: 0.85,
    SPIKE_RATIO: 0.8,
    INSET: 8,
  },
  ROCK: {
    RADIUS: { MIN: 50, MAX: 90 },
  },
  STICK: {
    LENGTH: { MIN: 220, MAX: 380 },
    THICKNESS: { MIN: 30, MAX: 40 },
    TWIG_LENGTH: { MIN: 50, MAX: 70 },
  },
  ICE_SPIKES: {
    COUNT: { MIN: 2, MAX: 4 },
    WIDTH: { MIN: 50, MAX: 70 },
    HEIGHT: { MIN: 90, MAX: 150 },
    BASE: 20,
  },
  PINE_TREE: {
    // Length grown out from the screen edge.
    LENGTH: { MIN: 300, MAX: 440 },
    HEIGHT: { MIN: 130, MAX: 180 },
    TRUNK: { LENGTH: 70, THICKNESS: 26 },
  },
};

export const CrashAttrs = {
  FLASH: 120,
  SHAKE: { DURATION: 250, INTENSITY: 0.01 },
  SQUASH: { SCALE_X: 1.35, SCALE_Y: 0.65, DURATION: 90 },
  STARS: { COUNT: 3, ORBIT: 100, SIZE: 22, SPIN: 400 },
  TUMBLE: { DELAY: 250, DURATION: 500, DISTANCE: 500, ANGLE: 540 },
  // Total crash time before the game over screen.
  DURATION: 800,
};

export const MountainAttrs = {
  // Height of each wall piece, and vertical distance between jagged points.
  CHUNK_HEIGHT: 480,
  STEP: 80,
  SNOW: { WIDTH: 30, HEIGHT: 22 },
  FAR: {
    WIDTH: { MIN: 40, MAX: 170 },
    SPEED_FACTOR: 0.25,
  },
  NEAR: {
    WIDTH: { MIN: 20, MAX: 100 },
    SPEED_FACTOR: 0.5,
  },
};

export const TuningAttrs: {
  STORAGE_KEY: string;
  SLIDERS: {
    KEY: keyof TuningValues;
    LABEL: string;
    MIN: number;
    MAX: number;
    STEP: number;
    UNIT: string;
    DECIMALS: number;
  }[];
} = {
  STORAGE_KEY: 'tuning',
  SLIDERS: [
    { KEY: 'fallSpeed', LABEL: 'Fall speed', MIN: 300, MAX: 2000, STEP: 50, UNIT: ' px/s', DECIMALS: 0 },
    { KEY: 'sensitivity', LABEL: 'Drag sensitivity', MIN: 0.5, MAX: 2.5, STEP: 0.1, UNIT: 'x', DECIMALS: 1 },
    { KEY: 'smoothing', LABEL: 'Smoothness (follow delay)', MIN: 0, MAX: 200, STEP: 10, UNIT: ' ms', DECIMALS: 0 },
    { KEY: 'marbleHeight', LABEL: 'Marble height', MIN: 15, MAX: 60, STEP: 1, UNIT: '% from top', DECIMALS: 0 },
  ],
};

export const SpeedLineAttrs = {
  COUNT: 30,
  MENU_SPEED: 150,
  LENGTH: {
    MIN: 80,
    MAX: 260,
  },
  FAR: {
    WIDTH: 4,
    ALPHA: 0.2,
    SPEED_FACTOR: 0.5,
  },
  NEAR: {
    WIDTH: 6,
    ALPHA: 0.4,
    SPEED_FACTOR: 1,
  },
};

export const HudAttrs = {
  CONTAINER: {
    WIDTH: 864,
    HEIGHT: 576,
    STROKE: 5,
    ALPHA: 0.6,
  },
  START_GAME: {
    Y: 100,
  },
  DEPTH: {
    Y: 30,
  },
  HITS: {
    Y: 110,
  },
  TUNE_BUTTON: {
    X: -30,
    Y: 100,
  },
  TUNING_PANEL: {
    Y: -30,
  },
  FLAGS: {
    SCALE: 8,
    EN: {
      X: 250,
      Y: 476,
    },
    ES: {
      X: -250,
      Y: 476,
    },
  },
  GAME_OVER: {
    HEIGHT: 700,
    Y: 70,
    DEPTH_Y: 190,
    BEST_Y: 260,
    NEW_BEST_Y: 330,
  },
  RETRY: {
    Y: 520,
    PADDING: 30,
  },
  QUIT: {
    Y: 640,
  },
  ESCAPE_BUTTON: {
    SCALE: 10,
    X: 30,
    Y: 30,
  },
  FPS: {
    X: -30,
    Y: 30,
  },
};
