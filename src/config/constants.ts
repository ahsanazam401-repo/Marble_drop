import { TuningValues } from '../interfaces';

export const Registry = {
  GAME_STATE: 'game-state',
  DEPTH: 'depth',
};

export const GameStates = {
  MENU: 'menu',
  STARTED: 'started',
  GAME_OVER: 'game-over',
};

export const MarbleAttrs = {
  RADIUS: 60,
  STROKE: 7,
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
    SENSITIVITY: 1,
    // Follow delay in milliseconds. Higher values feel smoother but slower.
    SMOOTHING: 60,
  },
};

export const FallAttrs = {
  // Speed the world scrolls upward past the marble, in pixels per second.
  SPEED: 900,
  PIXELS_PER_METRE: 100,
};

export const ObstacleAttrs = {
  // Distance fallen between each new obstacle, in pixels.
  SPACING: 650,
  HEIGHT: 48,
  WIDTH: {
    MIN: 160,
    MAX: 416,
  },
  // Hitbox is this many pixels smaller than the drawn block on every side.
  HITBOX_INSET: 10,
  // Spawn below and remove above the screen by this many pixels.
  OFFSCREEN: 100,
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
    Y: 100,
  },
  RETRY: {
    X: 250,
    Y: 476,
  },
  QUIT: {
    X: -250,
    Y: 476,
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
