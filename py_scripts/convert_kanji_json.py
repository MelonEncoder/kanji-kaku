import json
import sys
from pathlib import Path


def kvg_id_to_unicode(kvg_id: str) -> str:
    """
    Convert a KanjiVG-style hex id string like:
      "04e01" -> "U+4E01"
      "26951" -> "U+26951"

    - Treats input as hex
    - Outputs uppercase hex
    - No fixed-width padding in the output (matches examples)
    """
    if not isinstance(kvg_id, str) or not kvg_id.strip():
        raise ValueError(f"Invalid kvg_id: {kvg_id!r}")

    hex_str = kvg_id.strip()
    try:
        value = int(hex_str, 16)
    except ValueError as e:
        raise ValueError(f"kvg_id is not valid hex: {kvg_id!r}") from e

    return f"U+{format(value, 'X')}"


def convert_to_kvg_keyed_with_unicode(input_path: str) -> Path:
    """
    Input:
      {
        "丁": { ..., "kvg_id": "04e01" },
        "書": { ..., "kvg_id": "066f8" }
      }

    Output:
      {
        "04e01": {
          "symbol": "丁",
          "unicode": "U+4E01",
          ... (all other fields except kvg_id)
        },
        "066f8": {
          "symbol": "書",
          "unicode": "U+66F8",
          ...
        }
      }

    Rules:
    - Top-level key becomes the original entry["kvg_id"] (kept as-is)
    - Original kanji key becomes "symbol"
    - Remove "kvg_id" from the record
    - Add "unicode" in official format derived from kvg_id
    - Output file is prefixed with new_
    """
    input_file = Path(input_path)
    if not input_file.exists():
        raise FileNotFoundError(f"File not found: {input_file}")

    with input_file.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, dict):
        raise ValueError("Top-level JSON must be an object/dict")

    new_data = {}

    for symbol, entry in data.items():
        if not isinstance(symbol, str) or not symbol:
            raise ValueError(f"Invalid symbol key: {symbol!r}")
        if not isinstance(entry, dict):
            raise ValueError(f"Entry for {symbol!r} must be an object/dict")

        kvg_id = entry.get("kvg_id")
        if not kvg_id:
            raise ValueError(f"Missing kvg_id for symbol {symbol!r}")

        unicode_str = kvg_id_to_unicode(kvg_id)

        # Build the transformed record
        new_entry = dict(entry)
        del new_entry["kvg_id"]  # remove old field
        new_entry["symbol"] = symbol  # add symbol
        new_entry["unicode"] = unicode_str  # add official unicode string

        if kvg_id in new_data:
            raise ValueError(f"Duplicate kvg_id detected: {kvg_id}")

        new_data[kvg_id] = new_entry

    output_file = input_file.with_name(f"new_{input_file.name}")
    with output_file.open("w", encoding="utf-8") as f:
        json.dump(new_data, f, ensure_ascii=False, indent=4)

    return output_file


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convert_to_kvg_keyed_with_unicode.py <input.json>")
        sys.exit(1)

    out = convert_to_kvg_keyed_with_unicode(sys.argv[1])
    print(f"Converted file written to: {out}")
