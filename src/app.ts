// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

// File: src/app.js

import { consts, mode } from './common/data/base.js';
import { getIDBInstance } from './db/instance.js';
import { createLogger } from './logger/index.js';
import { dom } from './dom/index.js';

const logger = await createLogger();

const logMode = mode.logging;

if (mode.debug)
	logger.info('Executing main application script', 'app.js [STEP 1]');

if (document.readyState === 'loading') {
	if (mode.debug)
		logger.info(
			'DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...',
			'app.js [STEP 2]'
		);

	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	if (mode.debug)
		logger.info(
			'DOM content already loaded. Initializing application immediately.',
			'app.js [STEP 2]: ERROR'
		);

	initializeApp();
}

async function initializeApp(): Promise<void> {
	logger.info('DOM content loaded - Initializing application', 'app.js');

	try {
		if (mode.logging.verbosity > 1)
			logger.info(
				'Creating new IDBManager instance. Initializing database and its dependencies.',
				'app.js, ['
			);

		if (mode.expose.idbManager) {
			if (mode.debug)
				logger.info(
					'Exposing IDBManager instance to window.',
					'app.js'
				);

			try {
				(async () => {
					const idbManager = await getIDBInstance();

					logger.info(
						`IDBManager instance successfully initialized.`,
						'app.js > initializeApp()'
					);

					// binds the IDBManager instance to the window object
					window.idbManager = idbManager;

					logger.info(
						'IDBManager instance successfully exposed to window.',
						'app.js > initializeApp()'
					);
				})();
			} catch (error) {
				if (logMode.error)
					logger.error(
						`Failed to expose IDBManager instance to window. Error: ${error}`
					);

				if (mode.showAlerts)
					alert('An error occurred. Check console for details.');
			}
		}
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to create initial IDBManager instance. Error: ${error}`
			);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	const selectedColorOption = consts.dom.elements.inputs.selectedColorOption;

	if (mode.debug) {
		if (logMode.debug)
			if (!mode.quiet && logMode.verbosity > 1) {
				logger.debug('Validating DOM elements');
			}

		dom.validate.elements();
	} else {
		if (!mode.quiet) {
			logger.info('Skipping DOM element validation');
		}
	}

	const selectedColor = selectedColorOption
		? parseInt(selectedColorOption.value, 10)
		: 0;

	if (!mode.quiet && mode.debug)
		logger.debug(`Selected color: ${selectedColor}`);

	try {
		dom.events.initializeEventListeners();

		if (!mode.quiet)
			logger.info('Event listeners have been successfully initialized');
	} catch (error) {
		if (logMode.error)
			logger.error(`Failed to initialize event listeners.\n${error}`);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	if (!mode.quiet && logMode.info)
		logger.info(
			'Application successfully initialized. Awaiting user input.'
		);
}
