// File: palette/main/types/complementary.js

import { HSL, Palette, PaletteGenerationArgs } from '../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import { commonFn } from '../../../common/index.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';

const core = commonFn.core;
const utils = commonFn.utils;

export async function complementary(
	args: PaletteGenerationArgs
): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches !== 2) paletteHelpers.enforce.swatchRules(2);

	const swatches = 2;

	const baseColor = utils.random.hsl();
	const complementaryHue = (baseColor.value.hue + 180) % 360;
	const complementaryColor: HSL = {
		value: {
			hue: core.brand.asRadial(complementaryHue),
			saturation: baseColor.value.saturation,
			lightness: baseColor.value.lightness
		},
		format: 'hsl'
	};
	const basePaletteItem =
		await paletteSuperUtils.create.paletteItem(baseColor);

	const complementaryPaletteItem =
		await paletteSuperUtils.create.paletteItem(complementaryColor);

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const complementaryPalette = await idbManager.savePaletteToDB(
		'complementary',
		[basePaletteItem, complementaryPaletteItem],
		paletteID,
		swatches,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!complementaryPalette) {
		throw new Error('Complementary palette is null or undefined.');
	}

	return complementaryPalette;
}
