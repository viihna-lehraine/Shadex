// File: src/palette/main/types/analogous.ts

import { HSL, Palette, PaletteItem } from '../../../index';
import { IndexedDB } from '../../../idb';
import { config } from '../../../config';
import { paletteUtils, paletteSuperUtils } from '../../common';
import { utils } from '../../../common';

const create = paletteSuperUtils.create;
const defaultHSL = config.defaults.colors.hsl;
const genHues = paletteUtils.genHues;
const mode = config.mode;

const idb = IndexedDB.getInstance();

export async function analogous(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const currentAnalogousPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 2) {
		if (mode.logWarnings)
			console.warn('Analogous palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'analogous',
			[],
			defaultHSL,
			0,
			currentAnalogousPaletteID,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const hues = genHues.analogous(baseColor, numBoxes);
	const paletteItems: PaletteItem[] = hues.map((hue, i) => {
		const newColor: HSL = {
			value: {
				hue,
				saturation: Math.min(
					100,
					Math.max(
						0,
						baseColor.value.saturation + (Math.random() - 0.5) * 10
					)
				),
				lightness: Math.min(
					100,
					Math.max(
						0,
						baseColor.value.lightness + (i % 2 === 0 ? 5 : -5)
					)
				),
				alpha: enableAlpha ? Math.random() : 1
			},
			format: 'hsl'
		};

		return create.paletteItem(newColor, enableAlpha);
	});

	return await idb.savePaletteToDB(
		'analogous',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
