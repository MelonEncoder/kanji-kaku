function* shakeGenerator(steps = 10, maxX = 12): Generator<Keyframe> {
	for (let i = 0; i < steps; i++) {
		const strength = 1 - i / steps;
		const x = (Math.random() * 2 - 1) * maxX * strength;

		yield {
			transform: `translateX(${x.toFixed(2)}px)`
		};
	}

	yield { transform: 'translateX(0)' };
}

export default function shakeElement(element: HTMLElement) {
	if (!element) return;

	const keyframes = Array.from(
		shakeGenerator(
			8 + Math.floor(Math.random() * 4), // steps (8–11)
			10 + Math.random() * 6 // amplitude (10–16px)
		)
	);

	element.animate(keyframes, {
		duration: 280 + Math.random() * 120, // 280–400ms
		easing: 'ease-out'
	});
}
