<script lang="ts">
	import KanjiInfoModal from "$lib/components/KanjiInfoModal.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";

	const { data }: { data: PageData } = $props<{ data: PageData }>();

	const totalKanji = $derived(data.groups.reduce((sum, group) => sum + group.items.length, 0));

	function label(level: string) {
		return level === "other" ? "OTHER" : level.toUpperCase(); // n3 -> N3
	}

	// ---- selection + sidebar state ----
	type Selected = { level: string; item: (typeof data.groups)[number]["items"][number] } | null;
	let selected: Selected = $state(null);

	const isOpen = $derived(!!selected);

	function selectKanji(level: string, item: (typeof data.groups)[number]["items"][number]) {
		selected = { level, item };
	}

	function closeSidebar() {
		selected = null;
	}

	function toggleSelect(level: string, item: (typeof data.groups)[number]["items"][number]) {
		if (selected?.item.kanji === item.kanji) closeSidebar();
		else selectKanji(level, item);
	}

	onMount(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) closeSidebar();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});
</script>

<main class="page" class:drawer-open={isOpen}>
	<section class="content">
		<header class="topbar">
			<h1 class="title">Kanji</h1>
			<p class="subtitle">{totalKanji} kanji</p>
		</header>

		<div class="stack" aria-label="Kanji groups">
			{#each data.groups as group (group.level)}
				<section class="group" id={group.level}>
					<header class="groupHeader">
						<div class="groupTitle">
							<h2>
								{#if group.level !== "other"}
									JLPT {label(group.level)}
								{:else}
									Not in JLPT
								{/if}
							</h2>
							<span class="count">{group.items.length}</span>
						</div>
					</header>

					<div class="grid" aria-label={`${label(group.level)} kanji`}>
						{#each group.items as item (item.kanji)}
							<button
								class="kanji-card"
								class:selected={selected?.item.kanji === item.kanji}
								type="button"
								aria-label={`Kanji ${item.kanji}`}
								aria-pressed={selected?.item.kanji === item.kanji}
								onclick={() => toggleSelect(group.level, item)}
							>
								<div class="kanji">{item.kanji}</div>
							</button>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</section>

	<!-- Backdrop (mobile + helps close) -->
	<button
		class="backdrop"
		type="button"
		aria-label="Close kanji details"
		class:open={isOpen}
		onclick={closeSidebar}
	></button>

	<!-- Sidebar drawer -->

	<KanjiInfoModal
		open={!!selected}
		kanji={selected?.item.kanji ?? ""}
		jlptLevel={selected?.level ?? "other"}
		info={{
			meanings: selected?.item.info.meanings ?? [],
			readings_on: selected?.item.info.readings_on ?? [],
			readings_kun: selected?.item.info.readings_kun ?? [],
			strokes: selected?.item.info.strokes ?? null
		}}
		onClose={() => (selected = null)}
		onPractice={(kanji: string) => {
			selected = null; // close modal
			console.log(kanji);
			// route to practice
			// goto(`/practice/${kanji}`);
		}}
	/>
</main>

<style>
	/* Layout */
	.page {
		min-height: 100dvh;
		padding: 1.25rem;
		display: flex;
		justify-content: center;

		color: var(--ink);
		font-family: var(--font);
		position: relative;
	}

	.content {
		width: min(1100px, 100%);
	}

	/* Top header matches your existing look */
	.topbar {
		max-width: var(--card-width, 900px);
		margin: 0 auto 1.25rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.title {
		margin: 0;
		font-size: 2.35rem;
		font-weight: 950;
		letter-spacing: 0.2px;
	}

	.subtitle {
		margin: 0;
		color: var(--muted);
		font-weight: 650;
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin: 0 auto;
	}

	.group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.groupHeader {
		padding: 1rem 1.1rem;
		border-radius: var(--radius-md);
		border: 2px solid var(--stroke);
		background: var(--linear-grad);
		box-shadow: var(--shadow-soft);
	}

	.groupTitle {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.groupHeader h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 950;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2.25rem;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		border: 2px solid rgba(36, 27, 26, 0.12);
		background: rgba(255, 255, 255, 0.65);
		color: var(--ink);
		font-weight: 900;
		letter-spacing: 0.04em;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(86px, 1fr));
		gap: 0.75rem;
	}

	.kanji-card {
		display: grid;
		place-items: center;
		height: 86px;

		border-radius: var(--radius-sm);
		border: 2px solid var(--stroke);
		background: var(--paper);
		box-shadow: var(--shadow-soft);

		cursor: pointer;
		transition:
			transform 140ms ease,
			border-color 140ms ease,
			box-shadow 140ms ease,
			background 140ms ease;
	}

	.kanji-card:hover {
		transform: translateY(-3px);
		border-color: var(--stroke-accent);
		box-shadow: var(--shadow);
	}

	.kanji-card:active {
		transform: translateY(-1px);
		box-shadow: var(--shadow-soft);
	}

	.kanji-card:focus-visible {
		outline: 3px solid var(--stroke-accent);
		outline-offset: 3px;
	}

	.kanji-card.selected {
		border-color: var(--stroke-accent);
		box-shadow: var(--shadow);
		background: rgba(255, 255, 255, 0.92);
	}

	.kanji {
		font-size: 2.2rem;
		font-weight: 950;
		color: var(--ink);
	}

	/* Backdrop */
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(15, 10, 10, 0.22);
		opacity: 0;
		pointer-events: none;
		transition: opacity 200ms ease;
		z-index: 40;
		border: 0;
		padding: 0;
	}

	.backdrop.open {
		opacity: 1;
		pointer-events: auto;
	}

	/* Desktop behavior:
	   keep backdrop disabled and allow content to remain interactive if you want
	   (you can remove this if you prefer modal behavior everywhere). */
	@media (min-width: 1024px) {
		.backdrop {
			/* On desktop, keep it subtle and non-blocking */
			pointer-events: none;
			opacity: 0;
		}
	}

	/* Mobile: turn into a bottom sheet */
	@media (max-width: 640px) {
		.page {
			padding: 1rem;
		}

		.groupHeader {
			padding: 0.9rem;
		}

		.backdrop.open {
			pointer-events: auto;
		}
	}
</style>
