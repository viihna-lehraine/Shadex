// File: src/palette/common/paletteSuperUtils/genHues.js

import { HSL } from '../../../types/index.js';
import { core, utils } from '../../../common/index.js';
import { createLogger } from '../../../logger/index.js';
import { mode } from '../../../common/data/base.js';
import { paletteUtils } from '../paletteUtils/index.js';

const logger = await createLogger();

const logMode = mode.logging;

const genAllColorValues = utils.conversion.genAllColorValues;
const getWeightedRandomInterval =
	paletteUtils.probability.getWeightedRandomInterval;
const validateColorValues = core.validate.colorValues;

function analogous(color: HSL, numBoxes: number): number[] {
	try {
		if (!validateColorValues(color)) {
			if (logMode.error)
				logger.error(
					`Invalid color value ${JSON.stringify(color)}`,
					'palette > common > paletteSuperUtils > genHues > analogous()'
				);

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
		if (logMode.error)
			logger.error(
				`Error generating analogous hues: ${error}`,
				'palette > common > paletteSuperUtils > genHues > analogous()'
			);

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
		if (logMode.error)
			logger.error(
				`Error generating diadic hues: ${error}`,
				'palette > common > paletteSuperUtils > genHues > diadic()'
			);

		return [];
	}
}

function hexadic(color: HSL): number[] {
	try {
		const clonedColor = core.base.clone(color);

		if (!validateColorValues(clonedColor)) {
			if (logMode.error)
				logger.error(
					`Invalid color value ${JSON.stringify(clonedColor)}`,
					'palette > common > paletteSuperUtils > genHues > hexadic()'
				);

			return [];
		}

		const clonedBaseHSL = genAllColorValues(clonedColor).hsl as HSL;

		if (!clonedBaseHSL) {
			if (!mode.gracefulErrors)
				throw new Error(
					'Unable to generate hexadic hues - missing HSL values'
				);
			else if (logMode.error)
				logger.error(
					'Unable to generate hexadic hues - missing HSL values',
					'palette > common > paletteSuperUtils > genHues > hexadic()'
				);
			else if (!mode.quiet && logMode.verbosity > 0)
				logger.error(
					'Error generating hexadic hues',
					'palette > common > paletteSuperUtils > genHues > hexadic()'
				);

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
		if (logMode.error)
			logger.error(
				`Error generating hexadic hues: ${error}`,
				'palette > common > paletteSuperUtils > genHues > hexadic()'
			);

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
		if (logMode.error)
			logger.error(
				`Error generating split complementary hues: ${error}`,
				'palette > common > paletteSuperUtils > genHues > splitComplementary()'
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
		if (logMode.error)
			logger.error(
				`Error generating tetradic hues: ${error}`,
				'palette > common > paletteSuperUtils > genHues > tetradic()'
			);

		return [];
	}
}

function triadic(baseHue: number): number[] {
	try {
		const clonedBaseHue = core.base.clone(baseHue);

		return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating triadic hues: ${error}`,
				'palette > common > paletteSuperUtils > genHues > triadic()'
			);

		return [];
	}
}

export const genHues = {
	analogous,
	diadic,
	hexadic,
	splitComplementary,
	tetradic,
	triadic
} as const;
