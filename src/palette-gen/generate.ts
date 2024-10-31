import { limits } from './limits';
import { genPalette } from './palettes';
import { defaults } from '../config/defaults';
import { domFn } from '../dom/dom-main';
import { idbFn } from '../dom/idb-fn';
import { domHelpers } from '../helpers/dom';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as palette from '../index/palette';
import { genRandomColor } from '../utils/random-color';
import { transform } from '../utils/transform';
import { guards } from '../utils/type-guards';

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

async function genPaletteBox(
	items: palette.PaletteItem[],
	numBoxes: number,
	tableId: string
): Promise<void> {
	try {
		const paletteRow = document.getElementById('palette-row');

		if (!paletteRow) {
			console.error('paletteRow is undefined.');

			return;
		}

		paletteRow.innerHTML = '';

		const fragment = document.createDocumentFragment();

		items.slice(0, numBoxes).forEach((item, i) => {
			const { color } = item;
			const { colorStripe } = domHelpers.makePaletteBox(color, i + 1);
			fragment.appendChild(colorStripe);
			domFn.populateColorTextOutputBox(color, i + 1);
		});

		paletteRow.appendChild(fragment);

		console.log('Palette boxes generated and rendered.');

		await idbFn.saveData('tables', tableId, { palette: items });
	} catch (error) {
		console.error(`Error generating palette box: ${error}`);
	}
}

function genSelectedPalette(
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

		switch (paletteType) {
			case 1:
				return genPalette().random(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 2:
				return genPalette().complementary(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 3:
				return genPalette().triadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 4:
				return genPalette().tetradic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 5:
				return genPalette().splitComplementary(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 6:
				return genPalette().analogous(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 7:
				return genPalette().hexadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 8:
				return genPalette().diadic(
					numBoxes,
					customColor,
					enableAlpha,
					limitBright,
					limitDark,
					limitGray
				);
			case 9:
				return genPalette().monochromatic(
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
			genRandomColor('hsl');

		options.customColor = validatedCustomColor;

		const palette = await genSelectedPalette(options);

		if (palette.items.length === 0) {
			console.error('Colors array is empty or invalid.');

			return;
		}

		console.log(`Colors array generated: ${JSON.stringify(colors)}`);

		const tableId = await idbFn.getNextTableID();

		await genPaletteBox(palette.items, numBoxes, tableId);
	} catch (error) {
		console.error(`Error starting palette generation: ${error}`);
	}
}

function validateAndConvertColor(
	color: colors.Color | colors.ColorString | null
): colors.Color | null {
	if (!color) return null;

	const convertedColor = guards.isColorString(color)
		? transform.colorStringToColor(color)
		: color;

	if (!paletteHelpers.validateColorValues(convertedColor)) {
		console.error(`Invalid color: ${JSON.stringify(convertedColor)}`);
		return null;
	}

	return convertedColor;
}

export const generate: fnObjects.Generate = {
	genLimitedHSL,
	genPaletteBox,
	genSelectedPalette,
	startPaletteGen,
	validateAndConvertColor
};
