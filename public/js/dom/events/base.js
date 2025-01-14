// File: src/dom/events/base.js
import { core, superUtils, utils } from '../../common/index.js';
import { data } from '../../data/index.js';
import { domUtils } from '../utils/index.js';
import { IDBManager } from '../../idb/index.js';
import { mode } from '../../data/mode/index.js';
import { start } from '../../palette/index.js';
const buttonDebounce = data.consts.debounce.button || 300;
const domIDs = data.consts.dom.ids;
const uiElements = data.consts.dom.elements;
const idb = IDBManager.getInstance();
function addEventListener(id, eventType, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(eventType, callback);
    }
    else if (mode.warnLogs) {
        if ((mode.debug || mode.verbose) && mode.warnLogs)
            console.warn(`Element with id "${id}" not found.`);
    }
}
const handlePaletteGen = core.base.debounce(() => {
    try {
        const params = superUtils.dom.getGenButtonArgs();
        if (!params) {
            console.error('Failed to retrieve generateButton parameters');
            return;
        }
        const { numBoxes, customColor, paletteType, enableAlpha, limitDarkness, limitGrayness, limitLightness } = params;
        if (!paletteType || !numBoxes) {
            console.error('paletteType and/or numBoxes are undefined');
            return;
        }
        const options = {
            numBoxes,
            customColor,
            paletteType,
            enableAlpha,
            limitDarkness,
            limitGrayness,
            limitLightness
        };
        start.genPalette(options);
    }
    catch (error) {
        console.error(`Failed to handle generate button click: ${error}`);
    }
}, buttonDebounce);
function initializeEventListeners() {
    const addConversionListener = (id, colorSpace) => {
        const button = document.getElementById(id);
        if (button) {
            if (core.guards.isColorSpace(colorSpace)) {
                button.addEventListener('click', () => superUtils.dom.switchColorSpace(colorSpace));
            }
        }
        else {
            if (mode.warnLogs)
                console.warn(`Element with id "${id}" not found.`);
        }
    };
    addConversionListener('show-as-cmyk-button', 'cmyk');
    addConversionListener('show-as-hex-button', 'hex');
    addConversionListener('show-as-hsl-button', 'hsl');
    addConversionListener('show-as-hsv-button', 'hsv');
    addConversionListener('show-as-lab-button', 'lab');
    addConversionListener('show-as-rgb-button', 'rgb');
    addEventListener(domIDs.advancedMenuButton, 'click', async (e) => {
        e.preventDefault();
        const advancedMenuContent = document.querySelector('.advanced-menu-content');
        if (advancedMenuContent) {
            const isHidden = getComputedStyle(advancedMenuContent).display === 'none';
            advancedMenuContent.style.display = isHidden ? 'flex' : 'none';
        }
        if (!mode.quiet)
            console.log('advancedMenuButton clicked');
    });
    addEventListener(domIDs.applyCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        const customHSLColor = domUtils.applyCustomColor();
        const customHSLColorClone = core.base.clone(customHSLColor);
        await idb.saveData('customColor', 'appSettings', customHSLColorClone);
        if (!mode.quiet)
            console.log('Custom color saved to IndexedDB');
        // *DEV-NOTE* unfinished, I think? Double-check this
    });
    addEventListener(domIDs.clearCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.customColorInput.value = '#ff0000';
        if (!mode.quiet)
            console.log('Custom color cleared');
    });
    addEventListener(domIDs.closeCustomColorMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('closeCustomColorMenuButton clicked');
        uiElements.customColorMenu?.classList.add('hidden');
    });
    addEventListener(domIDs.closeDeveloperMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('closeDeveloperMenuButton clicked');
        uiElements.developerMenu?.classList.add('hidden');
    });
    addEventListener(domIDs.closeHelpMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('closeHelpMenuButton clicked');
        uiElements.advancedMenu?.classList.add('hidden');
    });
    addEventListener(domIDs.closeHistoryMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('closeHistoryMenuButton clicked');
        uiElements.historyMenu?.classList.add('hidden');
    });
    addEventListener(domIDs.customColorMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('customColorMenuButton clicked');
        uiElements.customColorMenu?.classList.remove('hidden');
    });
    if (!uiElements.customColorInput)
        throw new Error('Custom color input element not found');
    uiElements.customColorInput.addEventListener('input', () => {
        if (!uiElements.customColorDisplay)
            throw new Error('Custom color display element not found');
        uiElements.customColorDisplay.textContent =
            uiElements.customColorInput.value;
    });
    addEventListener(domIDs.deleteDatabaseButton, 'click', async (e) => {
        e.preventDefault();
        // Only allow if application is in development mode
        if (mode.app !== 'dev') {
            if (mode.infoLogs) {
                console.info('Cannot delete database in production mode.');
            }
            return;
        }
        const confirmDelete = confirm('Are you sure you want to delete the entire database? This action cannot be undone.');
        if (!confirmDelete)
            return;
        try {
            await IDBManager.getInstance().deleteDatabase();
            alert('Database deleted successfully!');
        }
        catch (error) {
            if (mode.errorLogs)
                console.error(`Failed to delete database: ${error}`);
            alert('Failed to delete database.');
        }
    });
    addEventListener(domIDs.desaturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.selectedColorOption
            ? parseInt(uiElements.selectedColorOption.value, 10)
            : 0;
        if (!mode.quiet)
            console.log('desaturateButton clicked');
        domUtils.desaturateColor(selectedColor);
    });
    addEventListener(domIDs.developerMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (mode.app !== 'dev') {
            if (!mode.quiet)
                console.error('Cannot access developer menu in production mode.');
            return;
        }
        if (!mode.quiet)
            console.log('developerMenuButton clicked');
        uiElements.developerMenu?.classList.remove('hidden');
    });
    addEventListener(domIDs.generateButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('generateButton clicked');
        if (mode.verbose)
            console.log(`Generate Button click event: Capturing parameters from UI`);
        // Captures data from UI at the time the Generate Button is clicked
        const { paletteType, numBoxes, enableAlpha, limitDarkness, limitGrayness, limitLightness } = domUtils.pullParamsFromUI();
        if (mode.verbose)
            console.log('Generate Button click event: Retrieved parameters from UI.');
        let customColor = (await idb.getCustomColor());
        if (!customColor) {
            if (mode.debug)
                // console.info('No custom color found. Using a random color'); *DEV-NOTE* see notes.txt for more info about what to do with this
                customColor = utils.random.hsl(true);
        }
        else {
            if (mode.debug)
                console.log(`User-generated Custom Color found in IndexedDB: ${JSON.stringify(customColor)}`);
        }
        const paletteOptions = {
            paletteType,
            numBoxes,
            customColor: core.base.clone(customColor),
            enableAlpha,
            limitDarkness,
            limitGrayness,
            limitLightness
        };
        if (mode.debug) {
            console.log(`paletteOptions object data:`);
            console.log(`paletteType: ${paletteOptions.paletteType}`);
            console.log(`numBoxes: ${paletteOptions.numBoxes}`);
            console.log(`customColor: ${JSON.stringify(paletteOptions.customColor)}`);
            console.log(`enableAlpha: ${paletteOptions.enableAlpha}`);
            console.log(`limitDarkness: ${paletteOptions.limitDarkness}`);
            console.log(`limitGrayness: ${paletteOptions.limitGrayness}`);
            console.log(`limitLightness: ${paletteOptions.limitLightness}`);
        }
        if (mode.verbose)
            console.log('Generate Button click event: Calling start.genPalette()');
        await start.genPalette(paletteOptions);
    });
    addEventListener(domIDs.helpMenuButton, 'click', async (e) => {
        e.preventDefault();
        const helpMenuContent = document.querySelector('.help-menu-content');
        if (helpMenuContent) {
            const isHidden = getComputedStyle(helpMenuContent).display === 'none';
            helpMenuContent.style.display = isHidden ? 'flex' : 'none';
            if (!mode.quiet)
                console.log('helpMenuButton clicked');
        }
    });
    addEventListener(domIDs.historyMenuButton, 'click', async (e) => {
        e.preventDefault();
        const historyMenuContent = document.querySelector('.history-menu-content');
        if (historyMenuContent) {
            const isHidden = getComputedStyle(historyMenuContent).display === 'none';
            historyMenuContent.style.display = isHidden ? 'flex' : 'none';
        }
        if (!mode.quiet)
            console.log('historyMenuToggleButton clicked');
    });
    addEventListener(domIDs.resetButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('resetButton clicked');
        const confirmReset = confirm('Are you sure you want to reset the cache?');
        if (!confirmReset)
            return;
        try {
            IDBManager.getInstance().resetDatabase();
            if (!mode.quiet)
                console.log('IndexedDB Data has been successfully reset.');
            alert('Cached IDB data reset successfully!');
        }
        catch (error) {
            if (mode.errorLogs)
                console.error(`Failed to reset IndexedDB: ${error}`);
            alert('Failed to reset IndexedDB data.');
        }
    });
    addEventListener(domIDs.resetPaletteIDButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('resetPaletteIDButton clicked');
        const confirmReset = confirm('Are you sure you want to reset the palette ID?');
        if (!confirmReset)
            return;
        try {
            await idb.resetPaletteID();
            if (!mode.quiet)
                console.log('Palette ID has been successfully reset.');
            alert('Palette ID reset successfully!');
        }
        catch (error) {
            if (mode.errorLogs)
                console.error(`Failed to reset palette ID: ${error}`);
            alert('Failed to reset palette ID.');
        }
    });
    addEventListener(domIDs.saturateButton, 'click', async (e) => {
        e.preventDefault();
        if (!mode.quiet)
            console.log('saturateButton clicked');
        const selectedColor = uiElements.selectedColorOption
            ? parseInt(uiElements.selectedColorOption.value, 10)
            : 0;
        domUtils.saturateColor(selectedColor);
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.customColorMenu)
            if (e.target === uiElements.customColorMenu)
                uiElements.customColorMenu.classList.add('hidden');
    });
}
export const base = {
    addEventListener,
    handlePaletteGen,
    initializeEventListeners
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kb20vZXZlbnRzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBRy9CLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFL0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztBQUMxRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBRTVDLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUVyQyxTQUFTLGdCQUFnQixDQUN4QixFQUFVLEVBQ1YsU0FBWSxFQUNaLFFBQThDO0lBRTlDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFNUMsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQztTQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLENB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QUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBdUI7SUFDdkMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQix3QkFBd0I7Q0FDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9kb20vZXZlbnRzL2Jhc2UuanNcblxuaW1wb3J0IHsgRE9NRXZlbnRzSW50ZXJmYWNlLCBIU0wsIFBhbGV0dGVPcHRpb25zIH0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSwgc3VwZXJVdGlscywgdXRpbHMgfSBmcm9tICcuLi8uLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgZG9tVXRpbHMgfSBmcm9tICcuLi91dGlscy9pbmRleC5qcyc7XG5pbXBvcnQgeyBJREJNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vaWRiL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGUgfSBmcm9tICcuLi8uLi9kYXRhL21vZGUvaW5kZXguanMnO1xuaW1wb3J0IHsgc3RhcnQgfSBmcm9tICcuLi8uLi9wYWxldHRlL2luZGV4LmpzJztcblxuY29uc3QgYnV0dG9uRGVib3VuY2UgPSBkYXRhLmNvbnN0cy5kZWJvdW5jZS5idXR0b24gfHwgMzAwO1xuY29uc3QgZG9tSURzID0gZGF0YS5jb25zdHMuZG9tLmlkcztcbmNvbnN0IHVpRWxlbWVudHMgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHM7XG5cbmNvbnN0IGlkYiA9IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcjxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRFdmVudE1hcD4oXG5cdGlkOiBzdHJpbmcsXG5cdGV2ZW50VHlwZTogSyxcblx0Y2FsbGJhY2s6IChldjogSFRNTEVsZW1lbnRFdmVudE1hcFtLXSkgPT4gdm9pZFxuKTogdm9pZCB7XG5cdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cblx0aWYgKGVsZW1lbnQpIHtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG5cdH0gZWxzZSBpZiAobW9kZS53YXJuTG9ncykge1xuXHRcdGlmICgobW9kZS5kZWJ1ZyB8fCBtb2RlLnZlcmJvc2UpICYmIG1vZGUud2FybkxvZ3MpXG5cdFx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmApO1xuXHR9XG59XG5cbmNvbnN0IGhhbmRsZVBhbGV0dGVHZW4gPSBjb3JlLmJhc2UuZGVib3VuY2UoKCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IHN1cGVyVXRpbHMuZG9tLmdldEdlbkJ1dHRvbkFyZ3MoKTtcblxuXHRcdGlmICghcGFyYW1zKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVycycpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fSA9IHBhcmFtcztcblxuXHRcdGlmICghcGFsZXR0ZVR5cGUgfHwgIW51bUJveGVzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdwYWxldHRlVHlwZSBhbmQvb3IgbnVtQm94ZXMgYXJlIHVuZGVmaW5lZCcpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb3B0aW9uczogUGFsZXR0ZU9wdGlvbnMgPSB7XG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdGN1c3RvbUNvbG9yLFxuXHRcdFx0cGFsZXR0ZVR5cGUsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9O1xuXG5cdFx0c3RhcnQuZ2VuUGFsZXR0ZShvcHRpb25zKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gaGFuZGxlIGdlbmVyYXRlIGJ1dHRvbiBjbGljazogJHtlcnJvcn1gKTtcblx0fVxufSwgYnV0dG9uRGVib3VuY2UpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG5cdGNvbnN0IGFkZENvbnZlcnNpb25MaXN0ZW5lciA9IChpZDogc3RyaW5nLCBjb2xvclNwYWNlOiBzdHJpbmcpID0+IHtcblx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKGJ1dHRvbikge1xuXHRcdFx0aWYgKGNvcmUuZ3VhcmRzLmlzQ29sb3JTcGFjZShjb2xvclNwYWNlKSkge1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuXHRcdFx0XHRcdHN1cGVyVXRpbHMuZG9tLnN3aXRjaENvbG9yU3BhY2UoY29sb3JTcGFjZSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKG1vZGUud2FybkxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUud2FybihgRWxlbWVudCB3aXRoIGlkIFwiJHtpZH1cIiBub3QgZm91bmQuYCk7XG5cdFx0fVxuXHR9O1xuXG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1jbXlrLWJ1dHRvbicsICdjbXlrJyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1oZXgtYnV0dG9uJywgJ2hleCcpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtaHNsLWJ1dHRvbicsICdoc2wnKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWhzdi1idXR0b24nLCAnaHN2Jyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1sYWItYnV0dG9uJywgJ2xhYicpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtcmdiLWJ1dHRvbicsICdyZ2InKTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5hZHZhbmNlZE1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBhZHZhbmNlZE1lbnVDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0Jy5hZHZhbmNlZC1tZW51LWNvbnRlbnQnXG5cdFx0XHQpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0aWYgKGFkdmFuY2VkTWVudUNvbnRlbnQpIHtcblx0XHRcdFx0Y29uc3QgaXNIaWRkZW4gPVxuXHRcdFx0XHRcdGdldENvbXB1dGVkU3R5bGUoYWR2YW5jZWRNZW51Q29udGVudCkuZGlzcGxheSA9PT0gJ25vbmUnO1xuXG5cdFx0XHRcdGFkdmFuY2VkTWVudUNvbnRlbnQuc3R5bGUuZGlzcGxheSA9IGlzSGlkZGVuID8gJ2ZsZXgnIDogJ25vbmUnO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdhZHZhbmNlZE1lbnVCdXR0b24gY2xpY2tlZCcpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5hcHBseUN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgY3VzdG9tSFNMQ29sb3IgPSBkb21VdGlscy5hcHBseUN1c3RvbUNvbG9yKCk7XG5cdFx0XHRjb25zdCBjdXN0b21IU0xDb2xvckNsb25lID0gY29yZS5iYXNlLmNsb25lKGN1c3RvbUhTTENvbG9yKTtcblxuXHRcdFx0YXdhaXQgaWRiLnNhdmVEYXRhKFxuXHRcdFx0XHQnY3VzdG9tQ29sb3InLFxuXHRcdFx0XHQnYXBwU2V0dGluZ3MnLFxuXHRcdFx0XHRjdXN0b21IU0xDb2xvckNsb25lXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdDdXN0b20gY29sb3Igc2F2ZWQgdG8gSW5kZXhlZERCJyk7XG5cblx0XHRcdC8vICpERVYtTk9URSogdW5maW5pc2hlZCwgSSB0aGluaz8gRG91YmxlLWNoZWNrIHRoaXNcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuY2xlYXJDdXN0b21Db2xvckJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuY3VzdG9tQ29sb3JJbnB1dCEudmFsdWUgPSAnI2ZmMDAwMCc7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ0N1c3RvbSBjb2xvciBjbGVhcmVkJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnY2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9yTWVudT8uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmNsb3NlRGV2ZWxvcGVyTWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ2Nsb3NlRGV2ZWxvcGVyTWVudUJ1dHRvbiBjbGlja2VkJyk7XG5cblx0XHRcdHVpRWxlbWVudHMuZGV2ZWxvcGVyTWVudT8uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmNsb3NlSGVscE1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdjbG9zZUhlbHBNZW51QnV0dG9uIGNsaWNrZWQnKTtcblxuXHRcdFx0dWlFbGVtZW50cy5hZHZhbmNlZE1lbnU/LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5jbG9zZUhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnY2xvc2VIaXN0b3J5TWVudUJ1dHRvbiBjbGlja2VkJyk7XG5cblx0XHRcdHVpRWxlbWVudHMuaGlzdG9yeU1lbnU/LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5jdXN0b21Db2xvck1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdjdXN0b21Db2xvck1lbnVCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9yTWVudT8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGlmICghdWlFbGVtZW50cy5jdXN0b21Db2xvcklucHV0KVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3VzdG9tIGNvbG9yIGlucHV0IGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cblx0dWlFbGVtZW50cy5jdXN0b21Db2xvcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuXHRcdGlmICghdWlFbGVtZW50cy5jdXN0b21Db2xvckRpc3BsYXkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0N1c3RvbSBjb2xvciBkaXNwbGF5IGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cblx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9yRGlzcGxheS50ZXh0Q29udGVudCA9XG5cdFx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9ySW5wdXQhLnZhbHVlO1xuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5kZWxldGVEYXRhYmFzZUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIE9ubHkgYWxsb3cgaWYgYXBwbGljYXRpb24gaXMgaW4gZGV2ZWxvcG1lbnQgbW9kZVxuXHRcdFx0aWYgKG1vZGUuYXBwICE9PSAnZGV2Jykge1xuXHRcdFx0XHRpZiAobW9kZS5pbmZvTG9ncykge1xuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbygnQ2Fubm90IGRlbGV0ZSBkYXRhYmFzZSBpbiBwcm9kdWN0aW9uIG1vZGUuJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNvbmZpcm1EZWxldGUgPSBjb25maXJtKFxuXHRcdFx0XHQnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGUgZW50aXJlIGRhdGFiYXNlPyBUaGlzIGFjdGlvbiBjYW5ub3QgYmUgdW5kb25lLidcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybURlbGV0ZSkgcmV0dXJuO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCkuZGVsZXRlRGF0YWJhc2UoKTtcblx0XHRcdFx0YWxlcnQoJ0RhdGFiYXNlIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBkZWxldGUgZGF0YWJhc2U6ICR7ZXJyb3J9YCk7XG5cdFx0XHRcdGFsZXJ0KCdGYWlsZWQgdG8gZGVsZXRlIGRhdGFiYXNlLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5kZXNhdHVyYXRlQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHVpRWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvblxuXHRcdFx0XHQ/IHBhcnNlSW50KHVpRWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvbi52YWx1ZSwgMTApXG5cdFx0XHRcdDogMDtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnZGVzYXR1cmF0ZUJ1dHRvbiBjbGlja2VkJyk7XG5cblx0XHRcdGRvbVV0aWxzLmRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuZGV2ZWxvcGVyTWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmIChtb2RlLmFwcCAhPT0gJ2RldicpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGFjY2VzcyBkZXZlbG9wZXIgbWVudSBpbiBwcm9kdWN0aW9uIG1vZGUuJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdkZXZlbG9wZXJNZW51QnV0dG9uIGNsaWNrZWQnKTtcblxuXHRcdFx0dWlFbGVtZW50cy5kZXZlbG9wZXJNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihkb21JRHMuZ2VuZXJhdGVCdXR0b24sICdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnZ2VuZXJhdGVCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0aWYgKG1vZGUudmVyYm9zZSlcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgR2VuZXJhdGUgQnV0dG9uIGNsaWNrIGV2ZW50OiBDYXB0dXJpbmcgcGFyYW1ldGVycyBmcm9tIFVJYFxuXHRcdFx0KTtcblxuXHRcdC8vIENhcHR1cmVzIGRhdGEgZnJvbSBVSSBhdCB0aGUgdGltZSB0aGUgR2VuZXJhdGUgQnV0dG9uIGlzIGNsaWNrZWRcblx0XHRjb25zdCB7XG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fSA9IGRvbVV0aWxzLnB1bGxQYXJhbXNGcm9tVUkoKTtcblxuXHRcdGlmIChtb2RlLnZlcmJvc2UpXG5cdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0J0dlbmVyYXRlIEJ1dHRvbiBjbGljayBldmVudDogUmV0cmlldmVkIHBhcmFtZXRlcnMgZnJvbSBVSS4nXG5cdFx0XHQpO1xuXG5cdFx0bGV0IGN1c3RvbUNvbG9yID0gKGF3YWl0IGlkYi5nZXRDdXN0b21Db2xvcigpKSBhcyBIU0wgfCBudWxsO1xuXG5cdFx0aWYgKCFjdXN0b21Db2xvcikge1xuXHRcdFx0aWYgKG1vZGUuZGVidWcpXG5cdFx0XHRcdC8vIGNvbnNvbGUuaW5mbygnTm8gY3VzdG9tIGNvbG9yIGZvdW5kLiBVc2luZyBhIHJhbmRvbSBjb2xvcicpOyAqREVWLU5PVEUqIHNlZSBub3Rlcy50eHQgZm9yIG1vcmUgaW5mbyBhYm91dCB3aGF0IHRvIGRvIHdpdGggdGhpc1xuXG5cdFx0XHRcdGN1c3RvbUNvbG9yID0gdXRpbHMucmFuZG9tLmhzbCh0cnVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKG1vZGUuZGVidWcpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdGBVc2VyLWdlbmVyYXRlZCBDdXN0b20gQ29sb3IgZm91bmQgaW4gSW5kZXhlZERCOiAke0pTT04uc3RyaW5naWZ5KFxuXHRcdFx0XHRcdFx0Y3VzdG9tQ29sb3Jcblx0XHRcdFx0XHQpfWBcblx0XHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCBwYWxldHRlT3B0aW9uczogUGFsZXR0ZU9wdGlvbnMgPSB7XG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IGNvcmUuYmFzZS5jbG9uZShjdXN0b21Db2xvciksXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9O1xuXG5cdFx0aWYgKG1vZGUuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKGBwYWxldHRlT3B0aW9ucyBvYmplY3QgZGF0YTpgKTtcblx0XHRcdGNvbnNvbGUubG9nKGBwYWxldHRlVHlwZTogJHtwYWxldHRlT3B0aW9ucy5wYWxldHRlVHlwZX1gKTtcblx0XHRcdGNvbnNvbGUubG9nKGBudW1Cb3hlczogJHtwYWxldHRlT3B0aW9ucy5udW1Cb3hlc31gKTtcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgY3VzdG9tQ29sb3I6ICR7SlNPTi5zdHJpbmdpZnkocGFsZXR0ZU9wdGlvbnMuY3VzdG9tQ29sb3IpfWBcblx0XHRcdCk7XG5cdFx0XHRjb25zb2xlLmxvZyhgZW5hYmxlQWxwaGE6ICR7cGFsZXR0ZU9wdGlvbnMuZW5hYmxlQWxwaGF9YCk7XG5cdFx0XHRjb25zb2xlLmxvZyhgbGltaXREYXJrbmVzczogJHtwYWxldHRlT3B0aW9ucy5saW1pdERhcmtuZXNzfWApO1xuXHRcdFx0Y29uc29sZS5sb2coYGxpbWl0R3JheW5lc3M6ICR7cGFsZXR0ZU9wdGlvbnMubGltaXRHcmF5bmVzc31gKTtcblx0XHRcdGNvbnNvbGUubG9nKGBsaW1pdExpZ2h0bmVzczogJHtwYWxldHRlT3B0aW9ucy5saW1pdExpZ2h0bmVzc31gKTtcblx0XHR9XG5cblx0XHRpZiAobW9kZS52ZXJib3NlKVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdCdHZW5lcmF0ZSBCdXR0b24gY2xpY2sgZXZlbnQ6IENhbGxpbmcgc3RhcnQuZ2VuUGFsZXR0ZSgpJ1xuXHRcdFx0KTtcblxuXHRcdGF3YWl0IHN0YXJ0LmdlblBhbGV0dGUocGFsZXR0ZU9wdGlvbnMpO1xuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKGRvbUlEcy5oZWxwTWVudUJ1dHRvbiwgJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCBoZWxwTWVudUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0Jy5oZWxwLW1lbnUtY29udGVudCdcblx0XHQpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmIChoZWxwTWVudUNvbnRlbnQpIHtcblx0XHRcdGNvbnN0IGlzSGlkZGVuID1cblx0XHRcdFx0Z2V0Q29tcHV0ZWRTdHlsZShoZWxwTWVudUNvbnRlbnQpLmRpc3BsYXkgPT09ICdub25lJztcblxuXHRcdFx0aGVscE1lbnVDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBpc0hpZGRlbiA/ICdmbGV4JyA6ICdub25lJztcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnaGVscE1lbnVCdXR0b24gY2xpY2tlZCcpO1xuXHRcdH1cblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuaGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBoaXN0b3J5TWVudUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHQnLmhpc3RvcnktbWVudS1jb250ZW50J1xuXHRcdFx0KSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmIChoaXN0b3J5TWVudUNvbnRlbnQpIHtcblx0XHRcdFx0Y29uc3QgaXNIaWRkZW4gPVxuXHRcdFx0XHRcdGdldENvbXB1dGVkU3R5bGUoaGlzdG9yeU1lbnVDb250ZW50KS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cblx0XHRcdFx0aGlzdG9yeU1lbnVDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBpc0hpZGRlbiA/ICdmbGV4JyA6ICdub25lJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnaGlzdG9yeU1lbnVUb2dnbGVCdXR0b24gY2xpY2tlZCcpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKGRvbUlEcy5yZXNldEJ1dHRvbiwgJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdyZXNldEJ1dHRvbiBjbGlja2VkJyk7XG5cblx0XHRjb25zdCBjb25maXJtUmVzZXQgPSBjb25maXJtKFxuXHRcdFx0J0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZXNldCB0aGUgY2FjaGU/J1xuXHRcdCk7XG5cblx0XHRpZiAoIWNvbmZpcm1SZXNldCkgcmV0dXJuO1xuXG5cdFx0dHJ5IHtcblx0XHRcdElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5yZXNldERhdGFiYXNlKCk7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdFx0Y29uc29sZS5sb2coJ0luZGV4ZWREQiBEYXRhIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSByZXNldC4nKTtcblxuXHRcdFx0YWxlcnQoJ0NhY2hlZCBJREIgZGF0YSByZXNldCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHJlc2V0IEluZGV4ZWREQjogJHtlcnJvcn1gKTtcblxuXHRcdFx0YWxlcnQoJ0ZhaWxlZCB0byByZXNldCBJbmRleGVkREIgZGF0YS4nKTtcblx0XHR9XG5cdH0pO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLnJlc2V0UGFsZXR0ZUlEQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygncmVzZXRQYWxldHRlSURCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0XHRjb25zdCBjb25maXJtUmVzZXQgPSBjb25maXJtKFxuXHRcdFx0XHQnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlc2V0IHRoZSBwYWxldHRlIElEPydcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybVJlc2V0KSByZXR1cm47XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IGlkYi5yZXNldFBhbGV0dGVJRCgpO1xuXG5cdFx0XHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnUGFsZXR0ZSBJRCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgcmVzZXQuJyk7XG5cblx0XHRcdFx0YWxlcnQoJ1BhbGV0dGUgSUQgcmVzZXQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byByZXNldCBwYWxldHRlIElEOiAke2Vycm9yfWApO1xuXG5cdFx0XHRcdGFsZXJ0KCdGYWlsZWQgdG8gcmVzZXQgcGFsZXR0ZSBJRC4nKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihkb21JRHMuc2F0dXJhdGVCdXR0b24sICdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnc2F0dXJhdGVCdXR0b24gY2xpY2tlZCcpO1xuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHVpRWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvblxuXHRcdFx0PyBwYXJzZUludCh1aUVsZW1lbnRzLnNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0ZG9tVXRpbHMuc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRpZiAodWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnUpXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IHVpRWxlbWVudHMuY3VzdG9tQ29sb3JNZW51KVxuXHRcdFx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9yTWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0fSk7XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBET01FdmVudHNJbnRlcmZhY2UgPSB7XG5cdGFkZEV2ZW50TGlzdGVuZXIsXG5cdGhhbmRsZVBhbGV0dGVHZW4sXG5cdGluaXRpYWxpemVFdmVudExpc3RlbmVyc1xufTtcbiJdfQ==