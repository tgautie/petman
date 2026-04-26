import { useEffect, useRef, useState } from "react";
import { CharacterCard } from "./CharacterCard";
import { characters } from "../data/characters";

const columnCount = 2;

type CharacterSelectProps = {
  onStartGame: (characterId: string) => void;
};

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

export function CharacterSelect({ onStartGame }: CharacterSelectProps) {
  const [focusedCharacterId, setFocusedCharacterId] = useState(characters[0].id);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const nextButton = buttonRefs.current[focusedCharacterId];
    nextButton?.focus();
  }, [focusedCharacterId]);

  useEffect(() => {
    if (!selectedCharacterId) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onStartGame(selectedCharacterId);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [onStartGame, selectedCharacterId]);

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
        <header className="selector-panel__header">
          <h1 id="choose-player-title">petman</h1>
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
          <p className="selector-panel__picked">
            {selectedCharacterId
              ? `launching ${characters.find((character) => character.id === selectedCharacterId)?.name}...`
              : "choose your player"}
          </p>
        </footer>
      </section>
    </main>
  );
}
