import type { SpritePixel } from "./spritePalette";
import circePortrait from "./portraits/circe.png";
import louisePortrait from "./portraits/louise.png";
import shantiPortrait from "./portraits/shanti.png";
import sohanPortrait from "./portraits/sohan.png";

export type Character = {
  id: string;
  name: string;
  species: "cat" | "dog";
  coatDescription: string;
  portrait: string;
  sprite: SpritePixel[][];
};

const T = "." as const;
const O = "O" as const;
const L = "L" as const;
const G = "G" as const;
const D = "D" as const;
const B = "B" as const;
const K = "K" as const;
const A = "A" as const;
const Y = "Y" as const;
const R = "R" as const;

export const characters: Character[] = [
  {
    id: "grey-cat",
    name: "Circe",
    species: "cat",
    coatDescription: "aka Nounette",
    portrait: circePortrait,
    sprite: [
      [T, O, O, T, T, O, O, T],
      [O, D, A, O, O, G, D, O],
      [O, A, D, G, G, D, L, O],
      [O, D, A, Y, D, Y, G, O],
      [O, D, D, D, G, L, D, O],
      [T, O, D, L, O, R, O, T],
      [T, T, O, G, L, O, T, T],
      [T, T, T, O, O, T, T, T],
    ],
  },
  {
    id: "black-cat",
    name: "Sohan",
    species: "cat",
    coatDescription: "black devil",
    portrait: sohanPortrait,
    sprite: [
      [T, O, T, T, T, T, O, T],
      [O, K, O, T, T, O, K, O],
      [O, B, B, O, O, B, B, O],
      [O, B, Y, B, B, Y, B, O],
      [O, B, B, B, B, L, B, O],
      [O, B, K, B, O, K, B, O],
      [T, O, B, B, B, B, O, T],
      [T, T, O, O, O, O, T, T],
    ],
  },
  {
    id: "black-dog",
    name: "Shanti",
    species: "dog",
    coatDescription: "slavic love",
    portrait: shantiPortrait,
    sprite: [
      [O, T, T, T, T, T, T, O],
      [O, O, B, O, O, B, O, O],
      [O, B, B, Y, B, B, Y, O],
      [O, B, B, B, B, B, B, O],
      [O, B, K, B, O, B, K, O],
      [O, B, B, B, R, B, B, O],
      [T, O, B, B, B, B, O, T],
      [T, T, O, O, O, O, T, T],
    ],
  },
  {
    id: "black-white-cat",
    name: "Louise",
    species: "cat",
    coatDescription: "croquette princess",
    portrait: louisePortrait,
    sprite: [
      [T, O, T, T, T, T, O, T],
      [O, K, O, T, T, O, L, O],
      [O, K, K, O, O, L, L, O],
      [O, K, Y, K, L, Y, K, O],
      [O, K, L, L, L, L, L, O],
      [O, K, L, O, O, L, K, O],
      [T, O, L, L, L, L, O, T],
      [T, T, O, O, O, O, T, T],
    ],
  },
];
