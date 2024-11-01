import { limits } from './limits';
import { genPalette } from './palettes';
import { defaults } from '../config/defaults';
import { database } from '../database/database';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as palette from '../index/palette';
import { colorUtils } from '../utils/color-utils';
import { commonUtils } from '../utils/common-utils';
import { domUtils } from '../utils/dom-utils';
import { randomHSL } from '../utils/random-color-utils';

function genLimitedHSL(
	baseHue: number,
	limitDark: boolean,
	limitLight: boolean,
	limitGray: boolean,
	alpha: number | null
): colors.HSL {
	let hsl: colors.HSL;

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
		(limitGray && limits.isTooGray(hsl)) ||
		(limitDark && limits.isTooDark(hsl)) ||
		(limitLight && limits.isTooBright(hsl))
	);

	return hsl;
}

async function genSelectedPalette(
	options: colors.PaletteOptions
): Promise<palette.Palette> {
	try {
		const {
			paletteType,
			numBoxes,
			customColor,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		} = options;

		const palette = await genPalette();

		switch (paletteType) {
			case 1:
				return palette.random(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 2:
				return palette.complementary(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 3:
				return palette.triadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 4:
				return palette.tetradic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 5:
				return palette.splitComplementary(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 6:
				return palette.analogous(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 7:
				return palette.hexadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 8:
				return palette.diadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 9:
				return palette.monochromatic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			default:
				console.error('Invalid palette type.');

				return Promise.resolve(defaults.paletteData);
		}
	} catch (error) {
		console.error(`Error generating palette: ${error}`);

		return Promise.resolve(defaults.paletteData);
	}
}

async function startPaletteGen(options: colors.PaletteOptions): Promise<void> {
	try {
		let { numBoxes, customColor } = options;

		if (customColor === null || customColor === undefined) {
			console.error('Custom color is null or undefined.');

			return;
		}

		const validatedCustomColor: colors.HSL =
			(validateAndConvertColor(customColor) as colors.HSL) ??
			randomHSL(options.enableAlpha);

		options.customColor = validatedCustomColor;

		const palette = await genSelectedPalette(options);

		if (palette.items.length === 0) {
			console.error('Colors array is empty or invalid.');

			return;
		}

		console.log(`Colors array generated: ${JSON.stringify(colors)}`);

		const tableId = await database.getNextTableID();

		await domUtils.genPaletteBox(palette.items, numBoxes, tableId);
	} catch (error) {
		console.error(`Error starting palette generation: ${error}`);
	}
}

function validateAndConvertColor(
	color: colors.Color | colors.ColorString | null
): colors.Color | null {
	if (!color) return null;

	const convertedColor = colorUtils.isColorString(color)
		? colorUtils.colorStringToColor(color)
		: color;

	if (!commonUtils.validateColorValues(convertedColor)) {
		console.error(`Invalid color: ${JSON.stringify(convertedColor)}`);

		return null;
	}

	return convertedColor;
}

export const generate: fnObjects.Generate = {
	genLimitedHSL,
	genSelectedPalette,
	startPaletteGen,
	validateAndConvertColor
};
