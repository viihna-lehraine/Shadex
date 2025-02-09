// File: palette/main/types/monochromatic.js

import {
	Palette,
	PaletteArgs,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../app/IDB/IDBManager.js';
import { commonFn } from '../../../common/index.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';

const core = commonFn.core;
const utils = commonFn.utils;

export async function monochromatic(
	args: PaletteGenerationArgs
): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches < 2) paletteHelpers.enforce.swatchRules(2);

	const baseColor = utils.random.hsl();
	const paletteItems: PaletteItem[] = [];
	const basePaletteItem =
		await paletteSuperUtils.create.paletteItem(baseColor);

	paletteItems.push(basePaletteItem);

	for (let i = 1; i < args.swatches; i++) {
		const hueShift = Math.random() * 10 - 5;
		const newColor = utils.conversion.genAllColorValues({
			value: {
				hue: core.brand.asRadial(
					(baseColor.value.hue + hueShift + 360) % 360
				),
				saturation: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.saturation - i * 5)
					)
				),
				lightness: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + (i * 10 - 20))
					)
				)
			},
			format: 'hsl'
		}).hsl;

		if (newColor) {
			const paletteItem =
				await paletteSuperUtils.create.paletteItem(newColor);

			paletteItems.push(paletteItem);
		}
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = (await idbManager.getCurrentPaletteID()) + 1;

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const paletteArgs: PaletteArgs = {
		type: 'monochromatic',
		items: paletteItems,
		paletteID,
		swatches: args.swatches,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	const monochromaticPalette = await idbManager.savePaletteToDB(paletteArgs);

	if (!monochromaticPalette) {
		throw new Error('Monochromatic palette is either null or undefined.');
	} else {
		return monochromaticPalette;
	}
}
