// File: src/palette/generate.ts

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteGenerateFnInterface,
	PaletteOptions
} from '../index/index.js';
import { core } from '../common/index.js';
import { data } from '../data/index.js';
import { genPalette } from './main/index.js';
import { paletteHelpers } from './common/index.js';

const defaultPalette = data.defaults.palette.data;
const limits = paletteHelpers.limits;
const mode = data.mode;

const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;

function limitedHSL(
	baseHue: number,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean,
	alphaValue: number | null
): HSL {
	let hsl: HSL;

	do {
		hsl = {
			value: {
				hue: core.brand.asRadial(baseHue),
				saturation: core.brand.asPercentile(Math.random() * 100),
				lightness: core.brand.asPercentile(Math.random() * 100),
				alpha: alphaValue
					? core.brand.asAlphaRange(alphaValue)
					: core.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};
	} while (
		(limitGray && isTooGray(hsl)) ||
		(limitDark && isTooDark(hsl)) ||
		(limitLight && isTooLight(hsl))
	);

	return hsl;
}

// async function generatePalette() {}

async function selectedPalette(options: PaletteOptions): Promise<Palette> {
	try {
		const {
			paletteType,
			numBoxes,
			customColor,
			enableAlpha,
			limitDarkness,
			limitGrayness,
			limitLightness
		} = options;

		const args: GenPaletteArgs = {
			numBoxes,
			customColor,
			enableAlpha,
			limitDark: limitDarkness,
			limitGray: limitGrayness,
			limitLight: limitLightness
		};

		switch (paletteType) {
			case 1:
				return genPalette.random(args);
			case 2:
				return genPalette.complementary(args);
			case 3:
				return genPalette.triadic(args);
			case 4:
				return genPalette.tetradic(args);
			case 5:
				return genPalette.splitComplementary(args);
			case 6:
				return genPalette.analogous(args);
			case 7:
				return genPalette.hexadic(args);
			case 8:
				return genPalette.diadic(args);
			case 9:
				return genPalette.monochromatic(args);
			default:
				if (mode.errorLogs) console.error('Invalid palette type.');

				return Promise.resolve(defaultPalette);
		}
	} catch (error) {
		if (mode.errorLogs) console.error(`Error generating palette: ${error}`);

		return Promise.resolve(defaultPalette);
	}
}

export const generate: PaletteGenerateFnInterface = {
	limitedHSL,
	selectedPalette
} as const;
