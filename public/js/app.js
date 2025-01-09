// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: src/app.js
import { data } from './data/index.js';
import { dom } from './dom/index.js';
import { logger } from './logger/index.js';
const consts = data.consts;
const mode = data.mode;
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded - Initializing application');
    if (!mode.quiet)
        console.log('HTML partials loaded. Initializing UI...');
    const domElements = dom.defineUIElements();
    if (!domElements) {
        if (mode.errorLogs)
            console.error('Failed to initialize DOM elements: Some elements could not be found.');
        return;
    }
    await dom.initializeUI();
    if (!mode.quiet)
        console.log('UI successfully initialized');
    if (!domElements) {
        console.error('Failed to initialize DOM elements');
        return;
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
        dom.elements.initializeEventListeners();
        if (!mode.quiet)
            console.log('Event listeners have been successfully initialized');
    }
    catch {
        if (mode.errorLogs)
            console.error('Failed to initialize event listeners');
    }
    if (!mode.quiet)
        console.log('Application successfully initialized. Awaiting user input');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLG1CQUFtQjtBQUVuQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFdkIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUU3RCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7SUFFekUsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFFM0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FDWixzRUFBc0UsQ0FDdEUsQ0FBQztRQUVILE9BQU87SUFDUixDQUFDO0lBRUQsTUFBTSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBRTVELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFFbkQsT0FBTztJQUNSLENBQUM7SUFFRCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO0lBRXBFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUVuQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDdEMsQ0FBQztJQUNGLENBQUM7U0FBTSxDQUFDO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztJQUNGLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUI7UUFDeEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFTCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBRWpFLElBQUksQ0FBQztRQUNKLEdBQUcsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUV4QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUFDLE1BQU0sQ0FBQztRQUNSLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUNWLDJEQUEyRCxDQUMzRCxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb2xvckdlbiAtIHZlcnNpb24gMC42LjAtZGV2XG5cbi8vIEF1dGhvcjogVmlpaG5hIExlcmFpbmUgKHZpaWhuYUBWaWlobmFUZWNoLmNvbSAvIHZpaWhuYS43OCAoU2lnbmFsKSAvIFZpaWhuYS1MZWhyYWluZSAoR2l0aHViKSlcbi8vIExpY2Vuc2VkIHVuZGVyIEdOVSBHUEx2MyAoaHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLmh0bWwpXG5cbi8vIFlvdSBtYXkgdXNlIHRoaXMgY29kZSBmb3IgYW55IHB1cnBvc2UgRVhDRVBUIGZvciB0aGUgY3JlYXRpb24gb2YgcHJvcHJpZXRhcnkgZGVyaXZhdGl2ZXMuIEkgZW5jb3VyYWdlIHlvdSB0byBpbXByb3ZlIG9uIG15IGNvZGUgb3IgdG8gaW5jbHVkZSBpdCBpbiBvdGhlciBwcm9qZWN0cyBpZiB5b3UgZmluZCBpdCBoZWxwZnVsLiBQbGVhc2UgY3JlZGl0IG1lIGFzIHRoZSBvcmlnaW5hbCBhdXRob3IuXG5cbi8vIFRoaXMgYXBwbGljYXRpb24gY29tZXMgd2l0aCBBQlNPTFVURUxZIE5PIFdBUlJBTlRZIE9SIEdVQVJBTlRFRSBPRiBBTlkgS0lORC5cblxuLy8gRmlsZTogc3JjL2FwcC5qc1xuXG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4vZG9tL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyL2luZGV4LmpzJztcblxuY29uc3QgY29uc3RzID0gZGF0YS5jb25zdHM7XG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgYXN5bmMgKCkgPT4ge1xuXHRjb25zb2xlLmxvZygnRE9NIGNvbnRlbnQgbG9hZGVkIC0gSW5pdGlhbGl6aW5nIGFwcGxpY2F0aW9uJyk7XG5cblx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnSFRNTCBwYXJ0aWFscyBsb2FkZWQuIEluaXRpYWxpemluZyBVSS4uLicpO1xuXG5cdGNvbnN0IGRvbUVsZW1lbnRzID0gZG9tLmRlZmluZVVJRWxlbWVudHMoKTtcblxuXHRpZiAoIWRvbUVsZW1lbnRzKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0J0ZhaWxlZCB0byBpbml0aWFsaXplIERPTSBlbGVtZW50czogU29tZSBlbGVtZW50cyBjb3VsZCBub3QgYmUgZm91bmQuJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdGF3YWl0IGRvbS5pbml0aWFsaXplVUkoKTtcblxuXHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdVSSBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQnKTtcblxuXHRpZiAoIWRvbUVsZW1lbnRzKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGluaXRpYWxpemUgRE9NIGVsZW1lbnRzJyk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBzZWxlY3RlZENvbG9yT3B0aW9uID0gY29uc3RzLmRvbS5lbGVtZW50cy5zZWxlY3RlZENvbG9yT3B0aW9uO1xuXG5cdGlmIChtb2RlLmRlYnVnKSB7XG5cdFx0bG9nZ2VyLmRlYnVnLnZhbGlkYXRlRE9NRWxlbWVudHMoKTtcblxuXHRcdGlmIChtb2RlLnZlcmJvc2UpIHtcblx0XHRcdGxvZ2dlci52ZXJib3NlLnZhbGlkYXRlRE9NRWxlbWVudHMoKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKCFtb2RlLnF1aWV0KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnU2tpcHBpbmcgRE9NIGVsZW1lbnQgdmFsaWRhdGlvbicpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSBzZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0PyBwYXJzZUludChzZWxlY3RlZENvbG9yT3B0aW9uLnZhbHVlLCAxMClcblx0XHQ6IDA7XG5cblx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZyhgU2VsZWN0ZWQgY29sb3I6ICR7c2VsZWN0ZWRDb2xvcn1gKTtcblxuXHR0cnkge1xuXHRcdGRvbS5lbGVtZW50cy5pbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGNvbnNvbGUubG9nKCdFdmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCcpO1xuXHR9IGNhdGNoIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBldmVudCBsaXN0ZW5lcnMnKTtcblx0fVxuXG5cdGlmICghbW9kZS5xdWlldClcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdCdBcHBsaWNhdGlvbiBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQuIEF3YWl0aW5nIHVzZXIgaW5wdXQnXG5cdFx0KTtcbn0pO1xuIl19