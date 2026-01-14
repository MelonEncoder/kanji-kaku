<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<header class="site-header">
	<nav class="nav">
		<h1 class="brand"><a href={resolve("/")}>Kanji Notebook</a></h1>

		<ul class="nav-links">
			<li><a href={resolve("/kana")}>Kana</a></li>
			<li><a href={resolve("/kanji")}>Kanji</a></li>
			<li><a href={resolve("/about")}>About</a></li>
		</ul>
	</nav>
</header>

<style>
	.site-header {
		width: 100%;
		border-bottom: 1px solid color-mix(in srgb, black 10%, transparent);
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;

		max-width: 1200px;
		margin-inline: auto;
		padding: 1.25rem 2rem;
	}

	.brand {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.brand a {
		text-decoration: none;
		color: black;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-links a {
		text-decoration: none;
		font-weight: 500;
		color: inherit;
		opacity: 0.75;
		transition: opacity 0.15s ease;
	}

	.nav-links a:hover {
		opacity: 1;
	}
</style>
