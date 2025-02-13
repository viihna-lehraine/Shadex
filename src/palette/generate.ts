// File: palette/generate.js

import {
	GenerateHuesArgs,
	GeneratePaletteArgs,
	HSL,
	HueGenFunctions,
	Palette,
	PaletteGenFunctions
} from '../types/index.js';
import { defaultData as defaults } from '../data/defaults.js';

const defaultPalette = defaults.palette;

export function generatePalette(
	params: GeneratePaletteArgs,
	functions: PaletteGenFunctions
): Palette {
	const log = params.appServices.log;

	try {
		log(
			'debug',
			`Generating ${params.options.paletteType} palette with args ${JSON.stringify(params.options)}`,
			'palette/generate > generatePalette()',
			2
		);

		switch (params.options.paletteType) {
			case 'analogous':
				return functions.generateAnalogousPalette(params);
			case 'complementary':
				return functions.generateComplementaryPalette(params);
			case 'diadic':
				return functions.generateDiadicPalette(params);
			case 'hexadic':
				return functions.generateHexadicPalette(params);
			case 'monochromatic':
				return functions.generateMonochromaticPalette(params);
			case 'random':
				return functions.generateRandomPalette(params);
			case 'split-complementary':
				return functions.generateSplitComplementaryPalette(params);
			case 'tetradic':
				return functions.generateTetradicPalette(params);
			case 'triadic':
				return functions.generateTriadicPalette(params);
			default:
				log(
					'error',
					`Invalid palette type ${params.options.paletteType}`,
					'generatePalette()'
				);

				return defaultPalette;
		}
	} catch (error) {
		throw new Error(`Error occurred during palette generation: ${error}`);
	}
}

export function generateHues(
	params: GenerateHuesArgs,
	functions: HueGenFunctions
): number[] {
	const log = params.appServices.log;

	try {
		if (!params.validate.colorValue(params.color, params.coreUtils)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(params.color)}`,
				'generateHues()'
			);

			return [];
		}

		const clonedColor = params.coreUtils.clone(params.color) as HSL;

		const newParams: GenerateHuesArgs = { ...params, color: clonedColor };

		switch (params.paletteType) {
			case 'analogous':
				return functions.generateAnalogousHues(newParams);
			case 'diadic':
				return functions.generateDiadicHues(newParams);
			case 'hexadic':
				return functions.generateHexadicHues(newParams);
			case 'split-complementary':
				return functions.generateSplitComplementaryHues(newParams);
			case 'tetradic':
				return functions.generateTetradicHues(newParams);
			case 'triadic':
				return functions.generateTriadicHues(newParams);
			default:
				log(
					'error',
					`Invalid hue type ${newParams.paletteType}`,
					'generateHues()'
				);

				return [];
		}
	} catch (error) {
		log('error', `Error generating hues: ${error}`, 'generateHues()');

		return [];
	}
}
