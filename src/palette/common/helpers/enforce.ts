// File: palette/common/helpers/enforce.js

import { createLogger } from '../../../logger/factory.js';
import { domData } from '../../../data/dom.js';
import { modeData as mode } from '../../../data/mode.js';

const domIDs = domData.ids;
const logMode = mode.logging;

const thisModule = 'palette/common/helpers/enforce.js';

const logger = await createLogger();

function swatchRules(minSwatches: number, maxSwatches?: number): void {
	const thisFunction = 'enforceSwatchRules()';
	const swatchNumberSelector = document.getElementById(
		domIDs.static.selects.swatchGen
	) as HTMLSelectElement;

	if (!swatchNumberSelector) {
		if (logMode.error) {
			logger.error(
				'paletteDropdown not found',
				`${thisModule} > ${thisFunction}`
			);
		}
		if (mode.stackTrace && logMode.verbosity > 3) {
			console.trace('enforceMinimumSwatches stack trace');
		}

		return;
	}

	const currentValue = parseInt(swatchNumberSelector.value, 10);

	let newValue = currentValue;

	// ensue the value is within the allowed range
	if (currentValue < minSwatches) {
		newValue = minSwatches;
	} else if (maxSwatches !== undefined && currentValue > maxSwatches) {
		newValue = maxSwatches;
	}

	if (newValue !== currentValue) {
		// update value in the dropdown menu
		swatchNumberSelector.value = newValue.toString();

		// trigger a change event to notify the application
		const event = new Event('change', { bubbles: true });
		try {
			swatchNumberSelector.dispatchEvent(event);
		} catch (error) {
			if (logMode.error) {
				logger.error(
					`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`,
					`${thisModule} > ${thisFunction}`
				);
			}
			throw new Error(`Failed to dispatch change event: ${error}`);
		}
	}
}

export const enforce = {
	swatchRules
};
