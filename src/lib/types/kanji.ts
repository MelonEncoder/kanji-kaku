/*
 * Currently all kanji in kanji_jlpt.json and kanji_other.json dataset
 * have thier key as the corresponding kanjivg file name or (kvg_id) (padded unicode hex value),
 * but not all kanji in the dataset have a corresponding {kvg_id}.svg file in the kanjivg directory /static/assets/kanjivg/
 */

export interface KanjiEntry {
	strokes: number | null;
	grade: number | null;
	freq: number | null;
	jlpt_new: 1 | 2 | 3 | 4 | 5 | null;
	meanings: string[];
	readings_on: string[];
	readings_kun: string[];
	wk_level: number | null;
	wk_meanings: string[] | null;
	wk_readings_on: string[] | null;
	wk_readings_kun: string[] | null;
	wk_radicals: string[] | null;
	symbol: string;
	unicode: string;
}

export interface KanjiItem {
	kvgId: string;
	info: KanjiEntry;
}
