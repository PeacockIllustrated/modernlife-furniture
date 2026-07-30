"""
Subsets and converts the accent face for the web.

Anaktoria ships as 184KB of OpenType covering every ancient script George
Douros drew it for. This shop writes in one alphabet, so the web build carries
Latin, Latin-1, Latin Extended-A and the punctuation and currency British
commercial copy needs, and nothing else: about 18KB of woff2.

    python3 scripts/subset-accent-font.py path/to/Anaktoria.otf

Defaults to the vendored original if no path is given. Requires fonttools and
brotli, which are not project dependencies because this is run by hand when the
face changes, not on every build:

    pip install fonttools brotli
"""

import os
import sys

from fontTools import subset

DEFAULT_SRC = "vendor/fonts/Anaktoria.otf"
OUT = "app/fonts/Anaktoria-latin.woff2"

# Basic Latin, Latin-1 Supplement and Latin Extended-A, plus the punctuation,
# dashes, quotes and currency the copy actually uses. British spelling and
# prices in pounds are the whole requirement here.
UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x180))
    + [
        0x2010, 0x2011, 0x2012, 0x2013, 0x2014,  # hyphens and dashes
        0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E,  # quotes
        0x2020, 0x2021, 0x2022, 0x2026, 0x2030,  # daggers, bullet, ellipsis
        0x2039, 0x203A, 0x2044,  # guillemets, fraction slash
        0x00A3, 0x00A9, 0x00AE, 0x00B0, 0x20AC, 0x2122,  # £ © ® ° € ™
    ]
)


def main() -> int:
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    if not os.path.exists(src):
        print(f"no source font at {src}", file=sys.stderr)
        return 1

    options = subset.Options()
    options.flavor = "woff2"
    # Keep the shaping the hand relies on; drop the printer table.
    options.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl"]
    options.notdef_outline = False
    options.drop_tables += ["PCLT"]

    font = subset.load_font(src, options)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    subset.save_font(font, OUT, options)

    print(
        f"{src} {os.path.getsize(src):,} bytes "
        f"-> {OUT} {os.path.getsize(OUT):,} bytes"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
