// File: dom/events/palette.js

import { UIFn_BaseInterface } from '../types/index.js';
import { domData } from '../data/dom.js';
import { createLogger } from '../logger/index.js';
import { modeData as mode } from '../data/mode.js';

const domIDs = domData.ids;
const logMode = mode.logging;
const thisModule = 'ui/base.js';

const logger = await createLogger();

function enforceSwatchRules(
	minimumSwatches: number,
	maximumSwatches?: number
): void {
	const thisFunction = 'enforceSwatchRules()';
	const paletteDropdown = document.getElementById(
		domIDs.paletteNumberOptions
	) as HTMLSelectElement;

	if (!paletteDropdown) {
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

	const currentValue = parseInt(paletteDropdown.value, 10);

	let newValue = currentValue;

	// ensue the value is within the allowed range
	if (currentValue < minimumSwatches) {
		newValue = minimumSwatches;
	} else if (
		maximumSwatches !== undefined &&
		currentValue > maximumSwatches
	) {
		newValue = maximumSwatches;
	}

	if (newValue !== currentValue) {
		// update value in the dropdown menu
		paletteDropdown.value = newValue.toString();

		// trigger a change event to notify the application
		const event = new Event('change', { bubbles: true });
		try {
			paletteDropdown.dispatchEvent(event);
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

export const base: UIFn_BaseInterface = {
	enforceSwatchRules
};
