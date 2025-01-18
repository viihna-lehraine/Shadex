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
const logMode = mode.logging;
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
    log.info('DOM content loaded - Initializing application');
    try {
        if (mode.logging.verbosity > 1)
            log.info('Creating new IDBManager instance. Initializing database and its dependencies.');
        if (mode.expose.idbManager) {
            if (mode.debug)
                log.info('Exposing IDBManager instance to window.');
            try {
                (async () => {
                    const idbManagerInstance = await IDBManager.createInstance(data);
                    // binds the IDBManager instance to the window object
                    window.idbManager = idbManagerInstance;
                    log.info('IDBManager instance successfully exposed to window.');
                })();
            }
            catch (error) {
                if (logMode.errors)
                    log.error(`Failed to expose IDBManager instance to window. Error: ${error}`);
                if (mode.showAlerts)
                    alert('An error occurred. Check console for details.');
            }
        }
    }
    catch (error) {
        if (logMode.errors)
            log.error(`Failed to create initial IDBManager instance. Error: ${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    const selectedColorOption = consts.dom.elements.selectedColorOption;
    if (mode.debug) {
        if (logMode.debug)
            if (!mode.quiet && logMode.verbosity > 1) {
                log.debug('Validating DOM elements');
            }
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
    if (!mode.quiet && mode.debug)
        log.debug(`Selected color: ${selectedColor}`);
    try {
        dom.events.initializeEventListeners();
        if (!mode.quiet)
            log.info('Event listeners have been successfully initialized');
    }
    catch (error) {
        if (logMode.errors)
            log.error(`Failed to initialize event listeners.\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet && logMode.info)
        log.info('Application successfully initialized. Awaiting user input.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLG1CQUFtQjtBQUVuQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFcEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFN0IsSUFBSSxJQUFJLENBQUMsS0FBSztJQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUU5RCxJQUFJLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7SUFDdkMsSUFBSSxJQUFJLENBQUMsS0FBSztRQUNiLEdBQUcsQ0FBQyxJQUFJLENBQ1Asb0ZBQW9GLENBQ3BGLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDOUQsQ0FBQztLQUFNLENBQUM7SUFDUCxJQUFJLElBQUksQ0FBQyxLQUFLO1FBQ2IsR0FBRyxDQUFDLElBQUksQ0FDUCxtRUFBbUUsQ0FDbkUsQ0FBQztJQUVILGFBQWEsRUFBRSxDQUFDO0FBQ2pCLENBQUM7QUFFRCxLQUFLLFVBQVUsYUFBYTtJQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFFMUQsSUFB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QUFJLE9BQU8sQ0FBQyxJQUFJO1FBQzlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsNERBQTRELENBQUMsQ0FBQztBQUN6RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29sb3JHZW4gLSB2ZXJzaW9uIDAuNi4wLWRldlxuXG4vLyBBdXRob3I6IFZpaWhuYSBMZXJhaW5lICh2aWlobmFAVmlpaG5hVGVjaC5jb20gLyB2aWlobmEuNzggKFNpZ25hbCkgLyBWaWlobmEtTGVocmFpbmUgKEdpdGh1YikpXG4vLyBMaWNlbnNlZCB1bmRlciBHTlUgR1BMdjMgKGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTMuMC5odG1sKVxuXG4vLyBZb3UgbWF5IHVzZSB0aGlzIGNvZGUgZm9yIGFueSBwdXJwb3NlIEVYQ0VQVCBmb3IgdGhlIGNyZWF0aW9uIG9mIHByb3ByaWV0YXJ5IGRlcml2YXRpdmVzLiBJIGVuY291cmFnZSB5b3UgdG8gaW1wcm92ZSBvbiBteSBjb2RlIG9yIHRvIGluY2x1ZGUgaXQgaW4gb3RoZXIgcHJvamVjdHMgaWYgeW91IGZpbmQgaXQgaGVscGZ1bC4gUGxlYXNlIGNyZWRpdCBtZSBhcyB0aGUgb3JpZ2luYWwgYXV0aG9yLlxuXG4vLyBUaGlzIGFwcGxpY2F0aW9uIGNvbWVzIHdpdGggQUJTT0xVVEVMWSBOTyBXQVJSQU5UWSBPUiBHVUFSQU5URUUgT0YgQU5ZIEtJTkQuXG5cbi8vIEZpbGU6IHNyYy9hcHAuanNcblxuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkb20gfSBmcm9tICcuL2RvbS9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuL2NsYXNzZXMvbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IElEQk1hbmFnZXIgfSBmcm9tICcuL2NsYXNzZXMvaWRiL2luZGV4LmpzJztcblxuY29uc3QgY29uc3RzID0gZGF0YS5jb25zdHM7XG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuaWYgKG1vZGUuZGVidWcpIGxvZy5pbmZvKCdFeGVjdXRpbmcgbWFpbiBhcHBsaWNhdGlvbiBzY3JpcHQnKTtcblxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuXHRpZiAobW9kZS5kZWJ1Zylcblx0XHRsb2cuaW5mbyhcblx0XHRcdCdET00gY29udGVudCBub3QgeWV0IGxvYWRlZC4gQWRkaW5nIERPTUNvbnRlbnRMb2FkZWQgZXZlbnQgbGlzdGVuZXIgYW5kIGF3YWl0aW5nLi4uJ1xuXHRcdCk7XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRpYWxpemVBcHApO1xufSBlbHNlIHtcblx0aWYgKG1vZGUuZGVidWcpXG5cdFx0bG9nLmluZm8oXG5cdFx0XHQnRE9NIGNvbnRlbnQgYWxyZWFkeSBsb2FkZWQuIEluaXRpYWxpemluZyBhcHBsaWNhdGlvbiBpbW1lZGlhdGVseS4nXG5cdFx0KTtcblxuXHRpbml0aWFsaXplQXBwKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemVBcHAoKTogUHJvbWlzZTx2b2lkPiB7XG5cdGxvZy5pbmZvKCdET00gY29udGVudCBsb2FkZWQgLSBJbml0aWFsaXppbmcgYXBwbGljYXRpb24nKTtcblxuXHR0cnkge1xuXHRcdGlmIChtb2RlLmxvZ2dpbmcudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHQnQ3JlYXRpbmcgbmV3IElEQk1hbmFnZXIgaW5zdGFuY2UuIEluaXRpYWxpemluZyBkYXRhYmFzZSBhbmQgaXRzIGRlcGVuZGVuY2llcy4nXG5cdFx0XHQpO1xuXG5cdFx0aWYgKG1vZGUuZXhwb3NlLmlkYk1hbmFnZXIpIHtcblx0XHRcdGlmIChtb2RlLmRlYnVnKSBsb2cuaW5mbygnRXhwb3NpbmcgSURCTWFuYWdlciBpbnN0YW5jZSB0byB3aW5kb3cuJyk7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdChhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgaWRiTWFuYWdlckluc3RhbmNlID1cblx0XHRcdFx0XHRcdGF3YWl0IElEQk1hbmFnZXIuY3JlYXRlSW5zdGFuY2UoZGF0YSk7XG5cblx0XHRcdFx0XHQvLyBiaW5kcyB0aGUgSURCTWFuYWdlciBpbnN0YW5jZSB0byB0aGUgd2luZG93IG9iamVjdFxuXHRcdFx0XHRcdHdpbmRvdy5pZGJNYW5hZ2VyID0gaWRiTWFuYWdlckluc3RhbmNlO1xuXG5cdFx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0XHQnSURCTWFuYWdlciBpbnN0YW5jZSBzdWNjZXNzZnVsbHkgZXhwb3NlZCB0byB3aW5kb3cuJ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pKCk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nLmVycm9yKFxuXHRcdFx0XHRcdFx0YEZhaWxlZCB0byBleHBvc2UgSURCTWFuYWdlciBpbnN0YW5jZSB0byB3aW5kb3cuIEVycm9yOiAke2Vycm9yfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRcdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBDaGVjayBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gY3JlYXRlIGluaXRpYWwgSURCTWFuYWdlciBpbnN0YW5jZS4gRXJyb3I6ICR7ZXJyb3J9YFxuXHRcdFx0KTtcblxuXHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdH1cblxuXHRjb25zdCBzZWxlY3RlZENvbG9yT3B0aW9uID0gY29uc3RzLmRvbS5lbGVtZW50cy5zZWxlY3RlZENvbG9yT3B0aW9uO1xuXG5cdGlmIChtb2RlLmRlYnVnKSB7XG5cdFx0aWYgKGxvZ01vZGUuZGVidWcpXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdGxvZy5kZWJ1ZygnVmFsaWRhdGluZyBET00gZWxlbWVudHMnKTtcblx0XHRcdH1cblxuXHRcdGRvbS52YWxpZGF0ZS5lbGVtZW50cygpO1xuXHR9IGVsc2Uge1xuXHRcdGlmICghbW9kZS5xdWlldCkge1xuXHRcdFx0bG9nLmluZm8oJ1NraXBwaW5nIERPTSBlbGVtZW50IHZhbGlkYXRpb24nKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBzZWxlY3RlZENvbG9yID0gc2VsZWN0ZWRDb2xvck9wdGlvblxuXHRcdD8gcGFyc2VJbnQoc2VsZWN0ZWRDb2xvck9wdGlvbi52YWx1ZSwgMTApXG5cdFx0OiAwO1xuXG5cdGlmICghbW9kZS5xdWlldCAmJiBtb2RlLmRlYnVnKVxuXHRcdGxvZy5kZWJ1ZyhgU2VsZWN0ZWQgY29sb3I6ICR7c2VsZWN0ZWRDb2xvcn1gKTtcblxuXHR0cnkge1xuXHRcdGRvbS5ldmVudHMuaW5pdGlhbGl6ZUV2ZW50TGlzdGVuZXJzKCk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRsb2cuaW5mbygnRXZlbnQgbGlzdGVuZXJzIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQnKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRsb2cuZXJyb3IoYEZhaWxlZCB0byBpbml0aWFsaXplIGV2ZW50IGxpc3RlbmVycy5cXG4ke2Vycm9yfWApO1xuXG5cdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gQ2hlY2sgY29uc29sZSBmb3IgZGV0YWlscy4nKTtcblx0fVxuXG5cdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8pXG5cdFx0bG9nLmluZm8oJ0FwcGxpY2F0aW9uIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZC4gQXdhaXRpbmcgdXNlciBpbnB1dC4nKTtcbn1cbiJdfQ==