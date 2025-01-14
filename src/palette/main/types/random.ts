// File: src/paletteGen/palettes/types/random.js

import { GenPaletteArgs, Palette, PaletteItem } from '../../../index/index.js';
import { IDBManager } from '../../../idb/index.js';
import { paletteHelpers, paletteSuperUtils } from '../../common/index.js';
import { utils } from '../../../common/index.js';

const create = paletteSuperUtils.create;
const update = paletteHelpers.update;

const idb = IDBManager.getInstance();

export async function random(args: GenPaletteArgs): Promise<Palette> {
	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const paletteItems: PaletteItem[] = [
		await create.paletteItem(baseColor, args.enableAlpha)
	];

	for (let i = 1; i < args.numBoxes; i++) {
		const randomColor = utils.random.hsl(args.enableAlpha);
		const nextPaletteItem = await create.paletteItem(
			randomColor,
			args.enableAlpha
		);

		paletteItems.push(nextPaletteItem);

		update.colorBox(randomColor, i);
	}

	const randomPalette = await idb.savePaletteToDB(
		'random',
		paletteItems,
		baseColor,
		args.numBoxes,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!randomPalette)
		throw new Error('Random palette is either null or undefined.');
	else return randomPalette;
}
