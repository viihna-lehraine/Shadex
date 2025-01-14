// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.

// File: src/app.js

import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { IDBManager } from './idb/index.js';
import { logger } from './logger/index.js';

const consts = data.consts;
const mode = data.mode;

if (mode.debug) console.log('Executing main application script');

if (document.readyState === 'loading') {
	if (mode.debug)
		console.log(
			'DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...'
		);

	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	if (mode.debug)
		console.log(
			'DOM content already loaded. Initializing application immediately.'
		);
	initializeApp();
}

async function initializeApp(): Promise<void> {
	console.log('DOM content loaded - Initializing application');

	try {
		if (mode.verbose)
			console.log(
				'Creating new IDBManager instance. Initializing database and its dependencies.'
			);

		if (mode.exposeIDB) {
			if (mode.debug)
				console.log('Exposing IDBManager instance to window.');

			try {
				(async () => {
					const idbManagerInstance =
						await IDBManager.createInstance();

					// binds the IDBManager instance to the window object
					window.idbManager = idbManagerInstance;

					console.log(
						'IDBManager instance successfully exposed to window.'
					);
				})();
			} catch (error) {
				if (mode.errorLogs)
					console.error(
						`Failed to expose IDBManager instance to window. Error: ${error}`
					);

				if (mode.showAlerts)
					alert('An error occurred. Check console for details.');
			}
		}
	} catch (error) {
		if (mode.errorLogs)
			console.error(
				`Failed to create initial IDBManager instance. Error: ${error}`
			);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	if (!mode.quiet) console.log('Initializing UI...');

	const domElements = dom.defineUIElements();

	if (!domElements) {
		if (mode.errorLogs)
			console.error(
				'Failed to properly initialize the UI. Some DOM elements could not be found.'
			);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	try {
		await dom.initializeUI();

		if (!mode.quiet) console.log('UI successfully initialized');
	} catch (error) {
		if (mode.errorLogs) console.error(`Failed to initialize UI\n${error}`);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
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
		dom.events.initializeEventListeners();

		if (!mode.quiet)
			console.log('Event listeners have been successfully initialized');
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Failed to initialize event listeners.\n${error}`);

		if (mode.showAlerts)
			alert('An error occurred. Check console for details.');
	}

	if (!mode.quiet)
		console.log(
			'Application successfully initialized. Awaiting user input.'
		);
}
