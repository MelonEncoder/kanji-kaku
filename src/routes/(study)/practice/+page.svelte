<script lang="ts">
	import DrawSymbol from "$lib/components/DrawSymbol.svelte";
	import { fly } from "svelte/transition";

	type Step = { type: "draw"; prompt: string; symbol: string; repsLabel?: string };

	const baseSymbol = "犬";
	const basePrompt = `Write the kanji for "cat"`;

	const steps: Step[] = Array.from({ length: 5 }, (_, i) => ({
		type: "draw",
		prompt: basePrompt,
		symbol: baseSymbol,
		repsLabel: `${i + 1} / 5`
	}));

	let stepIndex = $state(0);
	let uiState: "question" | "result" = $state("question");

	// key for animating the full content section
	let stepKey = $state(0);

	// Progress that reaches 100% at the last step
	let progress = $derived(steps.length <= 1 ? 1 : stepIndex / (steps.length - 1));

	let currentStep = $derived(steps[stepIndex]);

	let isCheckDissabled: boolean = $derived(currentStep?.type === "draw");

	function handleCompleteSymbol() {
		// only happens when the very last stroke is finished (DrawSymbol works as intended)
		uiState = "result";
	}

	function continueNext() {
		if (stepIndex >= steps.length - 1) {
			// finished session (you can route to a "done" screen later)
			uiState = "question";
			return;
		}

		stepIndex += 1;
		stepKey += 1; // triggers full-content transition
		uiState = "question";
	}
</script>

<main class="page" data-state={uiState}>
	<header class="topbar" aria-label="Practice header">
		<button class="iconButton closeButton" type="button" aria-label="close">
			<span aria-hidden="true">×</span>
		</button>

		<div
			class="progressBar"
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(progress * 100)}
		>
			<div
				class="progress"
				style={`width: ${Math.max(0, Math.min(1, progress)) * 100}%`}
			></div>
		</div>
		{#if currentStep?.type === "draw" && currentStep.repsLabel}
			<p class="repLabel" aria-label="Repetition counter">
				{currentStep.repsLabel}
			</p>
		{/if}
	</header>

	{#key stepKey}
		<section
			class="content"
			in:fly={{ x: 260, duration: 260 }}
			out:fly={{ x: -260, duration: 220 }}
		>
			<section class="practiceCard" aria-label="Practice prompt">
				<div class="practiceInfo">
					<p class="promptLabel">{currentStep?.type === "draw" ? "Write" : "Practice"}</p>

					<h1 class="infoMessage">
						{currentStep?.prompt}
					</h1>
				</div>

				{#if currentStep?.type === "draw"}
					<div class="glyphWrap" aria-label="Target kanji">
						<div class="glyph">{currentStep.symbol}</div>
					</div>
				{/if}
			</section>
			<section class="practiceActivity">
				{#if currentStep?.type === "draw"}
					<DrawSymbol
						symbol={currentStep.symbol}
						onCompleteSymbol={handleCompleteSymbol}
					/>
				{/if}
			</section>
		</section>
	{/key}

	<footer class="controls" aria-label="Practice controls">
		<section class="checkSection">
			<button
				class="primaryButton checkButton"
				type="button"
				aria-label="check"
				disabled={isCheckDissabled}
			>
				Check
			</button>
		</section>

		<section class="continueSection" aria-label="Result">
			<div class="resultLeft">
				<div class="checkMark" aria-hidden="true">✓</div>
				<div class="resultInfo">
					<h2 class="resultTitle">Nice!</h2>
					<button class="ghostButton reportButton" aria-label="report" type="button">
						Flag Issue
					</button>
				</div>
			</div>

			<div class="resultRight">
				<button
					class="primaryButton continueButton"
					type="button"
					aria-label="continue"
					onclick={continueNext}
				>
					Continue
				</button>
			</div>
		</section>
	</footer>
</main>

<style>
	.page {
		min-height: calc(100dvh - 4rem);
		padding: 2rem 0rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center; /* <-- add to match Kanji page centering */
		gap: 1.25rem;

		color: var(--ink);
		font-family: var(--font);
	}

	.topbar {
		width: 80%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;

		padding: 0.65rem 0.75rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--stroke);
		background: rgba(255, 255, 255, 0.78);
		box-shadow: var(--shadow-soft);
		backdrop-filter: blur(10px);
	}

	.iconButton {
		width: 42px;
		height: 42px;
		border-radius: 999px;
		border: 2px solid var(--stroke);
		background: rgba(255, 255, 255, 0.7);
		box-shadow: var(--shadow-soft);
		color: var(--ink);
		cursor: pointer;

		display: grid;
		place-items: center;
		font-weight: 950;
		line-height: 1;
		font-size: 1.4rem;
	}

	.iconButton:hover {
		border-color: var(--stroke-strong);
		transform: translateY(-1px);
	}

	.iconButton:active {
		transform: translateY(0px);
	}

	.progressBar {
		flex: 1 1 auto;
		height: 12px;
		border-radius: 999px;
		border: 2px solid var(--stroke);
		background: rgba(36, 27, 26, 0.06);
		overflow: hidden;
		position: relative;
		min-width: 140px; /* prevents collapsing on small widths */
	}

	.progress {
		height: 100%;
		border-radius: 999px;
		background: var(--linear-grad);
		box-shadow: var(--shadow-accent);
	}

	.repLabel {
		margin: 0; /* important: stop it from dropping */
		white-space: nowrap; /* keep it inline */
		color: var(--muted);
		font-weight: 850;
		font-size: 0.95rem;
	}

	/*  practice content */
	.content {
		display: flex;
		width: fit-content;
		flex-direction: column;
		gap: 1rem;
		will-change: transform;
		align-content: center;
	}

	.practiceActivity {
		display: flex;
		place-content: center;
		align-items: center;
	}

	.practiceCard {
		padding: 1.1rem 1.1rem 1rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: fit-content;
		border-radius: var(--radius-lg);
		border: 2px solid var(--stroke);
		background: var(--light-orange);
		box-shadow: var(--shadow);
	}

	.practiceInfo {
		display: grid;
		gap: 0.25rem;
	}

	.promptLabel {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.infoMessage {
		margin: 0;
		font-size: 1.55rem;
		font-weight: 950;
		letter-spacing: 0.2px;
	}

	.glyphWrap {
		display: grid;
		gap: 0.25rem;
		text-align: center;
		padding: 0.9rem 0.9rem;
		width: fit-content;
		border-radius: 999px;
		border: 2px solid var(--stroke);
		background: var(--paper);
	}

	.glyph {
		font-size: 2rem;
		font-weight: 950;
		line-height: 0.8;
	}

	/* footer controls */
	.controls {
		width: min(780px, 92%);
		padding-top: 1rem;
		flex: 0 0 auto;
	}

	.primaryButton {
		width: 100%;
		border: none;
		border-radius: var(--radius-lg);
		padding: 0.95rem 1.1rem;
		cursor: pointer;

		background: var(--linear-grad);
		color: white;
		font-weight: 950;
		letter-spacing: 0.2px;
		box-shadow: var(--shadow-accent);
	}

	.primaryButton:hover {
		filter: saturate(1.05);
		transform: translateY(-1px);
	}

	.primaryButton:active {
		transform: translateY(0px);
	}

	.primaryButton:disabled {
		cursor: not-allowed;
		transform: none;
		filter: none;
		background: rgba(36, 27, 26, 0.12);
		color: rgba(36, 27, 26, 0.45);
		box-shadow: none;
	}

	.primaryButton:disabled:hover {
		transform: none;
	}

	.ghostButton {
		border-radius: 999px;
		border: 2px solid var(--stroke);
		background: rgba(255, 255, 255, 0.65);
		padding: 0.45rem 0.7rem;
		cursor: pointer;
		font-weight: 850;
		color: var(--ink);
	}

	.ghostButton:hover {
		border-color: var(--stroke-strong);
		transform: translateY(-1px);
	}

	.checkSection {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		padding: 0.9rem 1rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--stroke);
		background: rgba(255, 255, 255, 0.86);
		box-shadow: var(--shadow);
		backdrop-filter: blur(10px);
	}

	.continueSection {
		display: none;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		padding: 0.9rem 1rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--stroke);
		background: rgba(255, 255, 255, 0.86);
		box-shadow: var(--shadow);
		backdrop-filter: blur(10px);
	}

	.resultLeft {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.checkMark {
		width: 42px;
		height: 42px;
		border-radius: 999px;
		border: 2px solid rgba(36, 27, 26, 0.12);
		background: var(--light-orange);
		display: grid;
		place-items: center;
		font-weight: 950;
	}

	.resultInfo {
		display: grid;
		gap: 0.25rem;
		min-width: 0;
	}

	.resultTitle {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 950;
	}

	.reportButton {
		width: fit-content;
	}

	.resultRight {
		display: flex;
		justify-content: flex-end;
	}

	.continueButton {
		width: auto;
		padding-inline: 1.15rem;
	}

	/*  state toggles (WIP-ready) */
	.page[data-state="question"] .checkSection {
		display: block;
	}
	.page[data-state="question"] .continueSection {
		display: none;
	}

	.page[data-state="result"] .checkSection {
		display: none;
	}
	.page[data-state="result"] .continueSection {
		display: flex;
	}

	/* mobile */
	@media (max-width: 640px) {
		.page {
			padding: 1rem;
		}

		.topbar {
			top: 0.5rem;
		}

		.infoMessage {
			font-size: 1.35rem;
		}

		.glyph {
			font-size: 4.1rem;
		}

		.continueSection {
			flex-direction: column;
			align-items: stretch;
		}

		.resultRight {
			width: 100%;
		}

		.continueButton {
			width: 100%;
		}
	}
</style>
