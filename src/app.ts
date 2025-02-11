// ColorGen - version 0.6.0-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE.

// File: app.js

import { defaultData as defaults } from './data/defaults.js';
import { domData } from './data/dom.js';
import { domUtils } from './utils/dom.js';
import { modeData as mode } from './data/mode.js';

const appServices = await import('./services/app.js').then(
	module => module.appServices
);
const log = appServices.log;
const logMode = mode.logging;

if (mode.debug)
	log('debug', 'Executing main application script', 'app.js > ANONYMOUS', 2);

if (document.readyState === 'loading') {
	log(
		'debug',
		'DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...',
		'app.js > ANONYMOUS',
		2
	);

	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	log(
		'debug',
		'DOM content already loaded. Initializing application immediately.',
		'app.js > ANONYMOUS',
		2
	);

	initializeApp();
}

async function initializeApp(): Promise<void> {
	log(
		'debug',
		'DOM content loaded - Initializing application',
		'app.js > initializeApp()',
		1
	);

	log(
		'debug',
		'Validating static DOM elements',
		'app.js > initializeApp()',
		2
	);

	domUtils.validateStaticElements(domData, log);

	const selectedSwatch = domData.elements.static.selects.swatch;

	const selectedColor = selectedSwatch
		? parseInt(selectedSwatch.value, 10)
		: 0;

	const defaultPaletteOptions = defaults.paletteOptions;

	if (logMode.verbosity > 1) {
		log(
			'debug',
			`Generating initial color palette.`,
			'app.js > initializeApp()',
			2
		);
	}

	await uiFn.startPaletteGeneration(defaultPaletteOptions);

	const uiManager = new UIManager(eventListenerFn);
	try {
		eventListenerFn.initializeEventListeners(uiManager);
		if (logMode.verbosity > 2)
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

	if (logMode.verbosity > 1)
		logger.info(
			'Application successfully initialized. Awaiting user input.',
			`${thisModule} > ${thisFunction}`
		);
}
