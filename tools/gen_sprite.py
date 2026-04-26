#!/usr/bin/env python3
import argparse
import math
from pathlib import Path

from PIL import Image

PALETTE = {
    ".": (0, 0, 0, 0),
    "O": (248, 244, 216, 255),
    "L": (243, 243, 239, 255),
    "G": (92, 95, 104, 255),
    "D": (44, 47, 54, 255),
    "B": (36, 37, 45, 255),
    "K": (17, 18, 22, 255),
    "A": (216, 167, 106, 255),
    "Y": (255, 212, 77, 255),
    "C": (106, 230, 255, 255),
    "R": (255, 115, 90, 255),
}


def dist(c1, c2):
    r1, g1, b1, _ = c1
    r2, g2, b2, _ = c2
    return math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)


def nearest_symbol(pixel, transparent_threshold, visible_colors):
    r, g, b, a = pixel

    if a < transparent_threshold:
        return "."

    pixel = (r, g, b, a)
    return min(visible_colors, key=lambda k: dist(pixel, visible_colors[k]))


def pixelate_sprite(
    input_path: str,
    txt_output_path: str | None = None,
    size: int = 32,
    transparent_threshold: int = 10,
):
    visible_colors = {k: v for k, v in PALETTE.items() if k != "."}
    img = Image.open(input_path).convert("RGBA")
    small = img.resize((size, size), Image.Resampling.LANCZOS)

    symbols = []
    indexed = Image.new("RGBA", (size, size), PALETTE["."])
    src = small.load()
    dst = indexed.load()

    for y in range(size):
        row = []
        for x in range(size):
            symbol = nearest_symbol(src[x, y], transparent_threshold, visible_colors)
            row.append(symbol)
            dst[x, y] = PALETTE[symbol]
        symbols.append("".join(row))

    print_terminal_sprite(indexed)

    ts_array = to_typescript_array(symbols)
    print()
    print(ts_array)

    if txt_output_path:
        Path(txt_output_path).write_text(ts_array + "\n")


def to_typescript_array(symbols: list[str]) -> str:
    rows = []
    for line in symbols:
        cells = ", ".join(symbol_to_const(char) for char in line)
        rows.append(f"  [{cells}]")
    return ",\n".join(rows)


def symbol_to_const(char: str) -> str:
    if char == ".":
        return "T"
    return char


def print_terminal_sprite(img: Image.Image):
    src = img.load()
    for y in range(img.height):
        parts = []
        for x in range(img.width):
            r, g, b, a = src[x, y]
            if a == 0:
                parts.append("  ")
            else:
                parts.append(f"\x1b[48;2;{r};{g};{b}m  \x1b[0m")
        print("".join(parts))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("--txt", default=None)
    parser.add_argument("--size", type=int, default=32)
    parser.add_argument("--transparent-threshold", type=int, default=10)
    args = parser.parse_args()

    pixelate_sprite(
        input_path=args.input,
        txt_output_path=args.txt,
        size=args.size,
        transparent_threshold=args.transparent_threshold,
    )


if __name__ == "__main__":
    main()
