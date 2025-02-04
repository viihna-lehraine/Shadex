// File: palette/main/types/analogous.js

import {
	HSL,
	Palette,
	PaletteGenerationArgs,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/IDBManager.js';
import { commonFn } from '../../../common/index.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';

const core = commonFn.core;
const utils = commonFn.utils;

export async function analogous(args: PaletteGenerationArgs): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches < 2) paletteHelpers.enforce.swatchRules(2);

	const baseColor = utils.random.hsl();
	const hues = paletteSuperUtils.genHues.analogous(baseColor, args.swatches);
	const paletteItems: PaletteItem[] = [];

	for (const [i, hue] of hues.entries()) {
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation +
								(Math.random() - 0.5) * 10
						)
					)
				),
				lightness: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.lightness + (i % 2 === 0 ? 5 : -5)
						)
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

	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const analogousPalette = await idbManager.savePaletteToDB(
		'analogous',
		paletteItems,
		paletteID,
		args.swatches,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!analogousPalette)
		throw new Error('Analogous palette is null or undefined.');
	else return analogousPalette;
}
