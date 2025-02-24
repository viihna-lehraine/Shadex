// ColorGen - version 0.6.3-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// License: GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE.

// File: index.ts

import { EventManager } from './events/EventManager.js';
import { config } from './config/index.js';

const mode = config.mode;

async function initializeApp() {
	// 1. Bootstrap minimal dependencies
	console.log('[STARTUP]: Importing bootstrap module...');
	const { bootstrap } = await import('./app/bootstrap.js');

	console.log('[STARTUP]: Executing bootstrap process.');
	const { helpers, services } = await bootstrap();

	const { errors, log } = services;
	log('Boostrap process complete.', { caller: 'STARTUP' });

	log('Registering global error handlers...', { caller: 'STARTUP' });
	window.onerror = function (message, source, lineno, colno, error) {
		log(`Unhandled error: ${message} at ${source}:${lineno}:${colno}`, {
			caller: 'GLOBAL ERROR HANDLER'
		});

		if (error && error.stack) {
			log(`Stack trace:\n${error.stack}`, {
				caller: 'GLOBAL ERROR HANDLER'
			});
		}

		return false;
	};
	window.addEventListener('unhandledrejection', function (event) {
		log(`Unhandled promise rejection: ${event.reason}`, {
			caller: 'GLOBAL ERROR HANDLER'
		});
	});

	const { registerDependencies } = await import('./app/registry.js');
	log('Registering dependencies.', { caller: 'STARTUP' });
	const deps = await registerDependencies(helpers, services);
	log('Dependencies registered.', { caller: 'STARTUP' });

	console.log(`mode.exposeClasses ${mode.exposeClasses}`);
	if (mode.exposeClasses) {
		log(`Exposing classes to console.`, { caller: 'STARTUP_OPTION' });
		const { exposeClasses } = await import('./app/init.js');
		await exposeClasses(
			deps.eventManager,
			deps.events.palette,
			deps.paletteManager,
			deps.common.services,
			deps.stateManager,
			deps.events.ui
		);
	}

	await errors.handleAsync(async () => {
		if (mode.debugLevel >= 3) {
			setTimeout(() => {
				EventManager.listAll();
			}, 100);
		}
	}, `[initializeApp]: Application startup failed.`);
}

if (document.readyState === 'loading') {
	console.log(
		'[anon@index.ts]: DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...'
	);

	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	console.log(
		'[anon@index.ts]: DOM content already loaded. Initializing application immediately.'
	);

	initializeApp();
}
