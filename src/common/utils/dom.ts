// File: src/common/utils/dom.ts

import { GenButtonParams, HSL, PaletteItem } from '../../index';
import { idb } from '../../idb';
import { helpers } from '../helpers';
import { palette } from './palette';
import { config } from '../../config';
import { core } from '../core';

async function genPaletteBox(
	items: PaletteItem[],
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
			const color: HSL = { value: item.colors.hsl, format: 'hsl' };
			const { colorStripe } = helpers.dom.makePaletteBox(color, i + 1);

			fragment.appendChild(colorStripe);

			palette.populateOutputBox(color, i + 1);
		});

		paletteRow.appendChild(fragment);

		console.log('Palette boxes generated and rendered.');

		await idb.saveData('tables', tableId, { palette: items });
	} catch (error) {
		console.error(`Error generating palette box: ${error}`);
	}
}

function getGenButtonParams(): GenButtonParams | null {
	try {
		const paletteNumberOptions = config.consts.dom.paletteNumberOptions;
		const paletteTypeOptions = config.consts.dom.paletteTypeOptions;
		const customColorRaw = config.consts.dom.customColorElement?.value;
		const enableAlphaCheckbox = config.consts.dom.enableAlphaCheckbox;
		const limitDarknessCheckbox = config.consts.dom.limitDarknessCheckbox;
		const limitGraynessCheckbox = config.consts.dom.limitGraynessCheckbox;
		const limitLightnessCheckbox = config.consts.dom.limitLightnessCheckbox;

		if (
			paletteNumberOptions === null ||
			paletteTypeOptions === null ||
			enableAlphaCheckbox === null ||
			limitDarknessCheckbox === null ||
			limitGraynessCheckbox === null ||
			limitLightnessCheckbox === null
		) {
			console.error('One or more elements are null');

			return null;
		}

		console.log(
			`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`
		);

		return {
			numBoxes: parseInt(paletteNumberOptions.value, 10),
			paletteType: parseInt(paletteTypeOptions.value, 10),
			customColor: customColorRaw
				? (core.parseCustomColor(customColorRaw) as HSL | null)
				: null,
			enableAlpha: enableAlphaCheckbox.checked,
			limitDarkness: limitDarknessCheckbox.checked,
			limitGrayness: limitGraynessCheckbox.checked,
			limitLightness: limitLightnessCheckbox.checked
		};
	} catch (error) {
		console.error('Failed to retrieve generateButton parameters:', error);

		return null;
	}
}

export const dom = { genPaletteBox, getGenButtonParams };
