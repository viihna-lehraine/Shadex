// File: src/io/parse/json.ts

import { Palette } from '../../types/index.js';
import { createLogger } from '../../logger/factory.js';
import { mode } from '../../common/data/base.js';

const logger = await createLogger();
const logMode = mode.logging;

function file(jsonData: string): Promise<Palette | null> {
	try {
		const parsed = JSON.parse(jsonData);

		// Validate that the parsed object matches the expected structure
		if (!parsed.items || !Array.isArray(parsed.items)) {
			throw new Error('Invalid JSON structure for Palette');
		}

		return Promise.resolve(parsed as Palette);
	} catch (error) {
		if (!mode.quiet && logMode.error && logMode.verbosity > 1) {
			logger.error(
				`Error parsing JSON file: ${error}`,
				'io > parse > json > file()'
			);

			if (mode.showAlerts)
				alert(`Error parsing JSON file. See console for details.`);
		}

		return Promise.resolve(null);
	}
}

export const json = {
	file
};
