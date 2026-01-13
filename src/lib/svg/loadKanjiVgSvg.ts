export function symbolToKanjiVgCode(symbol: string): string {
	const cp = symbol.codePointAt(0);
	if (!cp) throw new Error(`Invalid Symbol: "${symbol}"`);
	return `${cp.toString(16).padStart(5, "0")}`;
}

export async function loadKanjiVgSvg(kvgCode: string): Promise<string> {
	const res = await fetch(`/assets/kanjivg/${kvgCode}.svg`);
	if (!res.ok) throw new Error(`SVG not found: ${kvgCode}.svg`);
	return await res.text();
}
