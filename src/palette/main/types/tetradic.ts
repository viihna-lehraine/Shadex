// File: palette/main/types/tetradic.js

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

export async function tetradic(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure exactly 4 swatches
	if (args.swatches !== 4) paletteHelpers.enforce.swatchRules(4, 4);

	// base color setup
	const baseColor = utils.random.hsl();

	// generate tetradic hues
	const tetradicHues = paletteSuperUtils.genHues.tetradic(
		baseColor.value.hue
	);

	// initialize palette items array
	const paletteItems: PaletteItem[] = [];

	// add the base color as the first palette item
	const basePaletteItem =
		await paletteSuperUtils.create.paletteItem(baseColor);

	paletteItems.push(basePaletteItem);

	// add the tetradic colors sequentially
	for (let index = 0; index < tetradicHues.length; index++) {
		const hue = tetradicHues[index];
		const adjustedHSL: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(
					Math.max(
						0,
						Math.min(
							baseColor.value.saturation +
								(index % 2 === 0
									? -paletteRanges.shift.tetra.sat
									: paletteRanges.shift.tetra.sat),
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
									? -paletteRanges.shift.tetra.light
									: paletteRanges.shift.tetra.light),
							100
						)
					)
				)
			},
			format: 'hsl'
		};

		// generate all color values and create the palette item
		const adjustedColor = utils.conversion.genAllColorValues(adjustedHSL)
			.hsl as HSL;
		const paletteItem =
			await paletteSuperUtils.create.paletteItem(adjustedColor);
		paletteItems.push(paletteItem);
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	// save the palette to the database
	const tetradicPalette = await idbManager.savePaletteToDB(
		'tetradic',
		paletteItems,
		paletteID,
		args.swatches,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	// handle null or undefined palette
	if (!tetradicPalette) {
		throw new Error('Tetradic palette is either null or undefined.');
	}

	return tetradicPalette;
}
