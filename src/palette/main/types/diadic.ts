// File: src/palette/main/types/diadic.ts

import { GenPaletteArgs, HSL, Palette } from '../../../index/index.js';
import { core, utils } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { IDBManager } from '../../../idb/index.js';
import { paletteSuperUtils } from '../../common/index.js';

const consts = data.consts;
const create = paletteSuperUtils.create;
const defaults = data.defaults;
const genHues = paletteSuperUtils.genHues;
const mode = data.mode;
const paletteRanges = consts.paletteRanges;

const idb = IDBManager.getInstance();

export async function diadic(args: GenPaletteArgs): Promise<Palette> {
	const currentDiadicPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 2) {
		if (mode.warnLogs)
			console.warn('Diadic palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'diadic',
			[],
			core.brandColor.asHSL(defaults.colors.hsl),
			0,
			currentDiadicPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.diadic(baseColor.value.hue);
	const paletteItems = Array.from({ length: args.numBoxes }, (_, i) => {
		const saturationShift =
			Math.random() * paletteRanges.diadic.satShift -
			paletteRanges.diadic.satShift / 2;
		const lightnessShift =
			Math.random() * paletteRanges.diadic.lightShift -
			paletteRanges.diadic.lightShift / 2;
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hues[i % hues.length]),
				saturation: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				),
				alpha: args.enableAlpha
					? core.brand.asAlphaRange(Math.random())
					: core.brand.asAlphaRange(1)
			},
			format: 'hsl'
		};

		return create.paletteItem(newColor, args.enableAlpha);
	});

	const diadicPalette = await idb.savePaletteToDB(
		'diadic',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!diadicPalette)
		throw new Error(`Diadic palette is either null or undefined.`);
	else return diadicPalette;
}
