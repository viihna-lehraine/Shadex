// File: palette/main/types/triadic.js

import {
	HSL,
	Palette,
	PaletteArgs,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../app/db/IDBManager.js';
import { commonFn } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';

const paletteRanges = consts.paletteRanges;

const core = commonFn.core;
const utils = commonFn.utils;

export async function triadic(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure exactly 3 swatches
	if (args.swatches !== 3) paletteHelpers.enforce.swatchRules(3, 3);

	// base color setup
	const baseColor = utils.random.hsl();

	// generate triadic hues
	const hues = paletteSuperUtils.genHues.triadic(baseColor.value.hue);

	// initialize palette items array
	const paletteItems: PaletteItem[] = [];

	// add the base color as the first palette item
	const basePaletteItem =
		await paletteSuperUtils.create.paletteItem(baseColor);
	paletteItems.push(basePaletteItem);

	// add the triadic colors sequentially
	for (let index = 0; index < hues.length; index++) {
		const hue = hues[index];
		const adjustedHSL: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(
					Math.max(
						0,
						Math.min(
							baseColor.value.saturation +
								(index % 2 === 0
									? -paletteRanges.shift.triad.sat
									: paletteRanges.shift.triad.sat),
							100
						)
					)
				),
				lightness: core.brand.asPercentile(
					Math.max(
						0,
						Math.min(
							baseColor.value.lightness +
								(index % 2 === 0
									? -paletteRanges.shift.triad.light
									: paletteRanges.shift.triad.light),
							100
						)
					)
				)
			},
			format: 'hsl'
		};

		const adjustedColor = utils.conversion.genAllColorValues(adjustedHSL)
			.hsl as HSL;
		const paletteItem =
			await paletteSuperUtils.create.paletteItem(adjustedColor);
		paletteItems.push(paletteItem);
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = (await idbManager.getCurrentPaletteID()) + 1;

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const paletteArgs: PaletteArgs = {
		type: 'triadic',
		items: paletteItems,
		paletteID,
		swatches: args.swatches,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	const triadicPalette = await idbManager.savePaletteToDB(paletteArgs);

	if (!triadicPalette) {
		throw new Error('Triadic palette is either null or undefined.');
	}

	return triadicPalette;
}
