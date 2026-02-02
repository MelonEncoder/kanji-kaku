<script lang="ts">
	import type { PageData } from "./$types";
	import SymbolCard from "$lib/components/SymbolCard.svelte";
	import type { KanaEntry, KanaKind, KanaRow, KanaScript } from "$lib/types/kana";

	const { data }: { data: PageData } = $props<{ data: PageData }>();

	let currentScript: KanaScript = $state("hiragana");

	function setScript(script: KanaScript) {
		currentScript = script;
		sessionStorage.setItem("kana:script", script);
	}

	if (typeof window !== "undefined") {
		const saved = sessionStorage.getItem("kana:script") as KanaScript | null;
		if (saved) currentScript = saved;
	}

	// function startPractice() {
	// 	goto(resolve(`/practice/kana?script=${currentScript}`));
	// }

	function buildGojuonGrid(kind: KanaKind, rows: KanaRow[], script: KanaScript) {
		const items = (Object.values(data.kana[script]) as KanaEntry[]).filter(
			(c) => c.kind === kind
		);
		const grid: (KanaEntry | null)[] = [];
		for (const row of rows) {
			if (kind === "yoon") {
				for (const col of ["a", "u", "o"] as const) {
					grid.push(items.find((c) => c.row === row && c.col === col) ?? null);
				}
				continue;
			}
			for (const col of ["a", "i", "u", "e", "o"] as const) {
				grid.push(items.find((c) => c.row === row && c.col === col) ?? null);
			}
		}
		return grid;
	}

	// Which rows to include (no labels rendered, only used to preserve shape)
	const baseRows: KanaRow[] = ["v", "k", "s", "t", "n", "h", "m", "y", "r", "w", "other"];
	const dakutenRows: KanaRow[] = ["k", "s", "t", "h"];
	const handakutenRows: KanaRow[] = ["h"];
	const yoonRows: KanaRow[] = ["k", "g", "s", "z", "t", "n", "h", "b", "p", "m", "r"];

	const baseGrid = $derived(buildGojuonGrid("base", baseRows, currentScript));
	const dakutenGrid = $derived(buildGojuonGrid("dakuten", dakutenRows, currentScript));
	const handakutenGrid = $derived(buildGojuonGrid("handakuten", handakutenRows, currentScript));
	const yoonGrid = $derived(buildGojuonGrid("yoon", yoonRows, currentScript));
</script>

<main class="page">
	<section class="content">
		<header class="topbar">
			<h1 class="pageTitle">
				Let’s learn <span class="scriptWord">{currentScript}</span>!
			</h1>

			{#if currentScript === "hiragana"}
				<p>Used as the main writing system in Japanese</p>
			{:else}
				<p>These characters are often used for loanwords</p>
			{/if}

			<div
				class="tabSelector"
				role="tablist"
				aria-label="Kana Script"
				data-active={currentScript}
			>
				<div class="tabIndicator" aria-hidden="true"></div>

				<button
					type="button"
					role="tab"
					aria-selected={currentScript === "hiragana"}
					class="tabButton"
					onclick={() => setScript("hiragana")}
				>
					HIRAGANA
				</button>

				<button
					type="button"
					role="tab"
					aria-selected={currentScript === "katakana"}
					class="tabButton"
					onclick={() => setScript("katakana")}
				>
					KATAKANA
				</button>
			</div>
		</header>

		<div class="stack">
			{@render GridCard({ title: "Base", cells: baseGrid, script: currentScript })}
			{@render GridCard({ title: "Dakuten", cells: dakutenGrid, script: currentScript })}
			{@render GridCard({
				title: "Handakuten",
				cells: handakutenGrid,
				script: currentScript
			})}
			{@render GridCard({ title: "Yoon", cells: yoonGrid, script: currentScript })}
		</div>
	</section>
</main>

{#snippet GridCard({
	title,
	cells,
	script
}: {
	title: string;
	cells: (KanaEntry | null)[];
	script: KanaScript;
})}
	<section class="card" id={title.toLowerCase()}>
		{#if title.toLowerCase() !== "base"}
			<header class="cardHeader">
				<h2>{title}</h2>
			</header>
		{/if}

		<div class="gojuonGrid" aria-label={title}>
			{#each cells as cell, i (i)}
				{#if cell && script}
					<SymbolCard
						selected={false}
						symbol={cell.symbol}
						subText={cell.romaji}
						progress={0}
						onclick={() => {}}
					/>
				{:else}
					<div class="cell empty" aria-hidden="true"></div>
				{/if}
			{/each}
		</div>
	</section>
{/snippet}

<style>
	.page {
		display: flex;
		place-content: center;
		min-height: 100dvh;
		padding: 1.25rem;
		color: var(--ink);
		font-family: var(--font);
	}

	.content {
		max-width: 700px;
		width: 100%;
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		max-width: 1100px;
		margin: 0 auto;
		align-items: center;
	}

	.pageTitle {
		margin: 0;
		font-size: 2.25rem;
		font-weight: 900;
		letter-spacing: 0.2px;
		color: var(--ink);
	}

	.pageTitle .scriptWord {
		text-transform: capitalize;
		color: var(--coral);
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 6px;
	}

	/* Tob Bar content */
	.topbar {
		max-width: var(--card-width);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.topbar p {
		margin: 0;
		color: var(--muted);
		font-weight: 600;
	}

	.tabSelector {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 100%;
		max-width: 800px;

		align-items: center;
		gap: 0.25rem;
		padding: 0.35rem;

		border-radius: 999px;
		background: var(--paper-soft);
		border: 2px solid var(--stroke);

		box-shadow:
			var(--shadow),
			var(--shadow-accent),
			inset 0 0 0 1px var(--wash);
	}

	.tabButton {
		position: relative;
		z-index: 1;

		border: none;
		background: transparent;
		border-radius: 999px;

		padding: 0.6rem 1.1rem;

		font-size: 0.95rem;
		font-weight: 950;
		letter-spacing: 0.14em;

		cursor: pointer;
		color: var(--ink-soft);

		transition:
			color 140ms ease,
			transform 140ms ease,
			opacity 140ms ease;
	}

	.tabButton:hover {
		color: var(--ink);
		transform: translateY(-1px);
	}

	.tabButton[aria-selected="true"] {
		color: var(--ink);
	}

	.tabIndicator {
		position: absolute;
		top: 0.25rem;
		bottom: 0.25rem;
		left: 0.25rem;

		width: calc(50% - 0.45rem);
		border-radius: 999px;

		background: var(--linear-grad);
		border: 2px solid var(--stroke-accent);

		box-shadow: var(--shadow), var(--shadow-accent);

		transition: transform 180ms ease;
		transform: translateX(0%);
	}

	.tabSelector[data-active="katakana"] .tabIndicator {
		transform: translateX(100%);
	}

	.tabButton:focus-visible {
		outline: 3px solid var(--stroke-accent);
		outline-offset: 3px;
	}

	/* Kana Grids */
	.card {
		display: flex;
		flex-direction: column;
		max-width: var(--card-width);
		width: 100%;
		gap: 0.6rem;
	}

	.cardHeader {
		padding: 0.9rem 1.05rem;
		border-radius: var(--radius-sm);
		background: var(--paper-soft);
		border: 2px solid var(--stroke);
	}

	.cardHeader h2 {
		margin: 0;
		font-size: 1.05rem;
		letter-spacing: 0.14em;
		font-weight: 900;
		text-transform: uppercase;
		color: var(--ink);
		text-align: center;
	}

	.gojuonGrid {
		display: grid;
		grid-template-columns: repeat(5, minmax(86px, 1fr));
		gap: 0.6rem;
	}

	.card#yoon .gojuonGrid {
		grid-template-columns: repeat(3, minmax(86px, 1fr));
	}

	.cell {
		border-radius: var(--radius-sm);
		border: 2px solid var(--stroke);

		background: var(--paper-soft);
		padding: 0.7rem 0.55rem;
		text-align: center;
		cursor: pointer;

		box-shadow: var(--shadow-soft);

		transition:
			transform 140ms ease,
			box-shadow 140ms ease,
			border-color 140ms ease,
			background 140ms ease;
	}

	.cell:hover {
		transform: translateY(-3px);
		border-color: var(--stroke-accent);

		box-shadow: var(--shadow), var(--shadow-accent);

		background: var(--paper);
	}

	.cell:active {
		transform: translateY(-1px);
		box-shadow: var(--shadow);
	}

	.cell.empty {
		pointer-events: none;
		user-select: none;
	}
</style>
