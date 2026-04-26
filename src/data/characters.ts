export type SpritePixel =
  | "transparent"
  | "outline"
  | "fill"
  | "accent"
  | "shadow";

export type Character = {
  id: string;
  name: string;
  species: "cat" | "dog";
  coatDescription: string;
  sprite: SpritePixel[][];
  palette: {
    outline: string;
    fill: string;
    accent: string;
    shadow: string;
  };
};

const T = "transparent" as const;
const O = "outline" as const;
const F = "fill" as const;
const A = "accent" as const;
const S = "shadow" as const;

export const characters: Character[] = [
  {
    id: "grey-cat",
    name: "Miso",
    species: "cat",
    coatDescription: "grey cat",
    palette: {
      outline: "#f8f4d8",
      fill: "#9ea6ba",
      accent: "#ffd44d",
      shadow: "#556078",
    },
    sprite: [
      [T, T, O, T, T, T, O, T],
      [T, O, F, O, T, O, F, O],
      [T, O, F, F, O, F, F, O],
      [O, F, A, F, F, F, A, F],
      [O, F, F, F, F, F, F, F],
      [O, F, S, F, O, F, S, F],
      [T, O, F, F, F, F, F, O],
      [T, T, O, T, T, T, O, T],
    ],
  },
  {
    id: "black-cat",
    name: "Nyx",
    species: "cat",
    coatDescription: "black cat",
    palette: {
      outline: "#f8f4d8",
      fill: "#24252d",
      accent: "#6ae6ff",
      shadow: "#111216",
    },
    sprite: [
      [T, T, O, T, T, T, O, T],
      [T, O, F, O, T, O, F, O],
      [T, O, F, F, O, F, F, O],
      [O, F, A, F, F, F, A, F],
      [O, F, F, F, F, F, F, F],
      [O, F, S, F, O, F, S, F],
      [T, O, F, F, F, F, F, O],
      [T, T, O, T, T, T, O, T],
    ],
  },
  {
    id: "black-dog",
    name: "Rex",
    species: "dog",
    coatDescription: "black dog",
    palette: {
      outline: "#f8f4d8",
      fill: "#23242a",
      accent: "#ff735a",
      shadow: "#0f1014",
    },
    sprite: [
      [O, T, T, T, T, T, T, O],
      [O, O, F, O, T, O, F, O],
      [O, F, F, F, O, F, F, O],
      [O, F, A, F, F, F, A, F],
      [O, F, F, F, F, F, F, F],
      [T, O, S, F, O, F, S, O],
      [T, O, F, F, F, F, F, O],
      [T, T, O, T, T, T, O, T],
    ],
  },
  {
    id: "black-white-cat",
    name: "Domino",
    species: "cat",
    coatDescription: "black and white cat",
    palette: {
      outline: "#f8f4d8",
      fill: "#f3f3ef",
      accent: "#ffd44d",
      shadow: "#1d1d21",
    },
    sprite: [
      [T, T, O, T, T, T, O, T],
      [T, O, S, O, T, O, F, O],
      [T, O, S, S, O, F, F, O],
      [O, S, A, S, F, F, A, F],
      [O, S, S, F, F, F, F, F],
      [O, S, F, F, O, F, S, F],
      [T, O, S, F, F, F, F, O],
      [T, T, O, T, T, T, O, T],
    ],
  },
];
