import { dom } from '../dom/dom-main';
import { idbFn } from '../dom/idb-fn';
import { domHelpers } from '../helpers/dom';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { palette } from './palette-index';
import { random } from '../utils/color-randomizer';
import { transforms } from '../utils/transforms';
import { guards } from '../utils/type-guards';

async function genPaletteBox(
	colors: colors.Color[],
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

		colors.slice(0, numBoxes).forEach((color, i) => {
			const { colorStripe } = domHelpers.makePaletteBox(color, i + 1);
			fragment.appendChild(colorStripe);
			dom.populateColorTextOutputBox(color, i + 1);
		});

		paletteRow.appendChild(fragment);

		console.log('Palette boxes generated and rendered.');

		await idbFn.saveData('tables', tableId, { palette: colors });
	} catch (error) {
		console.error(`Error generating palette box: ${error}`);
	}
}

function genSelectedPaletteType(
	options: colors.PaletteOptions
): colors.Color[] {
	try {
		const { paletteType, numBoxes, baseColor, customColor, colorSpace } =
			options;

		if (customColor === null || customColor === undefined) {
			console.error('Custom color is null or undefined.');
			return [];
		}

		switch (paletteType) {
			case 1:
				return palette.genRandomPalette(
					numBoxes,
					customColor,
					colorSpace
				);
			case 2:
				return palette.genComplementaryPalette(
					numBoxes,
					baseColor,
					colorSpace
				);
			case 3:
				return palette.genTriadicPalette(
					numBoxes,
					baseColor,
					colorSpace
				);
			case 4:
				return palette.genTetradicPalette(
					numBoxes,
					baseColor,
					colorSpace
				);
			case 5:
				return palette.genSplitComplementaryPalette(
					numBoxes,
					baseColor,
					colorSpace
				);
			case 6:
				return palette.genAnalogousPalette(
					numBoxes,
					baseColor,
					colorSpace
				);
			case 7:
				return palette.genHexadicPalette(
					numBoxes,
					baseColor,
					colorSpace
				);

			case 8:
				return palette.genDiadicPalette(
					numBoxes,
					baseColor,
					colorSpace
				);
			case 9:
				return palette.genMonochromaticPalette(
					numBoxes,
					baseColor,
					colorSpace
				);

			default:
				console.error('Invalid palette type.');
				return [];
		}
	} catch (error) {
		console.error(`Error generating palette: ${error}`);
		return [];
	}
}

async function startPaletteGen(options: colors.PaletteOptions): Promise<void> {
	try {
		const { paletteType, numBoxes, colorSpace, baseColor, customColor } =
			options;

		if (customColor === null || customColor === undefined) {
			console.error('Custom color is null or undefined.');
			return;
		}

		const validatedCustomColor =
			validateAndConvertColor(customColor) ??
			random.randomColor(colorSpace);
		const validatedBaseColor =
			validateAndConvertColor(baseColor) ??
			random.randomColor(colorSpace);

		const colors = genSelectedPaletteType({
			paletteType,
			numBoxes,
			baseColor: validatedBaseColor,
			customColor: validatedCustomColor,
			colorSpace
		});

		if (colors.length === 0) {
			console.error('Colors array is empty or invalid.');
			return;
		}

		console.log(`Colors array generated: ${JSON.stringify(colors)}`);

		const tableId = await idbFn.getNextTableID();

		await genPaletteBox(colors, numBoxes, tableId);
	} catch (error) {
		console.error(`Error starting palette generation: ${error}`);
	}
}

function validateAndConvertColor(
	color: colors.Color | colors.ColorString | null
): colors.Color | null {
	if (!color) return null;

	const convertedColor = guards.isColorString(color)
		? transforms.colorStringToColor(color)
		: color;

	if (!paletteHelpers.validateColorValues(convertedColor)) {
		console.error(`Invalid color: ${JSON.stringify(convertedColor)}`);
		return null;
	}

	return convertedColor;
}

export const generate: fnObjects.Generate = {
	genPaletteBox,
	genSelectedPaletteType,
	startPaletteGen,
	validateAndConvertColor
};
