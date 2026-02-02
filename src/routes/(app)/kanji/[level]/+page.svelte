<script lang="ts">
	import KanjiInfoModal from "$lib/components/KanjiInfoModal.svelte";
	import SymbolCard from "$lib/components/SymbolCard.svelte";
	import { onMount } from "svelte";

	const { data } = $props();

	type Item = (typeof data.items)[number];
	type Selected = { item: Item } | null;

	const totalKanji = $derived(data.items.length);

	let selected: Selected = $state(null);
	const isOpen = $derived(!!selected);

	// Since this page is for ONE level, infer it from the returned items.
	const pageLevel = $derived.by(() => {
		const jlpt = data.items[0]?.jlpt ?? null; // 1..5 | null
		return jlpt === null ? "other" : (`N${jlpt}` as const);
	});

	const pageTitle = $derived.by(() => {
		return pageLevel === "other" ? "Not in JLPT" : `JLPT ${pageLevel}`;
	});

	function closeModal() {
		selected = null;
	}

	function toggleSelect(item: Item) {
		if (selected?.item.kvgId === item.kvgId) closeModal();
		else selected = { item };
	}

	onMount(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) closeModal();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});
</script>

<main class="page" class:drawer-open={isOpen}>
	<section class="content">
		<header class="topbar">
			<h1 class="title">{pageTitle}</h1>
			<p class="subtitle">{totalKanji} kanji</p>
		</header>

		<section class="section" aria-label={pageTitle}>
			<div class="grid" aria-label={`${pageTitle} kanji`}>
				{#each data.items as item (item.kvgId)}
					<SymbolCard
						selected={selected?.item.kvgId === item.kvgId}
						symbol={item.symbol}
						subText={null}
						progress={0}
						onclick={() => toggleSelect(item)}
					/>
				{/each}
			</div>

			{#if totalKanji === 0}
				<p class="empty">No kanji found for this level.</p>
			{/if}
		</section>
	</section>

	{#if selected}
		<KanjiInfoModal
			open={!!selected}
			kanji={selected.item.symbol}
			jlptLevel={selected.item.jlpt}
			meanings={selected.item.meanings}
			readings_on={selected.item.readings_on}
			readings_kun={selected.item.readings_kun}
			strokes={selected.item.strokes ?? 0}
			onClose={closeModal}
			onPractice={(kanji: string) => {
				closeModal();
				console.log(kanji);
				// goto(`/practice/${kanji}`);
			}}
		/>
	{/if}
</main>

<style>
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

	.section {
		margin: 0 auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(86px, 1fr));
		gap: 0.75rem;
	}

	.empty {
		margin: 0.75rem auto 0;
		text-align: center;
		color: var(--muted);
		font-weight: 650;
	}

	@media (max-width: 640px) {
		.page {
			padding: 1rem;
		}
	}
</style>
