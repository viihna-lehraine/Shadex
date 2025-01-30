// File: palette/main/types/tetradic.js

import {
	HSL,
	Palette,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import { coreUtils, utils } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import { superUtils as paletteSuperUtils } from '../../common/index.js';
import { uiFn } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = consts.paletteRanges;

export async function tetradic(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure exactly 4 swatches
	if (args.swatches !== 4) uiFn.enforceSwatchRules(4, 4);

	// base color setup
	const baseColor = create.baseColor(args.customColor);

	// generate tetradic hues
	const tetradicHues = genHues.tetradic(baseColor.value.hue);

	// initialize palette items array
	const paletteItems: PaletteItem[] = [];

	// add the base color as the first palette item
	const basePaletteItem = await create.paletteItem(baseColor);

	paletteItems.push(basePaletteItem);

	// add the tetradic colors sequentially
	for (let index = 0; index < tetradicHues.length; index++) {
		const hue = tetradicHues[index];
		const adjustedHSL: HSL = {
			value: {
				hue: coreUtils.brand.asRadial(hue),
				saturation: coreUtils.brand.asPercentile(
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
				lightness: coreUtils.brand.asPercentile(
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
		const paletteItem = await create.paletteItem(adjustedColor);
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
