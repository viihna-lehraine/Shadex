// File: src/palette/main/types/complementary.js

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../index/index.js';
import { IDBManager } from '../../../idb/index.js';
import { core } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { paletteSuperUtils } from '../../common/index.js';
import { ui } from '../../../ui/index.js';

const create = paletteSuperUtils.create;
const paletteRanges = data.consts.paletteRanges;

const idb = IDBManager.getInstance();

export async function complementary(args: GenPaletteArgs): Promise<Palette> {
	// ensure at least 2 color swatches
	if (args.numBoxes < 2) {
		ui.enforceSwatchRules(2);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const complementaryHue = (baseColor.value.hue + 180) % 360;
	const hues = Array.from(
		{ length: args.numBoxes - 1 },
		(_, _i) =>
			(complementaryHue +
				(Math.random() * paletteRanges.comp.hueShift -
					paletteRanges.comp.hueShift / 2)) %
			360
	);
	const paletteItems: PaletteItem[] = [];

	for (let i = 0; i < hues.length; i++) {
		const hue = hues[i];
		const saturation = Math.min(
			100,
			Math.max(0, baseColor.value.saturation + (Math.random() - 0.5) * 15)
		);
		const lightness = Math.min(
			100,
			Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? -10 : 10))
		);
		const alpha = args.enableAlpha ? Math.random() : 1;
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(saturation),
				lightness: core.brand.asPercentile(lightness),
				alpha: core.brand.asAlphaRange(alpha)
			},
			format: 'hsl'
		};
		const paletteItem = await create.paletteItem(
			newColor,
			args.enableAlpha
		);
		paletteItems.push(paletteItem);
	}

	const baseColorPaletteItem = await create.paletteItem(
		baseColor,
		args.enableAlpha
	);

	paletteItems.unshift(baseColorPaletteItem);

	const complementaryPalette = await idb.savePaletteToDB(
		'complementary',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!complementaryPalette)
		throw new Error('Complementary palette is null or undefined.');
	else return complementaryPalette;
}
