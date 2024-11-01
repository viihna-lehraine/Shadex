import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { commonUtils } from '../utils/common-utils';
import { genAllColorValues } from '../utils/conversion-utils';
import { core } from '../utils/core-utils';

function analogous(color: colors.HSL, numBoxes: number): number[] {
	try {
		if (!commonUtils.validateColorValues(color)) {
			console.error(`Invalid color value ${JSON.stringify(color)}`);

			return [];
		}

		const clonedColor = core.clone(color) as colors.HSL;

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

function diadic(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.clone(baseHue);
		const diadicHues = [];
		const randomDistance = paletteHelpers.getWeightedRandomInterval();
		const hue1 = clonedBaseHue;
		const hue2 = (hue1 + randomDistance) % 360;

		diadicHues.push(hue1, hue2);

		return diadicHues;
	} catch (error) {
		console.error(`Error generating diadic hues: ${error}`);
		return [];
	}
}

function hexadic(color: colors.HSL): number[] {
	try {
		const clonedColor = core.clone(color);

		if (!commonUtils.validateColorValues(clonedColor)) {
			console.error(`Invalid color value ${JSON.stringify(clonedColor)}`);

			return [];
		}

		const clonedBaseHSL = genAllColorValues(clonedColor).hsl as colors.HSL;

		if (!clonedBaseHSL) {
			throw new Error(
				'Unable to generate hexadic hues - missing HSL values'
			);
		}

		const hexadicHues: number[] = [];
		const baseHue = clonedBaseHSL.value.hue;
		const hue1 = baseHue;
		const hue2 = (hue1 + 180) % 360;
		const randomDistance = Math.floor(Math.random() * 61 + 30);
		const hue3 = (hue1 + randomDistance) % 360;
		const hue4 = (hue3 + 180) % 360;
		const hue5 = (hue1 + 360 - randomDistance) % 360;
		const hue6 = (hue5 + 180) % 360;

		hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);

		return hexadicHues;
	} catch (error) {
		console.error(`Error generating hexadic hues: ${error}`);
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

export const genHues: fnObjects.GenHues = {
	analogous,
	diadic,
	hexadic,
	splitComplementary,
	tetradic,
	triadic
};
