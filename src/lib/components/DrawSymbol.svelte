<script lang="ts">
	import { onMount, tick } from "svelte";
	import getPathEndpoints from "$lib/svg/getPathEndpoints";
	import pointsToSmoothSVGPath from "$lib/svg/pointsToSmoothSVGPath";
	import shakeElement from "$lib/effects/shakeElement";
	import { loadKanjiSvg } from "$lib/svg/loadKanjiSvg";

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

	interface KanjiStroke {
		id: string;
		d: string;
		length: number;
		endpoints: {
			start: Point;
			end: Point;
		};
		completed: boolean;
	}

	interface Stroke {
		id: string;
		d: string;
		length: number;
		points: Point[];
		completed: boolean;
		valid: boolean;
	}

	let { symbol, onCompleteSymbol }: { symbol: string; onCompleteSymbol: () => void } = $props();

	let rawSymbolSvg: string = "";

	let viewBox: ViewBox = $state({ x: 0, y: 0, w: 109, h: 109 });
	let kanjiStrokes: KanjiStroke[] = $state([]);

	// control
	let activeIndex: number = $state(0);

	// references to the actual rendered <path> nodes
	let kanjiPathElements: (SVGPathElement | null)[] = $state([]);
	let strokePathElements: (SVGPathElement | null)[] = $state([]);

	let canvas: HTMLCanvasElement;

	let stageElement: HTMLDivElement;
	let isShaking: boolean = $state(false);

	// drawing
	let isDrawing: boolean = false;
	let strokes: Stroke[] = $state([]);
	let current: Stroke | null = $state(null);

	function parseViewBox(doc: Document): ViewBox {
		const svg = doc.querySelector("svg");
		const vb = svg?.getAttribute("viewBox") ?? "0 0 109 109";
		const [x, y, w, h] = vb.split(/\s+/).map(Number);
		return { x, y, w, h };
	}

	function markStrokeCorrectAndAdvance() {
		if (!kanjiStrokes.length) return;

		kanjiStrokes = kanjiStrokes.map((s, i) =>
			i === activeIndex ? { ...s, completed: true } : s
		);
		if (activeIndex < kanjiStrokes.length - 1) {
			activeIndex += 1;
		} else if (activeIndex < kanjiStrokes.length) {
			onCompleteSymbol();
		}
	}

	// function restart() {
	// 	activeIndex = 0;
	// 	kanjiStrokes = kanjiStrokes.map((s) => ({ ...s, completed: false }));
	// 	strokes = [];
	// 	current = null;
	//  completedSymbol = false;
	// }

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

	function isValidStroke(): boolean {
		const kPts = kanjiStrokes[activeIndex].endpoints;
		const sPts = getPathEndpoints(strokes[activeIndex].d);
		const kLen = kanjiStrokes[activeIndex].length;
		const sLen = strokePathElements[activeIndex]?.getTotalLength() ?? 0;

		const ptOffset = 15;
		const lenOffset = 8;

		// Start point condition
		if (
			sPts.start.x > kPts.start.x + ptOffset ||
			sPts.start.y > kPts.start.y + ptOffset ||
			sPts.start.x < kPts.start.x - ptOffset ||
			sPts.start.y < kPts.start.y - ptOffset
		) {
			return false;
		}
		// End point condition
		if (
			sPts.end.x > kPts.end.x + ptOffset ||
			sPts.end.y > kPts.end.y + ptOffset ||
			sPts.end.x < kPts.end.x - ptOffset ||
			sPts.end.y < kPts.end.y - ptOffset
		) {
			return false;
		}
		// Length condition
		if (sLen > kLen + lenOffset || sLen < kLen - lenOffset) {
			return false;
		}

		return true;
	}

	function pointerDown(e: PointerEvent) {
		const p = canvasToViewBox(getCanvasPoint(e));
		current = {
			id: "stroke-" + String(activeIndex),
			d: `M ${p.x.toFixed(4)} ${p.y.toFixed(4)}`,
			length: 0,
			points: [{ x: p.x, y: p.y }],
			completed: false,
			valid: false
		};

		strokes[activeIndex] = current;
		strokes = strokes;

		isDrawing = true;
		canvas.setPointerCapture(e.pointerId);
	}

	function pointerMove(e: PointerEvent) {
		if (!isDrawing || !current) return;

		const p = canvasToViewBox(getCanvasPoint(e));

		current.points.push({ x: p.x, y: p.y });
		current.d += ` L ${p.x.toFixed(4)} ${p.y.toFixed(4)}`;
		strokes[activeIndex] = current;
	}

	function pointerUp(e: PointerEvent) {
		isDrawing = false;

		const idx: number = activeIndex;

		if (current) {
			if (isValidStroke()) {
				current.d = pointsToSmoothSVGPath(current.points);
				current.completed = true;
				current.valid = true;

				strokes[idx] = current;
				strokes = strokes;

				markStrokeCorrectAndAdvance();
			} else {
				shakeElement(stageElement);

				// Remove current stroke so user can retry
				strokes[idx] = undefined as unknown as Stroke;
				strokes = strokes.filter((s) => s); // compact array so {#each} drops it

				current = null;
				console.log("failed");
			}
		}

		canvas.releasePointerCapture(e.pointerId);
	}

	onMount(async () => {
		rawSymbolSvg = await loadKanjiSvg(symbol);

		const svgDoc = new DOMParser().parseFromString(rawSymbolSvg, "image/svg+xml");

		viewBox = parseViewBox(svgDoc);
		kanjiStrokes = [...svgDoc.querySelectorAll("path")]
			.map((p) => {
				const d = p.getAttribute("d") ?? "";
				const id = p.getAttribute("id") ?? "";
				return {
					id: id,
					d: d,
					length: 0,
					endpoints: getPathEndpoints(d),
					completed: false
				};
			})
			.filter((p) => p.d);

		// Wait for Svelte to render the SVG paths so bindings are populated
		await tick();

		// Measure length of the actual displayed paths
		kanjiStrokes = kanjiStrokes.map((stroke, i) => {
			const path = kanjiPathElements[i];
			let len = 0;
			try {
				len = path ? path.getTotalLength() : 0;
			} catch {
				len = 0;
			}
			return { ...stroke, length: len };
		});
	});
</script>

<div class="component">
	<div class="stage" bind:this={stageElement} class:shake={isShaking}>
		<svg
			class="kanji-grid"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={`M ${viewBox.w / 2} ${4.5} L ${viewBox.w / 2} ${viewBox.h - 4.5}`}></path>
			<path d={`M ${4.5} ${viewBox.h / 2} L ${viewBox.w - 4.5} ${viewBox.h / 2}`}></path>
		</svg>
		<svg
			class="kanji"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<marker
					id="start-marker"
					viewBox="0 0 24 24"
					refX="12"
					refY="12"
					markerUnits="strokeWidth"
					markerWidth="6"
					markerHeight="6"
					orient="auto"
				>
					<circle class="start-cap" cx="12" cy="12" r="12" />
					<path
						d="M 8 12 L 15 12 M 13 9 L 16 12 L 13 15"
						fill="none"
						stroke="white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</marker>
				<marker
					id="end-marker"
					viewBox="0 0 24 24"
					refX="12"
					refY="12"
					markerUnits="strokeWidth"
					markerWidth="6"
					markerHeight="6"
					orient="auto"
				>
					<path
						class="end-cap"
						d="M 8 6 L 16 12 L 8 18 L 8 6 Z"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</marker>
			</defs>

			{#each kanjiStrokes as kStroke, i (i)}
				<path
					bind:this={kanjiPathElements[i]}
					d={kStroke.d}
					class:fill={true}
					class:hidden={i > activeIndex}
					class:completed={kStroke.completed}
				/>
				<path
					d={kStroke.d}
					class:dash={true}
					class:hidden={i !== activeIndex}
					class:completed={kStroke.completed}
					marker-start={kStroke.completed ? "" : "url(#start-marker)"}
					marker-end={kStroke.completed ? "" : "url(#end-marker)"}
				>
				</path>
			{/each}
		</svg>
		<svg
			class="svg-output"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			{#each strokes as stroke, i (i)}
				<path
					bind:this={strokePathElements[i]}
					id={stroke.id}
					d={stroke.d}
					class:hidden={stroke.completed && stroke.valid}
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

	<div class="status">Current Stroke: {activeIndex + 1} / {kanjiStrokes.length}</div>
</div>

<style>
	.component {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: fit-content;
		height: fit-content;
	}

	.stage {
		position: relative;
		aspect-ratio: 1 / 1;
		width: min(600px, 92vw);
		aspect-ratio: 1 / 1;
		border-radius: var(--radius-lg);
		background: var(--paper-soft);
		border: 2px solid var(--stroke-strong);
		box-shadow: var(--shadow);
		overflow: hidden;
		will-change: transform;
	}

	.kanji-grid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.95;
	}

	.kanji-grid path {
		fill: none;
		stroke: rgba(36, 27, 26, 0.12);
		stroke-width: 0.55;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 2.5 2;
	}

	/* main svg overlay */
	.kanji {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.kanji path {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.kanji path.fill {
		stroke-width: 3;
		stroke: rgba(36, 27, 26, 0.16);
	}

	.kanji path.dash {
		stroke: var(--coral);
		stroke-width: 1.2;
		stroke-dasharray: 1.6 3.2;
		filter: drop-shadow(0 2px 6px rgba(255, 92, 74, 0.12));
	}

	.kanji .hidden {
		opacity: 0;
	}

	/* markers */
	.kanji .start-cap {
		fill: var(--coral);
	}

	.kanji .end-cap {
		stroke: var(--coral);
		fill: var(--coral);
	}

	.kanji path.completed {
		stroke: var(--ink);
		opacity: 0.95;
	}

	/* user drawn strokes */
	.svg-output {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.svg-output path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 3.2;
		stroke-linecap: round;
		stroke-linejoin: round;
		filter: drop-shadow(0 2px 4px rgba(36, 27, 26, 0.08));
	}

	.svg-output path.hidden {
		opacity: 0;
	}

	/* input capture */
	.drawing-input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		touch-action: none; /* important for pointer drawing on mobile */
		cursor: crosshair;
	}

	.status {
		font-size: 0.95rem;
		color: var(--muted);
		font-weight: 650;
		letter-spacing: 0.02em;
	}

	@media (max-width: 640px) {
		.component {
			padding: 1rem;
		}

		.stage {
			border-radius: var(--radius-md);
		}
	}
</style>
