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
const C = "C" as const;
const R = "R" as const;

export const characters: Character[] = [
  {
    id: "grey-cat",
    name: "Circe",
    species: "cat",
    coatDescription: "aka Nounette",
    portrait: circePortrait,
    sprite: [
      [T, T, O, T, T, T, O, T],
      [T, O, D, O, T, O, D, O],
      [T, O, G, G, O, G, G, O],
      [O, G, A, G, G, G, A, G],
      [O, G, G, G, D, G, G, G],
      [O, G, O, G, O, G, O, G],
      [T, O, G, G, G, G, G, O],
      [T, T, O, O, O, O, O, T],
    ],
  },
  {
    id: "black-cat",
    name: "Sohan",
    species: "cat",
    coatDescription: "black devil",
    portrait: sohanPortrait,
    sprite: [
      [T, T, O, T, T, T, O, T],
      [T, O, B, O, T, O, B, O],
      [T, O, B, B, O, B, B, O],
      [O, B, C, B, B, B, C, B],
      [O, B, B, B, B, B, B, B],
      [O, B, K, B, O, B, K, B],
      [T, O, B, B, B, B, B, O],
      [T, T, O, T, T, T, O, T],
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
      [O, O, B, O, T, O, B, O],
      [O, B, B, B, O, B, B, O],
      [O, B, R, B, B, B, R, B],
      [O, B, B, B, B, B, B, B],
      [T, O, K, B, O, B, K, O],
      [T, O, B, B, B, B, B, O],
      [T, T, O, T, T, T, O, T],
    ],
  },
  {
    id: "black-white-cat",
    name: "Louise",
    species: "cat",
    coatDescription: "croquette princess",
    portrait: louisePortrait,
    sprite: [
      [T, T, O, T, T, T, O, T],
      [T, O, K, O, T, O, L, O],
      [T, O, K, K, O, L, L, O],
      [O, K, Y, K, L, L, Y, L],
      [O, K, K, L, L, L, L, L],
      [O, K, L, L, O, L, K, L],
      [T, O, K, L, L, L, L, O],
      [T, T, O, T, T, T, O, T],
    ],
  },
];
