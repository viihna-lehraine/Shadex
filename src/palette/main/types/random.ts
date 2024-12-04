// File: src/paletteGen/palettes/types/random.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { IndexedDB } from '../../../idb';
import { paletteHelpers, paletteSuperUtils } from '../../common';
import { utils } from '../../../common';

const create = paletteSuperUtils.create;
const update = paletteHelpers.update;

const idb = IndexedDB.getInstance();

export async function random(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitDark: boolean,
	limitGray: boolean,
	limitLight: boolean
): Promise<Palette> {
	const baseColor = create.baseColor(customColor, enableAlpha);
	const paletteItems: PaletteItem[] = [
		create.paletteItem(baseColor, enableAlpha)
	];

	for (let i = 1; i < numBoxes; i++) {
		const randomColor = utils.random.hsl(enableAlpha);

		paletteItems.push(create.paletteItem(randomColor, enableAlpha));

		update.colorBox(randomColor, i);
	}

	return await idb.savePaletteToDB(
		'random',
		paletteItems,
		baseColor,
		numBoxes,
		enableAlpha,
		limitDark,
		limitGray,
		limitLight
	);
}
