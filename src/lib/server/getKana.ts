import type { KanaEntry, KanaScript } from "$lib/types/kana";
import kana from "$lib/server/data/kana.json";

export type KanaData = Record<KanaScript, Record<string, KanaEntry>>;

export default function getKana(): KanaData {
	return kana as KanaData;
}
