export const SPRITE_PALETTE = {
  ".": "transparent",
  O: "#f8f4d8",
  L: "#f3f3ef",
  G: "#5c5f68",
  D: "#2c2f36",
  B: "#24252d",
  K: "#111216",
  A: "#d8a76a",
  Y: "#ffd44d",
  C: "#6ae6ff",
  R: "#ff735a",
} as const;

export type SpritePixel = keyof typeof SPRITE_PALETTE;
