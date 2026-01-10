import type { PageServerLoad } from "./$types";

import n1 from "$lib/server/data/n1.json";
import n2 from "$lib/server/data/n2.json";
import n3 from "$lib/server/data/n3.json";
import n4 from "$lib/server/data/n4.json";
import n5 from "$lib/server/data/n5.json";
// import other from "$lib/server/data/other.json";

export type KanjiEntry = {
	strokes?: number | null;
	grade?: number | null;
	freq?: number | null;
	jlpt_new?: number | null;
	meanings?: string[];
	readings_on?: string[];
	readings_kun?: string[];
	wk_level?: number | null;
	wk_meanings?: string[] | null;
	wk_readings_on?: string[] | null;
	wk_readings_kun?: string[] | null;
	wk_radicals?: string[] | null;
	[key: string]: unknown;
};

type KanjiDb = Record<string, KanjiEntry>;

export type KanjiLevel = "n5" | "n4" | "n3" | "n2" | "n1" | "other";

export type KanjiItem = { kanji: string; info: KanjiEntry };

export type KanjiGroup = { level: KanjiLevel; items: KanjiItem[] };

const SOURCES: Array<{ level: KanjiLevel; db: KanjiDb }> = [
	{ level: "n5", db: n5 as KanjiDb },
	{ level: "n4", db: n4 as KanjiDb },
	{ level: "n3", db: n3 as KanjiDb },
	{ level: "n2", db: n2 as KanjiDb },
	{ level: "n1", db: n1 as KanjiDb }
	// { level: "other", db: other as KanjiDb }
];

export const load: PageServerLoad = (async () => {
	const seen = new Set<string>();
	const groups: KanjiGroup[] = [];

	for (const { level, db } of SOURCES) {
		const bucket: KanjiItem[] = [];

		for (const [kanji, info] of Object.entries(db)) {
			if (!kanji || seen.has(kanji)) continue;
			seen.add(kanji);
			bucket.push({ kanji, info });
		}

		// optional per-level sort by frequency
		bucket.sort((a, b) => (a.info.freq ?? Infinity) - (b.info.freq ?? Infinity));

		groups.push({ level, items: bucket });
	}

	return { groups };
}) satisfies PageServerLoad;
