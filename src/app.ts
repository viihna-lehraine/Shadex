// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

// File: src/app.js

import { getIDBInstance } from './db/instance.js';
import { createLogger } from './logger/index.js';
import { domData } from './data/dom.js';
import { domFn } from './dom/index.js';
import { modeData as mode } from './data/mode.js';

const logMode = mode.logging;

const thisModule = 'app.js';

const logger = await createLogger();

if (mode.debug)
	logger.info(
		'Executing main application script',
		`${thisModule} > ANONYMOUS`
	);

if (document.readyState === 'loading') {
	if (mode.debug)
		logger.info(
			'DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...',
			`${thisModule} > ANONYMOUS`
		);

	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	if (mode.debug)
		logger.info(
			'DOM content already loaded. Initializing application immediately.',
			`${thisModule} > ANONYMOUS`
		);

	initializeApp();
}

async function initializeApp(): Promise<void> {
	const thisFunction = 'initializeApp()';

	logger.info(
		'DOM content loaded - Initializing application',
		`${thisModule} > ${thisFunction}`
	);

	try {
		if (mode.logging.verbosity > 1)
			logger.info(
				'Creating new IDBManager instance. Initializing database and its dependencies.',
				`${thisModule} > ${thisFunction}`
			);

		if (mode.expose.idbManager) {
			if (mode.debug && mode.logging.verbosity > 1)
				logger.info(
					'Exposing IDBManager instance to window.',
					`${thisModule} > ${thisFunction}`
				);

			try {
				(async () => {
					const idbManager = await getIDBInstance();

					logger.info(
						`IDBManager instance successfully initialized.`,
						`${thisModule} > ${thisFunction}`
					);

					// binds the IDBManager instance to the window object
					window.idbManager = idbManager;

					logger.info(
						'IDBManager instance successfully exposed to window.',
						`${thisModule} > ${thisFunction}`
					);
				})();
			} catch (error) {
				if (logMode.error)
					logger.warn(
						`Failed to expose IDBManager instance to window. Error: ${error}`,
						`${thisModule} > ${thisFunction}`
					);

				if (mode.showAlerts)
					alert('An error occurred. Check console for details.');
			}
		}
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to create initial IDBManager instance. Error: ${error}`,
				`${thisModule} > ${thisFunction}`
			);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	const selectedColorOption = domData.elements.inputs.selectedColorOption;

	if (mode.debug) {
		if (logMode.debug)
			if (!mode.quiet && logMode.verbosity > 1) {
				logger.debug(
					'Validating DOM elements',
					`${thisModule} > ${thisFunction}`
				);
			}

		domFn.validate.elements();
	} else {
		if (!mode.quiet) {
			logger.info(
				'Skipping DOM element validation',
				`${thisModule} > ${thisFunction}`
			);
		}
	}

	const selectedColor = selectedColorOption
		? parseInt(selectedColorOption.value, 10)
		: 0;

	if (!mode.quiet && mode.debug)
		logger.debug(
			`Selected color: ${selectedColor}`,
			`${thisModule} > ${thisFunction}`
		);

	try {
		domFn.events.initializeEventListeners();

		if (!mode.quiet)
			logger.info(
				'Event listeners have been successfully initialized',
				`${thisModule} > ${thisFunction}`
			);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to initialize event listeners.\n${error}`,
				`${thisModule} > ${thisFunction}`
			);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	if (!mode.quiet && logMode.info)
		logger.info(
			'Application successfully initialized. Awaiting user input.',
			`${thisModule} > ${thisFunction}`
		);
}
