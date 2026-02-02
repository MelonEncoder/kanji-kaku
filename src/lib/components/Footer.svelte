<footer class="site-footer">
	<div class="inner">
		<p class="copyright">© 2026 Kanji Kaku</p>

		<nav aria-label="Footer">
			<ul class="links">
				<li>
					<a
						href="https://github.com/MelonEncoder/kanji-notebook.git"
						rel="noreferrer"
						target="_blank">GitHub</a
					>
				</li>
				<li><a href="https://discord.com/" rel="noreferrer" target="_blank">Discord</a></li>
			</ul>
		</nav>
	</div>
</footer>

<style>
	.site-footer {
		width: 100%;
		border-top: 1px solid color-mix(in srgb, black 10%, transparent);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;

		max-width: 1200px;
		margin-inline: auto;
		padding: 1.25rem 2rem;
	}

	.copyright {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 500;
		opacity: 0.75;
	}

	.links {
		display: flex;
		gap: 1.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.links a {
		text-decoration: none;
		font-weight: 500;
		color: inherit;
		opacity: 0.75;
		transition: opacity 0.15s ease;
	}

	.links a:hover {
		opacity: 1;
	}
</style>
