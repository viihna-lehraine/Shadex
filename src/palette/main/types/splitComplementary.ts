// File: src/palette/main/types/splitComplementary.js

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

export async function splitComplementary(
	args: GenPaletteArgs
): Promise<Palette> {
	const currentSplitComplementaryPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 3) {
		if (mode.warnLogs)
			console.warn(
				'Split complementary palette requires at least 3 swatches.'
			);

		return utils.palette.createObject(
			'splitComplementary',
			[],
			core.brandColor.asHSL(defaults.colors.hsl),
			0,
			currentSplitComplementaryPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const [hue1, hue2] = genHues.splitComplementary(baseColor.value.hue);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, args.enableAlpha),
		...[hue1, hue2].map((hue, index) => {
			const adjustedHSL: HSL = {
				value: {
					hue: core.brand.asRadial(hue),
					saturation: core.brand.asPercentile(
						Math.max(
							0,
							Math.min(
								baseColor.value.saturation +
									(index === 0
										? -paletteRanges.splitComp.satShift
										: paletteRanges.splitComp.satShift),
								100
							)
						)
					),
					lightness: core.brand.asPercentile(
						Math.max(
							0,
							Math.min(
								baseColor.value.lightness +
									(index === 0
										? -paletteRanges.splitComp.lightShift
										: paletteRanges.splitComp.lightShift),
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
			const adjustedColor = utils.conversion.genAllColorValues(
				adjustedHSL
			) as HSL;

			return create.paletteItem(adjustedColor, args.enableAlpha);
		})
	];

	const splitComplementaryPalette = await idb.savePaletteToDB(
		'splitComplementary',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!splitComplementaryPalette)
		throw new Error(
			'Split complementary palette is either null or undefined.'
		);
	else return splitComplementaryPalette;
}
