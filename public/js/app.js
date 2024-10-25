// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
import { dom } from './dom/dom-main.js';
import { storage } from './dom/storage.js';
import { domHelpers } from './helpers/dom.js';
import { generate } from './palette-gen/generate.js';
let customColor = null;
// applies all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded - Initializing application');
    const generateButton = domHelpers.getElement('generate-button');
    const saturateButton = domHelpers.getElement('saturate-button');
    const desaturateButton = domHelpers.getElement('desaturate-button');
    const popupDivButton = domHelpers.getElement('custom-color-button');
    const applyCustomColorButton = domHelpers.getElement('apply-custom-color-button');
    const clearCustomColorButton = domHelpers.getElement('clear-custom-color-button');
    const advancedMenuToggleButton = domHelpers.getElement('advanced-menu-toggle-button');
    const applyInitialColorSpaceButton = domHelpers.getElement('apply-initial-color-space-button');
    const selectedColorOptions = domHelpers.getElement('selected-color-options');
    // confirm that all elements are accessible
    console.log(`generateButton: ${generateButton}\nsaturateButton: ${saturateButton}\ndesaturateButton: ${desaturateButton}\npopupDivButton: ${popupDivButton}\napplyCustomColorButton: ${applyCustomColorButton}\nclearCustomColorButton: ${clearCustomColorButton}\nadvancedMenuToggleButton: ${advancedMenuToggleButton}\napplyInitialColorSpaceButton: ${applyInitialColorSpaceButton}\nselectedColorOptions: ${selectedColorOptions}`);
    const selectedColor = selectedColorOptions
        ? parseInt(selectedColorOptions.value, 10)
        : 0;
    console.log(`Selected color: ${selectedColor}`);
    try {
        dom.addConversionButtonEventListeners();
        console.log('Conversion button event listeners attached');
    }
    catch (error) {
        console.error(`Unable to attach conversion button event listeners: ${error}`);
    }
    generateButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('generateButton clicked');
        const { paletteType, numBoxes, initialColorSpace } = dom.pullParamsFromUI();
        const color = customColor
            ? structuredClone(customColor)
            : null;
        const space = initialColorSpace ?? 'hex';
        generate.startPaletteGen(paletteType, numBoxes, space, color);
    });
    saturateButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('saturateButton clicked');
        dom.saturateColor(selectedColor);
    });
    desaturateButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('desaturateButton clicked');
        dom.desaturateColor(selectedColor);
    });
    popupDivButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('popupDivButton clicked');
        dom.showCustomColorPopupDiv();
    });
    applyCustomColorButton?.addEventListener('click', e => {
        e.preventDefault();
        const hslColor = dom.applyCustomColor();
        const customColorClone = structuredClone(hslColor);
        storage.setAppStorage({ customColor: customColorClone });
        dom.showCustomColorPopupDiv();
    });
    applyInitialColorSpaceButton?.addEventListener('click', e => {
        e.preventDefault();
        const initialColorSpace = dom.applyInitialColorSpace();
        const currentStorage = storage.getAppStorage() || {};
        const newStorage = { ...currentStorage, initialColorSpace };
        storage.setAppStorage(newStorage);
    });
    clearCustomColorButton?.addEventListener('click', e => {
        e.preventDefault();
        storage.updateAppStorage({ customColor: null });
        customColor = null;
        dom.showCustomColorPopupDiv();
    });
    advancedMenuToggleButton?.addEventListener('click', e => {
        e.preventDefault();
        const advancedMenu = domHelpers.getElement('advanced-menu');
        if (advancedMenu) {
            const clonedClasses = [...advancedMenu.classList];
            const isHidden = clonedClasses.includes('hidden');
            advancedMenu.classList.toggle('hidden');
            advancedMenu.style.display = isHidden ? 'block' : 'none';
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFFL0IsaUdBQWlHO0FBQ2pHLHVFQUF1RTtBQUV2RSxzT0FBc087QUFFdE8sK0VBQStFO0FBRS9FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRWxELElBQUksV0FBVyxHQUF1QixJQUFJLENBQUM7QUFFM0MsaURBQWlEO0FBQ2pELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBRTdELE1BQU0sY0FBYyxHQUNuQixVQUFVLENBQUMsVUFBVSxDQUFvQixpQkFBaUIsQ0FBQyxDQUFDO0lBQzdELE1BQU0sY0FBYyxHQUNuQixVQUFVLENBQUMsVUFBVSxDQUFvQixpQkFBaUIsQ0FBQyxDQUFDO0lBQzdELE1BQU0sZ0JBQWdCLEdBQ3JCLFVBQVUsQ0FBQyxVQUFVLENBQW9CLG1CQUFtQixDQUFDLENBQUM7SUFDL0QsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FDM0MscUJBQXFCLENBQ3JCLENBQUM7SUFDRixNQUFNLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQ25ELDJCQUEyQixDQUMzQixDQUFDO0lBQ0YsTUFBTSxzQkFBc0IsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUNuRCwyQkFBMkIsQ0FDM0IsQ0FBQztJQUNGLE1BQU0sd0JBQXdCLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FDckQsNkJBQTZCLENBQzdCLENBQUM7SUFDRixN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Q2xELE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFbEQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUMxRCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbG9yR2VuIC0gdmVyc2lvbiAwLjYuMC1kZXZcblxuLy8gQXV0aG9yOiBWaWlobmEgTGVyYWluZSAodmlpaG5hQFZpaWhuYVRlY2guY29tIC8gdmlpaG5hLjc4IChTaWduYWwpIC8gVmlpaG5hLUxlaHJhaW5lIChHaXRodWIpKVxuLy8gTGljZW5zZWQgdW5kZXIgR05VIEdQTHYzIChodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAuaHRtbClcblxuLy8gWW91IG1heSB1c2UgdGhpcyBjb2RlIGZvciBhbnkgcHVycG9zZSBFWENFUFQgZm9yIHRoZSBjcmVhdGlvbiBvZiBwcm9wcmlldGFyeSBkZXJpdmF0aXZlcy4gSSBlbmNvdXJhZ2UgeW91IHRvIGltcHJvdmUgb24gbXkgY29kZSBvciB0byBpbmNsdWRlIGl0IGluIG90aGVyIHByb2plY3RzIGlmIHlvdSBmaW5kIGl0IGhlbHBmdWwuIFBsZWFzZSBjcmVkaXQgbWUgYXMgdGhlIG9yaWdpbmFsIGF1dGhvci5cblxuLy8gVGhpcyBhcHBsaWNhdGlvbiBjb21lcyB3aXRoIEFCU09MVVRFTFkgTk8gV0FSUkFOVFkgT1IgR1VBUkFOVEVFIE9GIEFOWSBLSU5ELlxuXG5pbXBvcnQgeyBkb20gfSBmcm9tICcuL2RvbS9kb20tbWFpbic7XG5pbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnLi9kb20vc3RvcmFnZSc7XG5pbXBvcnQgeyBkb21IZWxwZXJzIH0gZnJvbSAnLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnLi9wYWxldHRlLWdlbi9nZW5lcmF0ZSc7XG5cbmxldCBjdXN0b21Db2xvcjogdHlwZXMuQ29sb3IgfCBudWxsID0gbnVsbDtcblxuLy8gYXBwbGllcyBhbGwgZXZlbnQgbGlzdGVuZXJzIHdoZW4gRE9NIGlzIGxvYWRlZFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0Y29uc29sZS5sb2coJ0RPTSBjb250ZW50IGxvYWRlZCAtIEluaXRpYWxpemluZyBhcHBsaWNhdGlvbicpO1xuXG5cdGNvbnN0IGdlbmVyYXRlQnV0dG9uID1cblx0XHRkb21IZWxwZXJzLmdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdnZW5lcmF0ZS1idXR0b24nKTtcblx0Y29uc3Qgc2F0dXJhdGVCdXR0b24gPVxuXHRcdGRvbUhlbHBlcnMuZ2V0RWxlbWVudDxIVE1MQnV0dG9uRWxlbWVudD4oJ3NhdHVyYXRlLWJ1dHRvbicpO1xuXHRjb25zdCBkZXNhdHVyYXRlQnV0dG9uID1cblx0XHRkb21IZWxwZXJzLmdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdkZXNhdHVyYXRlLWJ1dHRvbicpO1xuXHRjb25zdCBwb3B1cERpdkJ1dHRvbiA9IGRvbUhlbHBlcnMuZ2V0RWxlbWVudDxIVE1MQnV0dG9uRWxlbWVudD4oXG5cdFx0J2N1c3RvbS1jb2xvci1idXR0b24nXG5cdCk7XG5cdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSBkb21IZWxwZXJzLmdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdhcHBseS1jdXN0b20tY29sb3ItYnV0dG9uJ1xuXHQpO1xuXHRjb25zdCBjbGVhckN1c3RvbUNvbG9yQnV0dG9uID0gZG9tSGVscGVycy5nZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnY2xlYXItY3VzdG9tLWNvbG9yLWJ1dHRvbidcblx0KTtcblx0Y29uc3QgYWR2YW5jZWRNZW51VG9nZ2xlQnV0dG9uID0gZG9tSGVscGVycy5nZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnYWR2YW5jZWQtbWVudS10b2dnbGUtYnV0dG9uJ1xuXHQpO1xuXHRjb25zdCBhcHBseUluaXRpYWxDb2xvclNwYWNlQnV0dG9uID1cblx0XHRkb21IZWxwZXJzLmdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdFx0J2FwcGx5LWluaXRpYWwtY29sb3Itc3BhY2UtYnV0dG9uJ1xuXHRcdCk7XG5cdGNvbnN0IHNlbGVjdGVkQ29sb3JPcHRpb25zID0gZG9tSGVscGVycy5nZXRFbGVtZW50PEhUTUxTZWxlY3RFbGVtZW50Pihcblx0XHQnc2VsZWN0ZWQtY29sb3Itb3B0aW9ucydcblx0KTtcblxuXHQvLyBjb25maXJtIHRoYXQgYWxsIGVsZW1lbnRzIGFyZSBhY2Nlc3NpYmxlXG5cdGNvbnNvbGUubG9nKFxuXHRcdGBnZW5lcmF0ZUJ1dHRvbjogJHtnZW5lcmF0ZUJ1dHRvbn1cXG5zYXR1cmF0ZUJ1dHRvbjogJHtzYXR1cmF0ZUJ1dHRvbn1cXG5kZXNhdHVyYXRlQnV0dG9uOiAke2Rlc2F0dXJhdGVCdXR0b259XFxucG9wdXBEaXZCdXR0b246ICR7cG9wdXBEaXZCdXR0b259XFxuYXBwbHlDdXN0b21Db2xvckJ1dHRvbjogJHthcHBseUN1c3RvbUNvbG9yQnV0dG9ufVxcbmNsZWFyQ3VzdG9tQ29sb3JCdXR0b246ICR7Y2xlYXJDdXN0b21Db2xvckJ1dHRvbn1cXG5hZHZhbmNlZE1lbnVUb2dnbGVCdXR0b246ICR7YWR2YW5jZWRNZW51VG9nZ2xlQnV0dG9ufVxcbmFwcGx5SW5pdGlhbENvbG9yU3BhY2VCdXR0b246ICR7YXBwbHlJbml0aWFsQ29sb3JTcGFjZUJ1dHRvbn1cXG5zZWxlY3RlZENvbG9yT3B0aW9uczogJHtzZWxlY3RlZENvbG9yT3B0aW9uc31gXG5cdCk7XG5cblx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25zXG5cdFx0PyBwYXJzZUludChzZWxlY3RlZENvbG9yT3B0aW9ucy52YWx1ZSwgMTApXG5cdFx0OiAwO1xuXG5cdGNvbnNvbGUubG9nKGBTZWxlY3RlZCBjb2xvcjogJHtzZWxlY3RlZENvbG9yfWApO1xuXG5cdHRyeSB7XG5cdFx0ZG9tLmFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycygpO1xuXG5cdFx0Y29uc29sZS5sb2coJ0NvbnZlcnNpb24gYnV0dG9uIGV2ZW50IGxpc3RlbmVycyBhdHRhY2hlZCcpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRgVW5hYmxlIHRvIGF0dGFjaCBjb252ZXJzaW9uIGJ1dHRvbiBldmVudCBsaXN0ZW5lcnM6ICR7ZXJyb3J9YFxuXHRcdCk7XG5cdH1cblxuXHRnZW5lcmF0ZUJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zb2xlLmxvZygnZ2VuZXJhdGVCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0Y29uc3QgeyBwYWxldHRlVHlwZSwgbnVtQm94ZXMsIGluaXRpYWxDb2xvclNwYWNlIH0gPVxuXHRcdFx0ZG9tLnB1bGxQYXJhbXNGcm9tVUkoKTtcblx0XHRjb25zdCBjb2xvcjogdHlwZXMuQ29sb3IgfCBudWxsID0gY3VzdG9tQ29sb3Jcblx0XHRcdD8gc3RydWN0dXJlZENsb25lKGN1c3RvbUNvbG9yKVxuXHRcdFx0OiBudWxsO1xuXHRcdGNvbnN0IHNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gaW5pdGlhbENvbG9yU3BhY2UgPz8gJ2hleCc7XG5cblx0XHRnZW5lcmF0ZS5zdGFydFBhbGV0dGVHZW4ocGFsZXR0ZVR5cGUsIG51bUJveGVzLCBzcGFjZSwgY29sb3IpO1xuXHR9KTtcblxuXHRzYXR1cmF0ZUJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zb2xlLmxvZygnc2F0dXJhdGVCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0ZG9tLnNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0pO1xuXG5cdGRlc2F0dXJhdGVCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc29sZS5sb2coJ2Rlc2F0dXJhdGVCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0ZG9tLmRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0fSk7XG5cblx0cG9wdXBEaXZCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc29sZS5sb2coJ3BvcHVwRGl2QnV0dG9uIGNsaWNrZWQnKTtcblxuXHRcdGRvbS5zaG93Q3VzdG9tQ29sb3JQb3B1cERpdigpO1xuXHR9KTtcblxuXHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0IGhzbENvbG9yID0gZG9tLmFwcGx5Q3VzdG9tQ29sb3IoKTtcblx0XHRjb25zdCBjdXN0b21Db2xvckNsb25lOiB0eXBlcy5Db2xvciA9IHN0cnVjdHVyZWRDbG9uZShoc2xDb2xvcik7XG5cblx0XHRzdG9yYWdlLnNldEFwcFN0b3JhZ2UoeyBjdXN0b21Db2xvcjogY3VzdG9tQ29sb3JDbG9uZSB9KTtcblxuXHRcdGRvbS5zaG93Q3VzdG9tQ29sb3JQb3B1cERpdigpO1xuXHR9KTtcblxuXHRhcHBseUluaXRpYWxDb2xvclNwYWNlQnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0IGluaXRpYWxDb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID1cblx0XHRcdGRvbS5hcHBseUluaXRpYWxDb2xvclNwYWNlKCk7XG5cdFx0Y29uc3QgY3VycmVudFN0b3JhZ2UgPSBzdG9yYWdlLmdldEFwcFN0b3JhZ2UoKSB8fCB7fTtcblx0XHRjb25zdCBuZXdTdG9yYWdlID0geyAuLi5jdXJyZW50U3RvcmFnZSwgaW5pdGlhbENvbG9yU3BhY2UgfTtcblxuXHRcdHN0b3JhZ2Uuc2V0QXBwU3RvcmFnZShuZXdTdG9yYWdlKTtcblx0fSk7XG5cblx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRzdG9yYWdlLnVwZGF0ZUFwcFN0b3JhZ2UoeyBjdXN0b21Db2xvcjogbnVsbCB9KTtcblxuXHRcdGN1c3RvbUNvbG9yID0gbnVsbDtcblxuXHRcdGRvbS5zaG93Q3VzdG9tQ29sb3JQb3B1cERpdigpO1xuXHR9KTtcblxuXHRhZHZhbmNlZE1lbnVUb2dnbGVCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgYWR2YW5jZWRNZW51ID1cblx0XHRcdGRvbUhlbHBlcnMuZ2V0RWxlbWVudDxIVE1MRGl2RWxlbWVudD4oJ2FkdmFuY2VkLW1lbnUnKTtcblxuXHRcdGlmIChhZHZhbmNlZE1lbnUpIHtcblx0XHRcdGNvbnN0IGNsb25lZENsYXNzZXMgPSBbLi4uYWR2YW5jZWRNZW51LmNsYXNzTGlzdF07XG5cdFx0XHRjb25zdCBpc0hpZGRlbiA9IGNsb25lZENsYXNzZXMuaW5jbHVkZXMoJ2hpZGRlbicpO1xuXG5cdFx0XHRhZHZhbmNlZE1lbnUuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG5cdFx0XHRhZHZhbmNlZE1lbnUuc3R5bGUuZGlzcGxheSA9IGlzSGlkZGVuID8gJ2Jsb2NrJyA6ICdub25lJztcblx0XHR9XG5cdH0pO1xufSk7XG4iXX0=