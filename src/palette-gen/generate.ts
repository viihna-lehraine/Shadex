import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { domHelpers } from '../helpers/dom';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { palette } from './palette-index';
import { random } from '../utils/color-randomizer';
import { guards } from '../utils/type-guards';

function genPaletteBox(numBoxes: number, colors: types.Color[]): void {
	try {
		const paletteRow = document.getElementById('palette-row');

		if (!paletteRow) {
			console.error('paletteRow is undefined');
			return;
		}

		paletteRow.innerHTML = ''; // clear the row
		let paletteBoxCount = 1;

		for (let i = 0; i < numBoxes; i++) {
			const color = colors[i];

			if (!color) {
				console.warn(`Color at index ${i} is undefined.`);
				continue;
			}

			console.log(
				`Color at index ${i} being processed is: ${JSON.stringify(color.value)} in ${color.format}`
			);
			const colorValues = genAllColorValues(color);
			console.log(
				`Generated color values: ${JSON.stringify(colorValues)}`
			);
			const originalColorFormat = color.format as types.ColorSpace;

			if (!guards.isFormat(originalColorFormat)) {
				console.warn(
					`Skipping unsupported color format: ${originalColorFormat}`
				);
				continue;
			}

			const originalColorValue = colorValues[originalColorFormat];

			if (!originalColorValue) {
				throw new Error(
					`Failed to generate color data for format ${originalColorFormat}`
				);
			}

			const { colorStripe, paletteBoxCount: newPaletteBoxCount } =
				domHelpers.makePaletteBox(color, paletteBoxCount);

			paletteRow.appendChild(colorStripe);

			dom.populateColorTextOutputBox(color, paletteBoxCount);

			paletteBoxCount = newPaletteBoxCount;
		}
	} catch (error) {
		console.error(`Error generating palette box: ${error}`);
	}
}

function genSelectedPaletteType(
	paletteType: number,
	numBoxes: number,
	baseColor: types.Color,
	customColor: types.Color | null = null,
	initialColorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		switch (paletteType) {
			case 1:
				console.log('Generating random palette');
				return palette.genRandomPalette(
					numBoxes,
					customColor,
					initialColorSpace
				);
			case 2:
				console.log('Generating complementary palette');
				return palette.genComplementaryPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			case 3:
				console.log('Generating triadic palette');
				return palette.genTriadicPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			case 4:
				console.log('Generating tetradic palette');
				return palette.genTetradicPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			case 5:
				console.log('Generating split complementary palette');
				return palette.genSplitComplementaryPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			case 6:
				console.log('Generating analogous palette');
				return palette.genAnalogousPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			case 7:
				console.log('Generating hexadic palette');
				return palette.genHexadicPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			case 8:
				console.log('Generating diadic palette');
				return palette.genDiadicPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			case 9:
				console.log('Generating monochromatic palette');
				return palette.genMonochromaticPalette(
					numBoxes,
					baseColor,
					initialColorSpace
				);
			default:
				console.error('Unable to determine color scheme');
				return [];
		}
	} catch (error) {
		console.error(`Error generating palette: ${error}`);
		return [];
	}
}

function startPaletteGen(
	paletteType: number,
	numBoxes: number,
	initialColorSpace: types.ColorSpace = 'hex',
	customColor: types.Color | null
): void {
	try {
		const baseColor: types.Color =
			customColor ?? random.randomColor(initialColorSpace);

		const colors: types.Color[] = genSelectedPaletteType(
			paletteType,
			numBoxes,
			baseColor,
			customColor,
			initialColorSpace
		);

		if (colors.length === 0) {
			console.error('Colors array is empty or undefined.');
			return;
		} else {
			console.log(`Colors array: ${JSON.stringify(colors)}`);
		}

		genPaletteBox(numBoxes, colors);
	} catch (error) {
		console.error(`Error starting palette generation: ${error}`);
	}
}

export const generate: fnObjects.Generate = {
	genPaletteBox,
	genSelectedPaletteType,
	startPaletteGen
};
