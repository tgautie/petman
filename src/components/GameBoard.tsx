import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { PixelSprite } from "./PixelSprite";
import { Hud } from "./Hud";
import { TouchControls } from "./TouchControls";
import type { Character } from "../data/characters";
import {
  chooseGhostDirection,
  createGhosts,
  moveIfWalkable,
  parseMaze,
  positionsEqual,
  removeFoodBowl,
} from "../game/logic";
import type { Direction, GamePhase, GhostState, Position } from "../game/types";

type GameBoardProps = {
  character: Character;
  onBackToSelection: () => void;
};

const maze = parseMaze();
const tickIntervalMs = 220;

type GameState = {
  playerPosition: Position;
  playerDirection: Direction;
  queuedDirection: Direction;
  ghosts: GhostState[];
  remainingFoodBowls: Position[];
  score: number;
  phase: GamePhase;
};

function createInitialGameState(): GameState {
  return {
    playerPosition: maze.playerSpawn,
    playerDirection: "left",
    queuedDirection: "left",
    ghosts: createGhosts(maze.ghostSpawns),
    remainingFoodBowls: maze.foodBowls,
    score: 0,
    phase: "playing",
  };
}

export function GameBoard({ character, onBackToSelection }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  void onBackToSelection;

  const ghostPositions = useMemo(
    () => new Map(gameState.ghosts.map((ghost) => [`${ghost.position.row}-${ghost.position.column}`, ghost])),
    [gameState.ghosts],
  );

  const bowlPositions = useMemo(
    () => new Set(gameState.remainingFoodBowls.map((bowl) => `${bowl.row}-${bowl.column}`)),
    [gameState.remainingFoodBowls],
  );

  const queueDirection = (direction: Direction) => {
    setGameState((currentState) => {
      const nextPosition = moveIfWalkable(
        maze.tiles,
        currentState.playerPosition,
        direction,
      );

      return {
        ...currentState,
        queuedDirection: direction,
        playerDirection: !positionsEqual(nextPosition, currentState.playerPosition)
          ? direction
          : currentState.playerDirection,
      };
    });
  };

  useEffect(() => {
    if (gameState.phase !== "playing") {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        queueDirection("up");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        queueDirection("down");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        queueDirection("left");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        queueDirection("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.phase]);

  useEffect(() => {
    if (gameState.phase !== "playing") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setGameState((currentState) => {
        if (currentState.phase !== "playing") {
          return currentState;
        }

        const requestedPosition = moveIfWalkable(
          maze.tiles,
          currentState.playerPosition,
          currentState.queuedDirection,
        );
        const canTurn = !positionsEqual(requestedPosition, currentState.playerPosition);
        const activeDirection = canTurn
          ? currentState.queuedDirection
          : currentState.playerDirection;
        const playerPosition = moveIfWalkable(
          maze.tiles,
          currentState.playerPosition,
          activeDirection,
        );

        let remainingFoodBowls = currentState.remainingFoodBowls;
        let score = currentState.score;

        if (bowlExists(remainingFoodBowls, playerPosition)) {
          remainingFoodBowls = removeFoodBowl(remainingFoodBowls, playerPosition);
          score += 10;
        }

        const ghosts = currentState.ghosts.map((ghost) => {
          const nextDirection = chooseGhostDirection(maze.tiles, ghost);

          return {
            ...ghost,
            direction: nextDirection,
            position: moveIfWalkable(maze.tiles, ghost.position, nextDirection),
          };
        });

        const ghostCollision = ghosts.some((ghost) =>
          positionsEqual(ghost.position, playerPosition),
        );

        const phase =
          ghostCollision
            ? "gameOver"
            : remainingFoodBowls.length === 0
              ? "victory"
              : "playing";

        return {
          ...currentState,
          playerPosition,
          playerDirection: activeDirection,
          ghosts,
          remainingFoodBowls,
          score,
          phase,
        };
      });
    }, tickIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [gameState.phase]);

  return (
    <main className="screen-shell">
      <section className="game-shell" aria-label="Petman game screen">
        <Hud
          character={character}
          score={gameState.score}
          phaseLabel={getPhaseLabel(gameState.phase)}
        />

        <div className="game-stage">
          <div
            className="maze"
            style={
              {
                "--maze-columns": maze.tiles[0].length,
                "--maze-rows": maze.tiles.length,
              } as CSSProperties
            }
          >
            {maze.tiles.flatMap((row, rowIndex) =>
              row.map((tile, columnIndex) => {
                const tileKey = `${rowIndex}-${columnIndex}`;
                const ghost = ghostPositions.get(tileKey);
                const hasBowl = bowlPositions.has(tileKey);
                const isPlayer =
                  gameState.playerPosition.row === rowIndex &&
                  gameState.playerPosition.column === columnIndex;

                return (
                  <div
                    key={tileKey}
                    className={[
                      "maze__tile",
                      tile === "brickWall" ? "maze__tile--brick" : "",
                      tile === "plant" ? "maze__tile--plant" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {hasBowl && !ghost ? <span className="maze__bowl" aria-hidden="true" /> : null}
                    {tile === "plant" ? <span className="maze__pot" aria-hidden="true" /> : null}
                    {ghost ? (
                        <span
                          className="maze__ghost"
                          aria-hidden="true"
                          style={{ "--ghost-color": ghost.color } as CSSProperties}
                        />
                    ) : null}
                    {isPlayer ? (
                      <div className="maze__player">
                        <PixelSprite character={character} />
                      </div>
                    ) : null}
                  </div>
                );
              }),
            )}
          </div>

          <div className="game-stage__status" role="status" aria-live="polite">
            {gameState.phase === "playing" ? (
              <p>collect bowls</p>
            ) : gameState.phase === "victory" ? (
              <p>maze complete</p>
            ) : (
              <p>ghost caught you</p>
            )}
          </div>
        </div>

        <TouchControls
          disabled={gameState.phase !== "playing"}
          onMove={queueDirection}
        />
      </section>
    </main>
  );
}

function bowlExists(foodBowls: Position[], playerPosition: Position) {
  return foodBowls.some((bowl) => positionsEqual(bowl, playerPosition));
}

function getPhaseLabel(phase: GamePhase) {
  if (phase === "victory") {
    return "victory";
  }

  if (phase === "gameOver") {
    return "ghosted";
  }

  return "playing";
}
