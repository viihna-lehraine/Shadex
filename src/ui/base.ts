// File: src/dom/events/palette.js

import { UIFnBaseInterface } from '../types/index.js';
import { consts, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';

const logger = await createLogger();

const domIDs = consts.dom.ids;
const logMode = mode.logging;

function enforceSwatchRules(
	minimumSwatches: number,
	maximumSwatches?: number
): void {
	const paletteDropdown = document.getElementById(
		domIDs.paletteNumberOptions
	) as HTMLSelectElement;

	if (!paletteDropdown) {
		if (logMode.error) {
			logger.error(
				'paletteDropdown not found',
				'ui > base > enforceSwatchRules()'
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
					'ui > base > enforceSwatchRules()'
				);
			}
			throw new Error(`Failed to dispatch change event: ${error}`);
		}
	}
}

export const base: UIFnBaseInterface = {
	enforceSwatchRules
};
