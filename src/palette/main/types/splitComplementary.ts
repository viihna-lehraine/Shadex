// File: src/palette/main/types/splitComplementary.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../index/index.js';
import { core, utils } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { IDBManager } from '../../../classes/idb/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = data.consts.paletteRanges;

const idb = IDBManager.getInstance();

// *DEV-NOTE* update to reflect the fact this will always return 3 color swatches
export async function splitComplementary(
	args: GenPaletteArgs
): Promise<Palette> {
	// ensure exactly 3 color swatches
	if (args.numBoxes < 3) {
		ui.enforceSwatchRules(3, 3);
	}

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
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(
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
				lightness: core.brand.asPercentile(
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
					? core.brand.asAlphaRange(Math.random())
					: core.brand.asAlphaRange(1)
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

	const splitComplementaryPalette = await idb.savePaletteToDB(
		'splitComplementary',
		paletteItems,
		baseColor,
		args.numBoxes,
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
