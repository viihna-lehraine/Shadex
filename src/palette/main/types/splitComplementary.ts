// File: palette/main/types/splitComplementary.js

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

export async function splitComplementary(
	args: PaletteGenerationArgs
): Promise<Palette> {
	// ensure exactly 3 color swatches
	if (args.swatches !== 3) paletteHelpers.enforce.swatchRules(3, 3);

	// base color setup
	const baseColor = utils.random.hsl();

	// generate split complementary hues
	const [hue1, hue2] = paletteSuperUtils.genHues.splitComplementary(
		baseColor.value.hue
	);

	// initialize palette items array
	const paletteItems: PaletteItem[] = [];

	// add base color as the first item in the array
	const basePaletteItem =
		await paletteSuperUtils.create.paletteItem(baseColor);
	paletteItems.push(basePaletteItem);

	for (const [index, hue] of [hue1, hue2].entries()) {
		const adjustedHSL: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(
					Math.max(
						0,
						Math.min(
							baseColor.value.saturation +
								(index === 0
									? -paletteRanges.shift.splitComp.sat
									: paletteRanges.shift.splitComp.sat),
							100
						)
					)
				),
				lightness: core.brand.asPercentile(
					Math.max(
						0,
						Math.min(
							baseColor.value.lightness +
								(index === 0
									? -paletteRanges.shift.splitComp.light
									: paletteRanges.shift.splitComp.light),
							100
						)
					)
				)
			},
			format: 'hsl'
		};

		const adjustedColor =
			utils.conversion.genAllColorValues(adjustedHSL).hsl;

		if (adjustedColor) {
			const paletteItem =
				await paletteSuperUtils.create.paletteItem(adjustedColor);

			paletteItems.push(paletteItem);
		}
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = (await idbManager.getCurrentPaletteID()) + 1;

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const paletteArgs: PaletteArgs = {
		type: 'splitComplementary',
		items: paletteItems,
		paletteID,
		swatches: args.swatches,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	const splitComplementaryPalette =
		await idbManager.savePaletteToDB(paletteArgs);

	if (!splitComplementaryPalette) {
		throw new Error(
			'Split complementary palette is either null or undefined.'
		);
	}

	return splitComplementaryPalette;
}
