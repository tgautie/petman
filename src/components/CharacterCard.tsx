import { forwardRef } from "react";
import type { KeyboardEvent } from "react";
import type { Character } from "../data/characters";

type CharacterCardProps = {
  character: Character;
  isFocused: boolean;
  isSelected: boolean;
  onClick: () => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

export const CharacterCard = forwardRef<HTMLButtonElement, CharacterCardProps>(
  function CharacterCard(
    { character, isFocused, isSelected, onClick, onFocus, onKeyDown },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={[
          "character-card",
          isFocused ? "character-card--focused" : "",
          isSelected ? "character-card--selected" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        aria-pressed={isSelected}
        aria-label={`${character.coatDescription}${isSelected ? ", selected" : ""}`}
        data-character-id={character.id}
      >
        <div className="character-card__frame">
          <img
            className="character-card__portrait"
            src={character.portrait}
            alt=""
            aria-hidden="true"
          />
        </div>
        <p className="character-card__name">{character.name}</p>
        <p className="character-card__type">{character.coatDescription}</p>
      </button>
    );
  },
);
