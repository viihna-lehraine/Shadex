// File: palette/main/types/monochromatic.js

import { GenPaletteArgs, Palette, PaletteItem } from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import { coreUtils, utils } from '../../../common/index.js';
import { superUtils as paletteSuperUtils } from '../../common/index.js';
import { uiFn } from '../../../ui/index.js';

const create = paletteSuperUtils.create;

export async function monochromatic(args: GenPaletteArgs): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches < 2) uiFn.enforceSwatchRules(2);

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const paletteItems: PaletteItem[] = [];
	const basePaletteItem = await create.paletteItem(
		baseColor,
		args.enableAlpha
	);

	paletteItems.push(basePaletteItem);

	for (let i = 1; i < args.swatches; i++) {
		const hueShift = Math.random() * 10 - 5;
		const newColor = utils.conversion.genAllColorValues({
			value: {
				hue: coreUtils.brand.asRadial(
					(baseColor.value.hue + hueShift + 360) % 360
				),
				saturation: coreUtils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.saturation - i * 5)
					)
				),
				lightness: coreUtils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + (i * 10 - 20))
					)
				),
				alpha: args.enableAlpha
					? coreUtils.brand.asAlphaRange(Math.random())
					: coreUtils.brand.asAlphaRange(1)
			},
			format: 'hsl'
		}).hsl;

		if (newColor) {
			const paletteItem = await create.paletteItem(
				newColor,
				args.enableAlpha
			);

			paletteItems.push(paletteItem);
		}
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const monochromaticPalette = await idbManager.savePaletteToDB(
		'monochromatic',
		paletteItems,
		paletteID,
		args.swatches,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!monochromaticPalette) {
		throw new Error('Monochromatic palette is either null or undefined.');
	} else {
		return monochromaticPalette;
	}
}
