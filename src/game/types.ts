import type { Character } from "../data/characters";

export type Direction = "up" | "down" | "left" | "right";

export type Position = {
  row: number;
  column: number;
};

export type TileType = "floor" | "brickWall" | "plant";

export type MazeData = {
  tiles: TileType[][];
  foodBowls: Position[];
  playerSpawn: Position;
  ghostSpawns: Position[];
};

export type GhostState = {
  id: string;
  position: Position;
  direction: Direction;
  color: string;
};

export type GamePhase = "playing" | "victory" | "gameOver";

export type GameSnapshot = {
  character: Character;
  playerPosition: Position;
  playerDirection: Direction;
  queuedDirection: Direction;
  ghosts: GhostState[];
  remainingFoodBowls: Position[];
  score: number;
  phase: GamePhase;
};
