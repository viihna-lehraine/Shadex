// File: src/paletteGen/palettes/types/random.ts

import { HSL, Palette, PaletteItem } from '../../../index/index';
import { idb } from '../../../idb';
import { utils } from '../../../common';
import { paletteUtils } from '../../utils';

const create = paletteUtils.create;
const update = paletteUtils.sub.update;

export async function random(
	numBoxes: number,
	customColor: HSL | null,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<Palette> {
	const baseColor = create.baseColor(customColor, enableAlpha);
	const paletteItems: PaletteItem[] = [
		paletteUtils.create.paletteItem(baseColor, enableAlpha)
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
		limitBright,
		limitDark,
		limitGray
	);
}
