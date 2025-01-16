// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

// File: src/app.js

import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { log } from './classes/logger/index.js';
import { IDBManager } from './classes/idb/index.js';

const consts = data.consts;
const mode = data.mode;
const loggingMode = mode.logging;

if (mode.debug) log.info('Executing main application script');

if (document.readyState === 'loading') {
	if (mode.debug)
		log.info(
			'DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...'
		);

	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	if (mode.debug)
		log.info(
			'DOM content already loaded. Initializing application immediately.'
		);

	initializeApp();
}

async function initializeApp(): Promise<void> {
	log.info('DOM content loaded - Initializing application');

	try {
		if (mode.logging.verbosity > 1)
			log.info(
				'Creating new IDBManager instance. Initializing database and its dependencies.'
			);

		if (mode.expose.idbManager) {
			if (mode.debug) log.info('Exposing IDBManager instance to window.');

			try {
				(async () => {
					const idbManagerInstance =
						await IDBManager.createInstance(data);

					// binds the IDBManager instance to the window object
					window.idbManager = idbManagerInstance;

					log.info(
						'IDBManager instance successfully exposed to window.'
					);
				})();
			} catch (error) {
				if (loggingMode.errors)
					log.error(
						`Failed to expose IDBManager instance to window. Error: ${error}`
					);

				if (mode.showAlerts)
					alert('An error occurred. Check console for details.');
			}
		}
	} catch (error) {
		if (loggingMode.errors)
			log.error(
				`Failed to create initial IDBManager instance. Error: ${error}`
			);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	if (!mode.quiet) log.info('Initializing UI...');

	const domElements = dom.defineUIElements();

	if (!domElements) {
		if (loggingMode.errors)
			log.error(
				'Failed to properly initialize the UI. Some DOM elements could not be found.'
			);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	try {
		await dom.initializeUI();

		if (!mode.quiet) log.info('UI successfully initialized');
	} catch (error) {
		if (loggingMode.errors) log.error(`Failed to initialize UI\n${error}`);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	const selectedColorOption = consts.dom.elements.selectedColorOption;

	if (mode.debug) {
		dom.validate.elements();
	} else {
		if (!mode.quiet) {
			log.info('Skipping DOM element validation');
		}
	}

	const selectedColor = selectedColorOption
		? parseInt(selectedColorOption.value, 10)
		: 0;

	if (!mode.quiet) log.info(`Selected color: ${selectedColor}`);

	try {
		dom.events.initializeEventListeners();

		if (!mode.quiet)
			log.info('Event listeners have been successfully initialized');
	} catch (error) {
		if (loggingMode.errors)
			log.error(`Failed to initialize event listeners.\n${error}`);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	if (!mode.quiet)
		log.info('Application successfully initialized. Awaiting user input.');
}
