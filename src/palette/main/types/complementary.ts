// File: src/palette/main/types/complementary.js

import { GenPaletteArgs, HSL, Palette } from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import { common } from '../../../common/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const brand = common.core.brand;
const create = paletteSuperUtils.create;

export async function complementary(args: GenPaletteArgs): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches !== 2) ui.enforceSwatchRules(2);

	const swatches = 2;

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const complementaryHue = (baseColor.value.hue + 180) % 360;
	const complementaryColor: HSL = {
		value: {
			hue: brand.asRadial(complementaryHue),
			saturation: baseColor.value.saturation,
			lightness: baseColor.value.lightness,
			alpha: brand.asAlphaRange(args.enableAlpha ? Math.random() : 1)
		},
		format: 'hsl'
	};
	const basePaletteItem = await create.paletteItem(
		baseColor,
		args.enableAlpha
	);

	const complementaryPaletteItem = await create.paletteItem(
		complementaryColor,
		args.enableAlpha
	);

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const complementaryPalette = await idbManager.savePaletteToDB(
		'complementary',
		[basePaletteItem, complementaryPaletteItem],
		paletteID,
		swatches,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!complementaryPalette) {
		throw new Error('Complementary palette is null or undefined.');
	}

	return complementaryPalette;
}
