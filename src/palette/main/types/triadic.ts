// File: src/palette/main/types/triadic.js

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

const conversion = utils.conversion;
const create = paletteSuperUtils.create;
const defaults = data.defaults;
const genHues = paletteSuperUtils.genHues;
const mode = data.mode;
const paletteRanges = data.consts.paletteRanges;

const idb = IDBManager.getInstance();

export async function triadic(args: GenPaletteArgs): Promise<Palette> {
	const currentTriadicPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 3) {
		if (mode.warnLogs)
			console.warn('Triadic palette requires at least 3 swatches.');

		return utils.palette.createObject(
			'triadic',
			[],
			core.brandColor.asHSL(defaults.colors.hsl),
			0,
			currentTriadicPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.triadic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, args.enableAlpha),
		...hues.map((hue, index) => {
			const adjustedHSL: HSL = {
				value: {
					hue: core.brand.asRadial(hue),
					saturation: core.brand.asPercentile(
						Math.max(
							0,
							Math.min(
								baseColor.value.saturation +
									(index % 2 === 0
										? -paletteRanges.triad.satShift
										: paletteRanges.triad.satShift),
								100
							)
						)
					),
					lightness: core.brand.asPercentile(
						Math.max(
							0,
							Math.min(
								baseColor.value.lightness +
									(index % 2 === 0
										? -paletteRanges.triad.lightShift
										: paletteRanges.triad.lightShift),
								100
							)
						)
					),
					alpha: args.enableAlpha
						? core.brand.asAlphaRange(Math.random())
						: core.brand.asAlphaRange(1)
				},
				format: 'hsl'
			};
			const adjustedColor = conversion.genAllColorValues(adjustedHSL);

			return create.paletteItem(adjustedColor as HSL, args.enableAlpha);
		})
	];

	const triadicPalette = await idb.savePaletteToDB(
		'triadic',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!triadicPalette)
		throw new Error('Triadic palette is either null or undefined.');
	else return triadicPalette;
}
