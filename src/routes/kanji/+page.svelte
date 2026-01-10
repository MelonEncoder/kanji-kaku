<script lang="ts">
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	let totalKanji: number = $state(0);

	for (const group of data.groups) {
		totalKanji += group.items.length;
	}

	function label(level: string) {
		return level === "other" ? "OTHER" : level.toUpperCase(); // n3 -> N3
	}
</script>

<main class="page">
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
								type="button"
								aria-label={`Kanji ${item.kanji}`}
							>
								<div class="kanji">{item.kanji}</div>
							</button>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</section>
</main>

<style>
	.page {
		min-height: 100dvh;
		padding: 1.25rem;
		display: flex;
		justify-content: center;
		color: var(--ink);
		font-family: var(--font);
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
			box-shadow 140ms ease;
	}

	.kanji-card:hover {
		transform: translateY(-2px);
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

	.kanji {
		font-size: 2.2rem;
		font-weight: 950;
		color: var(--ink);
	}

	.kanji-meaning {
		margin: 0;
		color: rgba(36, 27, 26, 0.68);
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: lowercase;
	}

	@media (max-width: 640px) {
		.page {
			padding: 1rem;
		}

		.grid {
			padding: 0.85rem;
		}

		.groupHeader {
			padding: 0.9rem;
		}
	}
</style>
