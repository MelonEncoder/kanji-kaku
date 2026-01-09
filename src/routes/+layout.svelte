<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />
{@render children()}
<Footer />

<style>
	:global(:root) {
		--ink: #241b1a;
		--muted: rgba(36, 27, 26, 0.65);
		--card: rgba(255, 255, 255, 0.78);
		--stroke: rgba(36, 27, 26, 0.1);
		--shadow: 0 18px 50px rgba(255, 92, 74, 0.1);
		--coral: #ff5c4a;
		--orange: #ff8a4c;
		--peach: #ffd1c2;
		--blush: #ffe6e0;
		--wash: rgba(255, 92, 74, 0.18);
		--wash2: rgba(255, 138, 76, 0.16);
		--radius: 18px;
		--radius-lg: 24px;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			Segoe UI,
			Roboto,
			Helvetica,
			Arial,
			'Apple Color Emoji',
			'Segoe UI Emoji';
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
