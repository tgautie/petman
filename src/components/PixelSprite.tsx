import type { CSSProperties } from "react";
import type { Character, SpritePixel } from "../data/characters";

type PixelSpriteProps = {
  character: Character;
};

const pixelClassByType: Record<SpritePixel, string> = {
  transparent: "pixel pixel--transparent",
  outline: "pixel pixel--outline",
  fill: "pixel pixel--fill",
  accent: "pixel pixel--accent",
  shadow: "pixel pixel--shadow",
};

export function PixelSprite({ character }: PixelSpriteProps) {
  return (
    <div
      className="pixel-sprite"
      aria-hidden="true"
      style={
        {
          "--sprite-outline": character.palette.outline,
          "--sprite-fill": character.palette.fill,
          "--sprite-accent": character.palette.accent,
          "--sprite-shadow": character.palette.shadow,
        } as CSSProperties
      }
    >
      {character.sprite.flatMap((row, rowIndex) =>
        row.map((pixel, columnIndex) => (
          <span
            key={`${character.id}-${rowIndex}-${columnIndex}`}
            className={pixelClassByType[pixel]}
          />
        )),
      )}
    </div>
  );
}
