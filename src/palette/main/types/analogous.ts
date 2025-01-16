// File: src/palette/main/types/analogous.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../index/index.js';
import { core } from '../../../common/index.js';
import { IDBManager } from '../../../classes/idb/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;

const idb = IDBManager.getInstance();

export async function analogous(args: GenPaletteArgs): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.numBoxes < 2) {
		ui.enforceSwatchRules(2);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.analogous(baseColor, args.numBoxes);
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
				),
				alpha: args.enableAlpha
					? core.brand.asAlphaRange(Math.random())
					: core.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};

		const paletteItem = await create.paletteItem(
			newColor,
			args.enableAlpha
		);

		paletteItems.push(paletteItem);
	}

	const analogousPalette = await idb.savePaletteToDB(
		'analogous',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!analogousPalette)
		throw new Error('Analogous palette is null or undefined.');
	else return analogousPalette;
}
