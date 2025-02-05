// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: app.js
import { UIManager } from './app/ui/UIManager.js';
import { getIDBInstance } from './app/db/instance.js';
import { createLogger } from './logger/index.js';
import { defaultData as defaults } from './data/defaults.js';
import { domData } from './data/dom.js';
import { eventListenerFn } from './app/dom/eventListeners/index.js';
import { modeData as mode } from './data/mode.js';
import { uiFn } from './app/ui/main.js';
import { validateStaticElements } from './app/dom/validate.js';
const logMode = mode.logging;
const thisModule = 'app.js';
const logger = await createLogger();
if (mode.debug)
    logger.info('Executing main application script', `${thisModule} > ANONYMOUS`);
if (document.readyState === 'loading') {
    if (mode.debug)
        logger.info('DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...', `${thisModule} > ANONYMOUS`);
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    if (mode.debug)
        logger.info('DOM content already loaded. Initializing application immediately.', `${thisModule} > ANONYMOUS`);
    initializeApp();
}
async function initializeApp() {
    const thisFunction = 'initializeApp()';
    logger.info('DOM content loaded - Initializing application', `${thisModule} > ${thisFunction}`);
    try {
        if (mode.logging.verbosity > 1)
            logger.info('Creating new IDBManager instance. Initializing database and its dependencies.', `${thisModule} > ${thisFunction}`);
        const idbManager = await getIDBInstance();
        if (mode.expose) {
            if (logMode.verbosity > 1)
                logger.info('Exposing IDBManager instance to global scope', `${thisModule} > ${thisFunction}`);
            window.idbManager = idbManager;
        }
        const selectedSwatch = domData.elements.static.selects.swatch;
        if (mode.debug) {
            if (logMode.debug && logMode.verbosity > 1) {
                logger.debug('Validating DOM elements', `${thisModule} > ${thisFunction}`);
                validateStaticElements();
            }
        }
        else {
            if (logMode.verbosity > 1) {
                logger.info('Skipping DOM element validation', `${thisModule} > ${thisFunction}`);
            }
        }
        const selectedColor = selectedSwatch
            ? parseInt(selectedSwatch.value, 10)
            : 0;
        if (mode.debug && logMode.verbosity > 1)
            logger.debug(`Selected color: ${selectedColor}`, `${thisModule} > ${thisFunction}`);
        const defaultPaletteOptions = defaults.paletteOptions;
        if (logMode.verbosity > 1) {
            logger.info(`Generating initial color palette.`, `${thisModule} > ${thisFunction}`);
        }
        await uiFn.startPaletteGeneration(defaultPaletteOptions);
        const uiManager = new UIManager(eventListenerFn);
        try {
            eventListenerFn.initializeEventListeners(uiManager);
            if (logMode.verbosity > 2)
                logger.info('Event listeners have been successfully initialized', `${thisModule} > ${thisFunction}`);
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to initialize event listeners.\n${error}`, `${thisModule} > ${thisFunction}`);
            if (mode.showAlerts)
                alert('An error occurred. Check console for details.');
        }
        if (logMode.verbosity > 1)
            logger.info('Application successfully initialized. Awaiting user input.', `${thisModule} > ${thisFunction}`);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Failed to initialize application: ${error}`, `${thisModule} > ${thisFunction}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLGVBQWU7QUFFZixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxJQUFJLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzdELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRS9ELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFN0IsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBRTVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsSUFBSSxJQUFJLENBQUMsS0FBSztJQUNiLE1BQU0sQ0FBQyxJQUFJLENBQ1YsbUNBQW1DLEVBQ25DLEdBQUcsVUFBVSxjQUFjLENBQzNCLENBQUM7QUFFSCxJQUFJLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7SUFDdkMsSUFBSSxJQUFJLENBQUMsS0FBSztRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQ1Ysb0ZBQW9GLEVBQ3BGLEdBQUcsVUFB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LEVBQ3BELEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO1FBQ0osQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSztnQkFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCwwQ0FBMEMsS0FBSyxFQUFFLEVBQ2pELEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO1lBRUgsSUFBSSxJQUFJLENBQUMsVUFBVTtnQkFDbEIsS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELElBQUksT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQ1YsNERBQTRELEVBQzVELEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSztZQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLHFDQUFxQyxLQUFLLEVBQUUsRUFDNUMsR0FBRyxVQUFVLE1BQU0sWUFBWSxFQUFFLENBQ2pDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxVQUFVO1lBQ2xCLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3pELENBQUM7QUFDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29sb3JHZW4gLSB2ZXJzaW9uIDAuNi4wLWRldlxuXG4vLyBBdXRob3I6IFZpaWhuYSBMZXJhaW5lICh2aWlobmFAVmlpaG5hVGVjaC5jb20gLyB2aWlobmEuNzggKFNpZ25hbCkgLyBWaWlobmEtTGVocmFpbmUgKEdpdGh1YikpXG4vLyBMaWNlbnNlZCB1bmRlciBHTlUgR1BMdjMgKGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTMuMC5odG1sKVxuXG4vLyBZb3UgbWF5IHVzZSB0aGlzIGNvZGUgZm9yIGFueSBwdXJwb3NlIEVYQ0VQVCBmb3IgdGhlIGNyZWF0aW9uIG9mIHByb3ByaWV0YXJ5IGRlcml2YXRpdmVzLiBJIGVuY291cmFnZSB5b3UgdG8gaW1wcm92ZSBvbiBteSBjb2RlIG9yIHRvIGluY2x1ZGUgaXQgaW4gb3RoZXIgcHJvamVjdHMgaWYgeW91IGZpbmQgaXQgaGVscGZ1bC4gUGxlYXNlIGNyZWRpdCBtZSBhcyB0aGUgb3JpZ2luYWwgYXV0aG9yLlxuXG4vLyBUaGlzIGFwcGxpY2F0aW9uIGNvbWVzIHdpdGggQUJTT0xVVEVMWSBOTyBXQVJSQU5UWSBPUiBHVUFSQU5URUUgT0YgQU5ZIEtJTkQuXG5cbi8vIEZpbGU6IGFwcC5qc1xuXG5pbXBvcnQgeyBVSU1hbmFnZXIgfSBmcm9tICcuL2FwcC91aS9VSU1hbmFnZXIuanMnO1xuaW1wb3J0IHsgZ2V0SURCSW5zdGFuY2UgfSBmcm9tICcuL2FwcC9kYi9pbnN0YW5jZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0RGF0YSBhcyBkZWZhdWx0cyB9IGZyb20gJy4vZGF0YS9kZWZhdWx0cy5qcyc7XG5pbXBvcnQgeyBkb21EYXRhIH0gZnJvbSAnLi9kYXRhL2RvbS5qcyc7XG5pbXBvcnQgeyBldmVudExpc3RlbmVyRm4gfSBmcm9tICcuL2FwcC9kb20vZXZlbnRMaXN0ZW5lcnMvaW5kZXguanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4vZGF0YS9tb2RlLmpzJztcbmltcG9ydCB7IHVpRm4gfSBmcm9tICcuL2FwcC91aS9tYWluLmpzJztcbmltcG9ydCB7IHZhbGlkYXRlU3RhdGljRWxlbWVudHMgfSBmcm9tICcuL2FwcC9kb20vdmFsaWRhdGUuanMnO1xuXG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ2FwcC5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5pZiAobW9kZS5kZWJ1Zylcblx0bG9nZ2VyLmluZm8oXG5cdFx0J0V4ZWN1dGluZyBtYWluIGFwcGxpY2F0aW9uIHNjcmlwdCcsXG5cdFx0YCR7dGhpc01vZHVsZX0gPiBBTk9OWU1PVVNgXG5cdCk7XG5cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIHtcblx0aWYgKG1vZGUuZGVidWcpXG5cdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHQnRE9NIGNvbnRlbnQgbm90IHlldCBsb2FkZWQuIEFkZGluZyBET01Db250ZW50TG9hZGVkIGV2ZW50IGxpc3RlbmVyIGFuZCBhd2FpdGluZy4uLicsXG5cdFx0XHRgJHt0aGlzTW9kdWxlfSA+IEFOT05ZTU9VU2Bcblx0XHQpO1xuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0aWFsaXplQXBwKTtcbn0gZWxzZSB7XG5cdGlmIChtb2RlLmRlYnVnKVxuXHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0J0RPTSBjb250ZW50IGFscmVhZHkgbG9hZGVkLiBJbml0aWFsaXppbmcgYXBwbGljYXRpb24gaW1tZWRpYXRlbHkuJyxcblx0XHRcdGAke3RoaXNNb2R1bGV9ID4gQU5PTllNT1VTYFxuXHRcdCk7XG5cblx0aW5pdGlhbGl6ZUFwcCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplQXBwKCk6IFByb21pc2U8dm9pZD4ge1xuXHRjb25zdCB0aGlzRnVuY3Rpb24gPSAnaW5pdGlhbGl6ZUFwcCgpJztcblxuXHRsb2dnZXIuaW5mbyhcblx0XHQnRE9NIGNvbnRlbnQgbG9hZGVkIC0gSW5pdGlhbGl6aW5nIGFwcGxpY2F0aW9uJyxcblx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0KTtcblxuXHR0cnkge1xuXHRcdGlmIChtb2RlLmxvZ2dpbmcudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHQnQ3JlYXRpbmcgbmV3IElEQk1hbmFnZXIgaW5zdGFuY2UuIEluaXRpYWxpemluZyBkYXRhYmFzZSBhbmQgaXRzIGRlcGVuZGVuY2llcy4nLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cblx0XHRjb25zdCBpZGJNYW5hZ2VyID0gYXdhaXQgZ2V0SURCSW5zdGFuY2UoKTtcblxuXHRcdGlmIChtb2RlLmV4cG9zZSkge1xuXHRcdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0J0V4cG9zaW5nIElEQk1hbmFnZXIgaW5zdGFuY2UgdG8gZ2xvYmFsIHNjb3BlJyxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdFx0KTtcblxuXHRcdFx0d2luZG93LmlkYk1hbmFnZXIgPSBpZGJNYW5hZ2VyO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNlbGVjdGVkU3dhdGNoID0gZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuc2VsZWN0cy5zd2F0Y2g7XG5cblx0XHRpZiAobW9kZS5kZWJ1Zykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdGxvZ2dlci5kZWJ1Zyhcblx0XHRcdFx0XHQnVmFsaWRhdGluZyBET00gZWxlbWVudHMnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHZhbGlkYXRlU3RhdGljRWxlbWVudHMoKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHQnU2tpcHBpbmcgRE9NIGVsZW1lbnQgdmFsaWRhdGlvbicsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNGdW5jdGlvbn1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkU3dhdGNoXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkU3dhdGNoLnZhbHVlLCAxMClcblx0XHRcdDogMDtcblxuXHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5kZWJ1Zyhcblx0XHRcdFx0YFNlbGVjdGVkIGNvbG9yOiAke3NlbGVjdGVkQ29sb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNGdW5jdGlvbn1gXG5cdFx0XHQpO1xuXG5cdFx0Y29uc3QgZGVmYXVsdFBhbGV0dGVPcHRpb25zID0gZGVmYXVsdHMucGFsZXR0ZU9wdGlvbnM7XG5cdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBHZW5lcmF0aW5nIGluaXRpYWwgY29sb3IgcGFsZXR0ZS5gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgdWlGbi5zdGFydFBhbGV0dGVHZW5lcmF0aW9uKGRlZmF1bHRQYWxldHRlT3B0aW9ucyk7XG5cblx0XHRjb25zdCB1aU1hbmFnZXIgPSBuZXcgVUlNYW5hZ2VyKGV2ZW50TGlzdGVuZXJGbik7XG5cblx0XHR0cnkge1xuXHRcdFx0ZXZlbnRMaXN0ZW5lckZuLmluaXRpYWxpemVFdmVudExpc3RlbmVycyh1aU1hbmFnZXIpO1xuXG5cdFx0XHRpZiAobG9nTW9kZS52ZXJib3NpdHkgPiAyKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHQnRXZlbnQgbGlzdGVuZXJzIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gaW5pdGlhbGl6ZSBldmVudCBsaXN0ZW5lcnMuXFxuJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRpZiAobW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHQnQXBwbGljYXRpb24gc3VjY2Vzc2Z1bGx5IGluaXRpYWxpemVkLiBBd2FpdGluZyB1c2VyIGlucHV0LicsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBpbml0aWFsaXplIGFwcGxpY2F0aW9uOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0KTtcblxuXHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdH1cbn1cbiJdfQ==