import { database } from '../database/database';
import { domHelpers } from '../helpers/dom';
import * as fnObjects from '../index/fn-objects';
import * as palette from '../index/palette';
import { paletteUtils } from '../utils/palette-utils';

async function genPaletteBox(
	items: palette.PaletteItem[],
	numBoxes: number,
	tableId: string
): Promise<void> {
	try {
		const paletteRow = document.getElementById('palette-row');

		if (!paletteRow) {
			console.error('paletteRow is undefined.');

			return;
		}

		paletteRow.innerHTML = '';

		const fragment = document.createDocumentFragment();

		items.slice(0, numBoxes).forEach((item, i) => {
			const { hsl: color } = item.colors;
			const { colorStripe } = domHelpers.makePaletteBox(color, i + 1);

			fragment.appendChild(colorStripe);

			paletteUtils.populateColorTextOutputBox(color, i + 1);
		});

		paletteRow.appendChild(fragment);

		console.log('Palette boxes generated and rendered.');

		await database.saveData('tables', tableId, { palette: items });
	} catch (error) {
		console.error(`Error generating palette box: ${error}`);
	}
}

export const domUtils: fnObjects.DOMUtils = {
	genPaletteBox
};
