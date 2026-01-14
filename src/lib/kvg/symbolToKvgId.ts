export function symbolToKvgId(symbol: string): string {
	const cp = symbol.codePointAt(0);
	if (!cp) throw new Error(`Invalid Symbol: "${symbol}"`);
	return `${cp.toString(16).padStart(5, "0")}`;
}
