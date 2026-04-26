import type { CSSProperties } from "react";
import type { Character } from "../data/characters";
import { SPRITE_PALETTE, type SpritePixel } from "../data/spritePalette";

type PixelSpriteProps = {
  character: Character;
  sprite?: SpritePixel[][];
};

export function PixelSprite({ character, sprite }: PixelSpriteProps) {
  const activeSprite = sprite ?? character.sprite;
  const columnCount = activeSprite[0]?.length ?? 0;

  return (
    <div
      className="pixel-sprite"
      aria-hidden="true"
      style={
        {
          "--sprite-columns": String(columnCount),
        } as CSSProperties
      }
    >
      {activeSprite.flatMap((row, rowIndex) =>
        row.map((pixel, columnIndex) => (
          <span
            key={`${character.id}-${rowIndex}-${columnIndex}`}
            className={pixel === "." ? "pixel pixel--transparent" : "pixel"}
            style={
              pixel === "."
                ? undefined
                : ({
                    backgroundColor: SPRITE_PALETTE[pixel as SpritePixel],
                  } as CSSProperties)
            }
          />
        )),
      )}
    </div>
  );
}
