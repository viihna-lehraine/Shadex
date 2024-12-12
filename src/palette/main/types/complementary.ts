// File: src/palette/main/types/complementary.ts

import {
	GenPaletteArgs,
	HSL,
	Palette,
	PaletteItem
} from '../../../index/index.js';
import { core, utils } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { IDBManager } from '../../../idb/index.js';
import { paletteSuperUtils } from '../../common/index.js';

const create = paletteSuperUtils.create;
const defaults = data.defaults;
const mode = data.mode;
const paletteRanges = data.consts.paletteRanges;

const idb = IDBManager.getInstance();

export async function complementary(args: GenPaletteArgs): Promise<Palette> {
	const currentComplementaryPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 2) {
		if (mode.warnLogs)
			console.warn('Complementary palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'complementary',
			[],
			core.brandColor.asHSL(defaults.colors.hsl),
			0,
			currentComplementaryPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
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
	const paletteItems: PaletteItem[] = hues.map((hue, i) => {
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

		return create.paletteItem(newColor, args.enableAlpha);
	});

	paletteItems.unshift(create.paletteItem(baseColor, args.enableAlpha));

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
