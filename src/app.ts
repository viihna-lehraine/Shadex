// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

// File: src/app.js

import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { logger } from './logger/index.js';

const consts = data.consts;
const mode = data.mode;

document.addEventListener('DOMContentLoaded', async () => {
	console.log('DOM content loaded - Initializing application');

	if (!mode.quiet) console.log('Initializing UI...');

	const domElements = dom.defineUIElements();

	if (!domElements) {
		if (mode.errorLogs)
			console.error(
				'Failed to properly initialize the UI. Some DOM elements could not be found.'
			);

		process.exit(201);
	}

	try {
		await dom.initializeUI();

		if (!mode.quiet) console.log('UI successfully initialized');
	} catch (error) {
		if (mode.errorLogs) console.error(`Failed to initialize UI\n${error}`);

		process.exit(202);
	}

	const selectedColorOption = consts.dom.elements.selectedColorOption;

	if (mode.debug) {
		logger.debug.validateDOMElements();

		if (mode.verbose) {
			logger.verbose.validateDOMElements();
		}
	} else {
		if (!mode.quiet) {
			console.log('Skipping DOM element validation');
		}
	}

	const selectedColor = selectedColorOption
		? parseInt(selectedColorOption.value, 10)
		: 0;

	if (!mode.quiet) console.log(`Selected color: ${selectedColor}`);

	try {
		dom.elements.initializeEventListeners();

		if (!mode.quiet)
			console.log('Event listeners have been successfully initialized');
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Failed to initialize event listeners.\n${error}`);

		process.exit(203);
	}

	if (!mode.quiet)
		console.log(
			'Application successfully initialized. Awaiting user input.'
		);
});
