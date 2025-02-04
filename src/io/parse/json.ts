// File: io/parse/json.js

import { Palette } from '../../types/index.js';
import { createLogger } from '../../logger/factory.js';
import { modeData } from '../../data/mode.js';

const logMode = modeData.logging;
const mode = modeData;
const thisModule = 'io/parse/json.ts';

const logger = await createLogger();

function file(jsonData: string): Promise<Palette | null> {
	const caller = 'file()';

	try {
		const parsed = JSON.parse(jsonData);

		// Validate that the parsed object matches the expected structure
		if (!parsed.items || !Array.isArray(parsed.items)) {
			throw new Error('Invalid JSON structure for Palette');
		}

		return Promise.resolve(parsed as Palette);
	} catch (error) {
		if (logMode.error && logMode.verbosity > 1) {
			logger.error(
				`Error parsing JSON file: ${error}`,
				`${thisModule} > ${caller}`
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
