export async function loadRawKvg(kvgCode: string): Promise<string> {
	const res = await fetch(`/assets/kanjivg/${kvgCode}.svg`);
	if (!res.ok) throw new Error(`SVG not found: ${kvgCode}.svg`);
	return await res.text();
}
