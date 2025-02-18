// File: palette/generate.js

import {
	CommonFunctionsInterface,
	GenerateHuesFnGroup,
	GeneratePaletteFnGroup,
	HSL,
	Palette,
	SelectedPaletteOptions
} from '../types/index.js';
import { data } from '../data/index.js';

const defaultPalette = data.defaults.palette;

export function generatePalette(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHuesFns: GenerateHuesFnGroup,
	generatePaletteFns: GeneratePaletteFnGroup
): Palette {
	const log = common.services.log;

	try {
		log(
			'debug',
			`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`,
			'generatePalette()',
			2
		);

		switch (options.paletteType) {
			case 'analogous':
				return generatePaletteFns.analogous(
					options,
					common,
					generateHuesFns
				);
			case 'complementary':
				return generatePaletteFns.complementary(options, common);
			case 'diadic':
				return generatePaletteFns.diadic(
					options,
					common,
					generateHuesFns
				);
			case 'hexadic':
				return generatePaletteFns.hexadic(
					options,
					common,
					generateHuesFns
				);
			case 'monochromatic':
				return generatePaletteFns.monochromatic(options, common);
			case 'random':
				return generatePaletteFns.random(options, common);
			case 'split-complementary':
				return generatePaletteFns.splitComplementary(options, common);
			case 'tetradic':
				return generatePaletteFns.tetradic(
					options,
					common,
					generateHuesFns
				);
			case 'triadic':
				return generatePaletteFns.triadic(
					options,
					common,
					generateHuesFns
				);
			default:
				log(
					'error',
					`Invalid palette type ${options.paletteType}`,
					'generatePalette()'
				);

				return defaultPalette;
		}
	} catch (error) {
		throw new Error(`Error occurred during palette generation: ${error}`);
	}
}

export function generateHues(
	color: HSL,
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHues: GenerateHuesFnGroup
): number[] {
	const utils = common.utils;
	const log = common.services.log;

	try {
		if (!utils.validate.colorValue(color)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(color)}`,
				'generateHues()'
			);

			return [];
		}

		const clonedColor = utils.core.clone(color) as HSL;

		switch (options.paletteType) {
			case 'analogous':
				return generateHues.analogous(clonedColor, options, common);
			case 'diadic':
				return generateHues.diadic(clonedColor, options, common);
			case 'hexadic':
				return generateHues.hexadic(clonedColor, common);
			case 'split-complementary':
				return generateHues.splitComplementary(clonedColor, common);
			case 'tetradic':
				return generateHues.tetradic(clonedColor, common);
			case 'triadic':
				return generateHues.triadic(clonedColor, common);
			default:
				log(
					'error',
					`Invalid hue type ${options.paletteType}`,
					'generateHues()'
				);

				return [];
		}
	} catch (error) {
		log('error', `Error generating hues: ${error}`, 'generateHues()');

		return [];
	}
}
