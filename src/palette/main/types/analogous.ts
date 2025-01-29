// File: palette/main/types/analogous.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import { coreUtils } from '../../../common/index.js';
import { superUtils as paletteSuperUtils } from '../../common/index.js';
import { uiFn } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;

export async function analogous(args: GenPaletteArgs): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches < 2) uiFn.enforceSwatchRules(2);

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.analogous(baseColor, args.swatches);
	const paletteItems: PaletteItem[] = [];

	for (const [i, hue] of hues.entries()) {
		const newColor: HSL = {
			value: {
				hue: coreUtils.brand.asRadial(hue),
				saturation: coreUtils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation +
								(Math.random() - 0.5) * 10
						)
					)
				),
				lightness: coreUtils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.lightness + (i % 2 === 0 ? 5 : -5)
						)
					)
				),
				alpha: args.enableAlpha
					? coreUtils.brand.asAlphaRange(Math.random())
					: coreUtils.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};

		const paletteItem = await create.paletteItem(
			newColor,
			args.enableAlpha
		);

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
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!analogousPalette)
		throw new Error('Analogous palette is null or undefined.');
	else return analogousPalette;
}
