// File: src/palette/main/types/monochromatic.js

import { GenPaletteArgs, Palette, PaletteItem } from '../../../index/index.js';
import { IDBManager } from '../../../idb/index.js';
import { core, utils } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { paletteSuperUtils } from '../../common/index.js';

const create = paletteSuperUtils.create;
const mode = data.mode;

const idb = IDBManager.getInstance();

export async function monochromatic(args: GenPaletteArgs): Promise<Palette> {
	const currentMonochromaticPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 2) {
		if (mode.warnLogs)
			console.warn('Monochromatic palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'monochromatic',
			[],
			core.brandColor.asHSL(data.defaults.colors.hsl),
			0,
			currentMonochromaticPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, args.enableAlpha)
	];

	for (let i = 1; i < args.numBoxes; i++) {
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
			paletteItems.push(create.paletteItem(newColor, args.enableAlpha));
		}
	}

	const monochromaticPalette = await idb.savePaletteToDB(
		'monochromatic',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!monochromaticPalette)
		throw new Error('Monochromatic palette is either null or undefined.');
	else return monochromaticPalette;
}
