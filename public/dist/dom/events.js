// File: src/dom/events/base.js
import { core, superUtils, utils } from '../common/index.js';
import { consts, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';
import { parse } from './parse.js';
import { IDBManager } from '../db/index.js';
import { start } from '../palette/index.js';
import { UIManager } from '../ui/index.js';
const logger = await createLogger();
const buttonDebounce = consts.debounce.button || 300;
const domIDs = consts.dom.ids;
const logMode = mode.logging;
const uiElements = consts.dom.elements;
const idb = await IDBManager.getInstance();
const uiManager = new UIManager(uiElements);
function addEventListener(id, eventType, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(eventType, callback);
    }
    else if (logMode.warn) {
        if (mode.debug && logMode.warn && logMode.verbosity > 2)
            logger.warn(`Element with id "${id}" not found.`, 'dom > events > addEventListener()');
    }
}
const handlePaletteGen = core.base.debounce(() => {
    try {
        const params = superUtils.dom.getGenButtonArgs();
        if (!params) {
            if (logMode.error) {
                logger.error('Failed to retrieve generateButton parameters', 'dom > events > handlePaletteGen()');
            }
            return;
        }
        const { swatches, customColor, type, enableAlpha, limitDarkness, limitGrayness, limitLightness } = params;
        if (!type || !swatches) {
            if (logMode.error) {
                logger.error('paletteType and/or swatches are undefined', 'dom > events > handlePaletteGen()');
            }
            return;
        }
        const options = {
            customColor,
            flags: {
                enableAlpha,
                limitDarkness,
                limitGrayness,
                limitLightness
            },
            swatches,
            type
        };
        start.genPalette(options);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Failed to handle generate button click: ${error}`, 'dom > events > handlePaletteGen()');
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
            if (logMode.warn)
                logger.warn(`Element with id "${id}" not found.`, 'dom > events > initializeEventListeners()');
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
        uiElements.divs.advancedMenu?.classList.remove('hidden');
        uiElements.divs.advancedMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.applyCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        const customHSLColor = uiManager.applyCustomColor();
        const customHSLColorClone = core.base.clone(customHSLColor);
        await idb.saveData('customColor', 'appSettings', customHSLColorClone);
        if (!mode.quiet && logMode.info)
            logger.info('Custom color saved to IndexedDB', 'dom > events > applyCustomColorButton click event');
        // *DEV-NOTE* unfinished, I think? Double-check this
    });
    addEventListener(domIDs.clearCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.inputs.customColorInput.value = '#ff0000';
        if (!mode.quiet && logMode.info)
            logger.info('Custom color cleared', 'dom > events > clearCustomColorButton click event');
    });
    addEventListener(domIDs.customColorMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.customColorMenu?.classList.add('hidden');
        uiElements.divs.customColorMenu?.setAttribute('aria-hidden', 'true');
    });
    if (!uiElements.inputs.customColorInput)
        throw new Error('Custom color input element not found');
    uiElements.inputs.customColorInput.addEventListener('input', () => {
        if (!uiElements.spans.customColorDisplay)
            throw new Error('Custom color display element not found');
        uiElements.spans.customColorDisplay.textContent =
            uiElements.inputs.customColorInput.value;
    });
    addEventListener(domIDs.deleteDatabaseButton, 'click', async (e) => {
        e.preventDefault();
        // only allow if application is in development mode
        if (String(mode.environment) === 'prod') {
            if (logMode.warn) {
                logger.warn('Cannot delete database in production mode.', 'dom > events > deleteDatabaseButton click event');
            }
            return;
        }
        const confirmDelete = confirm('Are you sure you want to delete the entire database? This action cannot be undone.');
        if (!confirmDelete)
            return;
        try {
            const idbManager = await IDBManager.getInstance();
            await idbManager.deleteDatabase();
            if (mode.showAlerts)
                alert('Database deleted successfully!');
            if (logMode.info)
                logger.info('Database deleted successfully.', 'dom > events > deleteDatabaseButton click event');
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to delete database: ${error}`, `common > utils > random > hsl()`);
            if (mode.showAlerts)
                alert('Failed to delete database.');
        }
    });
    addEventListener(domIDs.desaturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.select.selectedColorOption
            ? parseInt(uiElements.select.selectedColorOption.value, 10)
            : 0;
        if (!mode.quiet && logMode.clicks)
            logger.info('desaturateButton clicked', 'dom > events > desaturateButton click event');
        uiManager.desaturateColor(selectedColor);
    });
    addEventListener(domIDs.developerMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (String(mode.environment) === 'prod') {
            if (!mode.quiet && logMode.error)
                logger.error('Cannot access developer menu in production mode.', 'dom > events > developerMenuButton click event');
            return;
        }
        uiElements.divs.developerMenu?.classList.remove('hidden');
        uiElements.divs.developerMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.exportPaletteButton, 'click', async (e) => {
        e.preventDefault();
        const format = parse.paletteExportFormat();
        if (mode.debug && logMode.info && logMode.verbosity > 1)
            logger.info(`Export Palette Button click event: Export format selected: ${format}`, 'dom > events > exportPaletteButton click event');
        if (!format) {
            if (logMode.error && !mode.quiet && logMode.verbosity > 1) {
                logger.error('Export format not selected', 'dom > events > exportPaletteButton click event');
                return;
            }
        }
        else {
            uiManager.handleExport(format);
        }
    });
    addEventListener(domIDs.generateButton, 'click', async (e) => {
        e.preventDefault();
        // captures data from UI at the time the Generate Button is clicked
        const { type, swatches, enableAlpha, limitDarkness, limitGrayness, limitLightness } = uiManager.pullParamsFromUI();
        if (logMode.info && logMode.verbosity > 1)
            logger.info('Generate Button click event: Retrieved parameters from UI.', 'dom > events > generateButton click event');
        let customColor = (await idb.getCustomColor());
        if (!customColor) {
            customColor = utils.random.hsl(true);
        }
        else {
            if (mode.debug && logMode.info)
                logger.info(`User-generated Custom Color found in IndexedDB: ${JSON.stringify(customColor)}`, 'dom > events > generateButton click event');
        }
        const paletteOptions = {
            customColor: core.base.clone(customColor),
            flags: {
                enableAlpha,
                limitDarkness,
                limitGrayness,
                limitLightness
            },
            swatches,
            type
        };
        if (mode.debug && logMode.info) {
            logger.info(`paletteOptions object data:`, 'dom > events > generateButton click event');
            logger.info(`paletteType: ${paletteOptions.type}`, 'dom > events > generateButton click event');
            logger.info(`swatches: ${paletteOptions.swatches}`, 'dom > events > generateButton click event');
            logger.info(`customColor: ${JSON.stringify(paletteOptions.customColor)}`, 'dom > events > generateButton click event');
            logger.info(`enableAlpha: ${paletteOptions.flags.enableAlpha}`, 'dom > events > generateButton click event');
            logger.info(`limitDarkness: ${paletteOptions.flags.limitDarkness}`, 'dom > events > generateButton click event');
            logger.info(`limitGrayness: ${paletteOptions.flags.limitGrayness}`, 'dom > events > generateButton click event');
            logger.info(`limitLightness: ${paletteOptions.flags.limitLightness}`, 'dom > events > generateButton click event');
        }
        await start.genPalette(paletteOptions);
    });
    addEventListener(domIDs.helpMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.helpMenu?.classList.remove('hidden');
        uiElements.divs.helpMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.historyMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.historyMenu?.classList.remove('hidden');
        uiElements.divs.historyMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.importExportMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.importExportMenu?.classList.remove('hidden');
        uiElements.divs.importExportMenu?.setAttribute('aria-hidden', 'false');
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
        if (String(mode.environment) === 'prod') {
            if (!mode.quiet && logMode.error)
                logger.error('Cannot reset database in production mode.', 'dom > events > resetDatabaseButton click event');
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the database?');
        if (!confirmReset)
            return;
        try {
            const idbManager = await IDBManager.getInstance();
            idbManager.resetDatabase();
            if (!mode.quiet && logMode.info)
                logger.info('Database has been successfully reset.', 'dom > events > resetDatabaseButton click event');
            if (mode.showAlerts)
                alert('IndexedDB successfully reset!');
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to reset database: ${error}`, 'dom > events > resetDatabaseButton click event');
            if (mode.showAlerts)
                alert('Failed to reset database.');
        }
    });
    addEventListener(domIDs.resetPaletteIDButton, 'click', async (e) => {
        e.preventDefault();
        if (String(mode.environment) === 'prod') {
            if (!mode.quiet && logMode.error)
                logger.error('Cannot reset palette ID in production mode.', 'dom > events > resetPaletteIDButton click event');
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the palette ID?');
        if (!confirmReset)
            return;
        try {
            await idb.resetPaletteID();
            if (!mode.quiet && logMode.info)
                logger.info('Palette ID has been successfully reset.', 'dom > events > resetPaletteIDButton click event');
            if (mode.showAlerts)
                alert('Palette ID reset successfully!');
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to reset palette ID: ${error}`);
            if (mode.showAlerts)
                alert('Failed to reset palette ID.');
        }
    });
    addEventListener(domIDs.saturateButton, 'click', async (e) => {
        e.preventDefault();
        if (!uiElements.select.selectedColorOption) {
            throw new Error('Selected color option not found');
        }
        const selectedColor = uiElements.inputs.selectedColorOption
            ? parseInt(uiElements.select.selectedColorOption.value, 10)
            : 0;
        uiManager.saturateColor(selectedColor);
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.divs.advancedMenu)
            if (e.target === uiElements.divs.advancedMenu) {
                uiElements.divs.advancedMenu.classList.add('hidden');
                uiElements.divs.advancedMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.divs.customColorMenu)
            if (e.target === uiElements.divs.customColorMenu) {
                uiElements.divs.customColorMenu.classList.add('hidden');
                uiElements.divs.customColorMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.divs.developerMenu)
            if (e.target === uiElements.divs.developerMenu) {
                uiElements.divs.developerMenu.classList.add('hidden');
                uiElements.divs.developerMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.divs.helpMenu)
            if (e.target === uiElements.divs.helpMenu) {
                uiElements.divs.helpMenu.classList.add('hidden');
                uiElements.divs.helpMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.divs.historyMenu)
            if (e.target === uiElements.divs.historyMenu) {
                uiElements.divs.historyMenu.classList.add('hidden');
                uiElements.divs.historyMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.divs.importExportMenu)
            if (e.target === uiElements.divs.importExportMenu) {
                uiElements.divs.importExportMenu.classList.add('hidden');
                uiElements.divs.importExportMenu.setAttribute('aria-hidden', 'true');
            }
    });
}
export const base = {
    addEventListener,
    handlePaletteGen,
    initializeEventListeners
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RvbS9ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBTy9CLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzdELE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7QUFDckQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM3QixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUV2QyxNQUFNLEdBQUcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMzQyxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUU1QyxTQUFTLGdCQUFnQixDQUN4QixFQUFVLEVBQ1YsU0FBWSxFQUNaLFFBQThDO0lBRTlDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFD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QkFDbkQsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6RCxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FDNUMsYUFBYSxFQUNiLE1BQU0sQ0FDTixDQUFDO1lBQ0gsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBMkM7SUFDM0QsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQix3QkFBd0I7Q0FDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9kb20vZXZlbnRzL2Jhc2UuanNcblxuaW1wb3J0IHtcblx0RE9NX0Z1bmN0aW9uc01hc3RlckludGVyZmFjZSxcblx0SFNMLFxuXHRQYWxldHRlT3B0aW9uc1xufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlLCBzdXBlclV0aWxzLCB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25zdHMsIG1vZGUgfSBmcm9tICcuLi9jb21tb24vZGF0YS9iYXNlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJy4vcGFyc2UuanMnO1xuaW1wb3J0IHsgSURCTWFuYWdlciB9IGZyb20gJy4uL2RiL2luZGV4LmpzJztcbmltcG9ydCB7IHN0YXJ0IH0gZnJvbSAnLi4vcGFsZXR0ZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBVSU1hbmFnZXIgfSBmcm9tICcuLi91aS9pbmRleC5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5jb25zdCBidXR0b25EZWJvdW5jZSA9IGNvbnN0cy5kZWJvdW5jZS5idXR0b24gfHwgMzAwO1xuY29uc3QgZG9tSURzID0gY29uc3RzLmRvbS5pZHM7XG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuY29uc3QgdWlFbGVtZW50cyA9IGNvbnN0cy5kb20uZWxlbWVudHM7XG5cbmNvbnN0IGlkYiA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbmNvbnN0IHVpTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIodWlFbGVtZW50cyk7XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXI8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXA+KFxuXHRpZDogc3RyaW5nLFxuXHRldmVudFR5cGU6IEssXG5cdGNhbGxiYWNrOiAoZXY6IEhUTUxFbGVtZW50RXZlbnRNYXBbS10pID0+IHZvaWRcbik6IHZvaWQge1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG5cdGlmIChlbGVtZW50KSB7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuXHR9IGVsc2UgaWYgKGxvZ01vZGUud2Fybikge1xuXHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUud2FybiAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDIpXG5cdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0YEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmAsXG5cdFx0XHRcdCdkb20gPiBldmVudHMgPiBhZGRFdmVudExpc3RlbmVyKCknXG5cdFx0XHQpO1xuXHR9XG59XG5cbmNvbnN0IGhhbmRsZVBhbGV0dGVHZW4gPSBjb3JlLmJhc2UuZGVib3VuY2UoKCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IHN1cGVyVXRpbHMuZG9tLmdldEdlbkJ1dHRvbkFyZ3MoKTtcblxuXHRcdGlmICghcGFyYW1zKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0J0ZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzJyxcblx0XHRcdFx0XHQnZG9tID4gZXZlbnRzID4gaGFuZGxlUGFsZXR0ZUdlbigpJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0c3dhdGNoZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHR5cGUsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9ID0gcGFyYW1zO1xuXG5cdFx0aWYgKCF0eXBlIHx8ICFzd2F0Y2hlcykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdCdwYWxldHRlVHlwZSBhbmQvb3Igc3dhdGNoZXMgYXJlIHVuZGVmaW5lZCcsXG5cdFx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGhhbmRsZVBhbGV0dGVHZW4oKSdcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wdGlvbnM6IFBhbGV0dGVPcHRpb25zID0ge1xuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRmbGFnczoge1xuXHRcdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdFx0bGltaXREYXJrbmVzcyxcblx0XHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHRcdH0sXG5cdFx0XHRzd2F0Y2hlcyxcblx0XHRcdHR5cGVcblx0XHR9O1xuXG5cdFx0c3RhcnQuZ2VuUGFsZXR0ZShvcHRpb25zKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBoYW5kbGUgZ2VuZXJhdGUgYnV0dG9uIGNsaWNrOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdkb20gPiBldmVudHMgPiBoYW5kbGVQYWxldHRlR2VuKCknXG5cdFx0XHQpO1xuXHR9XG59LCBidXR0b25EZWJvdW5jZSk7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVFdmVudExpc3RlbmVycygpOiB2b2lkIHtcblx0Y29uc3QgYWRkQ29udmVyc2lvbkxpc3RlbmVyID0gKGlkOiBzdHJpbmcsIGNvbG9yU3BhY2U6IHN0cmluZykgPT4ge1xuXHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoYnV0dG9uKSB7XG5cdFx0XHRpZiAoY29yZS5ndWFyZHMuaXNDb2xvclNwYWNlKGNvbG9yU3BhY2UpKSB7XG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG5cdFx0XHRcdFx0c3VwZXJVdGlscy5kb20uc3dpdGNoQ29sb3JTcGFjZShjb2xvclNwYWNlKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobG9nTW9kZS53YXJuKVxuXHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRgRWxlbWVudCB3aXRoIGlkIFwiJHtpZH1cIiBub3QgZm91bmQuYCxcblx0XHRcdFx0XHQnZG9tID4gZXZlbnRzID4gaW5pdGlhbGl6ZUV2ZW50TGlzdGVuZXJzKCknXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9O1xuXG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1jbXlrLWJ1dHRvbicsICdjbXlrJyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1oZXgtYnV0dG9uJywgJ2hleCcpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtaHNsLWJ1dHRvbicsICdoc2wnKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWhzdi1idXR0b24nLCAnaHN2Jyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1sYWItYnV0dG9uJywgJ2xhYicpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtcmdiLWJ1dHRvbicsICdyZ2InKTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5hZHZhbmNlZE1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR1aUVsZW1lbnRzLmRpdnMuYWR2YW5jZWRNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuZGl2cy5hZHZhbmNlZE1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuYXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbUhTTENvbG9yID0gdWlNYW5hZ2VyLmFwcGx5Q3VzdG9tQ29sb3IoKTtcblx0XHRcdGNvbnN0IGN1c3RvbUhTTENvbG9yQ2xvbmUgPSBjb3JlLmJhc2UuY2xvbmUoY3VzdG9tSFNMQ29sb3IpO1xuXG5cdFx0XHRhd2FpdCBpZGIuc2F2ZURhdGEoXG5cdFx0XHRcdCdjdXN0b21Db2xvcicsXG5cdFx0XHRcdCdhcHBTZXR0aW5ncycsXG5cdFx0XHRcdGN1c3RvbUhTTENvbG9yQ2xvbmVcblx0XHRcdCk7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdCdDdXN0b20gY29sb3Igc2F2ZWQgdG8gSW5kZXhlZERCJyxcblx0XHRcdFx0XHQnZG9tID4gZXZlbnRzID4gYXBwbHlDdXN0b21Db2xvckJ1dHRvbiBjbGljayBldmVudCdcblx0XHRcdFx0KTtcblxuXHRcdFx0Ly8gKkRFVi1OT1RFKiB1bmZpbmlzaGVkLCBJIHRoaW5rPyBEb3VibGUtY2hlY2sgdGhpc1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5jbGVhckN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dWlFbGVtZW50cy5pbnB1dHMuY3VzdG9tQ29sb3JJbnB1dCEudmFsdWUgPSAnI2ZmMDAwMCc7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdCdDdXN0b20gY29sb3IgY2xlYXJlZCcsXG5cdFx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmN1c3RvbUNvbG9yTWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuZGl2cy5jdXN0b21Db2xvck1lbnU/LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0dWlFbGVtZW50cy5kaXZzLmN1c3RvbUNvbG9yTWVudT8uc2V0QXR0cmlidXRlKFxuXHRcdFx0XHQnYXJpYS1oaWRkZW4nLFxuXHRcdFx0XHQndHJ1ZSdcblx0XHRcdCk7XG5cdFx0fVxuXHQpO1xuXG5cdGlmICghdWlFbGVtZW50cy5pbnB1dHMuY3VzdG9tQ29sb3JJbnB1dClcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0N1c3RvbSBjb2xvciBpbnB1dCBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXG5cdHVpRWxlbWVudHMuaW5wdXRzLmN1c3RvbUNvbG9ySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG5cdFx0aWYgKCF1aUVsZW1lbnRzLnNwYW5zLmN1c3RvbUNvbG9yRGlzcGxheSlcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ3VzdG9tIGNvbG9yIGRpc3BsYXkgZWxlbWVudCBub3QgZm91bmQnKTtcblxuXHRcdHVpRWxlbWVudHMuc3BhbnMuY3VzdG9tQ29sb3JEaXNwbGF5LnRleHRDb250ZW50ID1cblx0XHRcdHVpRWxlbWVudHMuaW5wdXRzLmN1c3RvbUNvbG9ySW5wdXQhLnZhbHVlO1xuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5kZWxldGVEYXRhYmFzZUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIG9ubHkgYWxsb3cgaWYgYXBwbGljYXRpb24gaXMgaW4gZGV2ZWxvcG1lbnQgbW9kZVxuXHRcdFx0aWYgKFN0cmluZyhtb2RlLmVudmlyb25tZW50KSA9PT0gJ3Byb2QnKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLndhcm4pIHtcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdCdDYW5ub3QgZGVsZXRlIGRhdGFiYXNlIGluIHByb2R1Y3Rpb24gbW9kZS4nLFxuXHRcdFx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGRlbGV0ZURhdGFiYXNlQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNvbmZpcm1EZWxldGUgPSBjb25maXJtKFxuXHRcdFx0XHQnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGUgZW50aXJlIGRhdGFiYXNlPyBUaGlzIGFjdGlvbiBjYW5ub3QgYmUgdW5kb25lLidcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybURlbGV0ZSkgcmV0dXJuO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBpZGJNYW5hZ2VyID0gYXdhaXQgSURCTWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXHRcdFx0XHRhd2FpdCBpZGJNYW5hZ2VyLmRlbGV0ZURhdGFiYXNlKCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cykgYWxlcnQoJ0RhdGFiYXNlIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdFx0XHRpZiAobG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdFx0J0RhdGFiYXNlIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5LicsXG5cdFx0XHRcdFx0XHQnZG9tID4gZXZlbnRzID4gZGVsZXRlRGF0YWJhc2VCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHRcdFx0KTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVsZXRlIGRhdGFiYXNlOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0XHRgY29tbW9uID4gdXRpbHMgPiByYW5kb20gPiBoc2woKWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpIGFsZXJ0KCdGYWlsZWQgdG8gZGVsZXRlIGRhdGFiYXNlLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5kZXNhdHVyYXRlQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHVpRWxlbWVudHMuc2VsZWN0LnNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHRcdFx0PyBwYXJzZUludCh1aUVsZW1lbnRzLnNlbGVjdC5zZWxlY3RlZENvbG9yT3B0aW9uLnZhbHVlLCAxMClcblx0XHRcdFx0OiAwO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5jbGlja3MpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdCdkZXNhdHVyYXRlQnV0dG9uIGNsaWNrZWQnLFxuXHRcdFx0XHRcdCdkb20gPiBldmVudHMgPiBkZXNhdHVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0XHQpO1xuXG5cdFx0XHR1aU1hbmFnZXIuZGVzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5kZXZlbG9wZXJNZW51QnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKFN0cmluZyhtb2RlLmVudmlyb25tZW50KSA9PT0gJ3Byb2QnKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgYWNjZXNzIGRldmVsb3BlciBtZW51IGluIHByb2R1Y3Rpb24gbW9kZS4nLFxuXHRcdFx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGRldmVsb3Blck1lbnVCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVpRWxlbWVudHMuZGl2cy5kZXZlbG9wZXJNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuZGl2cy5kZXZlbG9wZXJNZW51Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0ZG9tSURzLmV4cG9ydFBhbGV0dGVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgPSBwYXJzZS5wYWxldHRlRXhwb3J0Rm9ybWF0KCk7XG5cblx0XHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBFeHBvcnQgUGFsZXR0ZSBCdXR0b24gY2xpY2sgZXZlbnQ6IEV4cG9ydCBmb3JtYXQgc2VsZWN0ZWQ6ICR7Zm9ybWF0fWAsXG5cdFx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGV4cG9ydFBhbGV0dGVCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHRcdCk7XG5cblx0XHRcdGlmICghZm9ybWF0KSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yICYmICFtb2RlLnF1aWV0ICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdFeHBvcnQgZm9ybWF0IG5vdCBzZWxlY3RlZCcsXG5cdFx0XHRcdFx0XHQnZG9tID4gZXZlbnRzID4gZXhwb3J0UGFsZXR0ZUJ1dHRvbiBjbGljayBldmVudCdcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1aU1hbmFnZXIuaGFuZGxlRXhwb3J0KGZvcm1hdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoZG9tSURzLmdlbmVyYXRlQnV0dG9uLCAnY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdC8vIGNhcHR1cmVzIGRhdGEgZnJvbSBVSSBhdCB0aGUgdGltZSB0aGUgR2VuZXJhdGUgQnV0dG9uIGlzIGNsaWNrZWRcblx0XHRjb25zdCB7XG5cdFx0XHR0eXBlLFxuXHRcdFx0c3dhdGNoZXMsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9ID0gdWlNYW5hZ2VyLnB1bGxQYXJhbXNGcm9tVUkoKTtcblxuXHRcdGlmIChsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKVxuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdCdHZW5lcmF0ZSBCdXR0b24gY2xpY2sgZXZlbnQ6IFJldHJpZXZlZCBwYXJhbWV0ZXJzIGZyb20gVUkuJyxcblx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0KTtcblxuXHRcdGxldCBjdXN0b21Db2xvciA9IChhd2FpdCBpZGIuZ2V0Q3VzdG9tQ29sb3IoKSkgYXMgSFNMIHwgbnVsbDtcblxuXHRcdGlmICghY3VzdG9tQ29sb3IpIHtcblx0XHRcdGN1c3RvbUNvbG9yID0gdXRpbHMucmFuZG9tLmhzbCh0cnVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKG1vZGUuZGVidWcgJiYgbG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgVXNlci1nZW5lcmF0ZWQgQ3VzdG9tIENvbG9yIGZvdW5kIGluIEluZGV4ZWREQjogJHtKU09OLnN0cmluZ2lmeShcblx0XHRcdFx0XHRcdGN1c3RvbUNvbG9yXG5cdFx0XHRcdFx0KX1gLFxuXHRcdFx0XHRcdCdkb20gPiBldmVudHMgPiBnZW5lcmF0ZUJ1dHRvbiBjbGljayBldmVudCdcblx0XHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCBwYWxldHRlT3B0aW9uczogUGFsZXR0ZU9wdGlvbnMgPSB7XG5cdFx0XHRjdXN0b21Db2xvcjogY29yZS5iYXNlLmNsb25lKGN1c3RvbUNvbG9yKSxcblx0XHRcdGZsYWdzOiB7XG5cdFx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0XHRsaW1pdExpZ2h0bmVzc1xuXHRcdFx0fSxcblx0XHRcdHN3YXRjaGVzLFxuXHRcdFx0dHlwZVxuXHRcdH07XG5cblx0XHRpZiAobW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLmluZm8pIHtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgcGFsZXR0ZU9wdGlvbnMgb2JqZWN0IGRhdGE6YCxcblx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0KTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgcGFsZXR0ZVR5cGU6ICR7cGFsZXR0ZU9wdGlvbnMudHlwZX1gLFxuXHRcdFx0XHQnZG9tID4gZXZlbnRzID4gZ2VuZXJhdGVCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHQpO1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBzd2F0Y2hlczogJHtwYWxldHRlT3B0aW9ucy5zd2F0Y2hlc31gLFxuXHRcdFx0XHQnZG9tID4gZXZlbnRzID4gZ2VuZXJhdGVCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHQpO1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBjdXN0b21Db2xvcjogJHtKU09OLnN0cmluZ2lmeShwYWxldHRlT3B0aW9ucy5jdXN0b21Db2xvcil9YCxcblx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0KTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgZW5hYmxlQWxwaGE6ICR7cGFsZXR0ZU9wdGlvbnMuZmxhZ3MuZW5hYmxlQWxwaGF9YCxcblx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0KTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgbGltaXREYXJrbmVzczogJHtwYWxldHRlT3B0aW9ucy5mbGFncy5saW1pdERhcmtuZXNzfWAsXG5cdFx0XHRcdCdkb20gPiBldmVudHMgPiBnZW5lcmF0ZUJ1dHRvbiBjbGljayBldmVudCdcblx0XHRcdCk7XG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0YGxpbWl0R3JheW5lc3M6ICR7cGFsZXR0ZU9wdGlvbnMuZmxhZ3MubGltaXRHcmF5bmVzc31gLFxuXHRcdFx0XHQnZG9tID4gZXZlbnRzID4gZ2VuZXJhdGVCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHQpO1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBsaW1pdExpZ2h0bmVzczogJHtwYWxldHRlT3B0aW9ucy5mbGFncy5saW1pdExpZ2h0bmVzc31gLFxuXHRcdFx0XHQnZG9tID4gZXZlbnRzID4gZ2VuZXJhdGVCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGF3YWl0IHN0YXJ0LmdlblBhbGV0dGUocGFsZXR0ZU9wdGlvbnMpO1xuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKGRvbUlEcy5oZWxwTWVudUJ1dHRvbiwgJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR1aUVsZW1lbnRzLmRpdnMuaGVscE1lbnU/LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdHVpRWxlbWVudHMuZGl2cy5oZWxwTWVudT8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5oaXN0b3J5TWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuZGl2cy5oaXN0b3J5TWVudT8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHR1aUVsZW1lbnRzLmRpdnMuaGlzdG9yeU1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMuaW1wb3J0RXhwb3J0TWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuZGl2cy5pbXBvcnRFeHBvcnRNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuZGl2cy5pbXBvcnRFeHBvcnRNZW51Py5zZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdCdhcmlhLWhpZGRlbicsXG5cdFx0XHRcdCdmYWxzZSdcblx0XHRcdCk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoZG9tSURzLmltcG9ydFBhbGV0dGVJbnB1dCwgJ2NoYW5nZScsIGFzeW5jIChlOiBFdmVudCkgPT4ge1xuXHRcdGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblxuXHRcdGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBmaWxlID0gaW5wdXQuZmlsZXNbMF07XG5cblx0XHRcdC8vICpERVYtTk9URSogaW1wbGVtZW50IGEgd2F5IHRvIGRldGVybWluZSB3aGV0aGVyIGZpbGUgZGVzY3JpYmVzIENTUywgSlNPTiwgb3IgWE1MIGltcG9ydFxuXHRcdFx0Y29uc3QgZm9ybWF0ID0gJ0pTT04nO1xuXG5cdFx0XHRhd2FpdCB1aU1hbmFnZXIuaGFuZGxlSW1wb3J0KGZpbGUsIGZvcm1hdCk7XG5cdFx0fVxuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGRvbUlEcy5yZXNldERhdGFiYXNlQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKFN0cmluZyhtb2RlLmVudmlyb25tZW50KSA9PT0gJ3Byb2QnKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgcmVzZXQgZGF0YWJhc2UgaW4gcHJvZHVjdGlvbiBtb2RlLicsXG5cdFx0XHRcdFx0XHQnZG9tID4gZXZlbnRzID4gcmVzZXREYXRhYmFzZUJ1dHRvbiBjbGljayBldmVudCdcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY29uZmlybVJlc2V0ID0gY29uZmlybShcblx0XHRcdFx0J0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZXNldCB0aGUgZGF0YWJhc2U/J1xuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFjb25maXJtUmVzZXQpIHJldHVybjtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgaWRiTWFuYWdlciA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuXHRcdFx0XHRpZGJNYW5hZ2VyLnJlc2V0RGF0YWJhc2UoKTtcblxuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdFx0J0RhdGFiYXNlIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSByZXNldC4nLFxuXHRcdFx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IHJlc2V0RGF0YWJhc2VCdXR0b24gY2xpY2sgZXZlbnQnXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAobW9kZS5zaG93QWxlcnRzKSBhbGVydCgnSW5kZXhlZERCIHN1Y2Nlc3NmdWxseSByZXNldCEnKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gcmVzZXQgZGF0YWJhc2U6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRcdCdkb20gPiBldmVudHMgPiByZXNldERhdGFiYXNlQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cykgYWxlcnQoJ0ZhaWxlZCB0byByZXNldCBkYXRhYmFzZS4nKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRkb21JRHMucmVzZXRQYWxldHRlSURCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRpZiAoU3RyaW5nKG1vZGUuZW52aXJvbm1lbnQpID09PSAncHJvZCcpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCByZXNldCBwYWxldHRlIElEIGluIHByb2R1Y3Rpb24gbW9kZS4nLFxuXHRcdFx0XHRcdFx0J2RvbSA+IGV2ZW50cyA+IHJlc2V0UGFsZXR0ZUlEQnV0dG9uIGNsaWNrIGV2ZW50J1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb25maXJtUmVzZXQgPSBjb25maXJtKFxuXHRcdFx0XHQnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlc2V0IHRoZSBwYWxldHRlIElEPydcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybVJlc2V0KSByZXR1cm47XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IGlkYi5yZXNldFBhbGV0dGVJRCgpO1xuXG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHQnUGFsZXR0ZSBJRCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgcmVzZXQuJyxcblx0XHRcdFx0XHRcdCdkb20gPiBldmVudHMgPiByZXNldFBhbGV0dGVJREJ1dHRvbiBjbGljayBldmVudCdcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpIGFsZXJ0KCdQYWxldHRlIElEIHJlc2V0IHN1Y2Nlc3NmdWxseSEnKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIHJlc2V0IHBhbGV0dGUgSUQ6ICR7ZXJyb3J9YCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cykgYWxlcnQoJ0ZhaWxlZCB0byByZXNldCBwYWxldHRlIElELicpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKGRvbUlEcy5zYXR1cmF0ZUJ1dHRvbiwgJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoIXVpRWxlbWVudHMuc2VsZWN0LnNlbGVjdGVkQ29sb3JPcHRpb24pIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU2VsZWN0ZWQgY29sb3Igb3B0aW9uIG5vdCBmb3VuZCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSB1aUVsZW1lbnRzLmlucHV0cy5zZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0XHQ/IHBhcnNlSW50KHVpRWxlbWVudHMuc2VsZWN0LnNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0dWlNYW5hZ2VyLnNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuZGl2cy5hZHZhbmNlZE1lbnUpXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IHVpRWxlbWVudHMuZGl2cy5hZHZhbmNlZE1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmFkdmFuY2VkTWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmFkdmFuY2VkTWVudS5zZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdFx0J2FyaWEtaGlkZGVuJyxcblx0XHRcdFx0XHQndHJ1ZSdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRpZiAodWlFbGVtZW50cy5kaXZzLmN1c3RvbUNvbG9yTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5kaXZzLmN1c3RvbUNvbG9yTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuY3VzdG9tQ29sb3JNZW51LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuY3VzdG9tQ29sb3JNZW51LnNldEF0dHJpYnV0ZShcblx0XHRcdFx0XHQnYXJpYS1oaWRkZW4nLFxuXHRcdFx0XHRcdCd0cnVlJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmRpdnMuZGV2ZWxvcGVyTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5kaXZzLmRldmVsb3Blck1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmRldmVsb3Blck1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuZGl2cy5kZXZlbG9wZXJNZW51LnNldEF0dHJpYnV0ZShcblx0XHRcdFx0XHQnYXJpYS1oaWRkZW4nLFxuXHRcdFx0XHRcdCd0cnVlJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmRpdnMuaGVscE1lbnUpXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IHVpRWxlbWVudHMuZGl2cy5oZWxwTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuaGVscE1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuZGl2cy5oZWxwTWVudS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblx0XHRcdH1cblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRpZiAodWlFbGVtZW50cy5kaXZzLmhpc3RvcnlNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmRpdnMuaGlzdG9yeU1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmhpc3RvcnlNZW51LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuaGlzdG9yeU1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuZGl2cy5pbXBvcnRFeHBvcnRNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmRpdnMuaW1wb3J0RXhwb3J0TWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuaW1wb3J0RXhwb3J0TWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmltcG9ydEV4cG9ydE1lbnUuc2V0QXR0cmlidXRlKFxuXHRcdFx0XHRcdCdhcmlhLWhpZGRlbicsXG5cdFx0XHRcdFx0J3RydWUnXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgY29uc3QgYmFzZTogRE9NX0Z1bmN0aW9uc01hc3RlckludGVyZmFjZVsnZXZlbnRzJ10gPSB7XG5cdGFkZEV2ZW50TGlzdGVuZXIsXG5cdGhhbmRsZVBhbGV0dGVHZW4sXG5cdGluaXRpYWxpemVFdmVudExpc3RlbmVyc1xufTtcbiJdfQ==