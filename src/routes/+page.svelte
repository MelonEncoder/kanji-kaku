<script lang="ts">
	import { onMount, tick } from 'svelte';
	import rawKanjiSVG from '$lib/assets/0f9b4.svg?raw';

	interface KanjiStroke {
		id: string;
		d: string;
		length: number;
		completed: boolean;
	}

	interface ViewBox {
		x: number;
		y: number;
		w: number;
		h: number;
	}

	interface Point {
		x: number;
		y: number;
	}

	interface Stroke {
		id: string;
		d: string;
		points: Point[];
	}

	let viewBox: ViewBox = $state({ x: 0, y: 0, w: 109, h: 109 });
	let kanjiStrokes: KanjiStroke[] = $state([]);

	// control
	let activeIndex = $state(0);

	// references to the actual rendered <path> nodes
	let pathElements: (SVGPathElement | null)[] = [];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	// drawing
	let isDrawing: boolean = false;
	let strokes: Stroke[] = $state([]);
	let current: Stroke | null = $state(null);

	function parseViewBox(doc: Document): ViewBox {
		const svg = doc.querySelector('svg');
		const vb = svg?.getAttribute('viewBox') ?? '0 0 109 109';
		const [x, y, w, h] = vb.split(/\s+/).map(Number);
		return { x, y, w, h };
	}

	function markStrokeCorrectAndAdvance() {
		if (!kanjiStrokes.length) return;

		kanjiStrokes = kanjiStrokes.map((s, i) => (i === activeIndex ? { ...s, completed: true } : s));
		if (activeIndex < kanjiStrokes.length - 1) {
			activeIndex += 1;
		}
	}

	function restart() {
		activeIndex = 0;
		kanjiStrokes = kanjiStrokes.map((s) => ({ ...s, completed: false }));
		strokes = [];
		current = null;
		if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	// DRAWING FUNCTIONS
	// Gets the point on the canvas even when scaled.
	function getCanvasPoint(e: PointerEvent): { x: number; y: number } {
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		return {
			x: (e.clientX - rect.left) * scaleX,
			y: (e.clientY - rect.top) * scaleY
		};
	}

	function canvasToViewBox(point: { x: number; y: number }) {
		return {
			x: viewBox.x + (point.x / canvas.width) * viewBox.w,
			y: viewBox.y + (point.y / canvas.height) * viewBox.h
		};
	}

	function pointerDown(e: PointerEvent) {
		if (!ctx) return;

		const p = canvasToViewBox(getCanvasPoint(e));
		current = { id: String(activeIndex), d: `M ${p.x} ${p.y}`, points: [{ x: p.x, y: p.y }] };

		strokes.push(current);

		isDrawing = true;
		canvas.setPointerCapture(e.pointerId);
	}

	function pointerMove(e: PointerEvent) {
		if (!ctx || !isDrawing) return;

		const p = canvasToViewBox(getCanvasPoint(e));

		if (current) {
			current.points.push({ x: p.x, y: p.y });
			current.d += ` L ${p.x} ${p.y}`;
			strokes[activeIndex] = current;
		}
	}

	function pointerUp(e: PointerEvent) {
		if (!ctx) return;
		isDrawing = false;

		if (current) {
			current.d = pointsToSmoothSvgPath(current.points);
			strokes[activeIndex] = current;
		}

		canvas.releasePointerCapture(e.pointerId);
	}

	function pointsToSmoothSvgPath(pts: { x: number; y: number }[]) {
		if (pts.length < 2) return '';
		let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
		for (let i = 1; i < pts.length - 1; i += 1) {
			const midX = (pts[i].x + pts[i + 1].x) / 2;
			const midY = (pts[i].y + pts[i + 1].y) / 2;
			d += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
		}
		const last = pts[pts.length - 1];
		d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
		return d;
	}

	onMount(async () => {
		const svgDoc = new DOMParser().parseFromString(rawKanjiSVG, 'image/svg+xml');
		viewBox = parseViewBox(svgDoc);

		const paths = [...svgDoc.querySelectorAll('path')]
			.map((p) => ({
				id: p.getAttribute('id') ?? '',
				d: p.getAttribute('d') ?? ''
			}))
			.filter((p) => p.d);

		kanjiStrokes = paths.map(({ id, d }) => ({ id, d, length: 0, completed: false }));

		// Wait for Svelte to render the SVG paths so bindings are populated
		await tick();

		// Measure length of the *actual displayed* paths
		kanjiStrokes = kanjiStrokes.map((stroke, i) => {
			const path = pathElements[i];
			let len = 0;
			try {
				len = path ? path.getTotalLength() : 0;
			} catch {
				len = 0;
			}
			return { ...stroke, length: len };
		});

		// Canvas overlay init (for user drawing)
		ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.lineWidth = 8;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = '#000';
		}
	});
</script>

<main class="page">
	<div class="stage">
		<svg
			class="kanji"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
		>
			{#each kanjiStrokes as stroke, i (i)}
				<path
					bind:this={pathElements[i]}
					d={stroke.d}
					class:hidden={i > activeIndex}
					class:completed={stroke.completed}
					class:active={i === activeIndex && !stroke.completed}
					style={`--len:${stroke.length}; --dur:${Math.max(35, Math.round(stroke.length)) * 15}ms;`}
				/>
			{/each}
		</svg>

		<svg
			class="svg-output"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
		>
			{#each strokes as stroke, i (i)}
				<path
					class=""
					id={stroke.id}
					d={stroke.d}
					class:hidden={i > activeIndex}
					class:active={i === activeIndex}
				></path>
			{/each}
		</svg>
		<canvas
			class="drawing-input"
			width="300"
			height="300"
			bind:this={canvas}
			onpointerdown={pointerDown}
			onpointermove={pointerMove}
			onpointerup={pointerUp}
		></canvas>
	</div>

	<div class="controls">
		<button onclick={markStrokeCorrectAndAdvance}>Mark current stroke correct → next</button>
		<button onclick={restart}>Restart</button>
		<div class="status">Active stroke: {activeIndex + 1} / {kanjiStrokes.length}</div>
	</div>
</main>

<style>
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.stage {
		position: relative;
		width: 300px;
		height: 300px;
		border: 1px solid black;
	}

	.kanji {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.kanji path {
		fill: none;
		stroke: #000;
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;

		/* dash trick for animating path */
		stroke-dasharray: var(--len) var(--len);
		stroke-dashoffset: var(--len);
	}

	.kanji path.hidden {
		opacity: 0;
	}

	.kanji path.completed {
		opacity: 1;
		stroke-dashoffset: 0;
		animation: none;
	}

	.kanji path.active {
		opacity: 1;
		animation: draw var(--dur) linear forwards;
	}

	@keyframes draw {
		from {
			stroke-dashoffset: var(--len);
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	.svg-output {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.svg-output path {
		fill: none;
		stroke: #000;
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.svg-output path.hidden {
		opacity: 0;
	}

	.svg-output path.active {
		opacity: 1;
	}

	.drawing-input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background: transparent;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 300px;
	}

	button {
		padding: 8px 10px;
	}

	.status {
		font-size: 14px;
		opacity: 0.8;
	}
</style>
