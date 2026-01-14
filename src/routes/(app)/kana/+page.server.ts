import type { PageServerLoad } from "./$types";

import getKana from "$lib/server/getKana";

export const load: PageServerLoad = async () => {
	return { kana: getKana() };
};
