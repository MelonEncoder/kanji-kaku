export default function pointsToSmoothSVGPath(pts: { x: number; y: number }[]): string {
	if (pts.length < 2) return '';
	let d = `M ${pts[0].x.toFixed(4)} ${pts[0].y.toFixed(4)}`;
	for (let i = 1; i < pts.length - 1; i += 1) {
		const midX = (pts[i].x + pts[i + 1].x) / 2;
		const midY = (pts[i].y + pts[i + 1].y) / 2;
		d += ` Q ${pts[i].x.toFixed(4)} ${pts[i].y.toFixed(4)} ${midX.toFixed(4)} ${midY.toFixed(4)}`;
	}
	const last = pts[pts.length - 1];
	d += ` L ${last.x.toFixed(4)} ${last.y.toFixed(4)}`;
	return d;
}
