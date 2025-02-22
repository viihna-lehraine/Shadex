// File: palette/generate.js

import {
	CommonFunctions,
	GenerateHuesFnGroup,
	GeneratePaletteFnGroup,
	HSL,
	Palette,
	SelectedPaletteOptions
} from '../types/index.js';
import { defaults } from '../config/index.js';

const defaultPalette = defaults.palette;

export function generatePalette(
	options: SelectedPaletteOptions,
	common: CommonFunctions,
	generateHuesFns: GenerateHuesFnGroup,
	generatePaletteFns: GeneratePaletteFnGroup
): Palette {
	const { log, errors } = common.services;

	return errors.handleSync(
		() => {
			log(
				`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`,
				{
					caller: '[generatePalette]',
					level: 'debug'
				}
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
				case 'splitComplementary':
					return generatePaletteFns.splitComplementary(
						options,
						common
					);
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
					log(`Invalid palette type ${options.paletteType}`, {
						caller: '[generatePalette]',
						level: 'error'
					});
					return defaultPalette;
			}
		},
		'Error generating palette',
		{ context: { options } }
	);
}

export function generateHues(
	color: HSL,
	options: SelectedPaletteOptions,
	common: CommonFunctions,
	generateHues: GenerateHuesFnGroup
): number[] {
	const {
		helpers,
		services: { log, errors },
		utils
	} = common;

	return errors.handleSync(
		() => {
			if (!utils.validate.colorValue(color)) {
				log(`Invalid color value ${JSON.stringify(color)}`, {
					caller: '[generateHues]',
					level: 'error'
				});
				return [];
			}

			const clonedColor = helpers.data.clone(color) as HSL;

			switch (options.paletteType) {
				case 'analogous':
					return generateHues.analogous(clonedColor, options, common);
				case 'diadic':
					return generateHues.diadic(clonedColor, options, common);
				case 'hexadic':
					return generateHues.hexadic(clonedColor, common);
				case 'splitComplementary':
					return generateHues.splitComplementary(clonedColor, common);
				case 'tetradic':
					return generateHues.tetradic(clonedColor, common);
				case 'triadic':
					return generateHues.triadic(clonedColor, common);
				default:
					log(`Invalid hue type ${options.paletteType}`, {
						caller: '[generateHues]',
						level: 'error'
					});
					return [];
			}
		},
		'Error generating hues',
		{ context: { color, options } }
	);
}
