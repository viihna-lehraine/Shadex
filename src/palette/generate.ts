// File: src/palette/generate.ts

import { HSL, Palette, PaletteOptions } from '../index';
import { config } from '../config';
import { genPalette } from './main';
import { paletteUtils } from './utils';

const defaultPalette = config.defaults.palette.data;
const limits = paletteUtils.sub.limits;

const isTooBright = limits.isTooBright;
const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;

function limitedHSL(
	baseHue: number,
	limitDark: boolean,
	limitLight: boolean,
	limitGray: boolean,
	alpha: number | null
): HSL {
	let hsl: HSL;

	do {
		hsl = {
			value: {
				hue: baseHue,
				saturation: Math.random() * 100,
				lightness: Math.random() * 100,
				alpha: alpha ?? 1
			},
			format: 'hsl'
		};
	} while (
		(limitGray && isTooGray(hsl)) ||
		(limitDark && isTooDark(hsl)) ||
		(limitLight && isTooBright(hsl))
	);

	return hsl;
}

// async function generatePalette() {}

async function generateSelectedPalette(
	options: PaletteOptions
): Promise<Palette> {
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

		switch (paletteType) {
			case 1:
				return genPalette.random(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 2:
				return genPalette.complementary(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 3:
				return genPalette.triadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 4:
				return genPalette.tetradic(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 5:
				return genPalette.splitComplementary(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 6:
				return genPalette.analogous(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 7:
				return genPalette.hexadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 8:
				return genPalette.diadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			case 9:
				return genPalette.monochromatic(
					numBoxes,
					customColor,
					enableAlpha,
					limitDarkness,
					limitGrayness,
					limitLightness
				);
			default:
				console.error('Invalid palette type.');

				return Promise.resolve(defaultPalette);
		}
	} catch (error) {
		console.error(`Error generating palette: ${error}`);

		return Promise.resolve(defaultPalette);
	}
}

export const generate = {
	limitedHSL,
	selectedPalette: generateSelectedPalette
};
