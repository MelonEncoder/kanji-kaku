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

	let viewBox: ViewBox = $state({ x: 0, y: 0, w: 109, h: 109 });
	let kanjiStrokes: KanjiStroke[] = $state([]);

	// control
	let activeIndex = $state(0);

	// references to the actual rendered <path> nodes
	let pathElements: (SVGPathElement | null)[] = [];

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
	});
</script>

<main class="page">
	<div class="stage">
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
		width: 600px;
		height: 600px;
		border: 1px solid black;
	}
	.kanji-grid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.kanji-grid path {
		fill: none;
		stroke: lightgray;
		stroke-width: 0.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 2.5 2;
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
