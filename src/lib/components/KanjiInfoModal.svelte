<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import Animated from "$lib/components/Animated.svelte";

	let {
		open,
		kanji,
		jlptLevel,
		info,
		onClose,
		onPractice
	}: {
		open: boolean;
		kanji: string;
		jlptLevel: 1 | 2 | 3 | 4 | 5 | null;
		info: {
			meanings: string[];
			readings_on: string[];
			readings_kun: string[];
			strokes: number | null;
		};
		onClose: () => void;
		onPractice?: (kanji: string) => void;
	} = $props();

	function startPractice() {
		onPractice?.(kanji);
	}

	const label = (level: 1 | 2 | 3 | 4 | 5 | null) =>
		level === null ? "Not in JLPT" : `JLPT N${level}`;
	const fmt = (xs: string[]) => xs.join(" • ");

	const meanings = $derived(info?.meanings ?? []);
	const onReadings = $derived(info?.readings_on ?? []);
	const kunReadings = $derived(info?.readings_kun ?? []);
	const strokes = $derived(info?.strokes ?? null);
</script>

<Modal {open} title={`Kanji details for ${kanji}`} {onClose}>
	<header class="head">
		<div class="left">
			<div class="glyph" aria-hidden="true">{kanji}</div>
			<div class="meta">
				<p class="metaTop">{label(jlptLevel)}</p>
				<p class="metaBottom">
					{strokes !== null ? `${strokes} strokes` : "Stroke count unknown"}
				</p>
			</div>
		</div>

		<button class="close" type="button" onclick={onClose} aria-label="Close">✕</button>
	</header>

	<div class="body">
		<div class="col">
			<Animated symbol={kanji} showControls={true} loop={true} />
		</div>

		<div class="col details">
			<section class="grid">
				<div class="card">
					<h3 class="title">Meanings</h3>
					{#if meanings.length}
						<p class="text">{fmt(meanings)}</p>
					{:else}
						<p class="muted">—</p>
					{/if}
				</div>

				<div class="card">
					<h3 class="title">On</h3>
					{#if onReadings.length}
						<p class="text">{fmt(onReadings)}</p>
					{:else}
						<p class="muted">—</p>
					{/if}
				</div>

				<div class="card">
					<h3 class="title">Kun</h3>
					{#if kunReadings.length}
						<p class="text">{fmt(kunReadings)}</p>
					{:else}
						<p class="muted">—</p>
					{/if}
				</div>
			</section>
			<button class="practiceBtn" type="button" onclick={startPractice}>
				<span class="cta">Practice</span>
				<span class="arrow" aria-hidden="true">→</span>
			</button>
		</div>
	</div>
</Modal>

<style>
	.head {
		position: sticky;
		top: 0;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;

		padding: 1rem;
		background: var(--linear-grad);
		border-bottom: 2px solid rgba(36, 27, 26, 0.08);
	}

	.left {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		min-width: 0;
	}

	.glyph {
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		display: grid;
		place-items: center;

		border: 2px solid var(--stroke);
		background: var(--paper);
		box-shadow: var(--shadow-soft);

		font-size: 1.6rem;
		font-weight: 950;
		line-height: 1;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.metaTop {
		margin: 0;
		font-weight: 950;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 0.85rem;
	}

	.metaBottom {
		margin: 0;
		color: var(--muted);
		font-weight: 650;
		font-size: 0.9rem;
	}

	.close {
		border: 2px solid var(--stroke);
		background: var(--paper);
		color: var(--ink);
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 999px;
		cursor: pointer;
		box-shadow: var(--shadow-soft);
		font-weight: 950;
	}

	.close:hover {
		border-color: var(--stroke-accent);
		box-shadow: var(--shadow);
	}

	.body {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		padding: 1rem;
		background-color: var(--paper);
	}

	.col {
		display: flex;
		flex-direction: column;
		place-items: start center;
		justify-content: space-between;
	}

	.details {
		align-content: start;
		gap: 1rem;
	}

	.card {
		border: 2px solid rgba(36, 27, 26, 0.1);
		border-radius: var(--radius-md);
		background: var(--paper);
		box-shadow: var(--shadow-soft);
		padding: 0.9rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
		width: 100%;
	}

	.title {
		margin: 0 0 0.35rem 0;
		font-size: 0.85rem;
		font-weight: 950;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-align: left;
	}

	.text {
		margin: 0;
		color: rgba(36, 27, 26, 0.82);
		font-weight: 650;
		line-height: 1.35;
		text-align: left;
	}

	.muted {
		margin: 0;
		color: rgba(36, 27, 26, 0.5);
		font-weight: 650;
	}

	.practiceBtn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: white;
		border-radius: calc(var(--radius-md) + 2px);
		border: 2px solid var(--light-orange);
		background-color: var(--coral);
		box-shadow: 0 4px 0 var(--light-orange);
		padding: 1.75rem 1.5rem;
		cursor: pointer;
		margin-bottom: 10px;

		transition:
			transform 140ms ease,
			box-shadow 140ms ease,
			border-color 140ms ease,
			filter 140ms ease;
	}

	.practiceBtn:hover {
		filter: saturate(1.05);
		transform: translateY(-4px);
		box-shadow: 0 8px 0 var(--light-orange);
	}

	.practiceBtn:active {
		transform: translateY(4px);
		box-shadow: 0 0 0 var(--light-orange);
	}

	.practiceBtn:focus-visible {
		outline: 3px solid var(--stroke-accent);
		outline-offset: 3px;
	}

	.cta {
		font-weight: 950;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: 1.25rem;
		text-align: center;
	}

	.arrow {
		font-weight: 950;
		font-size: 1.1rem;
		opacity: 0.8;
	}

	@media (max-width: 800px) {
		.body {
			grid-template-columns: 1fr;
		}
	}
</style>
