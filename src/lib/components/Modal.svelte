<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		children,
		open,
		title = "",
		onClose = () => {}
	}: {
		children: Snippet;
		open: boolean;
		title?: string;
		onClose?: () => void;
	} = $props();

	let panel: HTMLElement | null = $state(null);
	let lastActive: HTMLElement | null = $state(null);

	function close() {
		onClose();
	}

	function onBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function getFocusable(root: HTMLElement) {
		return Array.from(
			root.querySelectorAll<HTMLElement>(
				[
					"a[href]",
					"button:not([disabled])",
					"input:not([disabled])",
					"select:not([disabled])",
					"textarea:not([disabled])",
					'[tabindex]:not([tabindex="-1"])'
				].join(",")
			)
		).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
	}

	function trapTab(e: KeyboardEvent) {
		if (!panel) return;

		const items = getFocusable(panel);
		if (!items.length) return;

		const first = items[0];
		const last = items[items.length - 1];

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	// Keyboard + focus trap only while open
	$effect(() => {
		if (!open) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				close();
				return;
			}
			if (e.key === "Tab") trapTab(e);
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});

	// Scroll lock while open
	$effect(() => {
		if (!open) return;

		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = "hidden";

		return () => {
			document.documentElement.style.overflow = prev;
		};
	});

	// save active element on open, focus panel contents, restore on close
	$effect(() => {
		if (!open) return;

		lastActive = document.activeElement as HTMLElement;

		queueMicrotask(() => {
			if (!panel) return;
			const focusables = getFocusable(panel);
			(focusables[0] ?? panel).focus();
		});

		return () => {
			queueMicrotask(() => lastActive?.focus?.());
			lastActive = null;
		};
	});
</script>

{#if open}
	<button class="overlay" role="dialog" aria-modal="true" aria-label={title} onclick={onBackdrop}>
		<div class="panel" bind:this={panel} tabindex="-1">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</button>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 80;

		display: grid;
		place-items: center;

		background: rgba(15, 10, 10, 0.42);
		padding: 1rem;
	}

	.panel {
		width: min(940px, 100%);
		max-height: min(88dvh, 920px);
		overflow: auto;

		border-radius: var(--radius-lg);
		border: 2px solid var(--stroke);
		background: var(--paper-soft);
		box-shadow: var(--shadow);

		transform: translateY(8px);
		animation: pop 180ms ease-out forwards;

		outline: none;
	}

	@keyframes pop {
		to {
			transform: translateY(0);
		}
	}
</style>
