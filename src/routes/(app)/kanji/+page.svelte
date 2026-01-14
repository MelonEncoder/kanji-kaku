<script lang="ts">
	import KanjiInfoModal from "$lib/components/KanjiInfoModal.svelte";
	import SymbolCard from "$lib/components/SymbolCard.svelte";
	import type { PageData } from "./$types";
	import { onMount } from "svelte";

	const { data }: { data: PageData } = $props();

	// server now returns: { pageItems: PageItem[] }
	const totalKanji = $derived(data.items.length);

	type Item = (typeof data.items)[number];
	type GroupLevel = 1 | 2 | 3 | 4 | 5 | "other";

	type Selected = { item: Item } | null;

	let selected: Selected = $state(null);
	const isOpen = $derived(!!selected);

	function label(level: GroupLevel) {
		return level === "other" ? "other" : `N${level}`;
	}

	// Build groups on the client (since server returns a flat list)
	const groups = $derived.by(() => {
		const buckets = new Map<GroupLevel, Item[]>([
			[5, []],
			[4, []],
			[3, []],
			[2, []],
			[1, []],
			["other", []]
		]);

		for (const item of data.items) {
			const level: GroupLevel = item.jlpt ?? "other";
			buckets.get(level)!.push(item);
		}

		// Optional: stable-ish sorting within a group
		for (const arr of buckets.values()) {
			arr.sort((a, b) => a.symbol.localeCompare(b.symbol));
		}

		const ordered: GroupLevel[] = [5, 4, 3, 2, 1, "other"];
		return ordered
			.map((level) => ({ level, items: buckets.get(level)! }))
			.filter((g) => g.items.length > 0);
	});

	function selectKanji(item: Item) {
		selected = { item };
	}

	function closeModal() {
		selected = null;
	}

	function toggleSelect(item: Item) {
		if (selected?.item.kvgId === item.kvgId) closeModal();
		else selectKanji(item);
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
			<h1 class="title">Kanji</h1>
			<p class="subtitle">{totalKanji} kanji</p>
		</header>

		<div class="stack" aria-label="Kanji groups">
			{#each groups as group (group.level)}
				<section class="group" id={label(group.level)}>
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
						{#each group.items as item (item.kvgId)}
							<SymbolCard
								selected={selected?.item.kvgId === item.kvgId}
								symbol={item.symbol}
								subText={null}
								progress={0}
								onclick={() => toggleSelect(item)}
							/>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</section>

	<!--
		Your new PageItem only contains { kvgId, symbol, jlpt }.
		So we pass minimal info here.
		If KanjiInfoModal fetches details internally by `kanji`, you're good.
	-->
	<KanjiInfoModal
		open={!!selected}
		kanji={selected?.item.symbol ?? ""}
		jlptLevel={selected?.item.jlpt ?? null}
		info={{
			meanings: [],
			readings_on: [],
			readings_kun: [],
			strokes: null
		}}
		onClose={closeModal}
		onPractice={(kanji: string) => {
			closeModal();
			console.log(kanji);
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

	@media (max-width: 640px) {
		.page {
			padding: 1rem;
		}

		.groupHeader {
			padding: 0.9rem;
		}
	}
</style>
