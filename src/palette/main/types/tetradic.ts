// File: src/palette/main/types/tetradic.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../types/index.js';
import { core, utils } from '../../../common/index.js';
import { consts } from '../../../common/data/base.js';
import { IDBManager } from '../../../db/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = consts.paletteRanges;

export async function tetradic(args: GenPaletteArgs): Promise<Palette> {
	// ensure exactly 4 swatches
	if (args.swatches !== 4) ui.enforceSwatchRules(4, 4);

	// base color setup
	const baseColor = create.baseColor(args.customColor, args.enableAlpha);

	// generate tetradic hues
	const tetradicHues = genHues.tetradic(baseColor.value.hue);

	// initialize palette items array
	const paletteItems: PaletteItem[] = [];

	// add the base color as the first palette item
	const basePaletteItem = await create.paletteItem(
		baseColor,
		args.enableAlpha
	);

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
									? -paletteRanges.tetra.satShift
									: paletteRanges.tetra.satShift),
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
									? -paletteRanges.tetra.lightShift
									: paletteRanges.tetra.lightShift),
							100
						)
					)
				),
				alpha: args.enableAlpha
					? core.brand.asAlphaRange(Math.random())
					: core.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};

		// generate all color values and create the palette item
		const adjustedColor = utils.conversion.genAllColorValues(adjustedHSL)
			.hsl as HSL;
		const paletteItem = await create.paletteItem(
			adjustedColor,
			args.enableAlpha
		);
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
		args.enableAlpha,
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
