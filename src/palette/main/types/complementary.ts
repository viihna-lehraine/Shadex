// File: palette/main/types/complementary.js

import { HSL, Palette, PaletteGenerationArgs } from '../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import { commonFn } from '../../../common/index.js';
import { superUtils as paletteSuperUtils } from '../../common/index.js';
import { uiFn } from '../../../ui/index.js';

const brand = commonFn.core.brand;
const create = paletteSuperUtils.create;

export async function complementary(
	args: PaletteGenerationArgs
): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches !== 2) uiFn.enforceSwatchRules(2);

	const swatches = 2;

	const baseColor = create.baseColor(args.customColor);
	const complementaryHue = (baseColor.value.hue + 180) % 360;
	const complementaryColor: HSL = {
		value: {
			hue: brand.asRadial(complementaryHue),
			saturation: baseColor.value.saturation,
			lightness: baseColor.value.lightness
		},
		format: 'hsl'
	};
	const basePaletteItem = await create.paletteItem(baseColor);

	const complementaryPaletteItem =
		await create.paletteItem(complementaryColor);

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
