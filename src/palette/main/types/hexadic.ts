// File: src/palette/main/types/hexadic.js

import { GenPaletteArgs, HSL, Palette } from '../../../index/index.js';
import { IDBManager } from '../../../idb/index.js';
import { core, utils } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { paletteSuperUtils } from '../../common/index.js';

const consts = data.consts;
const create = paletteSuperUtils.create;
const defaults = data.defaults;
const genHues = paletteSuperUtils.genHues;
const mode = data.mode;
const paletteRanges = consts.paletteRanges;

const idb = IDBManager.getInstance();

export async function hexadic(args: GenPaletteArgs): Promise<Palette> {
	const currentHexadicPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 6) {
		if (mode.warnLogs)
			console.warn('Hexadic palette requires at least 6 swatches.');

		return utils.palette.createObject(
			'hexadic',
			[],
			core.brandColor.asHSL(defaults.colors.hsl),
			0,
			currentHexadicPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.hexadic(baseColor);
	const paletteItems = hues.map((hue, _i) => {
		const saturationShift =
			Math.random() * paletteRanges.hexad.satShift -
			paletteRanges.hexad.satShift / 2;
		const lightnessShift =
			Math.random() * paletteRanges.hexad.lightShift -
			paletteRanges.hexad.lightShift / 2;
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
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

	const hexadicPalette = await idb.savePaletteToDB(
		'hexadic',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!hexadicPalette)
		throw new Error('Hexadic palette is either null or undefined.');
	else return hexadicPalette;
}
