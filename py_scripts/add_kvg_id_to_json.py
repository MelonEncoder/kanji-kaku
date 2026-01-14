
import json
import sys
from pathlib import Path

def symbol_to_kvg_id(symbol: str) -> str:
    """
    Convert a single Unicode character into a KanjiVG-style ID.
    Equivalent to the provided JavaScript function.
    """
    if not symbol:
        raise ValueError("Empty symbol")

    cp = ord(symbol)
    return format(cp, "x").zfill(5)


def convert_json(input_path: str):
    input_file = Path(input_path)

    if not input_file.exists():
        raise FileNotFoundError(f"File not found: {input_file}")

    with input_file.open("r", encoding="utf-8") as f:
        data = json.load(f)

    new_data = {}

    for symbol, entry in data.items():
        if not isinstance(symbol, str) or len(symbol) == 0:
            raise ValueError(f"Invalid key: {symbol}")

        # Copy entry to avoid mutating original structure
        new_entry = dict(entry)

        # Insert kvg_id
        new_entry["kvg_id"] = symbol_to_kvg_id(symbol)

        new_data[symbol] = new_entry

    output_file = input_file.with_name(f"new_{input_file.name}")

    with output_file.open("w", encoding="utf-8") as f:
        json.dump(new_data, f, ensure_ascii=False, indent=4)

    print(f"Converted file written to: {output_file}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convert_kvg.py <input.json>")
        sys.exit(1)

    convert_json(sys.argv[1])
