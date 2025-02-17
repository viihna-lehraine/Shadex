// File: app/main.js

import { modeData as mode } from '../data/mode.js';

console.log('[main-1] Loading main.js...');

console.log(`[main-1] Importing initialize.js...`);
const initialize = await import('./initialize.js');
if (initialize) {
	console.log(`[main-1] Imported initialize.js .`);
}

const initializeApp = initialize.initializeApp ?? initialize.default;

console.log('[main-2] Defining initializeApp() function.');

console.log(`[main-3] Calling initializeApp() (define common)...`);
const common = await initializeApp();

console.log(`[main-4] Defining log as common.services.app.log...`);
const log = common.services.app.log;

if (mode.debug)
	log(
		'debug',
		'Executing main application script',
		'[main-5] > ANONYMOUS',
		2
	);

if (document.readyState === 'loading') {
	log(
		'debug',
		'DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...',
		'[main-5.1] > ANONYMOUS',
		2
	);

	document.addEventListener('DOMContentLoaded', () => main());
} else {
	log(
		'debug',
		'DOM content already loaded. Initializing application immediately.',
		'[main-5.1]> ANONYMOUS',
		2
	);

	main();
}

async function main() {
	try {
		log(
			'debug',
			'DOM content loaded - Application initialized.',
			'[main-6].main()]',
			1
		);
	} catch (error) {
		log(
			'error',
			`Application initialization failed: ${error instanceof Error ? error.message : error}`,
			'[main-error].main()]'
		);
		if (mode.showAlerts)
			alert(
				'An error occurred during startup. Check console for details'
			);
	}
}
