<script lang="ts">
	import { onMount, tick } from "svelte";
	import getPathEndpoints from "$lib/svg/getPathEndpoints";
	import pointsToPath from "$lib/svg/pointsToPath";
	import shakeElement from "$lib/effects/shakeElement";
	import { loadRawKvg } from "$lib/kvg/loadRawKvg";
	import { symbolToKvgId } from "$lib/kvg/symbolToKvgId";

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

	let {
		symbol,
		strokeHintsVisible,
		userStrokesVisible,
		onCompleteSymbol
	}: {
		symbol: string;
		strokeHintsVisible: boolean;
		userStrokesVisible: boolean;
		onCompleteSymbol: () => void;
	} = $props();

	let rawSymbolSvg: string = "";

	let viewBox: ViewBox = $state({ x: 0, y: 0, w: 109, h: 109 });
	let kanjiStrokes: KanjiStroke[] = $state([]);

	// control
	let activeIndex: number = $state(0);

	let kanjiPathElements: (SVGPathElement | null)[] = $state([]);
	let strokePathElements: (SVGPathElement | null)[] = $state([]);
	let canvas: HTMLCanvasElement;
	let stageElement: HTMLDivElement;

	let isShaking: boolean = $state(false);

	// drawing
	let isDrawing: boolean = $state(false);
	let strokes: Stroke[] = $state([]);
	let currentStroke: Stroke | null = $state(null);
	let failedCurrentStroke: boolean = $state(false);

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
			activeIndex += 1; // used as check for stroke visibility
			onCompleteSymbol();
		}
	}

	// function restart() {
	// 	activeIndex = 0;
	// 	kanjiStrokes = kanjiStrokes.map((s) => ({ ...s, completed: false }));
	// 	strokes = [];
	// 	currentStroke = null;
	//  completedSymbol = false;
	// }

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

		// start point condition
		if (
			sPts.start.x > kPts.start.x + ptOffset ||
			sPts.start.y > kPts.start.y + ptOffset ||
			sPts.start.x < kPts.start.x - ptOffset ||
			sPts.start.y < kPts.start.y - ptOffset
		) {
			return false;
		}
		// end point condition
		if (
			sPts.end.x > kPts.end.x + ptOffset ||
			sPts.end.y > kPts.end.y + ptOffset ||
			sPts.end.x < kPts.end.x - ptOffset ||
			sPts.end.y < kPts.end.y - ptOffset
		) {
			return false;
		}
		// length condition
		if (sLen > kLen + lenOffset || sLen < kLen - lenOffset) {
			return false;
		}

		return true;
	}

	function pointerDown(e: PointerEvent) {
		const p = canvasToViewBox(getCanvasPoint(e));
		currentStroke = {
			id: "stroke-" + String(activeIndex),
			d: `M ${p.x.toFixed(4)} ${p.y.toFixed(4)}`,
			length: 0,
			points: [{ x: p.x, y: p.y }],
			completed: false,
			valid: false
		};

		strokes[activeIndex] = currentStroke;
		strokes = strokes;

		isDrawing = true;
		canvas.setPointerCapture(e.pointerId);
	}

	function pointerMove(e: PointerEvent) {
		if (!isDrawing || !currentStroke) return;

		const p = canvasToViewBox(getCanvasPoint(e));

		currentStroke.points.push({ x: p.x, y: p.y });
		currentStroke.d += ` L ${p.x.toFixed(4)} ${p.y.toFixed(4)}`;
		strokes[activeIndex] = currentStroke;
	}

	function pointerUp(e: PointerEvent) {
		isDrawing = false;

		const idx: number = activeIndex;

		if (currentStroke) {
			if (isValidStroke()) {
				currentStroke.d = pointsToPath(currentStroke.points, "quadratic");
				currentStroke.completed = true;
				currentStroke.valid = true;
				failedCurrentStroke = false;

				strokes[idx] = currentStroke;
				strokes = strokes;

				markStrokeCorrectAndAdvance();
			} else {
				currentStroke = null;
				failedCurrentStroke = true;

				// Remove currentStroke stroke so user can retry
				strokes[idx] = undefined as unknown as Stroke;
				strokes = strokes.filter((s) => s); // compact array so {#each} drops it

				shakeElement(stageElement);
			}
		}

		canvas.releasePointerCapture(e.pointerId);
	}

	onMount(async () => {
		rawSymbolSvg = await loadRawKvg(symbolToKvgId(symbol));

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
			class="svgSymbolGrid"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={`M ${viewBox.w / 2} ${4.5} L ${viewBox.w / 2} ${viewBox.h - 4.5}`}></path>
			<path d={`M ${4.5} ${viewBox.h / 2} L ${viewBox.w - 4.5} ${viewBox.h / 2}`}></path>
		</svg>
		<svg
			class="svgSymbol"
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
					<circle class="startCap" cx="12" cy="12" r="12" />
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
						class="endCap"
						d="M 8 6 L 16 12 L 8 18 L 8 6 Z"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</marker>
			</defs>

			{#each kanjiStrokes as kStroke, i (i)}
				<g id={kStroke.id}>
					<path
						bind:this={kanjiPathElements[i]}
						class:strokeFill={kStroke.completed}
						d={kStroke.d}
						class:hidden={userStrokesVisible}
					/>
					<path
						class:strokeHintFill={strokeHintsVisible}
						d={kStroke.d}
						class:hidden={i !== activeIndex}
					/>
					<path
						class:strokeHint={strokeHintsVisible}
						d={kStroke.d}
						class:hidden={i !== activeIndex}
						marker-start={strokeHintsVisible ||
						(!strokeHintsVisible && failedCurrentStroke)
							? "url(#start-marker)"
							: undefined}
						marker-end={strokeHintsVisible ? "url(#end-marker)" : undefined}
					/>
					{#if strokes[i]}
						<path
							class="svgOutput"
							bind:this={strokePathElements[i]}
							d={strokes[i].d}
							id={strokes[i].id}
							class:hidden={!userStrokesVisible &&
								strokes[i].completed &&
								strokes[i].valid}
						>
						</path>
					{:else}
						<path class="svgOutput hidden" bind:this={strokePathElements[i]} d="">
						</path>
					{/if}
				</g>
			{/each}
		</svg>
		<canvas
			class="drawingInput"
			width="300"
			height="300"
			bind:this={canvas}
			onpointerdown={pointerDown}
			onpointermove={pointerMove}
			onpointerup={pointerUp}
		></canvas>
	</div>

	<div class="status">
		Strokes Completed: {activeIndex} /
		{kanjiStrokes.length}
	</div>
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

	.svgSymbolGrid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.95;
	}

	.svgSymbolGrid path {
		fill: none;
		stroke: rgba(36, 27, 26, 0.12);
		stroke-width: 0.55;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 2.5 2;
	}

	/* main svg overlay */
	.svgSymbol {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 1;
	}

	.svgSymbol .hidden {
		opacity: 0;
	}

	.svgSymbol path {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.svgSymbol path.strokeFill {
		stroke: var(--ink);
		stroke-width: 3;
	}

	.svgSymbol path.strokeHintFill {
		stroke: var(--light-gray);
		stroke-width: 3;
	}

	.svgSymbol path.strokeHint {
		stroke: var(--coral);
		stroke-width: 1.2;
		stroke-dasharray: 1.6 3.2;
	}

	/* hint markers */
	.svgSymbol .startCap {
		fill: var(--coral);
	}

	.svgSymbol .endCap {
		stroke: var(--coral);
		fill: var(--coral);
	}

	/* user drawn strokes */
	.svgOutput {
		fill: none;
		stroke: var(--ink);
		stroke-width: 3.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.svgOutput.hidden {
		opacity: 0;
	}

	/* input capture */
	.drawingInput {
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
