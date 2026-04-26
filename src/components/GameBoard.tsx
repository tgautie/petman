import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PixelSprite } from "./PixelSprite";
import { Hud } from "./Hud";
import type { Character } from "../data/characters";
import {
  chooseGhostDirection,
  createFoodBowls,
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
  playerDirection: Direction | null;
  queuedDirection: Direction | null;
  ghosts: GhostState[];
  remainingFoodBowls: Position[];
  score: number;
  phase: GamePhase;
};

function createInitialGameState(): GameState {
  return {
    playerPosition: maze.playerSpawn,
    playerDirection: null,
    queuedDirection: null,
    ghosts: createGhosts(maze.ghostSpawns),
    remainingFoodBowls: createFoodBowls(maze.foodBowls),
    score: 0,
    phase: "playing",
  };
}

export function GameBoard({ character, onBackToSelection }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const swipeStartRef = useRef<Position | null>(null);

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
          : currentState.playerDirection ?? direction,
      };
    });
  };

  const restartGame = () => {
    setGameState(createInitialGameState());
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

        const requestedPosition = currentState.queuedDirection
          ? moveIfWalkable(
              maze.tiles,
              currentState.playerPosition,
              currentState.queuedDirection,
            )
          : currentState.playerPosition;
        const canTurn =
          currentState.queuedDirection !== null &&
          !positionsEqual(requestedPosition, currentState.playerPosition);
        const activeDirection = canTurn
          ? currentState.queuedDirection
          : currentState.playerDirection;
        const playerPosition = activeDirection
          ? moveIfWalkable(maze.tiles, currentState.playerPosition, activeDirection)
          : currentState.playerPosition;

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

        <div
          className="game-stage"
          onTouchStart={(event) => {
            const touch = event.changedTouches[0];
            swipeStartRef.current = { row: touch.clientY, column: touch.clientX };
          }}
          onTouchEnd={(event) => {
            const swipeStart = swipeStartRef.current;
            const touch = event.changedTouches[0];

            if (!swipeStart) {
              return;
            }

            const deltaX = touch.clientX - swipeStart.column;
            const deltaY = touch.clientY - swipeStart.row;
            const swipeThreshold = 24;

            if (
              Math.abs(deltaX) < swipeThreshold &&
              Math.abs(deltaY) < swipeThreshold
            ) {
              swipeStartRef.current = null;
              return;
            }

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              queueDirection(deltaX > 0 ? "right" : "left");
            } else {
              queueDirection(deltaY > 0 ? "down" : "up");
            }

            swipeStartRef.current = null;
          }}
        >
          <div className="game-stage__board">
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

            {gameState.phase !== "playing" ? (
              <div className="game-result" role="alert" aria-live="assertive">
                <p className="game-result__eyebrow">
                  {gameState.phase === "victory" ? "victory" : "ghost caught you"}
                </p>
                <h2 className="game-result__title">
                  {gameState.phase === "victory"
                    ? `${character.name} cleared the maze`
                    : `${character.name} got trapped`}
                </h2>
                <p className="game-result__score">score {gameState.score}</p>
                <div className="game-result__actions">
                  <button type="button" className="game-result__button" onClick={restartGame}>
                    start over
                  </button>
                  <button
                    type="button"
                    className="game-result__button game-result__button--secondary"
                    onClick={onBackToSelection}
                  >
                    choose other character
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="game-stage__status" role="status" aria-live="polite">
            <p>swipe to move</p>
          </div>
        </div>

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
