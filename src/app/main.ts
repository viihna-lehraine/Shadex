// File: app/main.js

import { EventManager } from '../events/EventManager.js';
import { initialize } from './init.js';
import { data } from '../data/index.js';

const mode = data.mode;

console.log('[main-1] Loading main.js...');

console.log(`[main-3] Calling initialize()`);
const init = await initialize();

console.log('[main-4] Initialization complete.');
const log = init.common.services?.log;
console.log(`[main-5] Executing main loop...`);

if (log) {
	if (mode.debug)
		log('debug', 'Executing main application script', '[main-5]', 2);

	if (document.readyState === 'loading') {
		log(
			'debug',
			'DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...',
			'[main-5.1]',
			2
		);

		document.addEventListener('DOMContentLoaded', () => main());
	} else {
		log(
			'debug',
			'DOM content already loaded. Initializing application immediately.',
			'[main-5.1]',
			2
		);

		main();
	}
} else {
	console.error('[main-5E] > log function is undefined.');
}

const errorHandler = init.common.services.errors;

async function main() {
	await errorHandler.handleAsync(
		async () => {
			log(
				'debug',
				'DOM content loaded - Application initialized.',
				'[main-6]',
				1
			);

			if (mode.debug) {
				setTimeout(() => {
					EventManager.listAll();
				}, 100);
			}
		},
		'Application initialization failed',
		'[main-ERROR]'
	);

	if (mode.showAlerts) {
		alert('An error occurred during startup. Check console for details.');
	}
}
