import { mazeRows } from "../data/maze";
import type { Direction, GhostState, MazeData, Position, TileType } from "./types";

const directionOffsets: Record<Direction, Position> = {
  up: { row: -1, column: 0 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
  right: { row: 0, column: 1 },
};

const oppositeDirection: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const ghostPalette = ["#ff6b6b", "#67e7ff", "#ff9d4d", "#ff77d1"];

export function parseMaze(): MazeData {
  const expectedWidth = mazeRows[0].length;
  const tiles: TileType[][] = [];
  const foodBowls: Position[] = [];
  const ghostSpawns: Position[] = [];
  let playerSpawn: Position | null = null;

  mazeRows.forEach((row, rowIndex) => {
    if (row.length !== expectedWidth) {
      throw new Error(
        `Maze row ${rowIndex} has width ${row.length}, expected ${expectedWidth}.`,
      );
    }

    const parsedRow: TileType[] = [];

    row.split("").forEach((cell, columnIndex) => {
      if (cell === "#") {
        parsedRow.push("brickWall");
        return;
      }

      if (cell === "*") {
        parsedRow.push("plant");
        return;
      }

      parsedRow.push("floor");

      if (cell === ".") {
        foodBowls.push({ row: rowIndex, column: columnIndex });
      }

      if (cell === "S") {
        playerSpawn = { row: rowIndex, column: columnIndex };
      }

      if (cell === "G") {
        ghostSpawns.push({ row: rowIndex, column: columnIndex });
      }
    });

    tiles.push(parsedRow);
  });

  if (!playerSpawn) {
    throw new Error("Maze is missing a player spawn.");
  }

  return {
    tiles,
    foodBowls,
    playerSpawn,
    ghostSpawns,
  };
}

export function createGhosts(spawns: Position[]): GhostState[] {
  return spawns.map((spawn, index) => ({
    id: `ghost-${index}`,
    position: spawn,
    direction: index % 2 === 0 ? "left" : "right",
    color: ghostPalette[index % ghostPalette.length],
  }));
}

export function createFoodBowls(spawns: Position[]) {
  const shuffledSpawns = [...spawns];

  for (let index = shuffledSpawns.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentSpawn = shuffledSpawns[index];
    shuffledSpawns[index] = shuffledSpawns[swapIndex];
    shuffledSpawns[swapIndex] = currentSpawn;
  }

  const bowlCount = Math.max(12, Math.floor(shuffledSpawns.length * 0.45));
  return shuffledSpawns.slice(0, bowlCount);
}

export function positionsEqual(first: Position, second: Position) {
  return first.row === second.row && first.column === second.column;
}

export function getNextPosition(position: Position, direction: Direction): Position {
  const offset = directionOffsets[direction];

  return {
    row: position.row + offset.row,
    column: position.column + offset.column,
  };
}

export function isWalkable(tiles: TileType[][], position: Position) {
  const row = tiles[position.row];
  const tile = row?.[position.column];

  return tile === "floor";
}

export function moveIfWalkable(
  tiles: TileType[][],
  position: Position,
  direction: Direction,
) {
  const nextPosition = getNextPosition(position, direction);
  return isWalkable(tiles, nextPosition) ? nextPosition : position;
}

export function removeFoodBowl(foodBowls: Position[], playerPosition: Position) {
  return foodBowls.filter((foodBowl) => !positionsEqual(foodBowl, playerPosition));
}

export function chooseGhostDirection(
  tiles: TileType[][],
  ghost: GhostState,
) {
  const availableDirections = (Object.keys(directionOffsets) as Direction[]).filter(
    (direction) => isWalkable(tiles, getNextPosition(ghost.position, direction)),
  );

  const nonReverseDirections = availableDirections.filter(
    (direction) => direction !== oppositeDirection[ghost.direction],
  );

  const options = nonReverseDirections.length > 0 ? nonReverseDirections : availableDirections;

  if (options.length === 0) {
    return ghost.direction;
  }

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}
