// File: paletteGen/palettes/types/random.js

import { GenPaletteArgs, Palette, PaletteItem } from '../../../types/index.js';
import { IDBManager } from '../../../db/index.js';
import {
	helpers as paletteHelpers,
	superUtils as paletteSuperUtils
} from '../../common/index.js';
import { utils } from '../../../common/index.js';

const create = paletteSuperUtils.create;
const update = paletteHelpers.update;

export async function random(args: GenPaletteArgs): Promise<Palette> {
	const baseColor = create.baseColor(args.customColor, args.enableAlpha);
	const paletteItems: PaletteItem[] = [
		await create.paletteItem(baseColor, args.enableAlpha)
	];

	for (let i = 1; i < args.swatches; i++) {
		const randomColor = utils.random.hsl(args.enableAlpha);
		const nextPaletteItem = await create.paletteItem(
			randomColor,
			args.enableAlpha
		);

		paletteItems.push(nextPaletteItem);

		update.colorBox(randomColor, i);
	}

	const idbManager = await IDBManager.getInstance();
	const paletteID = await idbManager.getNextPaletteID();

	if (!paletteID) throw new Error('Palette ID is either null or undefined.');

	const randomPalette = await idbManager.savePaletteToDB(
		'random',
		paletteItems,
		paletteID,
		args.swatches,
		args.enableAlpha,
		args.limitDark,
		args.limitGray,
		args.limitLight
	);

	if (!randomPalette)
		throw new Error('Random palette is either null or undefined.');
	else return randomPalette;
}
