// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: src/app.js
import { UIManager } from './ui/UIManager.js';
import { getIDBInstance } from './db/instance.js';
import { createLogger } from './logger/index.js';
import { defaultData as defaults } from './data/defaults.js';
import { domData } from './data/dom.js';
import { eventListenerFn } from './dom/eventListeners/index.js';
import { modeData as mode } from './data/mode.js';
import { uiFn } from './ui/main.js';
import { validateStaticElements } from './dom/validate.js';
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
        const uiManager = new UIManager(eventListenerFn, idbManager);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLG1CQUFtQjtBQUVuQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxJQUFJLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzdELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUzRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUU1QixNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLElBQUksSUFBSSxDQUFDLEtBQUs7SUFDYixNQUFNLENBQUMsSUFBSSxDQUNWLG1DQUFtQyxFQUNuQyxHQUFHLFVBQVUsY0FBYyxDQUMzQixDQUFDO0FBRUgsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO0lBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUs7UUFDYixNQUFNLENBQUMsSUFBSSxDQUNWLG9GQUFvRixFQUNwRixHQUFHLFVB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akMsQ0FBQztZQUVILElBQUksSUFBSSxDQUFDLFVBQVU7Z0JBQ2xCLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxDQUNWLDREQUE0RCxFQUM1RCxHQUFHLFVBQVUsTUFBTSxZQUFZLEVBQUUsQ0FDakMsQ0FBQztJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxDQUFDLEtBQUs7WUFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCxxQ0FBcUMsS0FBSyxFQUFFLEVBQzVDLEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsVUFBVTtZQUNsQixLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbG9yR2VuIC0gdmVyc2lvbiAwLjYuMC1kZXZcblxuLy8gQXV0aG9yOiBWaWlobmEgTGVyYWluZSAodmlpaG5hQFZpaWhuYVRlY2guY29tIC8gdmlpaG5hLjc4IChTaWduYWwpIC8gVmlpaG5hLUxlaHJhaW5lIChHaXRodWIpKVxuLy8gTGljZW5zZWQgdW5kZXIgR05VIEdQTHYzIChodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAuaHRtbClcblxuLy8gWW91IG1heSB1c2UgdGhpcyBjb2RlIGZvciBhbnkgcHVycG9zZSBFWENFUFQgZm9yIHRoZSBjcmVhdGlvbiBvZiBwcm9wcmlldGFyeSBkZXJpdmF0aXZlcy4gSSBlbmNvdXJhZ2UgeW91IHRvIGltcHJvdmUgb24gbXkgY29kZSBvciB0byBpbmNsdWRlIGl0IGluIG90aGVyIHByb2plY3RzIGlmIHlvdSBmaW5kIGl0IGhlbHBmdWwuIFBsZWFzZSBjcmVkaXQgbWUgYXMgdGhlIG9yaWdpbmFsIGF1dGhvci5cblxuLy8gVGhpcyBhcHBsaWNhdGlvbiBjb21lcyB3aXRoIEFCU09MVVRFTFkgTk8gV0FSUkFOVFkgT1IgR1VBUkFOVEVFIE9GIEFOWSBLSU5ELlxuXG4vLyBGaWxlOiBzcmMvYXBwLmpzXG5cbmltcG9ydCB7IFVJTWFuYWdlciB9IGZyb20gJy4vdWkvVUlNYW5hZ2VyLmpzJztcbmltcG9ydCB7IGdldElEQkluc3RhbmNlIH0gZnJvbSAnLi9kYi9pbnN0YW5jZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0RGF0YSBhcyBkZWZhdWx0cyB9IGZyb20gJy4vZGF0YS9kZWZhdWx0cy5qcyc7XG5pbXBvcnQgeyBkb21EYXRhIH0gZnJvbSAnLi9kYXRhL2RvbS5qcyc7XG5pbXBvcnQgeyBldmVudExpc3RlbmVyRm4gfSBmcm9tICcuL2RvbS9ldmVudExpc3RlbmVycy9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi9kYXRhL21vZGUuanMnO1xuaW1wb3J0IHsgdWlGbiB9IGZyb20gJy4vdWkvbWFpbi5qcyc7XG5pbXBvcnQgeyB2YWxpZGF0ZVN0YXRpY0VsZW1lbnRzIH0gZnJvbSAnLi9kb20vdmFsaWRhdGUuanMnO1xuXG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ2FwcC5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5pZiAobW9kZS5kZWJ1Zylcblx0bG9nZ2VyLmluZm8oXG5cdFx0J0V4ZWN1dGluZyBtYWluIGFwcGxpY2F0aW9uIHNjcmlwdCcsXG5cdFx0YCR7dGhpc01vZHVsZX0gPiBBTk9OWU1PVVNgXG5cdCk7XG5cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIHtcblx0aWYgKG1vZGUuZGVidWcpXG5cdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHQnRE9NIGNvbnRlbnQgbm90IHlldCBsb2FkZWQuIEFkZGluZyBET01Db250ZW50TG9hZGVkIGV2ZW50IGxpc3RlbmVyIGFuZCBhd2FpdGluZy4uLicsXG5cdFx0XHRgJHt0aGlzTW9kdWxlfSA+IEFOT05ZTU9VU2Bcblx0XHQpO1xuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0aWFsaXplQXBwKTtcbn0gZWxzZSB7XG5cdGlmIChtb2RlLmRlYnVnKVxuXHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0J0RPTSBjb250ZW50IGFscmVhZHkgbG9hZGVkLiBJbml0aWFsaXppbmcgYXBwbGljYXRpb24gaW1tZWRpYXRlbHkuJyxcblx0XHRcdGAke3RoaXNNb2R1bGV9ID4gQU5PTllNT1VTYFxuXHRcdCk7XG5cblx0aW5pdGlhbGl6ZUFwcCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplQXBwKCk6IFByb21pc2U8dm9pZD4ge1xuXHRjb25zdCB0aGlzRnVuY3Rpb24gPSAnaW5pdGlhbGl6ZUFwcCgpJztcblxuXHRsb2dnZXIuaW5mbyhcblx0XHQnRE9NIGNvbnRlbnQgbG9hZGVkIC0gSW5pdGlhbGl6aW5nIGFwcGxpY2F0aW9uJyxcblx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0KTtcblxuXHR0cnkge1xuXHRcdGlmIChtb2RlLmxvZ2dpbmcudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHQnQ3JlYXRpbmcgbmV3IElEQk1hbmFnZXIgaW5zdGFuY2UuIEluaXRpYWxpemluZyBkYXRhYmFzZSBhbmQgaXRzIGRlcGVuZGVuY2llcy4nLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cblx0XHRjb25zdCBpZGJNYW5hZ2VyID0gYXdhaXQgZ2V0SURCSW5zdGFuY2UoKTtcblxuXHRcdGNvbnN0IHNlbGVjdGVkU3dhdGNoID0gZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuc2VsZWN0cy5zd2F0Y2g7XG5cblx0XHRpZiAobW9kZS5kZWJ1Zykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdGxvZ2dlci5kZWJ1Zyhcblx0XHRcdFx0XHQnVmFsaWRhdGluZyBET00gZWxlbWVudHMnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHZhbGlkYXRlU3RhdGljRWxlbWVudHMoKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHQnU2tpcHBpbmcgRE9NIGVsZW1lbnQgdmFsaWRhdGlvbicsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNGdW5jdGlvbn1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkU3dhdGNoXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkU3dhdGNoLnZhbHVlLCAxMClcblx0XHRcdDogMDtcblxuXHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5kZWJ1Zyhcblx0XHRcdFx0YFNlbGVjdGVkIGNvbG9yOiAke3NlbGVjdGVkQ29sb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNGdW5jdGlvbn1gXG5cdFx0XHQpO1xuXG5cdFx0Y29uc3QgZGVmYXVsdFBhbGV0dGVPcHRpb25zID0gZGVmYXVsdHMucGFsZXR0ZU9wdGlvbnM7XG5cdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBHZW5lcmF0aW5nIGluaXRpYWwgY29sb3IgcGFsZXR0ZS5gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgdWlGbi5zdGFydFBhbGV0dGVHZW5lcmF0aW9uKGRlZmF1bHRQYWxldHRlT3B0aW9ucyk7XG5cblx0XHRjb25zdCB1aU1hbmFnZXIgPSBuZXcgVUlNYW5hZ2VyKGV2ZW50TGlzdGVuZXJGbiwgaWRiTWFuYWdlcik7XG5cblx0XHR0cnkge1xuXHRcdFx0ZXZlbnRMaXN0ZW5lckZuLmluaXRpYWxpemVFdmVudExpc3RlbmVycyh1aU1hbmFnZXIpO1xuXG5cdFx0XHRpZiAobG9nTW9kZS52ZXJib3NpdHkgPiAyKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHQnRXZlbnQgbGlzdGVuZXJzIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gaW5pdGlhbGl6ZSBldmVudCBsaXN0ZW5lcnMuXFxuJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRpZiAobW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHQnQXBwbGljYXRpb24gc3VjY2Vzc2Z1bGx5IGluaXRpYWxpemVkLiBBd2FpdGluZyB1c2VyIGlucHV0LicsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBpbml0aWFsaXplIGFwcGxpY2F0aW9uOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0KTtcblxuXHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdH1cbn1cbiJdfQ==