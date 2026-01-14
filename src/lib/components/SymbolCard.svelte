<script lang="ts">
	let {
		selected,
		symbol,
		subText,
		progress,
		onclick
	}: {
		selected: boolean;
		symbol: string;
		subText: string | null;
		progress: number;
		onclick: () => void;
	} = $props();

	function calcWidthFromProgress(progress: number) {
		if (progress < 0 || progress > 1)
			throw new Error(`Progress value for ${symbol} is invalid.`);

		return `${progress * 100}%`;
	}
</script>

<button
	class="symbolCard"
	class:selected
	type="button"
	aria-label={`Symbol ${symbol}`}
	aria-pressed={selected}
	{onclick}
>
	<div class="symbol">{symbol}</div>
	{#if subText}
		<div class="subText">{subText}</div>
	{/if}
	<div class="symbolProgress">
		<div class="progressIndicator" style:width={calcWidthFromProgress(progress)}></div>
	</div>
</button>

<style>
	.symbolCard {
		display: grid;
		gap: 0.2rem;
		place-items: center;
		min-height: 5rem;
		height: fit-content;
		padding: 0.5rem 0.2rem 0.5rem 0.2rem;
		border-radius: var(--radius-sm);
		border: 2px solid var(--stroke);
		background: var(--paper);
		cursor: pointer;
		transition:
			transform 140ms ease,
			border-color 140ms ease,
			box-shadow 140ms ease,
			background 140ms ease;
	}

	.symbolCard:hover {
		transform: translateY(-3px);
		border-color: var(--stroke-accent);
		box-shadow: var(--shadow);
	}

	.symbolCard:active {
		transform: translateY(-1px);
		box-shadow: var(--shadow-soft);
	}

	.symbolCard:focus-visible {
		outline: 3px solid var(--stroke-accent);
		outline-offset: 3px;
	}

	.symbolCard.selected {
		border-color: var(--stroke-accent);
		box-shadow: var(--shadow);
		background: rgba(255, 255, 255, 0.92);
	}

	.symbol {
		font-size: 2rem;
		font-weight: 800;
		line-height: 1;
		color: var(--ink);
	}

	.subText {
		font-size: 0.9rem;
		line-height: 1;
		margin: 0.25rem 0rem;
		color: var(--muted);
	}

	.symbolProgress {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		height: 0.5rem;
		border-radius: 1rem;
		width: 80%;
		overflow: hidden;
		background-color: lightgray;
	}

	.progressIndicator {
		background-color: var(--orange);
		height: 100%;
		width: 40%;
		border-radius: 1rem;
	}
</style>
