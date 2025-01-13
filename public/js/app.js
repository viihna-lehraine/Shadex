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
        console.log('Initializing UI...');
    const domElements = dom.defineUIElements();
    if (!domElements) {
        if (mode.errorLogs)
            console.error('Failed to properly initialize the UI. Some DOM elements could not be found.');
        process.exit(201);
    }
    try {
        await dom.initializeUI();
        if (!mode.quiet)
            console.log('UI successfully initialized');
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to initialize UI\n${error}`);
        process.exit(202);
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
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to initialize event listeners.\n${error}`);
        process.exit(203);
    }
    if (!mode.quiet)
        console.log('Application successfully initialized. Awaiting user input.');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLG1CQUFtQjtBQUVuQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFdkIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUU3RCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFFbkQsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFFM0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FDWiw2RUFBNkUsQ0FDN0UsQ0FBQztRQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNKLE1BQU0sR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV2RSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO0lBRXBFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUVuQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDdEMsQ0FBQztJQUNGLENBQUM7U0FBTSxDQUFDO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztJQUNGLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUI7UUFDeEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFTCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBRWpFLElBQUksQ0FBQztRQUNKLEdBQUcsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUV4QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQ1YsNERBQTRELENBQzVELENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbG9yR2VuIC0gdmVyc2lvbiAwLjYuMC1kZXZcblxuLy8gQXV0aG9yOiBWaWlobmEgTGVyYWluZSAodmlpaG5hQFZpaWhuYVRlY2guY29tIC8gdmlpaG5hLjc4IChTaWduYWwpIC8gVmlpaG5hLUxlaHJhaW5lIChHaXRodWIpKVxuLy8gTGljZW5zZWQgdW5kZXIgR05VIEdQTHYzIChodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAuaHRtbClcblxuLy8gWW91IG1heSB1c2UgdGhpcyBjb2RlIGZvciBhbnkgcHVycG9zZSBFWENFUFQgZm9yIHRoZSBjcmVhdGlvbiBvZiBwcm9wcmlldGFyeSBkZXJpdmF0aXZlcy4gSSBlbmNvdXJhZ2UgeW91IHRvIGltcHJvdmUgb24gbXkgY29kZSBvciB0byBpbmNsdWRlIGl0IGluIG90aGVyIHByb2plY3RzIGlmIHlvdSBmaW5kIGl0IGhlbHBmdWwuIFBsZWFzZSBjcmVkaXQgbWUgYXMgdGhlIG9yaWdpbmFsIGF1dGhvci5cblxuLy8gVGhpcyBhcHBsaWNhdGlvbiBjb21lcyB3aXRoIEFCU09MVVRFTFkgTk8gV0FSUkFOVFkgT1IgR1VBUkFOVEVFIE9GIEFOWSBLSU5ELlxuXG4vLyBGaWxlOiBzcmMvYXBwLmpzXG5cbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgZG9tIH0gZnJvbSAnLi9kb20vaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXIvaW5kZXguanMnO1xuXG5jb25zdCBjb25zdHMgPSBkYXRhLmNvbnN0cztcbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBhc3luYyAoKSA9PiB7XG5cdGNvbnNvbGUubG9nKCdET00gY29udGVudCBsb2FkZWQgLSBJbml0aWFsaXppbmcgYXBwbGljYXRpb24nKTtcblxuXHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcgVUkuLi4nKTtcblxuXHRjb25zdCBkb21FbGVtZW50cyA9IGRvbS5kZWZpbmVVSUVsZW1lbnRzKCk7XG5cblx0aWYgKCFkb21FbGVtZW50cykge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdCdGYWlsZWQgdG8gcHJvcGVybHkgaW5pdGlhbGl6ZSB0aGUgVUkuIFNvbWUgRE9NIGVsZW1lbnRzIGNvdWxkIG5vdCBiZSBmb3VuZC4nXG5cdFx0XHQpO1xuXG5cdFx0cHJvY2Vzcy5leGl0KDIwMSk7XG5cdH1cblxuXHR0cnkge1xuXHRcdGF3YWl0IGRvbS5pbml0aWFsaXplVUkoKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ1VJIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCcpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGluaXRpYWxpemUgVUlcXG4ke2Vycm9yfWApO1xuXG5cdFx0cHJvY2Vzcy5leGl0KDIwMik7XG5cdH1cblxuXHRjb25zdCBzZWxlY3RlZENvbG9yT3B0aW9uID0gY29uc3RzLmRvbS5lbGVtZW50cy5zZWxlY3RlZENvbG9yT3B0aW9uO1xuXG5cdGlmIChtb2RlLmRlYnVnKSB7XG5cdFx0bG9nZ2VyLmRlYnVnLnZhbGlkYXRlRE9NRWxlbWVudHMoKTtcblxuXHRcdGlmIChtb2RlLnZlcmJvc2UpIHtcblx0XHRcdGxvZ2dlci52ZXJib3NlLnZhbGlkYXRlRE9NRWxlbWVudHMoKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKCFtb2RlLnF1aWV0KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnU2tpcHBpbmcgRE9NIGVsZW1lbnQgdmFsaWRhdGlvbicpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSBzZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0PyBwYXJzZUludChzZWxlY3RlZENvbG9yT3B0aW9uLnZhbHVlLCAxMClcblx0XHQ6IDA7XG5cblx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZyhgU2VsZWN0ZWQgY29sb3I6ICR7c2VsZWN0ZWRDb2xvcn1gKTtcblxuXHR0cnkge1xuXHRcdGRvbS5lbGVtZW50cy5pbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGNvbnNvbGUubG9nKCdFdmVudCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCcpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBpbml0aWFsaXplIGV2ZW50IGxpc3RlbmVycy5cXG4ke2Vycm9yfWApO1xuXG5cdFx0cHJvY2Vzcy5leGl0KDIwMyk7XG5cdH1cblxuXHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHQnQXBwbGljYXRpb24gc3VjY2Vzc2Z1bGx5IGluaXRpYWxpemVkLiBBd2FpdGluZyB1c2VyIGlucHV0Lidcblx0XHQpO1xufSk7XG4iXX0=