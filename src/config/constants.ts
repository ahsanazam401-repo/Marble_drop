export const Registry = {
  GAME_STATE: 'game-state',
};

export const GameStates = {
  MENU: 'menu',
  STARTED: 'started',
  GAME_OVER: 'game-over',
};

export const MarbleAttrs = {
  RADIUS: 60,
  STROKE: 7,
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
