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
  const tiles: TileType[][] = [];
  const foodBowls: Position[] = [];
  const ghostSpawns: Position[] = [];
  let playerSpawn: Position | null = null;

  mazeRows.forEach((row, rowIndex) => {
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
  playerPosition: Position,
) {
  const availableDirections = (Object.keys(directionOffsets) as Direction[]).filter(
    (direction) => isWalkable(tiles, getNextPosition(ghost.position, direction)),
  );

  const nonReverseDirections = availableDirections.filter(
    (direction) => direction !== oppositeDirection[ghost.direction],
  );

  const options = nonReverseDirections.length > 0 ? nonReverseDirections : availableDirections;

  return options.reduce((bestDirection, currentDirection) => {
    const bestDistance = manhattanDistance(
      getNextPosition(ghost.position, bestDirection),
      playerPosition,
    );
    const currentDistance = manhattanDistance(
      getNextPosition(ghost.position, currentDirection),
      playerPosition,
    );

    return currentDistance < bestDistance ? currentDirection : bestDirection;
  }, options[0] ?? ghost.direction);
}

function manhattanDistance(first: Position, second: Position) {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column);
}
