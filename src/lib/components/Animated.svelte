<script lang="ts">
	import { onMount, tick } from "svelte";
	import { loadKanjiVgSvg, symbolToKanjiVgCode } from "$lib/svg/loadKanjiVgSvg";

	interface symbolStroke {
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

	let {
		symbol,
		loop = true,
		showControls = true
	}: {
		symbol: string;
		loop?: boolean;
		showControls?: boolean;
	} = $props();

	let rawsymbolSvg = "";
	let viewBox: ViewBox = $state({ x: 0, y: 0, w: 109, h: 109 });
	let symbolStrokes: symbolStroke[] = $state([]);

	let activeIndex = $state(0);

	let pathElements: (SVGPathElement | null)[] = [];

	// used to force-remount paths so CSS animations reliably restart
	let runKey = $state(0);

	let playing = $state(true);

	function toggle() {
		playing = !playing;
	}

	function parseViewBox(doc: Document): ViewBox {
		const svg = doc.querySelector("svg");
		const vb = svg?.getAttribute("viewBox") ?? "0 0 109 109";
		const [x, y, w, h] = vb.split(/\s+/).map(Number);
		return { x, y, w, h };
	}

	function resetToStart() {
		activeIndex = 0;
		symbolStrokes = symbolStrokes.map((s) => ({ ...s, completed: false }));
		runKey += 1;
	}

	function advance() {
		if (!symbolStrokes.length || !playing) return;

		symbolStrokes = symbolStrokes.map((s, i) =>
			i === activeIndex ? { ...s, completed: true } : s
		);

		if (activeIndex < symbolStrokes.length - 1) {
			activeIndex += 1;
			return;
		}

		if (loop) {
			setTimeout(() => {
				if (playing) resetToStart();
			}, 450);
		}
	}

	onMount(async () => {
		rawsymbolSvg = await loadKanjiVgSvg(symbolToKanjiVgCode(symbol));
		const svgDoc = new DOMParser().parseFromString(rawsymbolSvg, "image/svg+xml");
		viewBox = parseViewBox(svgDoc);

		const paths = [...svgDoc.querySelectorAll("path")]
			.map((p) => ({
				id: p.getAttribute("id") ?? "",
				d: p.getAttribute("d") ?? ""
			}))
			.filter((p) => p.d);

		symbolStrokes = paths.map(({ id, d }) => ({
			id,
			d,
			length: 0,
			completed: false
		}));

		await tick();

		symbolStrokes = symbolStrokes.map((stroke, i) => {
			const path = pathElements[i];
			let len = 0;
			try {
				len = path ? path.getTotalLength() : 0;
			} catch {
				len = 0;
			}
			return { ...stroke, length: len };
		});

		// kick off from the start
		runKey += 1;
	});
</script>

<section class="wrap" aria-label="Stroke order reference">
	<header class="head">
		<div class="title">
			<h2>Stroke order</h2>
			<p class="sub">Visual reference</p>
		</div>
		<div class="badge" aria-hidden="true">{symbol}</div>
	</header>

	<div class="stage" role="img" aria-label={`Stroke order animation for ${symbol}`}>
		<svg
			class="symbolGrid"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={`M ${viewBox.w / 2} ${4.5} L ${viewBox.w / 2} ${viewBox.h - 4.5}`} />
			<path d={`M ${4.5} ${viewBox.h / 2} L ${viewBox.w - 4.5} ${viewBox.h / 2}`} />
		</svg>

		<svg
			class="symbol"
			viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			{#each symbolStrokes as stroke, i (stroke.id + "-" + runKey)}
				<path
					bind:this={pathElements[i]}
					d={stroke.d}
					class:hidden={i > activeIndex}
					class:completed={stroke.completed}
					class:active={i === activeIndex && !stroke.completed}
					class:paused={!playing}
					onanimationend={() => {
						if (i === activeIndex) advance();
					}}
					style={`--len:${stroke.length}; --dur:${Math.max(35, Math.round(stroke.length)) * 14}ms;`}
				/>
			{/each}
		</svg>
	</div>

	{#if showControls}
		<div class="controls">
			<p class="status">
				Stroke {Math.min(activeIndex + 1, symbolStrokes.length)} / {symbolStrokes.length}
			</p>
			<div>
				<button type="button" onclick={toggle}>
					{playing ? "Pause" : "Play"}
				</button>
				<button type="button" onclick={resetToStart}> Restart </button>
			</div>
		</div>
	{/if}
</section>

<style>
	.wrap {
		width: min(420px, 92vw);

		border-radius: var(--radius-lg);
		background: var(--paper);
		border: 2px solid var(--stroke);

		box-shadow: var(--shadow-soft);
		padding: 0.9rem;
		color: var(--ink);
		font-family: var(--font);
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
		padding: 0 0.5rem;
	}

	.title h2 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.sub {
		margin: 0.15rem 0 0 0;
		font-size: 0.9rem;
		color: var(--muted);
		font-weight: 650;
		letter-spacing: 0.02em;
	}

	.badge {
		display: grid;
		place-items: center;

		width: 2.25rem;
		height: 2.25rem;

		font-weight: 900;
		font-size: 2rem;
		line-height: 1;
		overflow: visible;
	}

	.stage {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;

		border-radius: var(--radius-md);
		background: var(--paper);
		border: 2px solid var(--stroke-strong);

		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.symbolGrid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.95;
	}

	.symbolGrid path {
		fill: none;
		stroke: rgba(36, 27, 26, 0.12);
		stroke-width: 0.55;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 2.5 2;
	}

	.symbol {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.symbol path {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;

		/* used to animate strokes */
		stroke-dasharray: var(--len) var(--len);
		stroke-dashoffset: var(--len);
	}

	.symbol path.hidden {
		opacity: 0;
	}

	.symbol path.completed {
		opacity: 1;
		stroke: var(--light-gray);
		stroke-width: 3;
		stroke-dashoffset: 0;
		animation: none;
	}

	.symbol path.active {
		opacity: 1;
		stroke: var(--coral);
		stroke-width: 3.2;
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
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 0.75rem;
		padding: 0 0.5rem;
	}

	button {
		border: 2px solid var(--stroke);
		background: var(--paper);
		color: var(--ink);

		padding: 0.55rem 0.8rem;
		border-radius: var(--radius-sm);

		font-family: var(--font);
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;

		cursor: pointer;

		transition:
			transform 140ms ease,
			box-shadow 140ms ease,
			border-color 140ms ease,
			background 140ms ease;
	}

	button:hover {
		transform: translateY(-2px);
		border-color: var(--stroke-accent);
		box-shadow: var(--shadow);
		background: rgba(255, 255, 255, 0.96);
	}

	button:active {
		transform: translateY(-1px);
	}

	button:focus-visible {
		outline: 3px solid var(--stroke-accent);
		outline-offset: 3px;
	}

	.status {
		margin: 0;
		font-size: 0.9rem;
		color: var(--muted);
		font-weight: 650;
		letter-spacing: 0.02em;
	}
</style>
