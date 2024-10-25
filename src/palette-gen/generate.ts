import { genAllColorValues } from '../color-conversion/conversion';
import { dom } from '../dom/dom-main';
import { domHelpers } from '../helpers/dom';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { palette } from './palette-index';
import { random } from '../utils/color-randomizer';
import { core } from '../utils/core';
import { transforms } from '../utils/transforms';
import { guards } from '../utils/type-guards';

function genPaletteBox(
	colors: types.Color[] | types.ColorString,
	numBoxes: number
): void {
	try {
		const normalizedColors: types.Color[] = Array.isArray(colors)
			? colors.map(color =>
					core.clone(
						guards.isColorString(color)
							? transforms.colorStringToColor(color)
							: color
					)
				)
			: [];
		const areAllColorsValid = normalizedColors.every((color, index) => {
			if (!paletteHelpers.validateColorValues(color)) {
				console.error(
					`Invalid color at index ${index}: ${JSON.stringify(color)}`
				);
				return false;
			}
			return true;
		});

		if (!areAllColorsValid) {
			console.error('One or more colors are invalid.');
			return;
		}

		const paletteRow = document.getElementById('palette-row');

		if (!paletteRow) {
			console.error('paletteRow is undefined');
			return;
		}

		paletteRow.innerHTML = '';
		let paletteBoxCount = 1;

		for (let i = 0; i < numBoxes; i++) {
			const clonedColor = normalizedColors[i];

			if (!clonedColor) {
				console.warn(`Color at index ${i} is undefined.`);
				continue;
			}

			console.log(
				`Processing color at index ${i}: ${JSON.stringify(clonedColor.value)} in ${clonedColor.format}`
			);

			const clonedColorValues = genAllColorValues(clonedColor);
			console.log(
				`Generated color values: ${JSON.stringify(clonedColorValues)}`
			);

			const clonedOriginalColorFormat =
				clonedColor.format as types.ColorSpace;

			if (!guards.isFormat(clonedOriginalColorFormat)) {
				console.warn(
					`Skipping unsupported color format: ${clonedOriginalColorFormat}`
				);
				continue;
			}

			const clonedOriginalColorValue =
				clonedColorValues[clonedOriginalColorFormat];

			if (!clonedOriginalColorValue) {
				throw new Error(
					`Failed to generate color data for format ${clonedOriginalColorFormat}`
				);
			}

			const { colorStripe, paletteBoxCount: newPaletteBoxCount } =
				domHelpers.makePaletteBox(clonedColor, paletteBoxCount);

			paletteRow.appendChild(colorStripe);

			dom.populateColorTextOutputBox(clonedColor, paletteBoxCount);

			paletteBoxCount = newPaletteBoxCount;
		}
	} catch (error) {
		console.error(`Error generating palette box: ${error}`);
	}
}

function genSelectedPaletteType(
	paletteType: number,
	numBoxes: number,
	baseColor: types.Color | types.ColorString,
	customColor: types.Color | types.ColorString | null = null,
	colorSpace: types.ColorSpace = 'hex'
): types.Color[] {
	try {
		const validatedBaseColor = guards.isColor(baseColor)
			? baseColor
			: transforms.colorStringToColor(baseColor);

		if (!paletteHelpers.validateColorValues(validatedBaseColor)) {
			console.error(
				`Invalid base color: ${JSON.stringify(validatedBaseColor)}`
			);

			return [];
		}

		const validatedCustomColor = customColor
			? guards.isColor(customColor)
				? customColor
				: transforms.colorStringToColor(customColor)
			: null;

		if (
			validatedCustomColor &&
			!paletteHelpers.validateColorValues(validatedCustomColor)
		) {
			console.error(
				`Invalid custom color value ${JSON.stringify(validatedCustomColor)}`
			);

			return [];
		}

		const validatedBaseColorClone = core.clone(validatedBaseColor);
		const validatedCustomColorClone = validatedCustomColor
			? core.clone(validatedCustomColor)
			: null;

		switch (paletteType) {
			case 1:
				console.log('Generating random palette');
				return palette.genRandomPalette(
					numBoxes,
					validatedCustomColorClone,
					colorSpace
				);

			case 2:
				console.log('Generating complementary palette');
				return palette.genComplementaryPalette(
					numBoxes,
					validatedCustomColorClone,
					colorSpace
				);

			case 3:
				console.log('Generating triadic palette');
				return palette.genTriadicPalette(
					numBoxes,
					validatedBaseColorClone,
					colorSpace
				);

			case 4:
				console.log('Generating tetradic palette');
				return palette.genTetradicPalette(
					numBoxes,
					validatedBaseColorClone,
					colorSpace
				);

			case 5:
				console.log('Generating split complementary palette');
				return palette.genSplitComplementaryPalette(
					numBoxes,
					validatedBaseColorClone,
					colorSpace
				);

			case 6:
				console.log('Generating analogous palette');
				return palette.genAnalogousPalette(
					numBoxes,
					validatedBaseColorClone,
					colorSpace
				);

			case 7:
				console.log('Generating hexadic palette');
				return palette.genHexadicPalette(
					numBoxes,
					validatedBaseColorClone,
					colorSpace
				);

			case 8:
				console.log('Generating diadic palette');
				return palette.genDiadicPalette(
					numBoxes,
					validatedBaseColorClone,
					colorSpace
				);

			case 9:
				console.log('Generating monochromatic palette');
				return palette.genMonochromaticPalette(
					numBoxes,
					validatedBaseColorClone,
					colorSpace
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
	colorSpace: types.ColorSpace = 'hex',
	customColor: types.Color | types.ColorString | null
): void {
	try {
		const clonedCustomColor = customColor ? core.clone(customColor) : null;
		const validatedCustomColorClone: types.Color = clonedCustomColor
			? guards.isColor(clonedCustomColor)
				? clonedCustomColor
				: transforms.colorStringToColor(clonedCustomColor)
			: random.randomColor(colorSpace);

		const baseColor: types.Color =
			validatedCustomColorClone ?? random.randomColor(colorSpace);
		const clonedBaseColor = core.clone(baseColor);
		const colors: types.Color[] = genSelectedPaletteType(
			paletteType,
			numBoxes,
			clonedBaseColor,
			validatedCustomColorClone,
			colorSpace
		);
		const clonedColors = core.clone(colors);

		if (colors.length === 0) {
			console.error('Colors array is empty or undefined.');

			return;
		} else {
			console.log(`Colors array: ${JSON.stringify(colors)}`);
		}

		console.log(
			`Calling genPaletteBox with clonedColors ${JSON.stringify(clonedColors)} and numBoxes ${numBoxes}`
		);

		genPaletteBox(clonedColors, numBoxes);
	} catch (error) {
		console.error(`Error starting palette generation: ${error}`);
	}
}

export const generate: fnObjects.Generate = {
	genPaletteBox,
	genSelectedPaletteType,
	startPaletteGen
};
