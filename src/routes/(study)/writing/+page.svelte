<script lang="ts">
	import DrawSymbol from "$lib/components/DrawSymbol.svelte";

	const kanji: string = "私は人";
</script>

<div class="page">
	{#each kanji as k, i (i)}
		<DrawSymbol
			symbol={k}
			strokesVisible={true}
			hintsVisible={true}
			onComplete={() => true}
			disabled={false}
		/>
	{/each}
</div>

<style>
</style>
