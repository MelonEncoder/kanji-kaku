type Point = Readonly<{ x: number; y: number }>;

type PathEndpoints = Readonly<{
	start: Point;
	end: Point;
}>;

type Command = 'M' | 'm' | 'L' | 'l' | 'C' | 'c' | 'H' | 'h' | 'V' | 'v' | 'Z' | 'z';

function isCommandToken(t: string): t is Command {
	return /^[A-Za-z]$/.test(t) && 'MmLlCcHhVvZz'.includes(t);
}

function toNumber(t: string): number {
	const n = Number(t);
	if (!Number.isFinite(n)) throw new Error(`Invalid number token: "${t}"`);
	return n;
}

/**
 * Returns the first move-to point (start) and the final current point (end)
 * for an SVG path `d` string. Supports: M/m L/l C/c H/h V/v Z/z.
 */
export default function getPathEndpoints(d: string): PathEndpoints {
	const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:[eE][+-]?\d+)?/g);
	if (!tokens || tokens.length === 0) throw new Error('Empty/invalid path data.');

	let i = 0;
	let cmd: Command | null = null;

	let x = 0,
		y = 0;
	let startX: number | null = null,
		startY: number | null = null;
	let subpathStartX = 0,
		subpathStartY = 0;

	const ensureStart = () => {
		if (startX === null || startY === null) {
			startX = x;
			startY = y;
		}
	};

	while (i < tokens.length) {
		const t = tokens[i];

		if (isCommandToken(t)) {
			cmd = t;
			i++;
		} else if (cmd === null) {
			throw new Error(`Path must begin with a command. Got token "${t}".`);
		}

		switch (cmd) {
			case 'M': {
				if (i + 1 >= tokens.length) throw new Error('Incomplete M command.');
				x = toNumber(tokens[i++]);
				y = toNumber(tokens[i++]);
				ensureStart();
				subpathStartX = x;
				subpathStartY = y;
				cmd = 'L'; // implicit subsequent coords are treated as L
				break;
			}

			case 'm': {
				if (i + 1 >= tokens.length) throw new Error('Incomplete m command.');
				x += toNumber(tokens[i++]);
				y += toNumber(tokens[i++]);
				ensureStart();
				subpathStartX = x;
				subpathStartY = y;
				cmd = 'l';
				break;
			}

			case 'L': {
				if (i + 1 >= tokens.length) throw new Error('Incomplete L command.');
				x = toNumber(tokens[i++]);
				y = toNumber(tokens[i++]);
				break;
			}

			case 'l': {
				if (i + 1 >= tokens.length) throw new Error('Incomplete l command.');
				x += toNumber(tokens[i++]);
				y += toNumber(tokens[i++]);
				break;
			}

			case 'C': {
				// x1 y1 x2 y2 x y
				if (i + 5 >= tokens.length) throw new Error('Incomplete C command.');
				i += 4; // skip control points
				x = toNumber(tokens[i++]);
				y = toNumber(tokens[i++]);
				break;
			}

			case 'c': {
				if (i + 5 >= tokens.length) throw new Error('Incomplete c command.');
				i += 4;
				x += toNumber(tokens[i++]);
				y += toNumber(tokens[i++]);
				break;
			}

			case 'H': {
				if (i >= tokens.length) throw new Error('Incomplete H command.');
				x = toNumber(tokens[i++]);
				break;
			}

			case 'h': {
				if (i >= tokens.length) throw new Error('Incomplete h command.');
				x += toNumber(tokens[i++]);
				break;
			}

			case 'V': {
				if (i >= tokens.length) throw new Error('Incomplete V command.');
				y = toNumber(tokens[i++]);
				break;
			}

			case 'v': {
				if (i >= tokens.length) throw new Error('Incomplete v command.');
				y += toNumber(tokens[i++]);
				break;
			}

			case 'Z':
			case 'z': {
				// Close to subpath start
				x = subpathStartX;
				y = subpathStartY;
				break;
			}

			default: {
				// Exhaustive check
				const _never: never = cmd;
				throw new Error(`Unsupported command: ${String(_never)}`);
			}
		}
	}

	if (startX === null || startY === null) {
		throw new Error('No move-to command found; cannot determine start point.');
	}

	return {
		start: { x: startX, y: startY },
		end: { x, y }
	};
}

// Example:
// const d = "M82.02,12.38c0.6,1.12,0.71,2.48,0.62,3.15c-0.56,4.07-0.77,5.98-1.54,11.69";
// console.log(getPathStartEnd(d));
