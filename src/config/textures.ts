// Hitbox shapes for an image, as fractions of its size: x by width, y by height, radius by width.
export interface ArtHitShape {
  circle?: [cx: number, cy: number, radius: number];
  rect?: [x: number, y: number, width: number, height: number];
  triangle?: [x1: number, y1: number, x2: number, y2: number, x3: number, y3: number];
}

export interface ObstacleArt {
  NAME: string;
  FILE: string;
  HIT: ArtHitShape[];
}

export const Textures = {
  HUD: {
    NAME: 'hud',
    FILE: 'assets/images/hud.png',
  },
  HERO: {
    // The ball fills the image width; its centre is below the cape.
    FALLING: {
      NAME: 'hero-falling',
      FILE: 'assets/images/hero/hero-falling.png',
      BALL: { X: 0.5, Y: 0.583, RADIUS: 0.5 },
    },
    MENU: { NAME: 'hero-menu', FILE: 'assets/images/hero/hero-menu.png' },
    GAME_OVER: { NAME: 'hero-game-over', FILE: 'assets/images/hero/hero-game-over.png' },
    FLYING: { NAME: 'hero-flying', FILE: 'assets/images/hero/hero-flying.png' },
  },
  // Drawn in code at startup, used for the snowball trail.
  SNOW_PUFF: { NAME: 'snow-puff', SIZE: 32 },
};

// Obstacle images and their hitbox shapes, measured from each picture.
export const ObstacleArts: Record<'ROCKS' | 'STICKS' | 'ICE_SPIKES' | 'PINE_TREES' | 'SNOWBALLS', ObstacleArt[]> = {
  ROCKS: [
    { NAME: 'rock-1', FILE: 'assets/images/obstacles/rock-1.png', HIT: [{ circle: [0.5, 0.518, 0.487] }] },
    { NAME: 'rock-2', FILE: 'assets/images/obstacles/rock-2.png', HIT: [{ circle: [0.49, 0.524, 0.466] }] },
  ],
  STICKS: [
    // Branch only; the small twig on top is forgiving.
    { NAME: 'stick-1', FILE: 'assets/images/obstacles/stick-1.png', HIT: [{ rect: [0.02, 0.4, 0.96, 0.4] }] },
    { NAME: 'stick-2', FILE: 'assets/images/obstacles/stick-2.png', HIT: [{ rect: [0.02, 0.365, 0.96, 0.53] }] },
  ],
  ICE_SPIKES: [
    {
      NAME: 'ice-spikes-1',
      FILE: 'assets/images/obstacles/ice-spikes-1.png',
      HIT: [
        { triangle: [0.068, 0.174, 0.095, 0.935, 0.408, 0.935] },
        { triangle: [0.49, 0.003, 0.289, 0.935, 0.697, 0.935] },
        { triangle: [0.935, 0.276, 0.578, 0.935, 0.912, 0.935] },
        { rect: [0, 0.9, 1, 0.1] },
      ],
    },
    {
      NAME: 'ice-spikes-2',
      FILE: 'assets/images/obstacles/ice-spikes-2.png',
      HIT: [
        { triangle: [0.124, 0.333, 0.18, 0.922, 0.44, 0.922] },
        { triangle: [0.512, 0, 0.34, 0.922, 0.68, 0.922] },
        { triangle: [0.856, 0.289, 0.58, 0.922, 0.82, 0.922] },
        { rect: [0, 0.9, 1, 0.07] },
      ],
    },
  ],
  PINE_TREES: [
    // Faces right, trunk at the left edge. Flipped for trees on the right side.
    {
      NAME: 'pine-tree-1',
      FILE: 'assets/images/obstacles/pine-tree-1.png',
      HIT: [
        { rect: [0, 0.386, 0.2, 0.222] },
        { triangle: [0.195, 0.003, 0.195, 0.994, 0.662, 0.497] },
        { triangle: [0.453, 0.12, 0.453, 0.88, 0.85, 0.497] },
        { triangle: [0.703, 0.238, 0.703, 0.759, 1, 0.497] },
      ],
    },
    {
      NAME: 'pine-tree-2',
      FILE: 'assets/images/obstacles/pine-tree-2.png',
      HIT: [
        { rect: [0, 0.392, 0.15, 0.215] },
        { triangle: [0.188, 0.015, 0.188, 0.985, 0.6, 0.5] },
        { triangle: [0.422, 0.096, 0.422, 0.898, 0.813, 0.5] },
        { triangle: [0.672, 0.227, 0.672, 0.77, 1, 0.5] },
      ],
    },
  ],
  SNOWBALLS: [
    { NAME: 'snowball-1', FILE: 'assets/images/obstacles/snowball-1.png', HIT: [{ circle: [0.5, 0.5, 0.47] }] },
    { NAME: 'snowball-2', FILE: 'assets/images/obstacles/snowball-2.png', HIT: [{ circle: [0.5, 0.5, 0.47] }] },
  ],
};

export const Frames = {
  HUD: {
    ESCAPE: 3,
    FLAGS: {
      EN: 4,
      ES: 5,
    },
  },
};
