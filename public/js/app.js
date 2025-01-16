// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: src/app.js
import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { log } from './logger/index.js';
import { IDBManager } from './idb/index.js';
const consts = data.consts;
const mode = data.mode;
if (mode.debug)
    log.info('Executing main application script');
if (document.readyState === 'loading') {
    if (mode.debug)
        log.info('DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...');
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    if (mode.debug)
        log.info('DOM content already loaded. Initializing application immediately.');
    initializeApp();
}
async function initializeApp() {
    console.log('DOM content loaded - Initializing application');
    try {
        if (mode.verbose)
            log.info('Creating new IDBManager instance. Initializing database and its dependencies.');
        if (mode.exposeIDB) {
            if (mode.debug)
                log.info('Exposing IDBManager instance to window.');
            try {
                (async () => {
                    const idbManagerInstance = await IDBManager.createInstance();
                    // binds the IDBManager instance to the window object
                    window.idbManager = idbManagerInstance;
                    log.info('IDBManager instance successfully exposed to window.');
                })();
            }
            catch (error) {
                if (mode.errorLogs)
                    log.error(`Failed to expose IDBManager instance to window. Error: ${error}`);
                if (mode.showAlerts)
                    alert('An error occurred. Check console for details.');
            }
        }
    }
    catch (error) {
        if (mode.errorLogs)
            log.error(`Failed to create initial IDBManager instance. Error: ${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet)
        console.log('Initializing UI...');
    const domElements = dom.defineUIElements();
    if (!domElements) {
        if (mode.errorLogs)
            log.error('Failed to properly initialize the UI. Some DOM elements could not be found.');
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    try {
        await dom.initializeUI();
        if (!mode.quiet)
            log.info('UI successfully initialized');
    }
    catch (error) {
        if (mode.errorLogs)
            log.error(`Failed to initialize UI\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    const selectedColorOption = consts.dom.elements.selectedColorOption;
    if (mode.debug) {
        dom.validate.elements();
    }
    else {
        if (!mode.quiet) {
            log.info('Skipping DOM element validation');
        }
    }
    const selectedColor = selectedColorOption
        ? parseInt(selectedColorOption.value, 10)
        : 0;
    if (!mode.quiet)
        log.info(`Selected color: ${selectedColor}`);
    try {
        dom.events.initializeEventListeners();
        if (!mode.quiet)
            log.info('Event listeners have been successfully initialized');
    }
    catch (error) {
        if (mode.errorLogs)
            log.error(`Failed to initialize event listeners.\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet)
        log.info('Application successfully initialized. Awaiting user input.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLG1CQUFtQjtBQUVuQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRXZCLElBQUksSUFBSSxDQUFDLEtBQUs7SUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFFOUQsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO0lBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUs7UUFDYixHQUFHLENBQUMsSUFBSSxDQUNQLG9GQUFvRixDQUNwRixDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQzlELENBQUM7S0FBTSxDQUFDO0lBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSztRQUNiLEdBQUcsQ0FBQyxJQUFJLENBQ1AsbUVBQW1FLENBQ25FLENBQUM7SUFFSCxhQUFhLEVBQUUsQ0FBQztBQUNqQixDQUFDO0FBRUQsS0FBSyxVQUFVLGFBQWE7SUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNKLElBQUksSUFBSSxDQUFDLE9BQU87WUFDZixHQUFH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RCxJQUFJLENBQUM7UUFDSixHQUFHLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFFdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsR0FBRyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU5RCxJQUFJLElBQUksQ0FBQyxVQUFVO1lBQ2xCLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUM7QUFDekUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbG9yR2VuIC0gdmVyc2lvbiAwLjYuMC1kZXZcblxuLy8gQXV0aG9yOiBWaWlobmEgTGVyYWluZSAodmlpaG5hQFZpaWhuYVRlY2guY29tIC8gdmlpaG5hLjc4IChTaWduYWwpIC8gVmlpaG5hLUxlaHJhaW5lIChHaXRodWIpKVxuLy8gTGljZW5zZWQgdW5kZXIgR05VIEdQTHYzIChodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAuaHRtbClcblxuLy8gWW91IG1heSB1c2UgdGhpcyBjb2RlIGZvciBhbnkgcHVycG9zZSBFWENFUFQgZm9yIHRoZSBjcmVhdGlvbiBvZiBwcm9wcmlldGFyeSBkZXJpdmF0aXZlcy4gSSBlbmNvdXJhZ2UgeW91IHRvIGltcHJvdmUgb24gbXkgY29kZSBvciB0byBpbmNsdWRlIGl0IGluIG90aGVyIHByb2plY3RzIGlmIHlvdSBmaW5kIGl0IGhlbHBmdWwuIFBsZWFzZSBjcmVkaXQgbWUgYXMgdGhlIG9yaWdpbmFsIGF1dGhvci5cblxuLy8gVGhpcyBhcHBsaWNhdGlvbiBjb21lcyB3aXRoIEFCU09MVVRFTFkgTk8gV0FSUkFOVFkgT1IgR1VBUkFOVEVFIE9GIEFOWSBLSU5ELlxuXG4vLyBGaWxlOiBzcmMvYXBwLmpzXG5cbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgZG9tIH0gZnJvbSAnLi9kb20vaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgSURCTWFuYWdlciB9IGZyb20gJy4vaWRiL2luZGV4LmpzJztcblxuY29uc3QgY29uc3RzID0gZGF0YS5jb25zdHM7XG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuXG5pZiAobW9kZS5kZWJ1ZykgbG9nLmluZm8oJ0V4ZWN1dGluZyBtYWluIGFwcGxpY2F0aW9uIHNjcmlwdCcpO1xuXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG5cdGlmIChtb2RlLmRlYnVnKVxuXHRcdGxvZy5pbmZvKFxuXHRcdFx0J0RPTSBjb250ZW50IG5vdCB5ZXQgbG9hZGVkLiBBZGRpbmcgRE9NQ29udGVudExvYWRlZCBldmVudCBsaXN0ZW5lciBhbmQgYXdhaXRpbmcuLi4nXG5cdFx0KTtcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdGlhbGl6ZUFwcCk7XG59IGVsc2Uge1xuXHRpZiAobW9kZS5kZWJ1Zylcblx0XHRsb2cuaW5mbyhcblx0XHRcdCdET00gY29udGVudCBhbHJlYWR5IGxvYWRlZC4gSW5pdGlhbGl6aW5nIGFwcGxpY2F0aW9uIGltbWVkaWF0ZWx5Lidcblx0XHQpO1xuXG5cdGluaXRpYWxpemVBcHAoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwcCgpOiBQcm9taXNlPHZvaWQ+IHtcblx0Y29uc29sZS5sb2coJ0RPTSBjb250ZW50IGxvYWRlZCAtIEluaXRpYWxpemluZyBhcHBsaWNhdGlvbicpO1xuXG5cdHRyeSB7XG5cdFx0aWYgKG1vZGUudmVyYm9zZSlcblx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHQnQ3JlYXRpbmcgbmV3IElEQk1hbmFnZXIgaW5zdGFuY2UuIEluaXRpYWxpemluZyBkYXRhYmFzZSBhbmQgaXRzIGRlcGVuZGVuY2llcy4nXG5cdFx0XHQpO1xuXG5cdFx0aWYgKG1vZGUuZXhwb3NlSURCKSB7XG5cdFx0XHRpZiAobW9kZS5kZWJ1ZykgbG9nLmluZm8oJ0V4cG9zaW5nIElEQk1hbmFnZXIgaW5zdGFuY2UgdG8gd2luZG93LicpO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGlkYk1hbmFnZXJJbnN0YW5jZSA9XG5cdFx0XHRcdFx0XHRhd2FpdCBJREJNYW5hZ2VyLmNyZWF0ZUluc3RhbmNlKCk7XG5cblx0XHRcdFx0XHQvLyBiaW5kcyB0aGUgSURCTWFuYWdlciBpbnN0YW5jZSB0byB0aGUgd2luZG93IG9iamVjdFxuXHRcdFx0XHRcdHdpbmRvdy5pZGJNYW5hZ2VyID0gaWRiTWFuYWdlckluc3RhbmNlO1xuXG5cdFx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0XHQnSURCTWFuYWdlciBpbnN0YW5jZSBzdWNjZXNzZnVsbHkgZXhwb3NlZCB0byB3aW5kb3cuJ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pKCk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0bG9nLmVycm9yKFxuXHRcdFx0XHRcdFx0YEZhaWxlZCB0byBleHBvc2UgSURCTWFuYWdlciBpbnN0YW5jZSB0byB3aW5kb3cuIEVycm9yOiAke2Vycm9yfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRcdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBDaGVjayBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gY3JlYXRlIGluaXRpYWwgSURCTWFuYWdlciBpbnN0YW5jZS4gRXJyb3I6ICR7ZXJyb3J9YFxuXHRcdFx0KTtcblxuXHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdH1cblxuXHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcgVUkuLi4nKTtcblxuXHRjb25zdCBkb21FbGVtZW50cyA9IGRvbS5kZWZpbmVVSUVsZW1lbnRzKCk7XG5cblx0aWYgKCFkb21FbGVtZW50cykge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0J0ZhaWxlZCB0byBwcm9wZXJseSBpbml0aWFsaXplIHRoZSBVSS4gU29tZSBET00gZWxlbWVudHMgY291bGQgbm90IGJlIGZvdW5kLidcblx0XHRcdCk7XG5cblx0XHRpZiAobW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBDaGVjayBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRhd2FpdCBkb20uaW5pdGlhbGl6ZVVJKCk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpIGxvZy5pbmZvKCdVSSBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQnKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGxvZy5lcnJvcihgRmFpbGVkIHRvIGluaXRpYWxpemUgVUlcXG4ke2Vycm9yfWApO1xuXG5cdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gQ2hlY2sgY29uc29sZSBmb3IgZGV0YWlscy4nKTtcblx0fVxuXG5cdGNvbnN0IHNlbGVjdGVkQ29sb3JPcHRpb24gPSBjb25zdHMuZG9tLmVsZW1lbnRzLnNlbGVjdGVkQ29sb3JPcHRpb247XG5cblx0aWYgKG1vZGUuZGVidWcpIHtcblx0XHRkb20udmFsaWRhdGUuZWxlbWVudHMoKTtcblx0fSBlbHNlIHtcblx0XHRpZiAoIW1vZGUucXVpZXQpIHtcblx0XHRcdGxvZy5pbmZvKCdTa2lwcGluZyBET00gZWxlbWVudCB2YWxpZGF0aW9uJyk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdDogMDtcblxuXHRpZiAoIW1vZGUucXVpZXQpIGxvZy5pbmZvKGBTZWxlY3RlZCBjb2xvcjogJHtzZWxlY3RlZENvbG9yfWApO1xuXG5cdHRyeSB7XG5cdFx0ZG9tLmV2ZW50cy5pbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGxvZy5pbmZvKCdFdmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCcpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGxvZy5lcnJvcihgRmFpbGVkIHRvIGluaXRpYWxpemUgZXZlbnQgbGlzdGVuZXJzLlxcbiR7ZXJyb3J9YCk7XG5cblx0XHRpZiAobW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBDaGVjayBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuXHR9XG5cblx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdGxvZy5pbmZvKCdBcHBsaWNhdGlvbiBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQuIEF3YWl0aW5nIHVzZXIgaW5wdXQuJyk7XG59XG4iXX0=