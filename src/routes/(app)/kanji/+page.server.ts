import type { PageServerLoad } from "./$types";

import getKanji from "$lib/server/getKanji";

export type PageItem = {
	kvgId: string;
	symbol: string;
	jlpt: 1 | 2 | 3 | 4 | 5 | null;
};

export const load: PageServerLoad = async () => {
	const items: PageItem[] = Object.entries(getKanji()).map(([id, item]) => {
		return {
			kvgId: id,
			symbol: item.symbol,
			jlpt: item.jlpt_new
		};
	});

	return { items };
};
