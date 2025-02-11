// File: app/palette/partials/hues.js

import { GenerateHuesFnArgs } from '../../../types/index.js';

export function generateAnalogousHues(params: GenerateHuesFnArgs): number[] {
	const log = params.appServices.log;

	try {
		if (!params.validate.colorValue(params.color, params.coreUtils)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(params.color)}`,
				'paletteUtils.generateAnalogousHues()'
			);

			return [];
		}

		const analogousHues: number[] = [];
		const baseHue = params.color.value.hue;
		const maxTotalDistance = 60;
		const minTotalDistance = Math.max(20, 10 + (params.swatches - 2) * 12);
		const totalIncrement =
			Math.floor(
				Math.random() * (maxTotalDistance - minTotalDistance + 1)
			) + minTotalDistance;
		const increment = Math.floor(totalIncrement / (params.swatches - 1));

		for (let i = 1; i < params.swatches; i++) {
			analogousHues.push((baseHue + increment * i) % 360);
		}

		return analogousHues;
	} catch (error) {
		log(
			'error',
			`Error generating analogous hues: ${error}`,
			'paletteUtils.generateAnalogousHues()'
		);

		return [];
	}
}

export function generateDiadicHues(params: GenerateHuesFnArgs): number[] {
	const log = params.appServices.log;

	try {
		const baseHue = params.color.value.hue;
		const diadicHues = [];
		const randomDistance = params.paletteHelpers.getWeightedRandomInterval(
			params.distributionType,
			params.appServices
		);
		const hue1 = baseHue;
		const hue2 = (hue1 + randomDistance) % 360;

		diadicHues.push(hue1, hue2);

		return diadicHues;
	} catch (error) {
		log(
			'error',
			`Error generating diadic hues: ${error}`,
			'paletteUtils.generateDiadicHues()'
		);

		return [];
	}
}

export function generateHexadicHues(params: GenerateHuesFnArgs): number[] {
	const log = params.appServices.log;

	try {
		const clonedBaseHSL = params.colorUtils.convertToHSL(
			params.color,
			params.adjust,
			params.appServices,
			params.brand,
			params.colorHelpers,
			params.coreUtils,
			params.format,
			params.validate
		);

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
			'paletteUtils.generateHexadicHues()'
		);

		return [];
	}
}

export function generateSplitComplementaryHues(
	params: GenerateHuesFnArgs
): number[] {
	const log = params.appServices.log;

	try {
		const baseHue = params.color.value.hue;
		const modifier = Math.floor(Math.random() * 11) + 20;

		return [
			(baseHue + 180 + modifier) % 360,
			(baseHue + 180 - modifier + 360) % 360
		];
	} catch (error) {
		log(
			'error',
			`Error generating split complementary hues: ${error}`,
			'paletteUtils.generateSplitComplementaryHues()'
		);

		return [];
	}
}

export function generateTetradicHues(params: GenerateHuesFnArgs): number[] {
	const log = params.appServices.log;

	try {
		const baseHue = params.color.value.hue;
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
			'paletteUtils.generateTetradicHues()'
		);

		return [];
	}
}

export function generateTriadicHues(params: GenerateHuesFnArgs): number[] {
	const log = params.appServices.log;

	try {
		const baseHue = params.color.value.hue;

		return [120, 240].map(increment => (baseHue + increment) % 360);
	} catch (error) {
		log(
			'error',
			`Error generating triadic hues: ${error}`,
			'paletteUtils.generateTriadicHues()'
		);

		return [];
	}
}
