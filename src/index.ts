// ColorGen - version 0.6.3-dev

// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.

// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE.

// File: index.js

window.onerror = function (message, source, lineno, colno, error) {
	import('./common/services/AppLogger.js').then(({ AppLogger }) => {
		const logger = AppLogger.getInstance();
		logger.log(
			`Unhandled error: ${message} at ${source}:${lineno}:${colno}`,
			'error',
			1,
			`[GLOBAL ERROR HANDLER]`
		);
		if (error && error.stack) {
			logger.log(
				`Stack trace:\n${error.stack}`,
				'error',
				3,
				`[GLOBAL ERROR HANDLER]`
			);
		}
	});

	return false; // prevent default logging
};

window.addEventListener('unhandledrejection', function (event) {
	import('./common/services/AppLogger.js').then(({ AppLogger }) => {
		const logger = AppLogger.getInstance();
		logger.log(
			`Unhandled promise rejection: ${event.reason}`,
			'error',
			1,
			`[GLOBAL ERROR HANDLER]`
		);
	});
});

import('./app/main.js');
