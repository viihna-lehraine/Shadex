// File: palette/main/types/diadic.js

import {
	HSL,
	Palette,
	PaletteArgs,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../app/IDB/IDBManager.js';
import { commonFn } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';

const paletteRanges = consts.paletteRanges;

const core = commonFn.core;
const utils = commonFn.utils;

export async function diadic(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure exactly 2 color swatches
	if (args.swatches !== 2) paletteHelpers.enforce.swatchRules(2, 2);

	const baseColor = utils.random.hsl();
	const hues = paletteSuperUtils.genHues.diadic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [];

	for (let i = 0; i < 2; i++) {
		const saturationShift =
			Math.random() * paletteRanges.shift.diadic.sat -
			paletteRanges.shift.diadic.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.diadic.light -
			paletteRanges.shift.diadic.light / 2;
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hues[i % hues.length]),
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

	const paletteArgs: PaletteArgs = {
		type: 'diadic',
		items: paletteItems,
		paletteID,
		swatches: args.swatches,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	const diadicPalette = await idbManager.savePaletteToDB(paletteArgs);

	if (!diadicPalette)
		throw new Error(`Diadic palette is either null or undefined.`);
	else return diadicPalette;
}
