// File: src/palette/main/types/analogous.ts

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
const genHues = paletteSuperUtils.genHues;
const mode = data.mode;

const idb = IDBManager.getInstance();

export async function analogous(args: GenPaletteArgs): Promise<Palette> {
	const currentAnalogousPaletteID = await idb.getCurrentPaletteID();

	if (args.numBoxes < 2) {
		if (mode.warnLogs) {
			console.warn('Analogous palette requires at least 2 swatches.');
			console.warn('Returning default palette.');
		}

		return utils.palette.createObject(
			'analogous',
			[],
			core.brandColor.asHSL(data.defaults.colors.hsl),
			0,
			currentAnalogousPaletteID,
			args.enableAlpha,
			args.limitDark,
			args.limitGray,
			args.limitLight
		);
	}

	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const hues = genHues.analogous(baseColor, args.numBoxes);
	const paletteItems: PaletteItem[] = hues.map((hue, i) => {
		const newColor: HSL = {
			value: {
				hue: core.brand.asRadial(hue),
				saturation: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation +
								(Math.random() - 0.5) * 10
						)
					)
				),
				lightness: core.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.lightness + (i % 2 === 0 ? 5 : -5)
						)
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

	const analogousPalette = await idb.savePaletteToDB(
		'analogous',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!analogousPalette)
		throw new Error('Analogous palette is null or undefined.');
	else return analogousPalette;
}
