// File: palette/partials/hues.js

import {
	CommonFunctionsInterface,
	GenerateHuesFnGroup,
	HSL,
	SelectedPaletteOptions
} from '../../types/index.js';

function analogous(
	color: HSL,
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface
): number[] {
	const log = common.services.app.log;

	try {
		if (!common.utils.validate.colorValue(color)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(color)}`,
				'generateAnalogousHues()'
			);

			return [];
		}

		const analogousHues: number[] = [];
		const baseHue = color.value.hue;
		const maxTotalDistance = 60;
		const minTotalDistance = Math.max(
			20,
			10 + (options.columnCount - 2) * 12
		);
		const totalIncrement =
			Math.floor(
				Math.random() * (maxTotalDistance - minTotalDistance + 1)
			) + minTotalDistance;
		const increment = Math.floor(
			totalIncrement / (options.columnCount - 1)
		);

		for (let i = 1; i < options.columnCount; i++) {
			analogousHues.push((baseHue + increment * i) % 360);
		}

		return analogousHues;
	} catch (error) {
		log(
			'error',
			`Error generating analogous hues: ${error}`,
			'generateAnalogousHues()'
		);

		return [];
	}
}

function diadic(
	color: HSL,
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface
): number[] {
	const helpers = common.helpers;
	const log = common.services.app.log;

	try {
		const baseHue = color.value.hue;
		const diadicHues = [];
		const randomDistance = helpers.palette.getWeightedRandomInterval(
			options.distributionType
		);
		const hue1 = baseHue;
		const hue2 = (hue1 + randomDistance) % 360;

		diadicHues.push(hue1, hue2);

		return diadicHues;
	} catch (error) {
		log(
			'error',
			`Error generating diadic hues: ${error}`,
			'generateDiadicHues()'
		);

		return [];
	}
}

function hexadic(color: HSL, common: CommonFunctionsInterface): number[] {
	const utils = common.utils;
	const log = common.services.app.log;

	try {
		const clonedBaseHSL = utils.color.convertToHSL(color);

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
		log(
			'error',
			`Error generating hexadic hues: ${error}`,
			'generateHexadicHues()'
		);

		return [];
	}
}

function splitComplementary(
	color: HSL,
	common: CommonFunctionsInterface
): number[] {
	const log = common.services.app.log;

	try {
		const baseHue = color.value.hue;
		const modifier = Math.floor(Math.random() * 11) + 20;

		return [
			(baseHue + 180 + modifier) % 360,
			(baseHue + 180 - modifier + 360) % 360
		];
	} catch (error) {
		log(
			'error',
			`Error generating split complementary hues: ${error}`,
			'generateSplitComplementaryHues()'
		);

		return [];
	}
}

function tetradic(color: HSL, common: CommonFunctionsInterface): number[] {
	const log = common.services.app.log;

	try {
		const baseHue = color.value.hue;
		const randomOffset = Math.floor(Math.random() * 46) + 20;
		const distance =
			90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);

		return [
			baseHue,
			(baseHue + 180) % 360,
			(baseHue + distance) % 360,
			(baseHue + distance + 180) % 360
		];
	} catch (error) {
		log(
			'error',
			`Error generating tetradic hues: ${error}`,
			'generateTetradicHues()'
		);

		return [];
	}
}

function triadic(color: HSL, common: CommonFunctionsInterface): number[] {
	const log = common.services.app.log;

	try {
		const baseHue = color.value.hue;

		return [120, 240].map(increment => (baseHue + increment) % 360);
	} catch (error) {
		log(
			'error',
			`Error generating triadic hues: ${error}`,
			'generateTriadicHues()'
		);

		return [];
	}
}

export const generateHues: GenerateHuesFnGroup = {
	analogous,
	diadic,
	hexadic,
	splitComplementary,
	tetradic,
	triadic
};
