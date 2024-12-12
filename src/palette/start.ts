// File: src/palette/start.ts

import {
	HSL,
	PaletteOptions,
	PaletteStartFnInterface
} from '../index/index.js';
import { IDBManager } from '../idb/index.js';
import { data } from '../data/index.js';
import { generate } from '../palette/index.js';
import { helpers, superUtils, utils } from '../common/index.js';

const mode = data.mode;

async function paletteGen(options: PaletteOptions): Promise<void> {
	try {
		let { numBoxes, customColor } = options;

		const idb = IDBManager.getInstance();

		if (customColor === null || customColor === undefined) {
			if (mode.errorLogs)
				console.error('Custom color is null or undefined.');

			return;
		}

		const validatedCustomColor: HSL =
			(helpers.dom.validateAndConvertColor(customColor) as HSL) ??
			utils.random.hsl(options.enableAlpha);

		options.customColor = validatedCustomColor;

		const palette = await generate.selectedPalette(options);

		if (palette.items.length === 0) {
			if (mode.errorLogs)
				console.error('Colors array is empty or invalid.');

			return;
		}

		if (!mode.quiet)
			console.log(
				`Colors array generated: ${JSON.stringify(palette.items)}`
			);

		const tableId = await idb.getNextTableID();

		if (!tableId) throw new Error('Table ID is null or undefined.');

		await superUtils.dom.genPaletteBox(palette.items, numBoxes, tableId);
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Error starting palette generation: ${error}`);
	}
}

export const start: PaletteStartFnInterface = {
	paletteGen
} as const;
