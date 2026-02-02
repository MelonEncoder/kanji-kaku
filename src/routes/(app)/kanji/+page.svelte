<script lang="ts">
	import { resolve } from "$app/paths";

	const levels = [
		{ label: "N5", href: "/kanji/N5", desc: "Beginner" },
		{ label: "N4", href: "/kanji/N4", desc: "Elementary" },
		{ label: "N3", href: "/kanji/N3", desc: "Intermediate" },
		{ label: "N2", href: "/kanji/N2", desc: "Upper-intermediate" },
		{ label: "N1", href: "/kanji/N1", desc: "Advanced" }
	] as const;
</script>

<main class="page">
	<section class="hero" aria-label="Kanji landing page">
		<header class="header">
			<h1 class="title">Kanji</h1>
			<p class="subtitle">
				Kanji (漢字) are the logographic characters used in Japanese writing. Each kanji
				carries meaning and can have multiple readings depending on context. Learning them
				is a big step toward reading real Japanese.
			</p>
		</header>

		<div class="panel">
			<h2 class="panelTitle">Choose a JLPT level</h2>
			<p class="panelSub">
				Start with N5 if you’re new. Move up as you get comfortable recognizing and writing
				more characters.
			</p>

			<nav class="grid" aria-label="JLPT kanji levels">
				{#each levels as level (level.label)}
					<a
						class="levelCard"
						href={resolve(level.href)}
						aria-label={`Go to JLPT ${level.label} kanji`}
					>
						<div class="levelTop">
							<span class="badge">{level.label}</span>
							<span class="desc">{level.desc}</span>
						</div>
						<span class="chev" aria-hidden="true">→</span>
					</a>
				{/each}
			</nav>
		</div>

		<footer class="note">
			<p>
				Tip: focus on recognition first, then practice writing stroke order once the meaning
				+ readings feel familiar.
			</p>
		</footer>
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

	.hero {
		width: min(980px, 100%);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.header {
		text-align: center;
		padding: 1.25rem 1.1rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--stroke);
		background: var(--linear-grad);
		box-shadow: var(--shadow-soft);
	}

	.title {
		margin: 0;
		font-size: 2.6rem;
		font-weight: 950;
		letter-spacing: 0.2px;
	}

	.subtitle {
		margin: 0.6rem auto 0;
		max-width: 72ch;
		color: var(--muted);
		font-weight: 650;
		line-height: 1.5;
	}

	.panel {
		padding: 1.1rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--stroke);
		background: rgba(255, 255, 255, 0.6);
		box-shadow: var(--shadow-soft);
	}

	.panelTitle {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 950;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.panelSub {
		margin: 0.45rem 0 0.95rem;
		color: var(--muted);
		font-weight: 650;
		line-height: 1.5;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.levelCard {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;

		padding: 0.9rem 0.95rem;
		border-radius: var(--radius-md);
		border: 2px solid var(--stroke);
		background: var(--card);
		box-shadow: var(--shadow-soft);

		text-decoration: none;
		color: inherit;

		transition:
			transform 120ms ease,
			box-shadow 120ms ease;
	}

	.levelCard:hover {
		transform: translateY(-1px);
		box-shadow:
			var(--shadow-soft),
			0 10px 30px rgba(36, 27, 26, 0.08);
	}

	.levelTop {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.badge {
		display: inline-flex;
		width: fit-content;
		padding: 0.18rem 0.55rem;
		border-radius: 999px;
		border: 2px solid rgba(36, 27, 26, 0.12);
		background: rgba(255, 255, 255, 0.7);
		font-weight: 950;
		letter-spacing: 0.05em;
	}

	.desc {
		color: var(--muted);
		font-weight: 650;
		font-size: 0.95rem;
	}

	.chev {
		font-weight: 950;
		opacity: 0.75;
	}

	.note {
		text-align: center;
		color: var(--muted);
		font-weight: 650;
		margin-top: 0.25rem;
	}

	.note p {
		margin: 0;
	}

	@media (max-width: 640px) {
		.page {
			padding: 1rem;
		}

		.title {
			font-size: 2.3rem;
		}
	}
</style>
