// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: src/app.js
import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { logger } from './logger/index.js';
import { IDBManager } from './db/index.js';
const consts = data.consts;
const mode = data.mode;
const logMode = mode.logging;
if (mode.debug)
    logger.info('Executing main application script');
if (document.readyState === 'loading') {
    if (mode.debug)
        logger.info('DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...');
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    if (mode.debug)
        logger.info('DOM content already loaded. Initializing application immediately.');
    initializeApp();
}
async function initializeApp() {
    logger.info('DOM content loaded - Initializing application');
    try {
        if (mode.logging.verbosity > 1)
            logger.info('Creating new IDBManager instance. Initializing database and its dependencies.');
        if (mode.expose.idbManager) {
            if (mode.debug)
                logger.info('Exposing IDBManager instance to window.');
            try {
                (async () => {
                    const idbManagerInstance = await IDBManager.createInstance(data);
                    // binds the IDBManager instance to the window object
                    window.idbManager = idbManagerInstance;
                    logger.info('IDBManager instance successfully exposed to window.');
                })();
            }
            catch (error) {
                if (logMode.errors)
                    logger.error(`Failed to expose IDBManager instance to window. Error: ${error}`);
                if (mode.showAlerts)
                    alert('An error occurred. Check console for details.');
            }
        }
    }
    catch (error) {
        if (logMode.errors)
            logger.error(`Failed to create initial IDBManager instance. Error: ${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    const selectedColorOption = consts.dom.elements.selectedColorOption;
    if (mode.debug) {
        if (logMode.debug)
            if (!mode.quiet && logMode.verbosity > 1) {
                logger.debug('Validating DOM elements');
            }
        dom.validate.elements();
    }
    else {
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
    }
    catch (error) {
        if (logMode.errors)
            logger.error(`Failed to initialize event listeners.\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet && logMode.info)
        logger.info('Application successfully initialized. Awaiting user input.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLG1CQUFtQjtBQUVuQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLElBQUksSUFBSSxDQUFDLEtBQUs7SUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFFakUsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO0lBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUs7UUFDYixNQUFNLENBQUMsSUFBSSxDQUNWLG9GQUFvRixDQUNwRixDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQzlELENBQUM7S0FBTSxDQUFDO0lBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSztRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQ1YsbUVBQW1FLENBQ25FLENBQUM7SUFFSCxhQUFhLEVBQUUsQ0FBQztBQUNqQixDQUFDO0FBRUQsS0FBSyxVQUFVLGFBQWE7SUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBRTdELElBQUks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SSxPQUFPLENBQUMsSUFBSTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUNWLDREQUE0RCxDQUM1RCxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbG9yR2VuIC0gdmVyc2lvbiAwLjYuMC1kZXZcblxuLy8gQXV0aG9yOiBWaWlobmEgTGVyYWluZSAodmlpaG5hQFZpaWhuYVRlY2guY29tIC8gdmlpaG5hLjc4IChTaWduYWwpIC8gVmlpaG5hLUxlaHJhaW5lIChHaXRodWIpKVxuLy8gTGljZW5zZWQgdW5kZXIgR05VIEdQTHYzIChodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAuaHRtbClcblxuLy8gWW91IG1heSB1c2UgdGhpcyBjb2RlIGZvciBhbnkgcHVycG9zZSBFWENFUFQgZm9yIHRoZSBjcmVhdGlvbiBvZiBwcm9wcmlldGFyeSBkZXJpdmF0aXZlcy4gSSBlbmNvdXJhZ2UgeW91IHRvIGltcHJvdmUgb24gbXkgY29kZSBvciB0byBpbmNsdWRlIGl0IGluIG90aGVyIHByb2plY3RzIGlmIHlvdSBmaW5kIGl0IGhlbHBmdWwuIFBsZWFzZSBjcmVkaXQgbWUgYXMgdGhlIG9yaWdpbmFsIGF1dGhvci5cblxuLy8gVGhpcyBhcHBsaWNhdGlvbiBjb21lcyB3aXRoIEFCU09MVVRFTFkgTk8gV0FSUkFOVFkgT1IgR1VBUkFOVEVFIE9GIEFOWSBLSU5ELlxuXG4vLyBGaWxlOiBzcmMvYXBwLmpzXG5cbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgZG9tIH0gZnJvbSAnLi9kb20vaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgSURCTWFuYWdlciB9IGZyb20gJy4vZGIvaW5kZXguanMnO1xuXG5jb25zdCBjb25zdHMgPSBkYXRhLmNvbnN0cztcbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuXG5pZiAobW9kZS5kZWJ1ZykgbG9nZ2VyLmluZm8oJ0V4ZWN1dGluZyBtYWluIGFwcGxpY2F0aW9uIHNjcmlwdCcpO1xuXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG5cdGlmIChtb2RlLmRlYnVnKVxuXHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0J0RPTSBjb250ZW50IG5vdCB5ZXQgbG9hZGVkLiBBZGRpbmcgRE9NQ29udGVudExvYWRlZCBldmVudCBsaXN0ZW5lciBhbmQgYXdhaXRpbmcuLi4nXG5cdFx0KTtcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdGlhbGl6ZUFwcCk7XG59IGVsc2Uge1xuXHRpZiAobW9kZS5kZWJ1Zylcblx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdCdET00gY29udGVudCBhbHJlYWR5IGxvYWRlZC4gSW5pdGlhbGl6aW5nIGFwcGxpY2F0aW9uIGltbWVkaWF0ZWx5Lidcblx0XHQpO1xuXG5cdGluaXRpYWxpemVBcHAoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwcCgpOiBQcm9taXNlPHZvaWQ+IHtcblx0bG9nZ2VyLmluZm8oJ0RPTSBjb250ZW50IGxvYWRlZCAtIEluaXRpYWxpemluZyBhcHBsaWNhdGlvbicpO1xuXG5cdHRyeSB7XG5cdFx0aWYgKG1vZGUubG9nZ2luZy52ZXJib3NpdHkgPiAxKVxuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdCdDcmVhdGluZyBuZXcgSURCTWFuYWdlciBpbnN0YW5jZS4gSW5pdGlhbGl6aW5nIGRhdGFiYXNlIGFuZCBpdHMgZGVwZW5kZW5jaWVzLidcblx0XHRcdCk7XG5cblx0XHRpZiAobW9kZS5leHBvc2UuaWRiTWFuYWdlcikge1xuXHRcdFx0aWYgKG1vZGUuZGVidWcpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKCdFeHBvc2luZyBJREJNYW5hZ2VyIGluc3RhbmNlIHRvIHdpbmRvdy4nKTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBpZGJNYW5hZ2VySW5zdGFuY2UgPVxuXHRcdFx0XHRcdFx0YXdhaXQgSURCTWFuYWdlci5jcmVhdGVJbnN0YW5jZShkYXRhKTtcblxuXHRcdFx0XHRcdC8vIGJpbmRzIHRoZSBJREJNYW5hZ2VyIGluc3RhbmNlIHRvIHRoZSB3aW5kb3cgb2JqZWN0XG5cdFx0XHRcdFx0d2luZG93LmlkYk1hbmFnZXIgPSBpZGJNYW5hZ2VySW5zdGFuY2U7XG5cblx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdCdJREJNYW5hZ2VyIGluc3RhbmNlIHN1Y2Nlc3NmdWxseSBleHBvc2VkIHRvIHdpbmRvdy4nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSkoKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgRmFpbGVkIHRvIGV4cG9zZSBJREJNYW5hZ2VyIGluc3RhbmNlIHRvIHdpbmRvdy4gRXJyb3I6ICR7ZXJyb3J9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBjcmVhdGUgaW5pdGlhbCBJREJNYW5hZ2VyIGluc3RhbmNlLiBFcnJvcjogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXG5cdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gQ2hlY2sgY29uc29sZSBmb3IgZGV0YWlscy4nKTtcblx0fVxuXG5cdGNvbnN0IHNlbGVjdGVkQ29sb3JPcHRpb24gPSBjb25zdHMuZG9tLmVsZW1lbnRzLnNlbGVjdGVkQ29sb3JPcHRpb247XG5cblx0aWYgKG1vZGUuZGVidWcpIHtcblx0XHRpZiAobG9nTW9kZS5kZWJ1Zylcblx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0bG9nZ2VyLmRlYnVnKCdWYWxpZGF0aW5nIERPTSBlbGVtZW50cycpO1xuXHRcdFx0fVxuXG5cdFx0ZG9tLnZhbGlkYXRlLmVsZW1lbnRzKCk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKCFtb2RlLnF1aWV0KSB7XG5cdFx0XHRsb2dnZXIuaW5mbygnU2tpcHBpbmcgRE9NIGVsZW1lbnQgdmFsaWRhdGlvbicpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSBzZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0PyBwYXJzZUludChzZWxlY3RlZENvbG9yT3B0aW9uLnZhbHVlLCAxMClcblx0XHQ6IDA7XG5cblx0aWYgKCFtb2RlLnF1aWV0ICYmIG1vZGUuZGVidWcpXG5cdFx0bG9nZ2VyLmRlYnVnKGBTZWxlY3RlZCBjb2xvcjogJHtzZWxlY3RlZENvbG9yfWApO1xuXG5cdHRyeSB7XG5cdFx0ZG9tLmV2ZW50cy5pbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGxvZ2dlci5pbmZvKCdFdmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCcpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGluaXRpYWxpemUgZXZlbnQgbGlzdGVuZXJzLlxcbiR7ZXJyb3J9YCk7XG5cblx0XHRpZiAobW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBDaGVjayBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuXHR9XG5cblx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbylcblx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdCdBcHBsaWNhdGlvbiBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQuIEF3YWl0aW5nIHVzZXIgaW5wdXQuJ1xuXHRcdCk7XG59XG4iXX0=