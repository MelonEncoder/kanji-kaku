export function kanjiToKanjiVgFile(kanji: string): string {
	const cp = kanji.codePointAt(0);
	if (cp == null) throw new Error(`Invalid kanji: "${kanji}"`);
	return `${cp.toString(16).padStart(5, "0")}.svg`;
}

export async function loadSymbolSvg(kanji: string): Promise<string> {
	const file = kanjiToKanjiVgFile(kanji);
	const res = await fetch(`/assets/kanjivg/${file}`);
	if (!res.ok) throw new Error(`SVG not found: ${file}`);
	return await res.text();
}
