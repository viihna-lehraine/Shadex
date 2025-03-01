// File: dom/palette/generate.js

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
			log.debug(
				`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`,
				`[generatePalette]`
			);

			switch (options.paletteType) {
				case 'analogous':
					return generatePaletteFns.analogous(options, common, generateHuesFns);
				case 'complementary':
					return generatePaletteFns.complementary(options, common);
				case 'diadic':
					return generatePaletteFns.diadic(options, common, generateHuesFns);
				case 'hexadic':
					return generatePaletteFns.hexadic(options, common, generateHuesFns);
				case 'monochromatic':
					return generatePaletteFns.monochromatic(options, common);
				case 'random':
					return generatePaletteFns.random(options, common);
				case 'splitComplementary':
					return generatePaletteFns.splitComplementary(options, common);
				case 'tetradic':
					return generatePaletteFns.tetradic(options, common, generateHuesFns);
				case 'triadic':
					return generatePaletteFns.triadic(options, common, generateHuesFns);
				default:
					log.error(
						`Invalid palette type ${options.paletteType}`,
						`[generatePalette]`
					);
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
				log.error(
					`Invalid color value ${JSON.stringify(color)}`,
					`[generateHues]`
				);
				return [];
			}

			const clonedColor = helpers.data.deepClone(color) as HSL;

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
					log.error(
						`Invalid hue type ${options.paletteType}`,
						`[generateHues]`
					);
					return [];
			}
		},
		'Error generating hues',
		{ context: { color, options } }
	);
}
