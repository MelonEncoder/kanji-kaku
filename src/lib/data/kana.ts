export type KanaKind = "base" | "dakuten" | "handakuten" | "yoon" | "small" | "marks";

export type KanaScript = "hiragana" | "katakana";

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
	| "g"
	| "z"
	| "d"
	| "b"
	| "p"
	| "yoon"
	| "small"
	| "marks"
	| "other";

export type KanaCol = "a" | "i" | "u" | "e" | "o" | "none";

export interface KanaCell {
	romaji: string;
	kind: KanaKind;
	row: KanaRow;
	col: KanaCol;
	hiragana: { symbol: string; kvg: string };
	katakana: { symbol: string; kvg: string };
}

export const KANA: KanaCell[] = [
	{
		romaji: "a",
		kind: "base",
		row: "v",
		col: "a",
		hiragana: { symbol: "あ", kvg: "03042" },
		katakana: { symbol: "ア", kvg: "030A2" }
	},
	{
		romaji: "i",
		kind: "base",
		row: "v",
		col: "i",
		hiragana: { symbol: "い", kvg: "03044" },
		katakana: { symbol: "イ", kvg: "030A4" }
	},
	{
		romaji: "u",
		kind: "base",
		row: "v",
		col: "u",
		hiragana: { symbol: "う", kvg: "03046" },
		katakana: { symbol: "ウ", kvg: "030A6" }
	},
	{
		romaji: "e",
		kind: "base",
		row: "v",
		col: "e",
		hiragana: { symbol: "え", kvg: "03048" },
		katakana: { symbol: "エ", kvg: "030A8" }
	},
	{
		romaji: "o",
		kind: "base",
		row: "v",
		col: "o",
		hiragana: { symbol: "お", kvg: "0304A" },
		katakana: { symbol: "オ", kvg: "030AA" }
	},

	{
		romaji: "ka",
		kind: "base",
		row: "k",
		col: "a",
		hiragana: { symbol: "か", kvg: "0304B" },
		katakana: { symbol: "カ", kvg: "030AB" }
	},
	{
		romaji: "ki",
		kind: "base",
		row: "k",
		col: "i",
		hiragana: { symbol: "き", kvg: "0304D" },
		katakana: { symbol: "キ", kvg: "030AD" }
	},
	{
		romaji: "ku",
		kind: "base",
		row: "k",
		col: "u",
		hiragana: { symbol: "く", kvg: "0304F" },
		katakana: { symbol: "ク", kvg: "030AF" }
	},
	{
		romaji: "ke",
		kind: "base",
		row: "k",
		col: "e",
		hiragana: { symbol: "け", kvg: "03051" },
		katakana: { symbol: "ケ", kvg: "030B1" }
	},
	{
		romaji: "ko",
		kind: "base",
		row: "k",
		col: "o",
		hiragana: { symbol: "こ", kvg: "03053" },
		katakana: { symbol: "コ", kvg: "030B3" }
	},

	{
		romaji: "sa",
		kind: "base",
		row: "s",
		col: "a",
		hiragana: { symbol: "さ", kvg: "03055" },
		katakana: { symbol: "サ", kvg: "030B5" }
	},
	{
		romaji: "shi",
		kind: "base",
		row: "s",
		col: "i",
		hiragana: { symbol: "し", kvg: "03057" },
		katakana: { symbol: "シ", kvg: "030B7" }
	},
	{
		romaji: "su",
		kind: "base",
		row: "s",
		col: "u",
		hiragana: { symbol: "す", kvg: "03059" },
		katakana: { symbol: "ス", kvg: "030B9" }
	},
	{
		romaji: "se",
		kind: "base",
		row: "s",
		col: "e",
		hiragana: { symbol: "せ", kvg: "0305B" },
		katakana: { symbol: "セ", kvg: "030BB" }
	},
	{
		romaji: "so",
		kind: "base",
		row: "s",
		col: "o",
		hiragana: { symbol: "そ", kvg: "0305D" },
		katakana: { symbol: "ソ", kvg: "030BD" }
	},

	{
		romaji: "ta",
		kind: "base",
		row: "t",
		col: "a",
		hiragana: { symbol: "た", kvg: "0305F" },
		katakana: { symbol: "タ", kvg: "030BF" }
	},
	{
		romaji: "chi",
		kind: "base",
		row: "t",
		col: "i",
		hiragana: { symbol: "ち", kvg: "03061" },
		katakana: { symbol: "チ", kvg: "030C1" }
	},
	{
		romaji: "tsu",
		kind: "base",
		row: "t",
		col: "u",
		hiragana: { symbol: "つ", kvg: "03064" },
		katakana: { symbol: "ツ", kvg: "030C4" }
	},
	{
		romaji: "te",
		kind: "base",
		row: "t",
		col: "e",
		hiragana: { symbol: "て", kvg: "03066" },
		katakana: { symbol: "テ", kvg: "030C6" }
	},
	{
		romaji: "to",
		kind: "base",
		row: "t",
		col: "o",
		hiragana: { symbol: "と", kvg: "03068" },
		katakana: { symbol: "ト", kvg: "030C8" }
	},

	{
		romaji: "na",
		kind: "base",
		row: "n",
		col: "a",
		hiragana: { symbol: "な", kvg: "0306A" },
		katakana: { symbol: "ナ", kvg: "030CA" }
	},
	{
		romaji: "ni",
		kind: "base",
		row: "n",
		col: "i",
		hiragana: { symbol: "に", kvg: "0306B" },
		katakana: { symbol: "ニ", kvg: "030CB" }
	},
	{
		romaji: "nu",
		kind: "base",
		row: "n",
		col: "u",
		hiragana: { symbol: "ぬ", kvg: "0306C" },
		katakana: { symbol: "ヌ", kvg: "030CC" }
	},
	{
		romaji: "ne",
		kind: "base",
		row: "n",
		col: "e",
		hiragana: { symbol: "ね", kvg: "0306D" },
		katakana: { symbol: "ネ", kvg: "030CD" }
	},
	{
		romaji: "no",
		kind: "base",
		row: "n",
		col: "o",
		hiragana: { symbol: "の", kvg: "0306E" },
		katakana: { symbol: "ノ", kvg: "030CE" }
	},

	{
		romaji: "ha",
		kind: "base",
		row: "h",
		col: "a",
		hiragana: { symbol: "は", kvg: "0306F" },
		katakana: { symbol: "ハ", kvg: "030CF" }
	},
	{
		romaji: "hi",
		kind: "base",
		row: "h",
		col: "i",
		hiragana: { symbol: "ひ", kvg: "03072" },
		katakana: { symbol: "ヒ", kvg: "030D2" }
	},
	{
		romaji: "fu",
		kind: "base",
		row: "h",
		col: "u",
		hiragana: { symbol: "ふ", kvg: "03075" },
		katakana: { symbol: "フ", kvg: "030D5" }
	},
	{
		romaji: "he",
		kind: "base",
		row: "h",
		col: "e",
		hiragana: { symbol: "へ", kvg: "03078" },
		katakana: { symbol: "ヘ", kvg: "030D8" }
	},
	{
		romaji: "ho",
		kind: "base",
		row: "h",
		col: "o",
		hiragana: { symbol: "ほ", kvg: "0307B" },
		katakana: { symbol: "ホ", kvg: "030DB" }
	},

	{
		romaji: "ma",
		kind: "base",
		row: "m",
		col: "a",
		hiragana: { symbol: "ま", kvg: "0307E" },
		katakana: { symbol: "マ", kvg: "030DE" }
	},
	{
		romaji: "mi",
		kind: "base",
		row: "m",
		col: "i",
		hiragana: { symbol: "み", kvg: "0307F" },
		katakana: { symbol: "ミ", kvg: "030DF" }
	},
	{
		romaji: "mu",
		kind: "base",
		row: "m",
		col: "u",
		hiragana: { symbol: "む", kvg: "03080" },
		katakana: { symbol: "ム", kvg: "030E0" }
	},
	{
		romaji: "me",
		kind: "base",
		row: "m",
		col: "e",
		hiragana: { symbol: "め", kvg: "03081" },
		katakana: { symbol: "メ", kvg: "030E1" }
	},
	{
		romaji: "mo",
		kind: "base",
		row: "m",
		col: "o",
		hiragana: { symbol: "も", kvg: "03082" },
		katakana: { symbol: "モ", kvg: "030E2" }
	},

	{
		romaji: "ya",
		kind: "base",
		row: "y",
		col: "a",
		hiragana: { symbol: "や", kvg: "03084" },
		katakana: { symbol: "ヤ", kvg: "030E4" }
	},
	{
		romaji: "yu",
		kind: "base",
		row: "y",
		col: "u",
		hiragana: { symbol: "ゆ", kvg: "03086" },
		katakana: { symbol: "ユ", kvg: "030E6" }
	},
	{
		romaji: "yo",
		kind: "base",
		row: "y",
		col: "o",
		hiragana: { symbol: "よ", kvg: "03088" },
		katakana: { symbol: "ヨ", kvg: "030E8" }
	},

	{
		romaji: "ra",
		kind: "base",
		row: "r",
		col: "a",
		hiragana: { symbol: "ら", kvg: "03089" },
		katakana: { symbol: "ラ", kvg: "030E9" }
	},
	{
		romaji: "ri",
		kind: "base",
		row: "r",
		col: "i",
		hiragana: { symbol: "り", kvg: "0308A" },
		katakana: { symbol: "リ", kvg: "030EA" }
	},
	{
		romaji: "ru",
		kind: "base",
		row: "r",
		col: "u",
		hiragana: { symbol: "る", kvg: "0308B" },
		katakana: { symbol: "ル", kvg: "030EB" }
	},
	{
		romaji: "re",
		kind: "base",
		row: "r",
		col: "e",
		hiragana: { symbol: "れ", kvg: "0308C" },
		katakana: { symbol: "レ", kvg: "030EC" }
	},
	{
		romaji: "ro",
		kind: "base",
		row: "r",
		col: "o",
		hiragana: { symbol: "ろ", kvg: "0308D" },
		katakana: { symbol: "ロ", kvg: "030ED" }
	},

	{
		romaji: "wa",
		kind: "base",
		row: "w",
		col: "a",
		hiragana: { symbol: "わ", kvg: "0308F" },
		katakana: { symbol: "ワ", kvg: "030EF" }
	},
	{
		romaji: "wo",
		kind: "base",
		row: "w",
		col: "o",
		hiragana: { symbol: "を", kvg: "03092" },
		katakana: { symbol: "ヲ", kvg: "030F2" }
	},

	{
		romaji: "n",
		kind: "base",
		row: "other",
		col: "a",
		hiragana: { symbol: "ん", kvg: "03093" },
		katakana: { symbol: "ン", kvg: "030F3" }
	},

	// ===== DAKUTEN =====
	{
		romaji: "ga",
		kind: "dakuten",
		row: "k",
		col: "a",
		hiragana: { symbol: "が", kvg: "0304C" },
		katakana: { symbol: "ガ", kvg: "030AC" }
	},
	{
		romaji: "gi",
		kind: "dakuten",
		row: "k",
		col: "i",
		hiragana: { symbol: "ぎ", kvg: "0304E" },
		katakana: { symbol: "ギ", kvg: "030AE" }
	},
	{
		romaji: "gu",
		kind: "dakuten",
		row: "k",
		col: "u",
		hiragana: { symbol: "ぐ", kvg: "03050" },
		katakana: { symbol: "グ", kvg: "030B0" }
	},
	{
		romaji: "ge",
		kind: "dakuten",
		row: "k",
		col: "e",
		hiragana: { symbol: "げ", kvg: "03052" },
		katakana: { symbol: "ゲ", kvg: "030B2" }
	},
	{
		romaji: "go",
		kind: "dakuten",
		row: "k",
		col: "o",
		hiragana: { symbol: "ご", kvg: "03054" },
		katakana: { symbol: "ゴ", kvg: "030B4" }
	},

	{
		romaji: "za",
		kind: "dakuten",
		row: "s",
		col: "a",
		hiragana: { symbol: "ざ", kvg: "03056" },
		katakana: { symbol: "ザ", kvg: "030B6" }
	},
	{
		romaji: "ji",
		kind: "dakuten",
		row: "s",
		col: "i",
		hiragana: { symbol: "じ", kvg: "03058" },
		katakana: { symbol: "ジ", kvg: "030B8" }
	},
	{
		romaji: "zu",
		kind: "dakuten",
		row: "s",
		col: "u",
		hiragana: { symbol: "ず", kvg: "0305A" },
		katakana: { symbol: "ズ", kvg: "030BA" }
	},
	{
		romaji: "ze",
		kind: "dakuten",
		row: "s",
		col: "e",
		hiragana: { symbol: "ぜ", kvg: "0305C" },
		katakana: { symbol: "ゼ", kvg: "030BC" }
	},
	{
		romaji: "zo",
		kind: "dakuten",
		row: "s",
		col: "o",
		hiragana: { symbol: "ぞ", kvg: "0305E" },
		katakana: { symbol: "ゾ", kvg: "030BE" }
	},

	{
		romaji: "da",
		kind: "dakuten",
		row: "t",
		col: "a",
		hiragana: { symbol: "だ", kvg: "03060" },
		katakana: { symbol: "ダ", kvg: "030C0" }
	},
	{
		romaji: "ji",
		kind: "dakuten",
		row: "t",
		col: "i",
		hiragana: { symbol: "ぢ", kvg: "03062" },
		katakana: { symbol: "ヂ", kvg: "030C2" }
	},
	{
		romaji: "zu",
		kind: "dakuten",
		row: "t",
		col: "u",
		hiragana: { symbol: "づ", kvg: "03065" },
		katakana: { symbol: "ヅ", kvg: "030C5" }
	},
	{
		romaji: "de",
		kind: "dakuten",
		row: "t",
		col: "e",
		hiragana: { symbol: "で", kvg: "03067" },
		katakana: { symbol: "デ", kvg: "030C7" }
	},
	{
		romaji: "do",
		kind: "dakuten",
		row: "t",
		col: "o",
		hiragana: { symbol: "ど", kvg: "03069" },
		katakana: { symbol: "ド", kvg: "030C9" }
	},

	{
		romaji: "ba",
		kind: "dakuten",
		row: "h",
		col: "a",
		hiragana: { symbol: "ば", kvg: "03070" },
		katakana: { symbol: "バ", kvg: "030D0" }
	},
	{
		romaji: "bi",
		kind: "dakuten",
		row: "h",
		col: "i",
		hiragana: { symbol: "び", kvg: "03073" },
		katakana: { symbol: "ビ", kvg: "030D3" }
	},
	{
		romaji: "bu",
		kind: "dakuten",
		row: "h",
		col: "u",
		hiragana: { symbol: "ぶ", kvg: "03076" },
		katakana: { symbol: "ブ", kvg: "030D6" }
	},
	{
		romaji: "be",
		kind: "dakuten",
		row: "h",
		col: "e",
		hiragana: { symbol: "べ", kvg: "03079" },
		katakana: { symbol: "ベ", kvg: "030D9" }
	},
	{
		romaji: "bo",
		kind: "dakuten",
		row: "h",
		col: "o",
		hiragana: { symbol: "ぼ", kvg: "0307C" },
		katakana: { symbol: "ボ", kvg: "030DC" }
	},

	// ===== HANDAKUTEN =====
	{
		romaji: "pa",
		kind: "handakuten",
		row: "h",
		col: "a",
		hiragana: { symbol: "ぱ", kvg: "03071" },
		katakana: { symbol: "パ", kvg: "030D1" }
	},
	{
		romaji: "pi",
		kind: "handakuten",
		row: "h",
		col: "i",
		hiragana: { symbol: "ぴ", kvg: "03074" },
		katakana: { symbol: "ピ", kvg: "030D4" }
	},
	{
		romaji: "pu",
		kind: "handakuten",
		row: "h",
		col: "u",
		hiragana: { symbol: "ぷ", kvg: "03077" },
		katakana: { symbol: "プ", kvg: "030D7" }
	},
	{
		romaji: "pe",
		kind: "handakuten",
		row: "h",
		col: "e",
		hiragana: { symbol: "ぺ", kvg: "0307A" },
		katakana: { symbol: "ペ", kvg: "030DA" }
	},
	{
		romaji: "po",
		kind: "handakuten",
		row: "h",
		col: "o",
		hiragana: { symbol: "ぽ", kvg: "0307D" },
		katakana: { symbol: "ポ", kvg: "030DD" }
	},

	// ===== YŌON =====
	{
		romaji: "kya",
		kind: "yoon",
		row: "k",
		col: "a",
		hiragana: { symbol: "きゃ", kvg: "0304D-03083" },
		katakana: { symbol: "キャ", kvg: "030AD-030E3" }
	},
	{
		romaji: "kyu",
		kind: "yoon",
		row: "k",
		col: "u",
		hiragana: { symbol: "きゅ", kvg: "0304D-03085" },
		katakana: { symbol: "キュ", kvg: "030AD-030E5" }
	},
	{
		romaji: "kyo",
		kind: "yoon",
		row: "k",
		col: "o",
		hiragana: { symbol: "きょ", kvg: "0304D-03087" },
		katakana: { symbol: "キョ", kvg: "030AD-030E7" }
	},

	{
		romaji: "sha",
		kind: "yoon",
		row: "s",
		col: "a",
		hiragana: { symbol: "しゃ", kvg: "03057-03083" },
		katakana: { symbol: "シャ", kvg: "030B7-030E3" }
	},
	{
		romaji: "shu",
		kind: "yoon",
		row: "s",
		col: "u",
		hiragana: { symbol: "しゅ", kvg: "03057-03085" },
		katakana: { symbol: "シュ", kvg: "030B7-030E5" }
	},
	{
		romaji: "sho",
		kind: "yoon",
		row: "s",
		col: "o",
		hiragana: { symbol: "しょ", kvg: "03057-03087" },
		katakana: { symbol: "ショ", kvg: "030B7-030E7" }
	},

	{
		romaji: "cha",
		kind: "yoon",
		row: "t",
		col: "a",
		hiragana: { symbol: "ちゃ", kvg: "03061-03083" },
		katakana: { symbol: "チャ", kvg: "030C1-030E3" }
	},
	{
		romaji: "chu",
		kind: "yoon",
		row: "t",
		col: "u",
		hiragana: { symbol: "ちゅ", kvg: "03061-03085" },
		katakana: { symbol: "チュ", kvg: "030C1-030E5" }
	},
	{
		romaji: "cho",
		kind: "yoon",
		row: "t",
		col: "o",
		hiragana: { symbol: "ちょ", kvg: "03061-03087" },
		katakana: { symbol: "チョ", kvg: "030C1-030E7" }
	},

	{
		romaji: "nya",
		kind: "yoon",
		row: "n",
		col: "a",
		hiragana: { symbol: "にゃ", kvg: "0306B-03083" },
		katakana: { symbol: "ニャ", kvg: "030CB-030E3" }
	},
	{
		romaji: "nyu",
		kind: "yoon",
		row: "n",
		col: "u",
		hiragana: { symbol: "にゅ", kvg: "0306B-03085" },
		katakana: { symbol: "ニュ", kvg: "030CB-030E5" }
	},
	{
		romaji: "nyo",
		kind: "yoon",
		row: "n",
		col: "o",
		hiragana: { symbol: "にょ", kvg: "0306B-03087" },
		katakana: { symbol: "ニョ", kvg: "030CB-030E7" }
	},

	{
		romaji: "hya",
		kind: "yoon",
		row: "h",
		col: "a",
		hiragana: { symbol: "ひゃ", kvg: "03072-03083" },
		katakana: { symbol: "ヒャ", kvg: "030D2-030E3" }
	},
	{
		romaji: "hyu",
		kind: "yoon",
		row: "h",
		col: "u",
		hiragana: { symbol: "ひゅ", kvg: "03072-03085" },
		katakana: { symbol: "ヒュ", kvg: "030D2-030E5" }
	},
	{
		romaji: "hyo",
		kind: "yoon",
		row: "h",
		col: "o",
		hiragana: { symbol: "ひょ", kvg: "03072-03087" },
		katakana: { symbol: "ヒョ", kvg: "030D2-030E7" }
	},

	{
		romaji: "mya",
		kind: "yoon",
		row: "m",
		col: "a",
		hiragana: { symbol: "みゃ", kvg: "0307F-03083" },
		katakana: { symbol: "ミャ", kvg: "030DF-030E3" }
	},
	{
		romaji: "myu",
		kind: "yoon",
		row: "m",
		col: "u",
		hiragana: { symbol: "みゅ", kvg: "0307F-03085" },
		katakana: { symbol: "ミュ", kvg: "030DF-030E5" }
	},
	{
		romaji: "myo",
		kind: "yoon",
		row: "m",
		col: "o",
		hiragana: { symbol: "みょ", kvg: "0307F-03087" },
		katakana: { symbol: "ミョ", kvg: "030DF-030E7" }
	},

	{
		romaji: "rya",
		kind: "yoon",
		row: "r",
		col: "a",
		hiragana: { symbol: "りゃ", kvg: "0308A-03083" },
		katakana: { symbol: "リャ", kvg: "030EA-030E3" }
	},
	{
		romaji: "ryu",
		kind: "yoon",
		row: "r",
		col: "u",
		hiragana: { symbol: "りゅ", kvg: "0308A-03085" },
		katakana: { symbol: "リュ", kvg: "030EA-030E5" }
	},
	{
		romaji: "ryo",
		kind: "yoon",
		row: "r",
		col: "o",
		hiragana: { symbol: "りょ", kvg: "0308A-03087" },
		katakana: { symbol: "リョ", kvg: "030EA-030E7" }
	},

	{
		romaji: "gya",
		kind: "yoon",
		row: "g",
		col: "a",
		hiragana: { symbol: "ぎゃ", kvg: "0304E-03083" },
		katakana: { symbol: "ギャ", kvg: "030AE-030E3" }
	},
	{
		romaji: "gyu",
		kind: "yoon",
		row: "g",
		col: "u",
		hiragana: { symbol: "ぎゅ", kvg: "0304E-03085" },
		katakana: { symbol: "ギュ", kvg: "030AE-030E5" }
	},
	{
		romaji: "gyo",
		kind: "yoon",
		row: "g",
		col: "o",
		hiragana: { symbol: "ぎょ", kvg: "0304E-03087" },
		katakana: { symbol: "ギョ", kvg: "030AE-030E7" }
	},

	{
		romaji: "ja",
		kind: "yoon",
		row: "z",
		col: "a",
		hiragana: { symbol: "じゃ", kvg: "03058-03083" },
		katakana: { symbol: "ジャ", kvg: "030B8-030E3" }
	},
	{
		romaji: "ju",
		kind: "yoon",
		row: "z",
		col: "u",
		hiragana: { symbol: "じゅ", kvg: "03058-03085" },
		katakana: { symbol: "ジュ", kvg: "030B8-030E5" }
	},
	{
		romaji: "jo",
		kind: "yoon",
		row: "z",
		col: "o",
		hiragana: { symbol: "じょ", kvg: "03058-03087" },
		katakana: { symbol: "ジョ", kvg: "030B8-030E7" }
	},

	{
		romaji: "bya",
		kind: "yoon",
		row: "b",
		col: "a",
		hiragana: { symbol: "びゃ", kvg: "03073-03083" },
		katakana: { symbol: "ビャ", kvg: "030D3-030E3" }
	},
	{
		romaji: "byu",
		kind: "yoon",
		row: "b",
		col: "u",
		hiragana: { symbol: "びゅ", kvg: "03073-03085" },
		katakana: { symbol: "ビュ", kvg: "030D3-030E5" }
	},
	{
		romaji: "byo",
		kind: "yoon",
		row: "b",
		col: "o",
		hiragana: { symbol: "びょ", kvg: "03073-03087" },
		katakana: { symbol: "ビョ", kvg: "030D3-030E7" }
	},

	{
		romaji: "pya",
		kind: "yoon",
		row: "p",
		col: "a",
		hiragana: { symbol: "ぴゃ", kvg: "03074-03083" },
		katakana: { symbol: "ピャ", kvg: "030D4-030E3" }
	},
	{
		romaji: "pyu",
		kind: "yoon",
		row: "p",
		col: "u",
		hiragana: { symbol: "ぴゅ", kvg: "03074-03085" },
		katakana: { symbol: "ピュ", kvg: "030D4-030E5" }
	},
	{
		romaji: "pyo",
		kind: "yoon",
		row: "p",
		col: "o",
		hiragana: { symbol: "ぴょ", kvg: "03074-03087" },
		katakana: { symbol: "ピョ", kvg: "030D4-030E7" }
	},

	// ===== SMALL =====
	{
		romaji: "a",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ぁ", kvg: "03041" },
		katakana: { symbol: "ァ", kvg: "030A1" }
	},
	{
		romaji: "i",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ぃ", kvg: "03043" },
		katakana: { symbol: "ィ", kvg: "030A3" }
	},
	{
		romaji: "u",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ぅ", kvg: "03045" },
		katakana: { symbol: "ゥ", kvg: "030A5" }
	},
	{
		romaji: "e",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ぇ", kvg: "03047" },
		katakana: { symbol: "ェ", kvg: "030A7" }
	},
	{
		romaji: "o",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ぉ", kvg: "03049" },
		katakana: { symbol: "ォ", kvg: "030A9" }
	},
	{
		romaji: "ya",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ゃ", kvg: "03083" },
		katakana: { symbol: "ャ", kvg: "030E3" }
	},
	{
		romaji: "yu",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ゅ", kvg: "03085" },
		katakana: { symbol: "ュ", kvg: "030E5" }
	},
	{
		romaji: "yo",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "ょ", kvg: "03087" },
		katakana: { symbol: "ョ", kvg: "030E7" }
	},
	{
		romaji: "tsu",
		kind: "small",
		row: "small",
		col: "none",
		hiragana: { symbol: "っ", kvg: "03063" },
		katakana: { symbol: "ッ", kvg: "030C3" }
	}
] as const;
