export type KanaKind = "base" | "dakuten" | "handakuten" | "yoon" | "small";
export type KanaRow =
	| "v"
	| "k"
	| "s"
	| "t"
	| "n"
	| "h"
	| "m"
	| "y"
	| "r"
	| "w"
	| "z"
	| "g"
	| "b"
	| "p"
	| "other"
	| "small";
export type KanaCol = "a" | "i" | "u" | "e" | "o" | "none";
export type KanaScript = "hiragana" | "katakana";

export type KanaEntry = {
	symbol: string;
	unicode: string;
	romaji: string;
	kind: KanaKind;
	row: KanaRow;
	col: KanaCol;
};
