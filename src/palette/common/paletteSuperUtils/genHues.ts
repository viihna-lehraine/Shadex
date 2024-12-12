// File: src/palette/common/paletteSuperUtils/genHues.ts

import { HSL, PaletteCommon_SuperUtils_GenHues } from '../../../index/index.js';
import { core, utils } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { paletteUtils } from '../paletteUtils/index.js';

const mode = data.mode;

const genAllColorValues = utils.conversion.genAllColorValues;
const getWeightedRandomInterval =
	paletteUtils.probability.getWeightedRandomInterval;
const validateColorValues = core.validate.colorValues;

function analogous(color: HSL, numBoxes: number): number[] {
	try {
		if (!validateColorValues(color)) {
			if (mode.errorLogs)
				console.error(`Invalid color value ${JSON.stringify(color)}`);

			return [];
		}

		const clonedColor = core.base.clone(color) as HSL;

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
		if (mode.errorLogs)
			console.error(`Error generating analogous hues: ${error}`);

		return [];
	}
}

function diadic(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.base.clone(baseHue);
		const diadicHues = [];
		const randomDistance = getWeightedRandomInterval();
		const hue1 = clonedBaseHue;
		const hue2 = (hue1 + randomDistance) % 360;

		diadicHues.push(hue1, hue2);

		return diadicHues;
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Error generating diadic hues: ${error}`);

		return [];
	}
}

function hexadic(color: HSL): number[] {
	try {
		const clonedColor = core.base.clone(color);

		if (!validateColorValues(clonedColor)) {
			if (mode.errorLogs)
				console.error(
					`Invalid color value ${JSON.stringify(clonedColor)}`
				);

			return [];
		}

		const clonedBaseHSL = genAllColorValues(clonedColor).hsl as HSL;

		if (!clonedBaseHSL) {
			if (!mode.gracefulErrors)
				throw new Error(
					'Unable to generate hexadic hues - missing HSL values'
				);
			else if (mode.errorLogs)
				console.error(
					'Unable to generate hexadic hues - missing HSL values'
				);
			else if (!mode.quiet)
				console.error('Error generating hexadic hues');

			return [];
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
		if (mode.errorLogs)
			console.error(`Error generating hexadic hues: ${error}`);

		return [];
	}
}

function splitComplementary(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.base.clone(baseHue);
		const modifier = Math.floor(Math.random() * 11) + 20;

		return [
			(clonedBaseHue + 180 + modifier) % 360,
			(clonedBaseHue + 180 - modifier + 360) % 360
		];
	} catch (error) {
		if (mode.errorLogs)
			console.error(
				`Error generating split complementary hues: ${error}`
			);

		return [];
	}
}

function tetradic(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.base.clone(baseHue);
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
		if (mode.errorLogs)
			console.error(`Error generating tetradic hues: ${error}`);

		return [];
	}
}

function triadic(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.base.clone(baseHue);

		return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Error generating triadic hues: ${error}`);

		return [];
	}
}

export const genHues: PaletteCommon_SuperUtils_GenHues = {
	analogous,
	diadic,
	hexadic,
	splitComplementary,
	tetradic,
	triadic
} as const;
