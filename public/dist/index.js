import { helpersFactory } from './common/factories/helpers.js';

// ColorGen - version 0.6.3-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE.
// File: index.js
const helpers = await helpersFactory();
window.onerror = function (message, source, lineno, colno, error) {
    import('./common/services/Logger.js').then(({ Logger }) => {
        const logger = Logger.getInstance(helpers);
        logger.log(`[GLOBAL ERROR HANDLER]: Unhandled error: ${message} at ${source}:${lineno}:${colno}`);
        if (error && error.stack) {
            logger.log(`[GLOBAL ERROR HANDLER]: Stack trace:\n${error.stack}`);
        }
    });
    return false; // prevent default logging
};
window.addEventListener('unhandledrejection', function (event) {
    import('./common/services/Logger.js').then(({ Logger }) => {
        const logger = Logger.getInstance(helpers);
        logger.log(`[GLOBAL ERROR HANDLER]: Unhandled promise rejection: ${event.reason}`);
    });
});
const { startApp } = await import('./app/main.js');
startApp(helpers);
//# sourceMappingURL=index.js.map
