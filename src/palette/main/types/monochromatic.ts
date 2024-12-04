// File: src/palette/main/types/monochromatic.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { config } from '../../../config';
import { IndexedDB } from '../../../idb';
import { paletteSuperUtils } from '../../common';
import { utils } from '../../../common';

const create = paletteSuperUtils.create;
const defaultHSL = config.defaults.colors.hsl;
const mode = config.mode;

const idb = IndexedDB.getInstance();

export async function monochromatic(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const currentMonochromaticPaletteID = await idb.getCurrentPaletteID();

	if (numBoxes < 2) {
		if (mode.logWarnings)
			console.warn('Monochromatic palette requires at least 2 swatches.');

		return utils.palette.createObject(
			'monochromatic',
			[],
			defaultHSL,
			0,
			currentMonochromaticPaletteID,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	const baseColor = create.baseColor(customColor, enableAlpha);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, enableAlpha)
	];

	for (let i = 1; i < numBoxes; i++) {
		const hueShift = Math.random() * 10 - 5;
		const newColor = utils.conversion.genAllColorValues({
			value: {
				hue: (baseColor.value.hue + hueShift + 360) % 360,
				saturation: Math.min(
					100,
					Math.max(0, baseColor.value.saturation - i * 5)
				),
				lightness: Math.min(
					100,
					Math.max(0, baseColor.value.lightness + (i * 10 - 20))
				),
				alpha: enableAlpha ? Math.random() : 1
			},
			format: 'hsl'
		}).hsl;

		if (newColor) {
			paletteItems.push(create.paletteItem(newColor, enableAlpha));
		}
	}

	return await idb.savePaletteToDB(
		'monochromatic',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
