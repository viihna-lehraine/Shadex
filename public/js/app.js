// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: src/app.js
import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { IDBManager } from './idb/index.js';
import { logger } from './logger/index.js';
const consts = data.consts;
const mode = data.mode;
if (mode.debug)
    console.log('Executing main application script');
if (document.readyState === 'loading') {
    if (mode.debug)
        console.log('DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...');
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    if (mode.debug)
        console.log('DOM content already loaded. Initializing application immediately.');
    initializeApp();
}
async function initializeApp() {
    console.log('DOM content loaded - Initializing application');
    try {
        if (mode.verbose)
            console.log('Creating new IDBManager instance. Initializing database and its dependencies.');
        if (mode.exposeIDB) {
            if (mode.debug)
                console.log('Exposing IDBManager instance to window.');
            try {
                (async () => {
                    const idbManagerInstance = await IDBManager.createInstance();
                    // binds the IDBManager instance to the window object
                    window.idbManager = idbManagerInstance;
                    console.log('IDBManager instance successfully exposed to window.');
                })();
            }
            catch (error) {
                if (mode.errorLogs)
                    console.error(`Failed to expose IDBManager instance to window. Error: ${error}`);
                if (mode.showAlerts)
                    alert('An error occurred. Check console for details.');
            }
        }
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to create initial IDBManager instance. Error: ${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet)
        console.log('Initializing UI...');
    const domElements = dom.defineUIElements();
    if (!domElements) {
        if (mode.errorLogs)
            console.error('Failed to properly initialize the UI. Some DOM elements could not be found.');
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    try {
        await dom.initializeUI();
        if (!mode.quiet)
            console.log('UI successfully initialized');
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to initialize UI\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    const selectedColorOption = consts.dom.elements.selectedColorOption;
    if (mode.debug) {
        logger.debug.validateDOMElements();
        if (mode.verbose) {
            logger.verbose.validateDOMElements();
        }
    }
    else {
        if (!mode.quiet) {
            console.log('Skipping DOM element validation');
        }
    }
    const selectedColor = selectedColorOption
        ? parseInt(selectedColorOption.value, 10)
        : 0;
    if (!mode.quiet)
        console.log(`Selected color: ${selectedColor}`);
    try {
        dom.events.initializeEventListeners();
        if (!mode.quiet)
            console.log('Event listeners have been successfully initialized');
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to initialize event listeners.\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet)
        console.log('Application successfully initialized. Awaiting user input.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLG1CQUFtQjtBQUVuQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRXZCLElBQUksSUFBSSxDQUFDLEtBQUs7SUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFFakUsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO0lBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUs7UUFDYixPQUFPLENBQUMsR0FBRyxDQUNWLG9GQUFvRixDQUNwRixDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQzlELENBQUM7S0FBTSxDQUFDO0lBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSztRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQ1YsbUVBQW1FLENBQ25FLENBQUM7SUFDSCxhQUFhLEVBQUUsQ0FBQztBQUNqQixDQUFDO0FBRUQsS0FBSyxVQUFVLGFBQWE7SUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNKLElBQUksSUFBSSxDQUFDLE9BQU87WUFDZixPQUFP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Q0FBQztJQUVMLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFFakUsSUFBSSxDQUFDO1FBQ0osR0FBRyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBRXRDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0RBQW9ELENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFbEUsSUFBSSxJQUFJLENBQUMsVUFBVTtZQUNsQixLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FDViw0REFBNEQsQ0FDNUQsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb2xvckdlbiAtIHZlcnNpb24gMC42LjAtZGV2XG5cbi8vIEF1dGhvcjogVmlpaG5hIExlcmFpbmUgKHZpaWhuYUBWaWlobmFUZWNoLmNvbSAvIHZpaWhuYS43OCAoU2lnbmFsKSAvIFZpaWhuYS1MZWhyYWluZSAoR2l0aHViKSlcbi8vIExpY2Vuc2VkIHVuZGVyIEdOVSBHUEx2MyAoaHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLmh0bWwpXG5cbi8vIFlvdSBtYXkgdXNlIHRoaXMgY29kZSBmb3IgYW55IHB1cnBvc2UgRVhDRVBUIGZvciB0aGUgY3JlYXRpb24gb2YgcHJvcHJpZXRhcnkgZGVyaXZhdGl2ZXMuIEkgZW5jb3VyYWdlIHlvdSB0byBpbXByb3ZlIG9uIG15IGNvZGUgb3IgdG8gaW5jbHVkZSBpdCBpbiBvdGhlciBwcm9qZWN0cyBpZiB5b3UgZmluZCBpdCBoZWxwZnVsLiBQbGVhc2UgY3JlZGl0IG1lIGFzIHRoZSBvcmlnaW5hbCBhdXRob3IuXG5cbi8vIFRoaXMgYXBwbGljYXRpb24gY29tZXMgd2l0aCBBQlNPTFVURUxZIE5PIFdBUlJBTlRZIE9SIEdVQVJBTlRFRSBPRiBBTlkgS0lORC5cblxuLy8gRmlsZTogc3JjL2FwcC5qc1xuXG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4vZG9tL2luZGV4LmpzJztcbmltcG9ydCB7IElEQk1hbmFnZXIgfSBmcm9tICcuL2lkYi9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlci9pbmRleC5qcyc7XG5cbmNvbnN0IGNvbnN0cyA9IGRhdGEuY29uc3RzO1xuY29uc3QgbW9kZSA9IGRhdGEubW9kZTtcblxuaWYgKG1vZGUuZGVidWcpIGNvbnNvbGUubG9nKCdFeGVjdXRpbmcgbWFpbiBhcHBsaWNhdGlvbiBzY3JpcHQnKTtcblxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuXHRpZiAobW9kZS5kZWJ1Zylcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdCdET00gY29udGVudCBub3QgeWV0IGxvYWRlZC4gQWRkaW5nIERPTUNvbnRlbnRMb2FkZWQgZXZlbnQgbGlzdGVuZXIgYW5kIGF3YWl0aW5nLi4uJ1xuXHRcdCk7XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRpYWxpemVBcHApO1xufSBlbHNlIHtcblx0aWYgKG1vZGUuZGVidWcpXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHQnRE9NIGNvbnRlbnQgYWxyZWFkeSBsb2FkZWQuIEluaXRpYWxpemluZyBhcHBsaWNhdGlvbiBpbW1lZGlhdGVseS4nXG5cdFx0KTtcblx0aW5pdGlhbGl6ZUFwcCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplQXBwKCk6IFByb21pc2U8dm9pZD4ge1xuXHRjb25zb2xlLmxvZygnRE9NIGNvbnRlbnQgbG9hZGVkIC0gSW5pdGlhbGl6aW5nIGFwcGxpY2F0aW9uJyk7XG5cblx0dHJ5IHtcblx0XHRpZiAobW9kZS52ZXJib3NlKVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdCdDcmVhdGluZyBuZXcgSURCTWFuYWdlciBpbnN0YW5jZS4gSW5pdGlhbGl6aW5nIGRhdGFiYXNlIGFuZCBpdHMgZGVwZW5kZW5jaWVzLidcblx0XHRcdCk7XG5cblx0XHRpZiAobW9kZS5leHBvc2VJREIpIHtcblx0XHRcdGlmIChtb2RlLmRlYnVnKVxuXHRcdFx0XHRjb25zb2xlLmxvZygnRXhwb3NpbmcgSURCTWFuYWdlciBpbnN0YW5jZSB0byB3aW5kb3cuJyk7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdChhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgaWRiTWFuYWdlckluc3RhbmNlID1cblx0XHRcdFx0XHRcdGF3YWl0IElEQk1hbmFnZXIuY3JlYXRlSW5zdGFuY2UoKTtcblxuXHRcdFx0XHRcdC8vIGJpbmRzIHRoZSBJREJNYW5hZ2VyIGluc3RhbmNlIHRvIHRoZSB3aW5kb3cgb2JqZWN0XG5cdFx0XHRcdFx0d2luZG93LmlkYk1hbmFnZXIgPSBpZGJNYW5hZ2VySW5zdGFuY2U7XG5cblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0XHRcdCdJREJNYW5hZ2VyIGluc3RhbmNlIHN1Y2Nlc3NmdWxseSBleHBvc2VkIHRvIHdpbmRvdy4nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSkoKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0YEZhaWxlZCB0byBleHBvc2UgSURCTWFuYWdlciBpbnN0YW5jZSB0byB3aW5kb3cuIEVycm9yOiAke2Vycm9yfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRcdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBDaGVjayBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGNyZWF0ZSBpbml0aWFsIElEQk1hbmFnZXIgaW5zdGFuY2UuIEVycm9yOiAke2Vycm9yfWBcblx0XHRcdCk7XG5cblx0XHRpZiAobW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBDaGVjayBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuXHR9XG5cblx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIFVJLi4uJyk7XG5cblx0Y29uc3QgZG9tRWxlbWVudHMgPSBkb20uZGVmaW5lVUlFbGVtZW50cygpO1xuXG5cdGlmICghZG9tRWxlbWVudHMpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHQnRmFpbGVkIHRvIHByb3Blcmx5IGluaXRpYWxpemUgdGhlIFVJLiBTb21lIERPTSBlbGVtZW50cyBjb3VsZCBub3QgYmUgZm91bmQuJ1xuXHRcdFx0KTtcblxuXHRcdGlmIChtb2RlLnNob3dBbGVydHMpXG5cdFx0XHRhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIENoZWNrIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG5cdH1cblxuXHR0cnkge1xuXHRcdGF3YWl0IGRvbS5pbml0aWFsaXplVUkoKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ1VJIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCcpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGluaXRpYWxpemUgVUlcXG4ke2Vycm9yfWApO1xuXG5cdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gQ2hlY2sgY29uc29sZSBmb3IgZGV0YWlscy4nKTtcblx0fVxuXG5cdGNvbnN0IHNlbGVjdGVkQ29sb3JPcHRpb24gPSBjb25zdHMuZG9tLmVsZW1lbnRzLnNlbGVjdGVkQ29sb3JPcHRpb247XG5cblx0aWYgKG1vZGUuZGVidWcpIHtcblx0XHRsb2dnZXIuZGVidWcudmFsaWRhdGVET01FbGVtZW50cygpO1xuXG5cdFx0aWYgKG1vZGUudmVyYm9zZSkge1xuXHRcdFx0bG9nZ2VyLnZlcmJvc2UudmFsaWRhdGVET01FbGVtZW50cygpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAoIW1vZGUucXVpZXQpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdTa2lwcGluZyBET00gZWxlbWVudCB2YWxpZGF0aW9uJyk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdDogMDtcblxuXHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKGBTZWxlY3RlZCBjb2xvcjogJHtzZWxlY3RlZENvbG9yfWApO1xuXG5cdHRyeSB7XG5cdFx0ZG9tLmV2ZW50cy5pbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGNvbnNvbGUubG9nKCdFdmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCcpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBpbml0aWFsaXplIGV2ZW50IGxpc3RlbmVycy5cXG4ke2Vycm9yfWApO1xuXG5cdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gQ2hlY2sgY29uc29sZSBmb3IgZGV0YWlscy4nKTtcblx0fVxuXG5cdGlmICghbW9kZS5xdWlldClcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdCdBcHBsaWNhdGlvbiBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQuIEF3YWl0aW5nIHVzZXIgaW5wdXQuJ1xuXHRcdCk7XG59XG4iXX0=