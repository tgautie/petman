import { useEffect, useRef, useState } from "react";
import { CharacterCard } from "./CharacterCard";
import { characters } from "../data/characters";

const columnCount = 2;

function getCharacterIndex(id: string) {
  return characters.findIndex((character) => character.id === id);
}

function getNextIndex(currentIndex: number, key: string) {
  const rowCount = Math.ceil(characters.length / columnCount);
  const currentRow = Math.floor(currentIndex / columnCount);
  const currentColumn = currentIndex % columnCount;

  switch (key) {
    case "ArrowRight":
      return (currentIndex + 1) % characters.length;
    case "ArrowLeft":
      return (currentIndex - 1 + characters.length) % characters.length;
    case "ArrowDown":
      return ((currentRow + 1) % rowCount) * columnCount + currentColumn;
    case "ArrowUp":
      return ((currentRow - 1 + rowCount) % rowCount) * columnCount + currentColumn;
    default:
      return currentIndex;
  }
}

export function CharacterSelect() {
  const [focusedCharacterId, setFocusedCharacterId] = useState(characters[0].id);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const nextButton = buttonRefs.current[focusedCharacterId];
    nextButton?.focus();
  }, [focusedCharacterId]);

  const handleSelect = (characterId: string) => {
    setFocusedCharacterId(characterId);
    setSelectedCharacterId(characterId);
  };

  const handleMove = (key: string) => {
    const currentIndex = getCharacterIndex(focusedCharacterId);
    const nextIndex = getNextIndex(currentIndex, key);
    const safeIndex = nextIndex >= characters.length ? currentIndex : nextIndex;
    setFocusedCharacterId(characters[safeIndex].id);
  };

  return (
    <main className="screen-shell">
      <section className="selector-panel" aria-labelledby="choose-player-title">
        <div className="selector-panel__hud" aria-hidden="true">
          <span>1UP</span>
          <span>Petman</span>
          <span>{selectedCharacterId ? "player locked" : "insert coin"}</span>
        </div>

        <header className="selector-panel__header">
          <p className="selector-panel__eyebrow">retro roster select</p>
          <h1 id="choose-player-title">choose your player</h1>
          <p className="selector-panel__subtitle">
            Pick your companion before entering the maze.
          </p>
        </header>

        <div className="character-grid" role="list" aria-label="Player choices">
          {characters.map((character) => {
            const isFocused = character.id === focusedCharacterId;
            const isSelected = character.id === selectedCharacterId;

            return (
              <div key={character.id} role="listitem" className="character-grid__item">
                <CharacterCard
                  character={character}
                  isFocused={isFocused}
                  isSelected={isSelected}
                  onClick={() => handleSelect(character.id)}
                  onFocus={() => setFocusedCharacterId(character.id)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowUp" ||
                      event.key === "ArrowDown" ||
                      event.key === "ArrowLeft" ||
                      event.key === "ArrowRight"
                    ) {
                      event.preventDefault();
                      handleMove(event.key);
                      return;
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSelect(character.id);
                    }
                  }}
                  ref={(element: HTMLButtonElement | null) => {
                    buttonRefs.current[character.id] = element;
                  }}
                />
              </div>
            );
          })}
        </div>

        <footer className="selector-panel__footer">
          <p>tap a card or use arrow keys</p>
          <p>press enter or space to choose</p>
          <p className="selector-panel__picked">
            {selectedCharacterId
              ? `selected: ${characters.find((character) => character.id === selectedCharacterId)?.coatDescription}`
              : "no player selected"}
          </p>
        </footer>
      </section>
    </main>
  );
}
