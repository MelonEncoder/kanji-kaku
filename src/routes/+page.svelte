<script lang="ts">
	import { onMount, tick } from 'svelte';
	import rawKanjiSVG from '$lib/assets/0f9b4.svg?raw';

	interface KanjiStroke {
		id: string;
		d: string;
		length: number; // filled after mount from real DOM paths
	}

	interface ViewBox {
		x: number;
		y: number;
		w: number;
		h: number;
	}

	let viewBox: ViewBox = { x: 0, y: 0, w: 109, h: 109 };
	let kanjiStrokes: KanjiStroke[] = [];

	// control
	let activeIndex = 0;
	let completed: boolean[] = [];

	// references to the actual rendered <path> nodes
	let pathElements: (SVGPathElement | null)[] = [];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	function parseViewBox(doc: Document): ViewBox {
		const svg = doc.querySelector('svg');
		const vb = svg?.getAttribute('viewBox') ?? '0 0 109 109';
		const [x, y, w, h] = vb.split(/\s+/).map(Number);
		return { x, y, w, h };
	}

	function markStrokeCorrectAndAdvance() {
		if (!kanjiStrokes.length) return;

		completed = completed.map((value, i) => (i === activeIndex ? true : value));

		if (activeIndex < kanjiStrokes.length - 1) {
			activeIndex += 1;
		}
	}

	function restart() {
		activeIndex = 0;
		completed = kanjiStrokes.map(() => false);
		if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
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

		kanjiStrokes = paths.map(({ id, d }) => ({ id, d, length: 0 }));
		completed = kanjiStrokes.map(() => false);

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
			ctx.lineWidth = 4;
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
			{#each kanjiStrokes as stroke, i (stroke.id)}
				<path
					bind:this={pathElements[i]}
					d={stroke.d}
					class:hidden={i > activeIndex}
					class:completed={completed[i]}
					class:active={i === activeIndex && !completed[i]}
					style={`--len:${stroke.length}; --dur:${Math.max(30, Math.round(stroke.length)) * 18}ms;`}
				/>
			{/each}
		</svg>

		<canvas class="drawing" width="300" height="300" bind:this={canvas}></canvas>
	</div>

	<div class="controls">
		<button on:click={markStrokeCorrectAndAdvance}>Mark current stroke correct → next</button>
		<button on:click={restart}>Restart</button>
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

		/* dash trick */
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
		animation: draw var(--dur) ease forwards;
	}

	@keyframes draw {
		from {
			stroke-dashoffset: var(--len);
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	.drawing {
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
