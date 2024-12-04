// File: src/palette/utils/genHues.ts

import { HSL } from '../../index';
import { core } from '../../common';

function analogous(color: HSL, numBoxes: number): number[] {
	try {
		if (!core.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return [];
		}

		const clonedColor = core.clone(color) as HSL;

		const analogousHues: number[] = [];
		const baseHue = clonedColor.value.hue;
		const maxTotalDistance = 60;
		const minTotalDistance = Math.max(20, 10 + (numBoxes - 2) * 12);
		const totalIncrement =
			Math.floor(
				Math.random() * (maxTotalDistance - minTotalDistance + 1)
			) + minTotalDistance;
		const increment = Math.floor(totalIncrement / (numBoxes - 1));

		for (let i = 1; i < numBoxes; i++) {
			analogousHues.push((baseHue + increment * i) % 360);
		}

		return analogousHues;
	} catch (error) {
		console.error(`Error generating analogous hues: ${error}`);

		return [];
	}
}

function splitComplementary(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);
		const modifier = Math.floor(Math.random() * 11) + 20;

		return [
			(clonedBaseHue + 180 + modifier) % 360,
			(clonedBaseHue + 180 - modifier + 360) % 360
		];
	} catch (error) {
		console.error(`Error generating split complementary hues: ${error}`);

		return [];
	}
}

function tetradic(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);
		const randomOffset = Math.floor(Math.random() * 46) + 20;
		const distance =
			90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);

		return [
			clonedBaseHue,
			(clonedBaseHue + 180) % 360,
			(clonedBaseHue + distance) % 360,
			(clonedBaseHue + distance + 180) % 360
		];
	} catch (error) {
		console.error(`Error generating tetradic hues: ${error}`);

		return [];
	}
}

function triadic(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);

		return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
	} catch (error) {
		console.error(`Error generating triadic hues: ${error}`);

		return [];
	}
}

export const genHues = {
	analogous,
	splitComp: splitComplementary,
	tetradic,
	triadic
};
