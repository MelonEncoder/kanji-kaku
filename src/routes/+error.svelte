<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";

	const message = page.error?.message ?? "An unexpected error occurred.";
</script>

<main class="page error-page">
	<section class="content">
		<header class="header">
			<h1 class="title">
				エラー
				<span class="code">{page.status}</span>
			</h1>

			<p class="subtitle">Something went wrong</p>
		</header>

		<div class="message">
			<p class="en">
				{message}
			</p>
		</div>

		<a href={resolve("/")} class="home-link"> ← ホームに戻る / Back to home </a>
	</section>
</main>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.code {
		display: inline-block;
		margin-left: 0.5rem;
		opacity: 0.6;
		font-weight: 500;
	}

	.message {
		margin-top: 1.5rem;
		line-height: 1.6;
	}

	.en {
		font-size: 0.95rem;
		opacity: 0.75;
	}

	.home-link {
		display: inline-block;
		margin-top: 2rem;
		text-decoration: none;
		font-weight: 500;
		opacity: 0.85;
	}

	.home-link:hover {
		opacity: 1;
		text-decoration: underline;
	}
</style>
