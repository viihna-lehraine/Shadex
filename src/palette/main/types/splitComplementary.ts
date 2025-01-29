// File: palette/main/types/splitComplementary.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import { coreUtils, utils } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import { superUtils as paletteSuperUtils } from '../../common/index.js';
import { uiFn } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = consts.paletteRanges;

export async function splitComplementary(
	args: GenPaletteArgs
): Promise<Palette> {
	// ensure exactly 3 color swatches
	if (args.swatches !== 3) uiFn.enforceSwatchRules(3, 3);

	// base color setup
	const baseColor = create.baseColor(args.customColor, args.enableAlpha);

	// generate split complementary hues
	const [hue1, hue2] = genHues.splitComplementary(baseColor.value.hue);

	// initialize palette items array
	const paletteItems: PaletteItem[] = [];

	// add base color as the first item in the array
	const basePaletteItem = await create.paletteItem(
		baseColor,
		args.enableAlpha
	);
	paletteItems.push(basePaletteItem);

	for (const [index, hue] of [hue1, hue2].entries()) {
		const adjustedHSL: HSL = {
			value: {
				hue: coreUtils.brand.asRadial(hue),
				saturation: coreUtils.brand.asPercentile(
					Math.max(
						0,
						Math.min(
							baseColor.value.saturation +
								(index === 0
									? -paletteRanges.splitComp.satShift
									: paletteRanges.splitComp.satShift),
							100
						)
					)
				),
				lightness: coreUtils.brand.asPercentile(
					Math.max(
						0,
						Math.min(
							baseColor.value.lightness +
								(index === 0
									? -paletteRanges.splitComp.lightShift
									: paletteRanges.splitComp.lightShift),
							100
						)
					)
				),
				alpha: args.enableAlpha
					? coreUtils.brand.asAlphaRange(Math.random())
					: coreUtils.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};

		const adjustedColor =
			utils.conversion.genAllColorValues(adjustedHSL).hsl;

		if (adjustedColor) {
			const paletteItem = await create.paletteItem(
				adjustedColor,
				args.enableAlpha
			);

			paletteItems.push(paletteItem);
		}
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const splitComplementaryPalette = await idbManager.savePaletteToDB(
		'splitComplementary',
		paletteItems,
		paletteID,
		args.swatches,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!splitComplementaryPalette) {
		throw new Error(
			'Split complementary palette is either null or undefined.'
		);
	}

	return splitComplementaryPalette;
}
