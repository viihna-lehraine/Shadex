// File: palette/generate.js

import {
	CommonFunctionsInterface,
	GenerateHuesFnGroup,
	GeneratePaletteFnGroup,
	HSL,
	Palette,
	SelectedPaletteOptions
} from '../types/index.js';
import { defaultData as defaults } from '../data/defaults.js';

const defaultPalette = defaults.palette;

export function generatePalette(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHues: GenerateHuesFnGroup,
	generatePalette: GeneratePaletteFnGroup
): Palette {
	const log = common.services.app.log;

	try {
		log(
			'debug',
			`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`,
			'generatePalette()',
			2
		);

		switch (options.paletteType) {
			case 'analogous':
				return generatePalette.analogous(options, common, generateHues);
			case 'complementary':
				return generatePalette.complementary(options, common);
			case 'diadic':
				return generatePalette.diadic(options, common, generateHues);
			case 'hexadic':
				return generatePalette.hexadic(options, common, generateHues);
			case 'monochromatic':
				return generatePalette.monochromatic(options, common);
			case 'random':
				return generatePalette.random(options, common);
			case 'split-complementary':
				return generatePalette.splitComplementary(options, common);
			case 'tetradic':
				return generatePalette.tetradic(options, common, generateHues);
			case 'triadic':
				return generatePalette.triadic(options, common, generateHues);
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
	const log = common.services.app.log;

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
