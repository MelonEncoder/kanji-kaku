const precision: number = 4;

export default function pointsToPath(
	pts: { x: number; y: number }[],
	smoothing: "linear" | "quadratic"
): string {
	if (pts.length < 2) return "";
	let d = `M ${pts[0].x.toFixed(precision)} ${pts[0].y.toFixed(precision)}`;

	if (smoothing === "linear") {
		for (let i = 1; i < pts.length - 1; i += 1) {
			d += ` L ${pts[i].x.toFixed(precision)} ${pts[i].y.toFixed(precision)}`;
		}
	} else if (smoothing === "quadratic") {
		for (let i = 1; i < pts.length - 1; i += 1) {
			const midX = (pts[i].x + pts[i + 1].x) / 2;
			const midY = (pts[i].y + pts[i + 1].y) / 2;
			d += ` Q ${pts[i].x.toFixed(precision)} ${pts[i].y.toFixed(precision)} ${midX.toFixed(precision)} ${midY.toFixed(precision)}`;
		}
	}
	const last = pts[pts.length - 1];
	d += ` L ${last.x.toFixed(precision)} ${last.y.toFixed(precision)}`;
	return d;
}
