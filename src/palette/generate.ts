// File: palette/generate.js

import {
	CommonFunctions,
	GenerateHuesFnGroup,
	GeneratePaletteFnGroup,
	HSL,
	Palette,
	SelectedPaletteOptions
} from '../types/index.js';
import { config } from '../config/index.js';

const defaultPalette = config.defaults.palette;

export function generatePalette(
	options: SelectedPaletteOptions,
	common: CommonFunctions,
	generateHuesFns: GenerateHuesFnGroup,
	generatePaletteFns: GeneratePaletteFnGroup
): Palette {
	const { log, errors } = common.services;

	try {
		log(
			`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`,
			'debug'
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
				log(`Invalid palette type ${options.paletteType}`, 'error');
				return defaultPalette;
		}
	} catch (error) {
		errors.handle(error, 'Error occurred during palette generation');
		return defaultPalette;
	}
}

export function generateHues(
	color: HSL,
	options: SelectedPaletteOptions,
	common: CommonFunctions,
	generateHues: GenerateHuesFnGroup
): number[] {
	const { log, errors } = common.services;
	const { utils } = common;

	try {
		if (!utils.validate.colorValue(color)) {
			log(`Invalid color value ${JSON.stringify(color)}`, 'error');
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
				log(`Invalid hue type ${options.paletteType}`, 'error');
				return [];
		}
	} catch (error) {
		errors.handle(error, 'Error generating hues');
		return [];
	}
}
