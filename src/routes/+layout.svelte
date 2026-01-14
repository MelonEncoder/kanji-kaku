<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	@import url("https://fonts.googleapis.com/css2?family=Murecho:wght@100..900&display=swap");

	:global(:root) {
		--ink: rgb(36, 27, 26);
		--ink-soft: rgba(36, 27, 26, 0.85);
		--ink-muted: rgba(36, 27, 26, 0.6);

		--paper: white;
		--light-gray: rgb(228, 227, 227);

		--coral: rgb(255, 92, 74);
		--coral-strong: rgb(232, 74, 58);
		--orange: rgb(255, 122, 60);
		--light-orange: rgb(252, 151, 88);

		--stroke: rgba(36, 27, 26, 0.16);
		--stroke-strong: rgba(36, 27, 26, 0.32);
		--stroke-accent: rgba(255, 92, 74, 0.45);

		--shadow: 0 8px 18px rgba(36, 27, 26, 0.06);
		--shadow-accent: 0 10px 22px rgba(255, 92, 74, 0.08);

		--radius-sm: 0.9rem;
		--radius-md: 1.35rem;
		--radius-lg: 1.9rem;

		--linear-grad: linear-gradient(90deg, var(--coral), var(--orange));

		--font: "Murecho";

		font-family:
			var(--font),
			ui-sans-serif,
			system-ui,
			-apple-system;
		color-scheme: light;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
