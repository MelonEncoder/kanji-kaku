import type { KanjiEntry } from "$lib/types/kanji";
import kanjiJLPT from "$lib/server/data/kanji_jlpt.json";
// import kanjiOther from "$lib/server/data/kanji_other.json";

export type KanjiData = Record<string, KanjiEntry>;

// const SOURCES: Array<{ db: KanjiData }> = [
// 	{ db: JLPTKANJI as KanjiData }
// 	{ db: OTHERKANJI as KanjiDb }
// ];

export default function getKanji() {
	return kanjiJLPT as KanjiData;
}
