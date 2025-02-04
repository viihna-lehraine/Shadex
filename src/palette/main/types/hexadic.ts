// File: palette/main/types/hexadic.js

import {
	HSL,
	Palette,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import { commonFn } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';

const paletteRanges = consts.paletteRanges;

const core = commonFn.core;
const utils = commonFn.utils;

export async function hexadic(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure exactly 6 color swatches
	if (args.swatches !== 6) paletteHelpers.enforce.swatchRules(6, 6);

	const baseColor = utils.random.hsl();
	const hues = paletteSuperUtils.genHues.hexadic(baseColor);

	const paletteItems: PaletteItem[] = [];
	for (const hue of hues) {
		const saturationShift =
			Math.random() * paletteRanges.shift.hexad.sat -
			paletteRanges.shift.hexad.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.hexad.light -
			paletteRanges.shift.hexad.light / 2;
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				)
			},
			format: 'hsl'
		};

		const paletteItem =
			await paletteSuperUtils.create.paletteItem(newColor);

		paletteItems.push(paletteItem);
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = (await idbManager.getCurrentPaletteID()) + 1;

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const hexadicPalette = await idbManager.savePaletteToDB(
		'hexadic',
		paletteItems,
		paletteID,
		args.swatches,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!hexadicPalette) {
		throw new Error('Hexadic palette is either null or undefined.');
	} else {
		return hexadicPalette;
	}
}
