import type { Direction } from "../game/types";

type TouchControlsProps = {
  disabled: boolean;
  onMove: (direction: Direction) => void;
};

const directions: Direction[] = ["up", "left", "down", "right"];

export function TouchControls({ disabled, onMove }: TouchControlsProps) {
  return (
    <section className="touch-controls" aria-label="Touch controls">
      {directions.map((direction) => (
        <button
          key={direction}
          type="button"
          className={`touch-controls__button touch-controls__button--${direction}`}
          disabled={disabled}
          onClick={() => onMove(direction)}
        >
          {direction}
        </button>
      ))}
    </section>
  );
}
