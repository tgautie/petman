import type { Character } from "../data/characters";

type HudProps = {
  character: Character;
  score: number;
  phaseLabel: string;
};

export function Hud({
  character,
  score,
  phaseLabel,
}: HudProps) {
  return (
    <header className="game-hud">
      <div className="game-hud__stats">
        <div className="game-hud__chip">
          <span className="game-hud__label">pet</span>
          <strong>{character.name}</strong>
        </div>
        <div className="game-hud__chip">
          <span className="game-hud__label">score</span>
          <strong>{score}</strong>
        </div>
        <div className="game-hud__chip">
          <span className="game-hud__label">state</span>
          <strong>{phaseLabel}</strong>
        </div>
      </div>
    </header>
  );
}
