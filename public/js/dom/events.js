// File: src/dom/events/base.js
import { core, superUtils, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { parse } from './parse.js';
import { IDBManager } from '../db/index.js';
import { logger } from '../logger/index.js';
import { mode } from '../data/mode/index.js';
import { start } from '../palette/index.js';
import { UIManager } from '../ui/index.js';
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
            logger.warning(`Element with id "${id}" not found.`);
    }
}
const handlePaletteGen = core.base.debounce(() => {
    try {
        const params = superUtils.dom.getGenButtonArgs();
        if (!params) {
            if (logMode.errors) {
                logger.error('Failed to retrieve generateButton parameters');
            }
            return;
        }
        const { numBoxes, customColor, paletteType, enableAlpha, limitDarkness, limitGrayness, limitLightness } = params;
        if (!paletteType || !numBoxes) {
            if (logMode.errors) {
                logger.error('paletteType and/or numBoxes are undefined');
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
            logger.error(`Failed to handle generate button click: ${error}`);
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
                logger.warning(`Element with id "${id}" not found.`);
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
            logger.info('Custom color saved to IndexedDB');
        // *DEV-NOTE* unfinished, I think? Double-check this
    });
    addEventListener(domIDs.clearCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.customColorInput.value = '#ff0000';
        if (!mode.quiet && logMode.info)
            logger.info('Custom color cleared');
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
                logger.warning('Cannot delete database in production mode.');
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
                logger.error(`Failed to delete database: ${error}`);
            alert('Failed to delete database.');
        }
    });
    addEventListener(domIDs.desaturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.selectedColorOption
            ? parseInt(uiElements.selectedColorOption.value, 10)
            : 0;
        if (!mode.quiet && logMode.clicks)
            logger.info('desaturateButton clicked');
        uiManager.desaturateColor(selectedColor);
    });
    addEventListener(domIDs.developerMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (mode.environment === 'prod') {
            if (!mode.quiet && logMode.errors)
                logger.error('Cannot access developer menu in production mode.');
            return;
        }
        uiElements.developerMenu?.classList.remove('hidden');
        uiElements.developerMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.exportPaletteButton, 'click', async (e) => {
        e.preventDefault();
        const format = parse.paletteExportFormat();
        if (mode.debug && logMode.info && logMode.verbosity > 1)
            logger.info(`Export Palette Button click event: Export format selected: ${format}`);
        uiManager.handleExport(format);
    });
    addEventListener(domIDs.generateButton, 'click', async (e) => {
        e.preventDefault();
        // captures data from UI at the time the Generate Button is clicked
        const { paletteType, numBoxes, enableAlpha, limitDarkness, limitGrayness, limitLightness } = uiManager.pullParamsFromUI();
        if (logMode.info && logMode.verbosity > 1)
            logger.info('Generate Button click event: Retrieved parameters from UI.');
        let customColor = (await idb.getCustomColor());
        if (!customColor) {
            customColor = utils.random.hsl(true);
        }
        else {
            if (mode.debug && logMode.info)
                logger.info(`User-generated Custom Color found in IndexedDB: ${JSON.stringify(customColor)}`);
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
            logger.info(`paletteOptions object data:`);
            logger.info(`paletteType: ${paletteOptions.paletteType}`);
            logger.info(`numBoxes: ${paletteOptions.numBoxes}`);
            logger.info(`customColor: ${JSON.stringify(paletteOptions.customColor)}`);
            logger.info(`enableAlpha: ${paletteOptions.enableAlpha}`);
            logger.info(`limitDarkness: ${paletteOptions.limitDarkness}`);
            logger.info(`limitGrayness: ${paletteOptions.limitGrayness}`);
            logger.info(`limitLightness: ${paletteOptions.limitLightness}`);
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
                logger.error('Cannot reset database in production mode.');
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the database?');
        if (!confirmReset)
            return;
        try {
            IDBManager.getInstance().resetDatabase();
            if (!mode.quiet && logMode.info)
                logger.info('Database has been successfully reset.');
            alert('IndexedDB successfully reset!');
        }
        catch (error) {
            if (logMode.errors)
                logger.error(`Failed to reset database: ${error}`);
            if (mode.showAlerts)
                alert('Failed to reset database.');
        }
    });
    addEventListener(domIDs.resetPaletteIDButton, 'click', async (e) => {
        e.preventDefault();
        if (mode.environment === 'prod') {
            if (!mode.quiet && logMode.errors)
                logger.error('Cannot reset palette ID in production mode.');
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the palette ID?');
        if (!confirmReset)
            return;
        try {
            await idb.resetPaletteID();
            if (!mode.quiet && logMode.info)
                logger.info('Palette ID has been successfully reset.');
            if (mode.showAlerts)
                alert('Palette ID reset successfully!');
        }
        catch (error) {
            if (logMode.errors)
                logger.error(`Failed to reset palette ID: ${error}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RvbS9ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBUS9CLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzdELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztBQUMxRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM3QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFFNUMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRTVDLFNBQVMsZ0JBQWdCLENBQ3hCLEVBQVUsRUFDVixTQUFZLEVBQ1osUUFBOEM7SUFFOUMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNB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QUUsQ0FBQztnQkFDekMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQyxVQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUQsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBYSxFQUFFLEVBQUU7UUFDeEQsSUFBSSxVQUFVLENBQUMsZ0JBQWdCO1lBQzlCLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDOUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3BELFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pFLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQXVCO0lBQ3ZDLGdCQUFnQjtJQUNoQixnQkFBZ0I7SUFDaEIsd0JBQXdCO0NBQ3hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZG9tL2V2ZW50cy9iYXNlLmpzXG5cbmltcG9ydCB7XG5cdERPTUV2ZW50c0ludGVyZmFjZSxcblx0SFNMLFxuXHRJT0Zvcm1hdCxcblx0UGFsZXR0ZU9wdGlvbnNcbn0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSwgc3VwZXJVdGlscywgdXRpbHMgfSBmcm9tICcuLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICcuL3BhcnNlLmpzJztcbmltcG9ydCB7IElEQk1hbmFnZXIgfSBmcm9tICcuLi9kYi9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgbW9kZSB9IGZyb20gJy4uL2RhdGEvbW9kZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBzdGFydCB9IGZyb20gJy4uL3BhbGV0dGUvaW5kZXguanMnO1xuaW1wb3J0IHsgVUlNYW5hZ2VyIH0gZnJvbSAnLi4vdWkvaW5kZXguanMnO1xuXG5jb25zdCBidXR0b25EZWJvdW5jZSA9IGRhdGEuY29uc3RzLmRlYm91bmNlLmJ1dHRvbiB8fCAzMDA7XG5jb25zdCBkb21JRHMgPSBkYXRhLmNvbnN0cy5kb20uaWRzO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcbmNvbnN0IHVpRWxlbWVudHMgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHM7XG5cbmNvbnN0IGlkYiA9IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbmNvbnN0IHVpTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIodWlFbGVtZW50cyk7XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXI8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXA+KFxuXHRpZDogc3RyaW5nLFxuXHRldmVudFR5cGU6IEssXG5cdGNhbGxiYWNrOiAoZXY6IEhUTUxFbGVtZW50RXZlbnRNYXBbS10pID0+IHZvaWRcbik6IHZvaWQge1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG5cdGlmIChlbGVtZW50KSB7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuXHR9IGVsc2UgaWYgKGxvZ01vZGUud2FybmluZ3MpIHtcblx0XHRpZiAobW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLndhcm5pbmdzICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMilcblx0XHRcdGxvZ2dlci53YXJuaW5nKGBFbGVtZW50IHdpdGggaWQgXCIke2lkfVwiIG5vdCBmb3VuZC5gKTtcblx0fVxufVxuXG5jb25zdCBoYW5kbGVQYWxldHRlR2VuID0gY29yZS5iYXNlLmRlYm91bmNlKCgpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYXJhbXMgPSBzdXBlclV0aWxzLmRvbS5nZXRHZW5CdXR0b25BcmdzKCk7XG5cblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIGdlbmVyYXRlQnV0dG9uIHBhcmFtZXRlcnMnKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrbmVzcyxcblx0XHRcdGxpbWl0R3JheW5lc3MsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc1xuXHRcdH0gPSBwYXJhbXM7XG5cblx0XHRpZiAoIXBhbGV0dGVUeXBlIHx8ICFudW1Cb3hlcykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcigncGFsZXR0ZVR5cGUgYW5kL29yIG51bUJveGVzIGFyZSB1bmRlZmluZWQnKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wdGlvbnM6IFBhbGV0dGVPcHRpb25zID0ge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fTtcblxuXHRcdHN0YXJ0LmdlblBhbGV0dGUob3B0aW9ucyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0bG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gaGFuZGxlIGdlbmVyYXRlIGJ1dHRvbiBjbGljazogJHtlcnJvcn1gKTtcblx0fVxufSwgYnV0dG9uRGVib3VuY2UpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG5cdGNvbnN0IGFkZENvbnZlcnNpb25MaXN0ZW5lciA9IChpZDogc3RyaW5nLCBjb2xvclNwYWNlOiBzdHJpbmcpID0+IHtcblx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKGJ1dHRvbikge1xuXHRcdFx0aWYgKGNvcmUuZ3VhcmRzLmlzQ29sb3JTcGFjZShjb2xvclNwYWNlKSkge1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuXHRcdFx0XHRcdHN1cGVyVXRpbHMuZG9tLnN3aXRjaENvbG9yU3BhY2UoY29sb3JTcGFjZSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGxvZ01vZGUud2FybmluZ3MpXG5cdFx0XHRcdGxvZ2dlci53YXJuaW5nKGBFbGVtZW50IHdpdGggaWQgXCIke2lkfVwiIG5vdCBmb3VuZC5gKTtcblx0XHR9XG5cdH07XG5cblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWNteWstYnV0dG9uJywgJ2NteWsnKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWhleC1idXR0b24nLCAnaGV4Jyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1oc2wtYnV0dG9uJywgJ2hzbCcpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtaHN2LWJ1dHRvbicsICdoc3YnKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWxhYi1idXR0b24nLCAnbGFiJyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1yZ2ItYnV0dG9uJywgJ3JnYicpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmFkdmFuY2VkTWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuYWR2YW5jZWRNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuYWR2YW5jZWRNZW51Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmFwcGx5Q3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBjdXN0b21IU0xDb2xvciA9IHVpTWFuYWdlci5hcHBseUN1c3RvbUNvbG9yKCk7XG5cdFx0XHRjb25zdCBjdXN0b21IU0xDb2xvckNsb25lID0gY29yZS5iYXNlLmNsb25lKGN1c3RvbUhTTENvbG9yKTtcblxuXHRcdFx0YXdhaXQgaWRiLnNhdmVEYXRhKFxuXHRcdFx0XHQnY3VzdG9tQ29sb3InLFxuXHRcdFx0XHQnYXBwU2V0dGluZ3MnLFxuXHRcdFx0XHRjdXN0b21IU0xDb2xvckNsb25lXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2dnZXIuaW5mbygnQ3VzdG9tIGNvbG9yIHNhdmVkIHRvIEluZGV4ZWREQicpO1xuXG5cdFx0XHQvLyAqREVWLU5PVEUqIHVuZmluaXNoZWQsIEkgdGhpbms/IERvdWJsZS1jaGVjayB0aGlzXG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmNsZWFyQ3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9ySW5wdXQhLnZhbHVlID0gJyNmZjAwMDAnO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2dnZXIuaW5mbygnQ3VzdG9tIGNvbG9yIGNsZWFyZWQnKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuY3VzdG9tQ29sb3JNZW51QnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnU/LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdH1cblx0KTtcblxuXHRpZiAoIXVpRWxlbWVudHMuY3VzdG9tQ29sb3JJbnB1dClcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0N1c3RvbSBjb2xvciBpbnB1dCBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXG5cdHVpRWxlbWVudHMuY3VzdG9tQ29sb3JJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcblx0XHRpZiAoIXVpRWxlbWVudHMuY3VzdG9tQ29sb3JEaXNwbGF5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDdXN0b20gY29sb3IgZGlzcGxheSBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXG5cdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvckRpc3BsYXkudGV4dENvbnRlbnQgPVxuXHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvcklucHV0IS52YWx1ZTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuZGVsZXRlRGF0YWJhc2VCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBvbmx5IGFsbG93IGlmIGFwcGxpY2F0aW9uIGlzIGluIGRldmVsb3BtZW50IG1vZGVcblx0XHRcdGlmIChtb2RlLmVudmlyb25tZW50ID09PSAncHJvZCcpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUud2FybmluZ3MpIHtcblx0XHRcdFx0XHRsb2dnZXIud2FybmluZyhcblx0XHRcdFx0XHRcdCdDYW5ub3QgZGVsZXRlIGRhdGFiYXNlIGluIHByb2R1Y3Rpb24gbW9kZS4nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY29uZmlybURlbGV0ZSA9IGNvbmZpcm0oXG5cdFx0XHRcdCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZSBlbnRpcmUgZGF0YWJhc2U/IFRoaXMgYWN0aW9uIGNhbm5vdCBiZSB1bmRvbmUuJ1xuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFjb25maXJtRGVsZXRlKSByZXR1cm47XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5kZWxldGVEYXRhYmFzZSgpO1xuXG5cdFx0XHRcdGFsZXJ0KCdEYXRhYmFzZSBkZWxldGVkIHN1Y2Nlc3NmdWxseSEnKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBkZWxldGUgZGF0YWJhc2U6ICR7ZXJyb3J9YCk7XG5cblx0XHRcdFx0YWxlcnQoJ0ZhaWxlZCB0byBkZWxldGUgZGF0YWJhc2UuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmRlc2F0dXJhdGVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBzZWxlY3RlZENvbG9yID0gdWlFbGVtZW50cy5zZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0XHRcdD8gcGFyc2VJbnQodWlFbGVtZW50cy5zZWxlY3RlZENvbG9yT3B0aW9uLnZhbHVlLCAxMClcblx0XHRcdFx0OiAwO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5jbGlja3MpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKCdkZXNhdHVyYXRlQnV0dG9uIGNsaWNrZWQnKTtcblxuXHRcdFx0dWlNYW5hZ2VyLmRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuZGV2ZWxvcGVyTWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmIChtb2RlLmVudmlyb25tZW50ID09PSAncHJvZCcpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgYWNjZXNzIGRldmVsb3BlciBtZW51IGluIHByb2R1Y3Rpb24gbW9kZS4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVpRWxlbWVudHMuZGV2ZWxvcGVyTWVudT8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHR1aUVsZW1lbnRzLmRldmVsb3Blck1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuZXhwb3J0UGFsZXR0ZUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0IGZvcm1hdCA9IHBhcnNlLnBhbGV0dGVFeHBvcnRGb3JtYXQoKSBhcyBJT0Zvcm1hdDtcblxuXHRcdFx0aWYgKG1vZGUuZGVidWcgJiYgbG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEV4cG9ydCBQYWxldHRlIEJ1dHRvbiBjbGljayBldmVudDogRXhwb3J0IGZvcm1hdCBzZWxlY3RlZDogJHtmb3JtYXR9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHR1aU1hbmFnZXIuaGFuZGxlRXhwb3J0KGZvcm1hdCk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoZG9tSURzLmdlbmVyYXRlQnV0dG9uLCAnY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdC8vIGNhcHR1cmVzIGRhdGEgZnJvbSBVSSBhdCB0aGUgdGltZSB0aGUgR2VuZXJhdGUgQnV0dG9uIGlzIGNsaWNrZWRcblx0XHRjb25zdCB7XG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fSA9IHVpTWFuYWdlci5wdWxsUGFyYW1zRnJvbVVJKCk7XG5cblx0XHRpZiAobG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHQnR2VuZXJhdGUgQnV0dG9uIGNsaWNrIGV2ZW50OiBSZXRyaWV2ZWQgcGFyYW1ldGVycyBmcm9tIFVJLidcblx0XHRcdCk7XG5cblx0XHRsZXQgY3VzdG9tQ29sb3IgPSAoYXdhaXQgaWRiLmdldEN1c3RvbUNvbG9yKCkpIGFzIEhTTCB8IG51bGw7XG5cblx0XHRpZiAoIWN1c3RvbUNvbG9yKSB7XG5cdFx0XHRjdXN0b21Db2xvciA9IHV0aWxzLnJhbmRvbS5oc2wodHJ1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFVzZXItZ2VuZXJhdGVkIEN1c3RvbSBDb2xvciBmb3VuZCBpbiBJbmRleGVkREI6ICR7SlNPTi5zdHJpbmdpZnkoXG5cdFx0XHRcdFx0XHRjdXN0b21Db2xvclxuXHRcdFx0XHRcdCl9YFxuXHRcdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHBhbGV0dGVPcHRpb25zOiBQYWxldHRlT3B0aW9ucyA9IHtcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcjogY29yZS5iYXNlLmNsb25lKGN1c3RvbUNvbG9yKSxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrbmVzcyxcblx0XHRcdGxpbWl0R3JheW5lc3MsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc1xuXHRcdH07XG5cblx0XHRpZiAobW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLmluZm8pIHtcblx0XHRcdGxvZ2dlci5pbmZvKGBwYWxldHRlT3B0aW9ucyBvYmplY3QgZGF0YTpgKTtcblx0XHRcdGxvZ2dlci5pbmZvKGBwYWxldHRlVHlwZTogJHtwYWxldHRlT3B0aW9ucy5wYWxldHRlVHlwZX1gKTtcblx0XHRcdGxvZ2dlci5pbmZvKGBudW1Cb3hlczogJHtwYWxldHRlT3B0aW9ucy5udW1Cb3hlc31gKTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgY3VzdG9tQ29sb3I6ICR7SlNPTi5zdHJpbmdpZnkocGFsZXR0ZU9wdGlvbnMuY3VzdG9tQ29sb3IpfWBcblx0XHRcdCk7XG5cdFx0XHRsb2dnZXIuaW5mbyhgZW5hYmxlQWxwaGE6ICR7cGFsZXR0ZU9wdGlvbnMuZW5hYmxlQWxwaGF9YCk7XG5cdFx0XHRsb2dnZXIuaW5mbyhgbGltaXREYXJrbmVzczogJHtwYWxldHRlT3B0aW9ucy5saW1pdERhcmtuZXNzfWApO1xuXHRcdFx0bG9nZ2VyLmluZm8oYGxpbWl0R3JheW5lc3M6ICR7cGFsZXR0ZU9wdGlvbnMubGltaXRHcmF5bmVzc31gKTtcblx0XHRcdGxvZ2dlci5pbmZvKGBsaW1pdExpZ2h0bmVzczogJHtwYWxldHRlT3B0aW9ucy5saW1pdExpZ2h0bmVzc31gKTtcblx0XHR9XG5cblx0XHRhd2FpdCBzdGFydC5nZW5QYWxldHRlKHBhbGV0dGVPcHRpb25zKTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihkb21JRHMuaGVscE1lbnVCdXR0b24sICdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dWlFbGVtZW50cy5oZWxwTWVudT8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0dWlFbGVtZW50cy5oZWxwTWVudT8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5oaXN0b3J5TWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuaGlzdG9yeU1lbnU/LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0dWlFbGVtZW50cy5oaXN0b3J5TWVudT8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5pbXBvcnRFeHBvcnRNZW51QnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dWlFbGVtZW50cy5pbXBvcnRFeHBvcnRNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuaW1wb3J0RXhwb3J0TWVudT8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKGRvbUlEcy5pbXBvcnRQYWxldHRlSW5wdXQsICdjaGFuZ2UnLCBhc3luYyAoZTogRXZlbnQpID0+IHtcblx0XHRjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cblx0XHRpZiAoaW5wdXQuZmlsZXMgJiYgaW5wdXQuZmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgZmlsZSA9IGlucHV0LmZpbGVzWzBdO1xuXG5cdFx0XHQvLyAqREVWLU5PVEUqIGltcGxlbWVudCBhIHdheSB0byBkZXRlcm1pbmUgd2hldGhlciBmaWxlIGRlc2NyaWJlcyBDU1MsIEpTT04sIG9yIFhNTCBpbXBvcnRcblx0XHRcdGNvbnN0IGZvcm1hdCA9ICdKU09OJztcblxuXHRcdFx0YXdhaXQgdWlNYW5hZ2VyLmhhbmRsZUltcG9ydChmaWxlLCBmb3JtYXQpO1xuXHRcdH1cblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMucmVzZXREYXRhYmFzZUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmIChtb2RlLmVudmlyb25tZW50ID09PSAncHJvZCcpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcignQ2Fubm90IHJlc2V0IGRhdGFiYXNlIGluIHByb2R1Y3Rpb24gbW9kZS4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNvbmZpcm1SZXNldCA9IGNvbmZpcm0oXG5cdFx0XHRcdCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVzZXQgdGhlIGRhdGFiYXNlPydcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybVJlc2V0KSByZXR1cm47XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5yZXNldERhdGFiYXNlKCk7XG5cblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbylcblx0XHRcdFx0XHRsb2dnZXIuaW5mbygnRGF0YWJhc2UgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHJlc2V0LicpO1xuXG5cdFx0XHRcdGFsZXJ0KCdJbmRleGVkREIgc3VjY2Vzc2Z1bGx5IHJlc2V0IScpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIHJlc2V0IGRhdGFiYXNlOiAke2Vycm9yfWApO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpIGFsZXJ0KCdGYWlsZWQgdG8gcmVzZXQgZGF0YWJhc2UuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLnJlc2V0UGFsZXR0ZUlEQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKG1vZGUuZW52aXJvbm1lbnQgPT09ICdwcm9kJykge1xuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKCdDYW5ub3QgcmVzZXQgcGFsZXR0ZSBJRCBpbiBwcm9kdWN0aW9uIG1vZGUuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb25maXJtUmVzZXQgPSBjb25maXJtKFxuXHRcdFx0XHQnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlc2V0IHRoZSBwYWxldHRlIElEPydcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybVJlc2V0KSByZXR1cm47XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IGlkYi5yZXNldFBhbGV0dGVJRCgpO1xuXG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdFx0bG9nZ2VyLmluZm8oJ1BhbGV0dGUgSUQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHJlc2V0LicpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpIGFsZXJ0KCdQYWxldHRlIElEIHJlc2V0IHN1Y2Nlc3NmdWxseSEnKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byByZXNldCBwYWxldHRlIElEOiAke2Vycm9yfWApO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpIGFsZXJ0KCdGYWlsZWQgdG8gcmVzZXQgcGFsZXR0ZSBJRC4nKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihkb21JRHMuc2F0dXJhdGVCdXR0b24sICdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHVpRWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvblxuXHRcdFx0PyBwYXJzZUludCh1aUVsZW1lbnRzLnNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0dWlNYW5hZ2VyLnNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuYWR2YW5jZWRNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmFkdmFuY2VkTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmFkdmFuY2VkTWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5hZHZhbmNlZE1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuY3VzdG9tQ29sb3JNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmN1c3RvbUNvbG9yTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmN1c3RvbUNvbG9yTWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5jdXN0b21Db2xvck1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuZGV2ZWxvcGVyTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5kZXZlbG9wZXJNZW51KSB7XG5cdFx0XHRcdHVpRWxlbWVudHMuZGV2ZWxvcGVyTWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5kZXZlbG9wZXJNZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmhlbHBNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmhlbHBNZW51KSB7XG5cdFx0XHRcdHVpRWxlbWVudHMuaGVscE1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuaGVscE1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuaGlzdG9yeU1lbnUpXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IHVpRWxlbWVudHMuaGlzdG9yeU1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5oaXN0b3J5TWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5oaXN0b3J5TWVudS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblx0XHRcdH1cblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRpZiAodWlFbGVtZW50cy5pbXBvcnRFeHBvcnRNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmltcG9ydEV4cG9ydE1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5pbXBvcnRFeHBvcnRNZW51LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0XHR1aUVsZW1lbnRzLmltcG9ydEV4cG9ydE1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgY29uc3QgYmFzZTogRE9NRXZlbnRzSW50ZXJmYWNlID0ge1xuXHRhZGRFdmVudExpc3RlbmVyLFxuXHRoYW5kbGVQYWxldHRlR2VuLFxuXHRpbml0aWFsaXplRXZlbnRMaXN0ZW5lcnNcbn07XG4iXX0=