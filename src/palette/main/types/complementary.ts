// File: palette/main/types/complementary.js

import {
	HSL,
	Palette,
	PaletteArgs,
	PaletteGenerationArgs
} from '../../../types/index.js';
import { IDBManager } from '../../../app/IDB/IDBManager.js';
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
	const paletteID = (await idbManager.getCurrentPaletteID()) + 1;

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const paletteArgs: PaletteArgs = {
		type: 'complementary',
		items: [basePaletteItem, complementaryPaletteItem],
		paletteID,
		swatches,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	const complementaryPalette = await idbManager.savePaletteToDB(paletteArgs);

	if (!complementaryPalette) {
		throw new Error('Complementary palette is null or undefined.');
	}

	return complementaryPalette;
}
