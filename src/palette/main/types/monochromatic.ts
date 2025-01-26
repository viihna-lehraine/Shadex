// File: src/palette/main/types/monochromatic.js

import { GenPaletteArgs, Palette, PaletteItem } from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import { core, utils } from '../../../common/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const create = paletteSuperUtils.create;

export async function monochromatic(args: GenPaletteArgs): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.swatches < 2) ui.enforceSwatchRules(2);

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
				),
				alpha: args.enableAlpha
					? core.brand.asAlphaRange(Math.random())
					: core.brand.asAlphaRange(1)
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
