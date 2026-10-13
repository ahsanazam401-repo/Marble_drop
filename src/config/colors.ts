const hexToDecimal = (hex: string) => parseInt(hex.slice(1), 16);

const makeColor = (hex: string) => ({
  HEX: hex,
  DECIMAL: hexToDecimal(hex),
});

export const Colors = {
  BLACK: makeColor('#000000'),
  BLUE: makeColor('#1976d2'),
  GREEN: makeColor('#388e3c'),
  GREY: makeColor('#546e7a'),
  LIGHT_BLUE: makeColor('#2fbdff'),
  ORANGE: makeColor('#ff8f00'),
  RED: makeColor('#d32f2f'),
  WHITE: makeColor('#ffffff'),
  YELLOW: makeColor('#ffd600'),
  ROCK: makeColor('#9e9e9e'),
  ROCK_DARK: makeColor('#757575'),
  ROCK_LIGHT: makeColor('#cfcfcf'),
  ROCK_OUTLINE: makeColor('#424242'),
  WOOD: makeColor('#8d5a2b'),
  WOOD_DARK: makeColor('#5d3a1a'),
  WOOD_OUTLINE: makeColor('#3e2410'),
  ICE: makeColor('#b3e5fc'),
  ICE_OUTLINE: makeColor('#0277bd'),
  PINE: makeColor('#388e3c'),
  PINE_OUTLINE: makeColor('#1b5e20'),
  MOUNTAIN_FAR: makeColor('#7aa7cf'),
  MOUNTAIN_NEAR: makeColor('#4f7ca3'),
};
