// File: src/io/parse/json.ts

import { Palette } from '../../types/index.js';
import { data } from '../../data/index.js';
import { logger } from '../../logger/factory.js';

const logMode = data.mode.logging;
const mode = data.mode;

function file(jsonData: string): Promise<Palette | null> {
	try {
		const parsed = JSON.parse(jsonData);

		// Validate that the parsed object matches the expected structure
		if (!parsed.items || !Array.isArray(parsed.items)) {
			throw new Error('Invalid JSON structure for Palette');
		}

		return Promise.resolve(parsed as Palette);
	} catch (error) {
		if (!mode.quiet && logMode.errors && logMode.verbosity > 1) {
			logger.error(`Error parsing JSON file: ${error}`);

			if (mode.showAlerts)
				alert(`Error parsing JSON file. See console for details.`);
		}

		return Promise.resolve(null);
	}
}

export const json = {
	file
};
