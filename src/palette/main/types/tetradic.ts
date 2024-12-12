// File: src/palette/main/types/tetradic.ts

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
const genHues = paletteSuperUtils.genHues;
const mode = data.mode;
const paletteRanges = data.consts.paletteRanges;

const idb = IDBManager.getInstance();

export async function tetradic(args: GenPaletteArgs): Promise<Palette> {
	const currentTetradicPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 4) {
		if (mode.warnLogs)
			console.warn('Tetradic palette requires at least 4 swatches.');

		return utils.palette.createObject(
			'tetradic',
			[],
			core.brandColor.asHSL(defaults.colors.hsl),
			0,
			currentTetradicPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const tetradicHues = genHues.tetradic(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, args.enableAlpha),
		...tetradicHues.map((hue, index) => {
			const adjustedHSL: HSL = {
				value: {
					hue: core.brand.asRadial(hue),
					saturation: core.brand.asPercentile(
						Math.max(
							0,
							Math.min(
								baseColor.value.saturation +
									(index % 2 === 0
										? -paletteRanges.tetra.satShift
										: paletteRanges.tetra.satShift),
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
										? -paletteRanges.tetra.lightShift
										: paletteRanges.tetra.lightShift),
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
			const adjustedColor =
				utils.conversion.genAllColorValues(adjustedHSL);

			return create.paletteItem(
				adjustedColor.hsl as HSL,
				args.enableAlpha
			);
		})
	];

	const tetradicPalette = await idb.savePaletteToDB(
		'tetradic',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!tetradicPalette)
		throw new Error('Tetradic palette is either null or undefined.');
	else return tetradicPalette;
}
