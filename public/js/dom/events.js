// File: src/dom/events/base.js
import { core, superUtils, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { parse } from './parse.js';
import { IDBManager } from '../classes/idb/index.js';
import { log } from '../classes/logger/index.js';
import { mode } from '../data/mode/index.js';
import { start } from '../palette/index.js';
import { UIManager } from '../classes/ui/index.js';
const buttonDebounce = data.consts.debounce.button || 300;
const domIDs = data.consts.dom.ids;
const logMode = mode.logging;
const uiElements = data.consts.dom.elements;
const idb = IDBManager.getInstance();
const uiManager = new UIManager(uiElements);
function addEventListener(id, eventType, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(eventType, callback);
    }
    else if (logMode.warnings) {
        if (mode.debug && logMode.warnings && logMode.verbosity > 2)
            log.warning(`Element with id "${id}" not found.`);
    }
}
const handlePaletteGen = core.base.debounce(() => {
    try {
        const params = superUtils.dom.getGenButtonArgs();
        if (!params) {
            if (logMode.errors) {
                log.error('Failed to retrieve generateButton parameters');
            }
            return;
        }
        const { numBoxes, customColor, paletteType, enableAlpha, limitDarkness, limitGrayness, limitLightness } = params;
        if (!paletteType || !numBoxes) {
            if (logMode.errors) {
                log.error('paletteType and/or numBoxes are undefined');
            }
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
        if (logMode.errors)
            log.error(`Failed to handle generate button click: ${error}`);
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
            if (logMode.warnings)
                log.warning(`Element with id "${id}" not found.`);
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
        uiElements.advancedMenu?.classList.remove('hidden');
        uiElements.advancedMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.applyCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        const customHSLColor = uiManager.applyCustomColor();
        const customHSLColorClone = core.base.clone(customHSLColor);
        await idb.saveData('customColor', 'appSettings', customHSLColorClone);
        if (!mode.quiet && logMode.info)
            log.info('Custom color saved to IndexedDB');
        // *DEV-NOTE* unfinished, I think? Double-check this
    });
    addEventListener(domIDs.clearCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.customColorInput.value = '#ff0000';
        if (!mode.quiet && logMode.info)
            log.info('Custom color cleared');
    });
    addEventListener(domIDs.customColorMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.customColorMenu?.classList.add('hidden');
        uiElements.customColorMenu?.setAttribute('aria-hidden', 'true');
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
        // only allow if application is in development mode
        if (mode.environment === 'prod') {
            if (logMode.warnings) {
                log.warning('Cannot delete database in production mode.');
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
            if (logMode.errors)
                log.error(`Failed to delete database: ${error}`);
            alert('Failed to delete database.');
        }
    });
    addEventListener(domIDs.desaturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.selectedColorOption
            ? parseInt(uiElements.selectedColorOption.value, 10)
            : 0;
        if (!mode.quiet && logMode.clicks)
            log.info('desaturateButton clicked');
        uiManager.desaturateColor(selectedColor);
    });
    addEventListener(domIDs.developerMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (mode.environment === 'prod') {
            if (!mode.quiet && logMode.errors)
                log.error('Cannot access developer menu in production mode.');
            return;
        }
        uiElements.developerMenu?.classList.remove('hidden');
        uiElements.developerMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.exportPaletteButton, 'click', async (e) => {
        e.preventDefault();
        const format = parse.paletteExportFormat();
        if (mode.debug && logMode.info && logMode.verbosity > 1)
            log.info(`Export Palette Button click event: Export format selected: ${format}`);
        uiManager.handleExport(format);
    });
    addEventListener(domIDs.generateButton, 'click', async (e) => {
        e.preventDefault();
        // captures data from UI at the time the Generate Button is clicked
        const { paletteType, numBoxes, enableAlpha, limitDarkness, limitGrayness, limitLightness } = uiManager.pullParamsFromUI();
        if (logMode.info && logMode.verbosity > 1)
            log.info('Generate Button click event: Retrieved parameters from UI.');
        let customColor = (await idb.getCustomColor());
        if (!customColor) {
            customColor = utils.random.hsl(true);
        }
        else {
            if (mode.debug && logMode.info)
                log.info(`User-generated Custom Color found in IndexedDB: ${JSON.stringify(customColor)}`);
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
        if (mode.debug && logMode.info) {
            log.info(`paletteOptions object data:`);
            log.info(`paletteType: ${paletteOptions.paletteType}`);
            log.info(`numBoxes: ${paletteOptions.numBoxes}`);
            log.info(`customColor: ${JSON.stringify(paletteOptions.customColor)}`);
            log.info(`enableAlpha: ${paletteOptions.enableAlpha}`);
            log.info(`limitDarkness: ${paletteOptions.limitDarkness}`);
            log.info(`limitGrayness: ${paletteOptions.limitGrayness}`);
            log.info(`limitLightness: ${paletteOptions.limitLightness}`);
        }
        await start.genPalette(paletteOptions);
    });
    addEventListener(domIDs.helpMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.helpMenu?.classList.remove('hidden');
        uiElements.helpMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.historyMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.historyMenu?.classList.remove('hidden');
        uiElements.historyMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.importExportMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.importExportMenu?.classList.remove('hidden');
        uiElements.importExportMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.importPaletteInput, 'change', async (e) => {
        const input = e.target;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            // *DEV-NOTE* implement a way to determine whether file describes CSS, JSON, or XML import
            const format = 'JSON';
            await uiManager.handleImport(file, format);
        }
    });
    addEventListener(domIDs.resetDatabaseButton, 'click', async (e) => {
        e.preventDefault();
        if (mode.environment === 'prod') {
            if (!mode.quiet && logMode.errors)
                log.error('Cannot reset database in production mode.');
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the database?');
        if (!confirmReset)
            return;
        try {
            IDBManager.getInstance().resetDatabase();
            if (!mode.quiet && logMode.info)
                log.info('Database has been successfully reset.');
            alert('IndexedDB successfully reset!');
        }
        catch (error) {
            if (logMode.errors)
                log.error(`Failed to reset database: ${error}`);
            if (mode.showAlerts)
                alert('Failed to reset database.');
        }
    });
    addEventListener(domIDs.resetPaletteIDButton, 'click', async (e) => {
        e.preventDefault();
        if (mode.environment === 'prod') {
            if (!mode.quiet && logMode.errors)
                log.error('Cannot reset palette ID in production mode.');
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the palette ID?');
        if (!confirmReset)
            return;
        try {
            await idb.resetPaletteID();
            if (!mode.quiet && logMode.info)
                log.info('Palette ID has been successfully reset.');
            if (mode.showAlerts)
                alert('Palette ID reset successfully!');
        }
        catch (error) {
            if (logMode.errors)
                log.error(`Failed to reset palette ID: ${error}`);
            if (mode.showAlerts)
                alert('Failed to reset palette ID.');
        }
    });
    addEventListener(domIDs.saturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.selectedColorOption
            ? parseInt(uiElements.selectedColorOption.value, 10)
            : 0;
        uiManager.saturateColor(selectedColor);
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.advancedMenu)
            if (e.target === uiElements.advancedMenu) {
                uiElements.advancedMenu.classList.add('hidden');
                uiElements.advancedMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.customColorMenu)
            if (e.target === uiElements.customColorMenu) {
                uiElements.customColorMenu.classList.add('hidden');
                uiElements.customColorMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.developerMenu)
            if (e.target === uiElements.developerMenu) {
                uiElements.developerMenu.classList.add('hidden');
                uiElements.developerMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.helpMenu)
            if (e.target === uiElements.helpMenu) {
                uiElements.helpMenu.classList.add('hidden');
                uiElements.helpMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.historyMenu)
            if (e.target === uiElements.historyMenu) {
                uiElements.historyMenu.classList.add('hidden');
                uiElements.historyMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.importExportMenu)
            if (e.target === uiElements.importExportMenu) {
                uiElements.importExportMenu.classList.add('hidden');
                uiElements.importExportMenu.setAttribute('aria-hidden', 'true');
            }
    });
}
export const base = {
    addEventListener,
    handlePaletteGen,
    initializeEventListeners
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RvbS9ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBUS9CLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzdELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDakQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFbkQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztBQUMxRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM3QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFFNUMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRTVDLFNBQVMsZ0JBQWdCLENBQ3hCLEVBQVUsRUFDVixTQUFZLEVBQ1osUUFBOEM7SUFFOUMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNB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RSxDQUFDO2dCQUN6QyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQy9DLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1RCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFhLEVBQUUsRUFBRTtRQUN4RCxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0I7WUFDOUIsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUM5QyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEQsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakUsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBdUI7SUFDdkMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQix3QkFBd0I7Q0FDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9kb20vZXZlbnRzL2Jhc2UuanNcblxuaW1wb3J0IHtcblx0RE9NRXZlbnRzSW50ZXJmYWNlLFxuXHRIU0wsXG5cdElPRm9ybWF0LFxuXHRQYWxldHRlT3B0aW9uc1xufSBmcm9tICcuLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlLCBzdXBlclV0aWxzLCB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJy4vcGFyc2UuanMnO1xuaW1wb3J0IHsgSURCTWFuYWdlciB9IGZyb20gJy4uL2NsYXNzZXMvaWRiL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2NsYXNzZXMvbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGUgfSBmcm9tICcuLi9kYXRhL21vZGUvaW5kZXguanMnO1xuaW1wb3J0IHsgc3RhcnQgfSBmcm9tICcuLi9wYWxldHRlL2luZGV4LmpzJztcbmltcG9ydCB7IFVJTWFuYWdlciB9IGZyb20gJy4uL2NsYXNzZXMvdWkvaW5kZXguanMnO1xuXG5jb25zdCBidXR0b25EZWJvdW5jZSA9IGRhdGEuY29uc3RzLmRlYm91bmNlLmJ1dHRvbiB8fCAzMDA7XG5jb25zdCBkb21JRHMgPSBkYXRhLmNvbnN0cy5kb20uaWRzO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcbmNvbnN0IHVpRWxlbWVudHMgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHM7XG5cbmNvbnN0IGlkYiA9IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbmNvbnN0IHVpTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIodWlFbGVtZW50cyk7XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXI8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXA+KFxuXHRpZDogc3RyaW5nLFxuXHRldmVudFR5cGU6IEssXG5cdGNhbGxiYWNrOiAoZXY6IEhUTUxFbGVtZW50RXZlbnRNYXBbS10pID0+IHZvaWRcbik6IHZvaWQge1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG5cdGlmIChlbGVtZW50KSB7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuXHR9IGVsc2UgaWYgKGxvZ01vZGUud2FybmluZ3MpIHtcblx0XHRpZiAobW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLndhcm5pbmdzICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMilcblx0XHRcdGxvZy53YXJuaW5nKGBFbGVtZW50IHdpdGggaWQgXCIke2lkfVwiIG5vdCBmb3VuZC5gKTtcblx0fVxufVxuXG5jb25zdCBoYW5kbGVQYWxldHRlR2VuID0gY29yZS5iYXNlLmRlYm91bmNlKCgpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYXJhbXMgPSBzdXBlclV0aWxzLmRvbS5nZXRHZW5CdXR0b25BcmdzKCk7XG5cblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRcdGxvZy5lcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIGdlbmVyYXRlQnV0dG9uIHBhcmFtZXRlcnMnKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrbmVzcyxcblx0XHRcdGxpbWl0R3JheW5lc3MsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc1xuXHRcdH0gPSBwYXJhbXM7XG5cblx0XHRpZiAoIXBhbGV0dGVUeXBlIHx8ICFudW1Cb3hlcykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRcdGxvZy5lcnJvcigncGFsZXR0ZVR5cGUgYW5kL29yIG51bUJveGVzIGFyZSB1bmRlZmluZWQnKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wdGlvbnM6IFBhbGV0dGVPcHRpb25zID0ge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fTtcblxuXHRcdHN0YXJ0LmdlblBhbGV0dGUob3B0aW9ucyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0bG9nLmVycm9yKGBGYWlsZWQgdG8gaGFuZGxlIGdlbmVyYXRlIGJ1dHRvbiBjbGljazogJHtlcnJvcn1gKTtcblx0fVxufSwgYnV0dG9uRGVib3VuY2UpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG5cdGNvbnN0IGFkZENvbnZlcnNpb25MaXN0ZW5lciA9IChpZDogc3RyaW5nLCBjb2xvclNwYWNlOiBzdHJpbmcpID0+IHtcblx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKGJ1dHRvbikge1xuXHRcdFx0aWYgKGNvcmUuZ3VhcmRzLmlzQ29sb3JTcGFjZShjb2xvclNwYWNlKSkge1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuXHRcdFx0XHRcdHN1cGVyVXRpbHMuZG9tLnN3aXRjaENvbG9yU3BhY2UoY29sb3JTcGFjZSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGxvZ01vZGUud2FybmluZ3MpXG5cdFx0XHRcdGxvZy53YXJuaW5nKGBFbGVtZW50IHdpdGggaWQgXCIke2lkfVwiIG5vdCBmb3VuZC5gKTtcblx0XHR9XG5cdH07XG5cblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWNteWstYnV0dG9uJywgJ2NteWsnKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWhleC1idXR0b24nLCAnaGV4Jyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1oc2wtYnV0dG9uJywgJ2hzbCcpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtaHN2LWJ1dHRvbicsICdoc3YnKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWxhYi1idXR0b24nLCAnbGFiJyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1yZ2ItYnV0dG9uJywgJ3JnYicpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmFkdmFuY2VkTWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuYWR2YW5jZWRNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuYWR2YW5jZWRNZW51Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmFwcGx5Q3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBjdXN0b21IU0xDb2xvciA9IHVpTWFuYWdlci5hcHBseUN1c3RvbUNvbG9yKCk7XG5cdFx0XHRjb25zdCBjdXN0b21IU0xDb2xvckNsb25lID0gY29yZS5iYXNlLmNsb25lKGN1c3RvbUhTTENvbG9yKTtcblxuXHRcdFx0YXdhaXQgaWRiLnNhdmVEYXRhKFxuXHRcdFx0XHQnY3VzdG9tQ29sb3InLFxuXHRcdFx0XHQnYXBwU2V0dGluZ3MnLFxuXHRcdFx0XHRjdXN0b21IU0xDb2xvckNsb25lXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2cuaW5mbygnQ3VzdG9tIGNvbG9yIHNhdmVkIHRvIEluZGV4ZWREQicpO1xuXG5cdFx0XHQvLyAqREVWLU5PVEUqIHVuZmluaXNoZWQsIEkgdGhpbms/IERvdWJsZS1jaGVjayB0aGlzXG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmNsZWFyQ3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9ySW5wdXQhLnZhbHVlID0gJyNmZjAwMDAnO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvKSBsb2cuaW5mbygnQ3VzdG9tIGNvbG9yIGNsZWFyZWQnKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuY3VzdG9tQ29sb3JNZW51QnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnU/LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdH1cblx0KTtcblxuXHRpZiAoIXVpRWxlbWVudHMuY3VzdG9tQ29sb3JJbnB1dClcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0N1c3RvbSBjb2xvciBpbnB1dCBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXG5cdHVpRWxlbWVudHMuY3VzdG9tQ29sb3JJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcblx0XHRpZiAoIXVpRWxlbWVudHMuY3VzdG9tQ29sb3JEaXNwbGF5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDdXN0b20gY29sb3IgZGlzcGxheSBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXG5cdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvckRpc3BsYXkudGV4dENvbnRlbnQgPVxuXHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvcklucHV0IS52YWx1ZTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuZGVsZXRlRGF0YWJhc2VCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBvbmx5IGFsbG93IGlmIGFwcGxpY2F0aW9uIGlzIGluIGRldmVsb3BtZW50IG1vZGVcblx0XHRcdGlmIChtb2RlLmVudmlyb25tZW50ID09PSAncHJvZCcpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUud2FybmluZ3MpIHtcblx0XHRcdFx0XHRsb2cud2FybmluZygnQ2Fubm90IGRlbGV0ZSBkYXRhYmFzZSBpbiBwcm9kdWN0aW9uIG1vZGUuJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNvbmZpcm1EZWxldGUgPSBjb25maXJtKFxuXHRcdFx0XHQnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGUgZW50aXJlIGRhdGFiYXNlPyBUaGlzIGFjdGlvbiBjYW5ub3QgYmUgdW5kb25lLidcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybURlbGV0ZSkgcmV0dXJuO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCkuZGVsZXRlRGF0YWJhc2UoKTtcblxuXHRcdFx0XHRhbGVydCgnRGF0YWJhc2UgZGVsZXRlZCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nLmVycm9yKGBGYWlsZWQgdG8gZGVsZXRlIGRhdGFiYXNlOiAke2Vycm9yfWApO1xuXG5cdFx0XHRcdGFsZXJ0KCdGYWlsZWQgdG8gZGVsZXRlIGRhdGFiYXNlLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5kZXNhdHVyYXRlQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHVpRWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvblxuXHRcdFx0XHQ/IHBhcnNlSW50KHVpRWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvbi52YWx1ZSwgMTApXG5cdFx0XHRcdDogMDtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuY2xpY2tzKVxuXHRcdFx0XHRsb2cuaW5mbygnZGVzYXR1cmF0ZUJ1dHRvbiBjbGlja2VkJyk7XG5cblx0XHRcdHVpTWFuYWdlci5kZXNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmRldmVsb3Blck1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRpZiAobW9kZS5lbnZpcm9ubWVudCA9PT0gJ3Byb2QnKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGFjY2VzcyBkZXZlbG9wZXIgbWVudSBpbiBwcm9kdWN0aW9uIG1vZGUuJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1aUVsZW1lbnRzLmRldmVsb3Blck1lbnU/LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0dWlFbGVtZW50cy5kZXZlbG9wZXJNZW51Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmV4cG9ydFBhbGV0dGVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgPSBwYXJzZS5wYWxldHRlRXhwb3J0Rm9ybWF0KCkgYXMgSU9Gb3JtYXQ7XG5cblx0XHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBFeHBvcnQgUGFsZXR0ZSBCdXR0b24gY2xpY2sgZXZlbnQ6IEV4cG9ydCBmb3JtYXQgc2VsZWN0ZWQ6ICR7Zm9ybWF0fWBcblx0XHRcdFx0KTtcblxuXHRcdFx0dWlNYW5hZ2VyLmhhbmRsZUV4cG9ydChmb3JtYXQpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKGRvbUlEcy5nZW5lcmF0ZUJ1dHRvbiwgJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQvLyBjYXB0dXJlcyBkYXRhIGZyb20gVUkgYXQgdGhlIHRpbWUgdGhlIEdlbmVyYXRlIEJ1dHRvbiBpcyBjbGlja2VkXG5cdFx0Y29uc3Qge1xuXHRcdFx0cGFsZXR0ZVR5cGUsXG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrbmVzcyxcblx0XHRcdGxpbWl0R3JheW5lc3MsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc1xuXHRcdH0gPSB1aU1hbmFnZXIucHVsbFBhcmFtc0Zyb21VSSgpO1xuXG5cdFx0aWYgKGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0J0dlbmVyYXRlIEJ1dHRvbiBjbGljayBldmVudDogUmV0cmlldmVkIHBhcmFtZXRlcnMgZnJvbSBVSS4nXG5cdFx0XHQpO1xuXG5cdFx0bGV0IGN1c3RvbUNvbG9yID0gKGF3YWl0IGlkYi5nZXRDdXN0b21Db2xvcigpKSBhcyBIU0wgfCBudWxsO1xuXG5cdFx0aWYgKCFjdXN0b21Db2xvcikge1xuXHRcdFx0Y3VzdG9tQ29sb3IgPSB1dGlscy5yYW5kb20uaHNsKHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBVc2VyLWdlbmVyYXRlZCBDdXN0b20gQ29sb3IgZm91bmQgaW4gSW5kZXhlZERCOiAke0pTT04uc3RyaW5naWZ5KFxuXHRcdFx0XHRcdFx0Y3VzdG9tQ29sb3Jcblx0XHRcdFx0XHQpfWBcblx0XHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCBwYWxldHRlT3B0aW9uczogUGFsZXR0ZU9wdGlvbnMgPSB7XG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IGNvcmUuYmFzZS5jbG9uZShjdXN0b21Db2xvciksXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9O1xuXG5cdFx0aWYgKG1vZGUuZGVidWcgJiYgbG9nTW9kZS5pbmZvKSB7XG5cdFx0XHRsb2cuaW5mbyhgcGFsZXR0ZU9wdGlvbnMgb2JqZWN0IGRhdGE6YCk7XG5cdFx0XHRsb2cuaW5mbyhgcGFsZXR0ZVR5cGU6ICR7cGFsZXR0ZU9wdGlvbnMucGFsZXR0ZVR5cGV9YCk7XG5cdFx0XHRsb2cuaW5mbyhgbnVtQm94ZXM6ICR7cGFsZXR0ZU9wdGlvbnMubnVtQm94ZXN9YCk7XG5cdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0YGN1c3RvbUNvbG9yOiAke0pTT04uc3RyaW5naWZ5KHBhbGV0dGVPcHRpb25zLmN1c3RvbUNvbG9yKX1gXG5cdFx0XHQpO1xuXHRcdFx0bG9nLmluZm8oYGVuYWJsZUFscGhhOiAke3BhbGV0dGVPcHRpb25zLmVuYWJsZUFscGhhfWApO1xuXHRcdFx0bG9nLmluZm8oYGxpbWl0RGFya25lc3M6ICR7cGFsZXR0ZU9wdGlvbnMubGltaXREYXJrbmVzc31gKTtcblx0XHRcdGxvZy5pbmZvKGBsaW1pdEdyYXluZXNzOiAke3BhbGV0dGVPcHRpb25zLmxpbWl0R3JheW5lc3N9YCk7XG5cdFx0XHRsb2cuaW5mbyhgbGltaXRMaWdodG5lc3M6ICR7cGFsZXR0ZU9wdGlvbnMubGltaXRMaWdodG5lc3N9YCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgc3RhcnQuZ2VuUGFsZXR0ZShwYWxldHRlT3B0aW9ucyk7XG5cdH0pO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoZG9tSURzLmhlbHBNZW51QnV0dG9uLCAnY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHVpRWxlbWVudHMuaGVscE1lbnU/LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdHVpRWxlbWVudHMuaGVscE1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuaGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR1aUVsZW1lbnRzLmhpc3RvcnlNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuaGlzdG9yeU1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuaW1wb3J0RXhwb3J0TWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuaW1wb3J0RXhwb3J0TWVudT8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHR1aUVsZW1lbnRzLmltcG9ydEV4cG9ydE1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihkb21JRHMuaW1wb3J0UGFsZXR0ZUlucHV0LCAnY2hhbmdlJywgYXN5bmMgKGU6IEV2ZW50KSA9PiB7XG5cdFx0Y29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG5cdFx0aWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGNvbnN0IGZpbGUgPSBpbnB1dC5maWxlc1swXTtcblxuXHRcdFx0Ly8gKkRFVi1OT1RFKiBpbXBsZW1lbnQgYSB3YXkgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgZmlsZSBkZXNjcmliZXMgQ1NTLCBKU09OLCBvciBYTUwgaW1wb3J0XG5cdFx0XHRjb25zdCBmb3JtYXQgPSAnSlNPTic7XG5cblx0XHRcdGF3YWl0IHVpTWFuYWdlci5oYW5kbGVJbXBvcnQoZmlsZSwgZm9ybWF0KTtcblx0XHR9XG5cdH0pO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLnJlc2V0RGF0YWJhc2VCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRpZiAobW9kZS5lbnZpcm9ubWVudCA9PT0gJ3Byb2QnKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2cuZXJyb3IoJ0Nhbm5vdCByZXNldCBkYXRhYmFzZSBpbiBwcm9kdWN0aW9uIG1vZGUuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb25maXJtUmVzZXQgPSBjb25maXJtKFxuXHRcdFx0XHQnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlc2V0IHRoZSBkYXRhYmFzZT8nXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIWNvbmZpcm1SZXNldCkgcmV0dXJuO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRJREJNYW5hZ2VyLmdldEluc3RhbmNlKCkucmVzZXREYXRhYmFzZSgpO1xuXG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdFx0bG9nLmluZm8oJ0RhdGFiYXNlIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSByZXNldC4nKTtcblxuXHRcdFx0XHRhbGVydCgnSW5kZXhlZERCIHN1Y2Nlc3NmdWxseSByZXNldCEnKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2cuZXJyb3IoYEZhaWxlZCB0byByZXNldCBkYXRhYmFzZTogJHtlcnJvcn1gKTtcblxuXHRcdFx0XHRpZiAobW9kZS5zaG93QWxlcnRzKSBhbGVydCgnRmFpbGVkIHRvIHJlc2V0IGRhdGFiYXNlLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5yZXNldFBhbGV0dGVJREJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmIChtb2RlLmVudmlyb25tZW50ID09PSAncHJvZCcpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZy5lcnJvcignQ2Fubm90IHJlc2V0IHBhbGV0dGUgSUQgaW4gcHJvZHVjdGlvbiBtb2RlLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY29uZmlybVJlc2V0ID0gY29uZmlybShcblx0XHRcdFx0J0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZXNldCB0aGUgcGFsZXR0ZSBJRD8nXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIWNvbmZpcm1SZXNldCkgcmV0dXJuO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBpZGIucmVzZXRQYWxldHRlSUQoKTtcblxuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZy5pbmZvKCdQYWxldHRlIElEIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSByZXNldC4nKTtcblxuXHRcdFx0XHRpZiAobW9kZS5zaG93QWxlcnRzKSBhbGVydCgnUGFsZXR0ZSBJRCByZXNldCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nLmVycm9yKGBGYWlsZWQgdG8gcmVzZXQgcGFsZXR0ZSBJRDogJHtlcnJvcn1gKTtcblxuXHRcdFx0XHRpZiAobW9kZS5zaG93QWxlcnRzKSBhbGVydCgnRmFpbGVkIHRvIHJlc2V0IHBhbGV0dGUgSUQuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoZG9tSURzLnNhdHVyYXRlQnV0dG9uLCAnY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSB1aUVsZW1lbnRzLnNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHRcdD8gcGFyc2VJbnQodWlFbGVtZW50cy5zZWxlY3RlZENvbG9yT3B0aW9uLnZhbHVlLCAxMClcblx0XHRcdDogMDtcblxuXHRcdHVpTWFuYWdlci5zYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmFkdmFuY2VkTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5hZHZhbmNlZE1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5hZHZhbmNlZE1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuYWR2YW5jZWRNZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmN1c3RvbUNvbG9yTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuY3VzdG9tQ29sb3JNZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmRldmVsb3Blck1lbnUpXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IHVpRWxlbWVudHMuZGV2ZWxvcGVyTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRldmVsb3Blck1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuZGV2ZWxvcGVyTWVudS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblx0XHRcdH1cblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRpZiAodWlFbGVtZW50cy5oZWxwTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5oZWxwTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmhlbHBNZW51LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0XHR1aUVsZW1lbnRzLmhlbHBNZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmhpc3RvcnlNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmhpc3RvcnlNZW51KSB7XG5cdFx0XHRcdHVpRWxlbWVudHMuaGlzdG9yeU1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuaGlzdG9yeU1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuaW1wb3J0RXhwb3J0TWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5pbXBvcnRFeHBvcnRNZW51KSB7XG5cdFx0XHRcdHVpRWxlbWVudHMuaW1wb3J0RXhwb3J0TWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5pbXBvcnRFeHBvcnRNZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdFx0fVxuXHR9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IERPTUV2ZW50c0ludGVyZmFjZSA9IHtcblx0YWRkRXZlbnRMaXN0ZW5lcixcblx0aGFuZGxlUGFsZXR0ZUdlbixcblx0aW5pdGlhbGl6ZUV2ZW50TGlzdGVuZXJzXG59O1xuIl19