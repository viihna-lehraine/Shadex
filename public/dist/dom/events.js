// File: dom/events/base.js
import { IDBManager } from '../db/index.js';
import { coreUtils, superUtils, utils } from '../common/index.js';
import { constsData as consts } from '../data/consts.js';
import { createLogger } from '../logger/index.js';
import { domData } from '../data/dom.js';
import { parse } from './parse.js';
import { modeData as mode } from '../data/mode.js';
import { start } from '../palette/index.js';
import { UIManager } from '../ui/index.js';
const buttonDebounce = consts.debounce.button || 300;
const ids = domData.ids;
const logMode = mode.logging;
const uiElements = domData.elements;
const thisModule = 'dom/events.js';
const logger = await createLogger();
const idb = await IDBManager.getInstance();
const uiManager = new UIManager();
function addEventListener(id, eventType, callback) {
    const thisFunction = 'addEventListener()';
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(eventType, callback);
    }
    else if (logMode.warn) {
        if (mode.debug && logMode.warn && logMode.verbosity > 2)
            logger.warn(`Element with id "${id}" not found.`, `${thisModule} > ${thisFunction}`);
    }
}
const handlePaletteGen = coreUtils.base.debounce(() => {
    const thisFunction = 'handlePaletteGen';
    try {
        const params = superUtils.dom.getGenButtonArgs();
        if (!params) {
            if (logMode.error) {
                logger.error('Failed to retrieve generateButton parameters', `${thisModule} > ${thisFunction}`);
            }
            return;
        }
        const { swatches, customColor, type, enableAlpha, limitDark, limitGray, limitLight } = params;
        if (!type || !swatches) {
            if (logMode.error) {
                logger.error('paletteType and/or swatches are undefined', `${thisModule} > ${thisFunction}`);
            }
            return;
        }
        const options = {
            customColor,
            flags: {
                enableAlpha,
                limitDarkness: limitDark,
                limitGrayness: limitGray,
                limitLightness: limitLight
            },
            swatches,
            type
        };
        start.genPalette(options);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Failed to handle generate button click: ${error}`, `${thisModule} > ${thisFunction}`);
    }
}, buttonDebounce);
function initializeEventListeners() {
    const thisFunction = 'initializeEventListeners()';
    const addConversionListener = (id, colorSpace) => {
        const button = document.getElementById(id);
        if (button) {
            if (coreUtils.guards.isColorSpace(colorSpace)) {
                button.addEventListener('click', () => superUtils.dom.switchColorSpace(colorSpace));
            }
            else {
                if (logMode.warn) {
                    logger.warn(`Invalid color space provided: ${colorSpace}`, `${thisModule} > ${thisFunction}`);
                }
            }
        }
        else {
            if (logMode.warn)
                logger.warn(`Element with id "${id}" not found.`, `${thisModule} > ${thisFunction}`);
        }
    };
    addConversionListener('show-as-cmyk-button', 'cmyk');
    addConversionListener('show-as-hex-button', 'hex');
    addConversionListener('show-as-hsl-button', 'hsl');
    addConversionListener('show-as-hsv-button', 'hsv');
    addConversionListener('show-as-lab-button', 'lab');
    addConversionListener('show-as-rgb-button', 'rgb');
    addEventListener(ids.advancedMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.advancedMenu?.classList.remove('hidden');
        uiElements.divs.advancedMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(ids.applyCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        const customHSLColor = uiManager.applyCustomColor();
        const customHSLColorClone = coreUtils.base.clone(customHSLColor);
        await idb.saveData('customColor', 'appSettings', customHSLColorClone);
        if (!mode.quiet && logMode.info)
            logger.info('Custom color saved to IndexedDB', `${thisModule} > applyCustomColorButton click event`);
        // *DEV-NOTE* unfinished, I think? Double-check this
    });
    addEventListener(ids.clearCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.inputs.customColorInput.value = '#ff0000';
        if (!mode.quiet && logMode.info)
            logger.info('Custom color cleared', `${thisModule} > clearCustomColorButton click event`);
    });
    addEventListener(ids.customColorMenuButton, 'click', async (e) => {
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
    addEventListener(ids.deleteDatabaseButton, 'click', async (e) => {
        e.preventDefault();
        // only allow if application is in development mode
        if (String(mode.environment) === 'prod') {
            if (logMode.warn) {
                logger.warn('Cannot delete database in production mode.', `${thisModule} > deleteDatabaseButton click event`);
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
                logger.info('Database deleted successfully.', `${thisModule} > deleteDatabaseButton click event`);
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to delete database: ${error}`, `${thisModule} > deleteDatabaseButton click event`);
            if (mode.showAlerts)
                alert('Failed to delete database.');
        }
    });
    addEventListener(ids.desaturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.select.selectedColorOption
            ? parseInt(uiElements.select.selectedColorOption.value, 10)
            : 0;
        if (!mode.quiet && logMode.clicks)
            logger.info('desaturateButton clicked', `${thisModule} > desaturateButton click event`);
        uiManager.desaturateColor(selectedColor);
    });
    addEventListener(ids.developerMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (String(mode.environment) === 'prod') {
            if (!mode.quiet && logMode.error)
                logger.error('Cannot access developer menu in production mode.', `${thisModule} > developerMenuButton click event`);
            return;
        }
        uiElements.divs.developerMenu?.classList.remove('hidden');
        uiElements.divs.developerMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(ids.exportPaletteButton, 'click', async (e) => {
        e.preventDefault();
        const format = parse.paletteExportFormat();
        if (mode.debug && logMode.info && logMode.verbosity > 1)
            logger.info(`Export Palette Button click event: Export format selected: ${format}`, `${thisModule} > exportPaletteButton click event`);
        if (!format) {
            if (logMode.error && !mode.quiet && logMode.verbosity > 1) {
                logger.error('Export format not selected', `${thisModule} > exportPaletteButton click event`);
                return;
            }
        }
        else {
            uiManager.handleExport(format);
        }
    });
    addEventListener(ids.generateButton, 'click', async (e) => {
        e.preventDefault();
        // captures data from UI at the time the Generate Button is clicked
        const { type, swatches, enableAlpha, limitDarkness, limitGrayness, limitLightness } = uiManager.pullParamsFromUI();
        if (logMode.info && logMode.verbosity > 1)
            logger.info('Generate Button click event: Retrieved parameters from UI.', `${thisModule} > generateButton click event`);
        if (logMode.info && mode.debug && logMode.verbosity > 1)
            logger.info(`Type: ${type}\nSwatches: ${swatches}\nEnableAlpha: ${enableAlpha}\nLimit Darkness: ${limitDarkness}\nLimit Grayness: ${limitGrayness}\nLimit Lightness${limitLightness}.`, `${thisModule} > generateButton click event`);
        let customColor = (await idb.getCustomColor());
        if (!customColor) {
            customColor = utils.random.hsl(true);
        }
        else {
            if (mode.debug && logMode.info)
                logger.info(`User-generated Custom Color found in IndexedDB: ${JSON.stringify(customColor)}`, `${thisModule} > generateButton click event`);
        }
        const paletteOptions = {
            customColor: coreUtils.base.clone(customColor),
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
            logger.info(`paletteOptions object data:`, `${thisModule} > generateButton click event`);
            logger.info(`paletteType: ${paletteOptions.type}`, `${thisModule} > generateButton click event`);
            logger.info(`swatches: ${paletteOptions.swatches}`, `${thisModule} > generateButton click event`);
            logger.info(`customColor: ${JSON.stringify(paletteOptions.customColor)}`, `${thisModule} > generateButton click event`);
            logger.info(`enableAlpha: ${paletteOptions.flags.enableAlpha}`, `${thisModule} > generateButton click event`);
            logger.info(`limitDarkness: ${paletteOptions.flags.limitDarkness}`, `${thisModule} > generateButton click event`);
            logger.info(`limitGrayness: ${paletteOptions.flags.limitGrayness}`, `${thisModule} > generateButton click event`);
            logger.info(`limitLightness: ${paletteOptions.flags.limitLightness}`, `${thisModule} > generateButton click event`);
        }
        await start.genPalette(paletteOptions);
    });
    addEventListener(ids.helpMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.helpMenu?.classList.remove('hidden');
        uiElements.divs.helpMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(ids.historyMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.historyMenu?.classList.remove('hidden');
        uiElements.divs.historyMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(ids.importExportMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.divs.importExportMenu?.classList.remove('hidden');
        uiElements.divs.importExportMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(ids.importPaletteInput, 'change', async (e) => {
        const input = e.target;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            // *DEV-NOTE* implement a way to determine whether file describes CSS, JSON, or XML import
            const format = 'JSON';
            await uiManager.handleImport(file, format);
        }
    });
    addEventListener(ids.resetDatabaseButton, 'click', async (e) => {
        e.preventDefault();
        if (String(mode.environment) === 'prod') {
            if (!mode.quiet && logMode.error)
                logger.error('Cannot reset database in production mode.', `${thisModule} > resetDatabaseButton click event`);
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the database?');
        if (!confirmReset)
            return;
        try {
            const idbManager = await IDBManager.getInstance();
            idbManager.resetDatabase();
            if (!mode.quiet && logMode.info)
                logger.info('Database has been successfully reset.', `${thisModule} > resetDatabaseButton click event`);
            if (mode.showAlerts)
                alert('IndexedDB successfully reset!');
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to reset database: ${error}`, `${thisModule} > resetDatabaseButton click event`);
            if (mode.showAlerts)
                alert('Failed to reset database.');
        }
    });
    addEventListener(ids.resetPaletteIDButton, 'click', async (e) => {
        e.preventDefault();
        if (String(mode.environment) === 'prod') {
            if (!mode.quiet && logMode.error)
                logger.error('Cannot reset palette ID in production mode.', `${thisModule} > resetPaletteIDButton click event`);
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the palette ID?');
        if (!confirmReset)
            return;
        try {
            await idb.resetPaletteID();
            if (!mode.quiet && logMode.info)
                logger.info('Palette ID has been successfully reset.', `${thisModule} > resetPaletteIDButton click event`);
            if (mode.showAlerts)
                alert('Palette ID reset successfully!');
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to reset palette ID: ${error}`, `${thisModule} > resetPaletteIDButton click event`);
            if (mode.showAlerts)
                alert('Failed to reset palette ID.');
        }
    });
    addEventListener(ids.saturateButton, 'click', async (e) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RvbS9ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkJBQTJCO0FBUTNCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsVUFBVSxJQUFJLE1BQU0sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDO0FBQ3JELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM3QixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBRXBDLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQztBQUVuQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLE1BQU0sR0FBRyxHQUFHLE1BQU0sVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7QUFFbEMsU0FBUyxnQkFBZ0IsQ0FDeEIsRUFBVSxFQUNWLFNBQVksRUFDWixRQUE4QztJQUU5QyxNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQztJQUMxQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTVDLElBQUksT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7U0FBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUM7WUFDdEQsTUFBTSxDQUFDLElBQUksQ0FDVixvQkFBb0IsRUFBRSxjQUFjLEVBQ3BDLEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO0lBQ0osQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtJQUNyRCxNQUFNLFlBQVksR0FBRyxrQkFBa0IsQ0FBQztJQUV4QyxJQUFJLENBQUM7UUFDSixNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFakQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2IsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQ1gsOENBQThDLEVBQzlDLEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO1lBQ0gsQ0FBQztZQUVELE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxFQUNMLFFBQVEsRUFDUixXQUFXLEVBQ1gsSUFBSSxFQUNKLFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixHQUFHLE1BQU0sQ0FBQztRQUVYLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4QixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLEtBQUssQ0FDWCwyQ0FBMkMsRUFDM0MsR0FBRyxVQUFVLE1BQU0sWUFBWSxFQUFFLENBQ2pDLENBQUM7WUFDSCxDQUFDO1lBRUQsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLE9BQU8sR0FBbUI7WUFDL0IsV0FBVztZQUNYLEtBQUssRUFBRTtnQkFDTixXQUFXO2dCQUNYLGFBQWEsRUFBRSxTQUFTO2dCQUN4QixhQUFhLEVBQUUsU0FBUztnQkFDeEIsY0FBYyxFQUFFLFVBQVU7YUFDMUI7WUFDRCxRQUFRO1lBQ1IsSUFBSTtTQUNKLENBQUM7UUFFRixLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxDQUFDLEtBQUs7WUFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCwyQ0FBMkMsS0FBSyxFQUFFLEVBQ2xELEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO0lBQ0osQ0FBQztBQUNGLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUVuQixTQUFTLHdCQUF3QjtJQUNoQyxNQUFNLFlBQVksR0FBRyw0QkFBNEIsQ0FBQztJQUVsRCxNQUFNLHFCQUFxQixHQUFHLENBQUMsRUFBVSxFQUFFLFVBQWtCLEVBQUUsRUFBRTtRQUNoRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBNkIsQ0FBQztRQUV2RSxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1osSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUMvQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUNyQyxVQUFVLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQXdCLENBQUMsQ0FDekQsQ0FBQztZQUNILENBQUM7aUJBQU0sQ0FBQztnQkFDUCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FDVixpQ0FBaUMsVUFBVSxFQUFFLEVBQzdDLEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO2dCQUNILENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQzthQUFNLENBQUM7WUFDUCxJQUFJLE9BQU8sQ0FBQyxJQUFJO2dCQUNmLE1BQU0sQ0FBQyxJQUFJLENBQ1Ysb0JBQW9CLEVBQUUsY0FBYyxFQUNwQyxHQUFHLFVBQVUsTUFBTSxZQUFZLEVBQUUsQ0FDakMsQ0FBQztRQUNKLENBQUM7SUFDRixDQUFDLENBQUM7SUFFRixxQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRCxxQkFBcUIsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxxQkFBcUIsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxxQkFBcUIsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxxQkFBcUIsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxxQkFBcUIsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVuRCxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFhLEVBQUUsRUFBRTtRQUN6RSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFbkIsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0JBQWdCLENBQ2YsR0FBRyxDQUFDLHNCQUFzQixFQUMxQixPQUFPLEVBQ1AsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3ZCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQixNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNwRCxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FDakIsYUFBYSxFQUNiLGFBQWEsRUFDYixtQkFBbUIsQ0FDbkIsQ0FBQztRQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQ1YsaUNBQWlDLEVBQ2pDLEdBQUcsVUFBVSx1Q0FBdUMsQ0FDcEQsQ0FBQztRQUVILG9EQUFvRDtJQUNyRCxDQUFDLENBQ0QsQ0FBQztJQUVGLGdCQUFnQixDQUNmLEdBQUcsQ0FBQyxzQkFBc0IsRUFDMUIsT0FBTyxFQUNQLEtBQUssRUFBRSxDQUFhLEVBQUUsRUFBRTtRQUN2QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFbkIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBaUIsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBRXRELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQ1Ysc0JBQXNCLEVBQ3RCLEdBQUcsVUFBVSx1Q0FBdUMsQ0FDcEQsQ0FBQztJQUNKLENBQUMsQ0FDRCxDQUFDO0lBRUYsZ0JBQWdCLENBQ2YsR0FBRyxDQUFDLHFCQUFxQixFQUN6QixPQUFPLEVBQ1AsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3ZCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQixVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FDNUMsYUFBYSxFQUNiLE1BQU0sQ0FDTixDQUFDO0lBQ0gsQ0FBQyxDQUNELENBQUM7SUFFRixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0I7UUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBRXpELFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNqRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7WUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBRTNELFVBQVUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVztZQUM5QyxVQUFVLENBQUMsTUFBTSxDQUFDLGdCQUFpQixDQUFDLEtBQUssQ0FBQztJQUM1QyxDQUFDLENBQUMsQ0FBQztJQUVILGdCQUFnQixDQUNmLEdBQUcsQ0FBQyxvQkFBb0IsRUFDeEIsT0FBTyxFQUNQLEtBQUssRUFBRSxDQUFhLEVBQUUsRUFBRTtRQUN2QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFbkIsbURBQW1EO1FBQ25ELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUN6QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FDViw0Q0FBNEMsRUFDNUMsR0FBRyxVQUFVLHFDQUFxQyxDQUNsRCxDQUFDO1lBQ0gsQ0FBQztZQUVELE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUM1QixvRkFBb0YsQ0FDcEYsQ0FBQztRQUVGLElBQUksQ0FBQyxhQUFhO1lBQUUsT0FBTztRQUUzQixJQUFJLENBQUM7WUFDSixNQUFNLFVBQVUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsRCxNQUFNLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUVsQyxJQUFJLElBQUksQ0FBQyxVQUFVO2dCQUFFLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQzdELElBQUksT0FBTyxDQUFDLElBQUk7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FDVixnQ0FBZ0MsRUFDaEMsR0FBRyxVQUFVLHFDQUFxQyxDQUNsRCxDQUFDO1FBQ0osQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSztnQkFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCw4QkFBOEIsS0FBSyxFQUFFLEVBQ3JDLEdBQUcsVUFBVSxxQ0FBcUMsQ0FDbEQsQ0FBQztZQUVILElBQUksSUFBSSxDQUFDLFVBQVU7Z0JBQUUsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDMUQsQ0FBQztJQUNGLENBQUMsQ0FDRCxDQUFDO0lBRUYsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBYSxFQUFFLEVBQUU7UUFDdkUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRW5CLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CO1lBQzFELENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsTUFBTTtZQUNoQyxNQUFNLENBQUMsSUFBSSxDQUNWLDBCQUEwQixFQUMxQixHQUFHLFVBQVUsaUNBQWlDLENBQzlDLENBQUM7UUFFSCxTQUFTLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0JBQWdCLENBQ2YsR0FBRyxDQUFDLG1CQUFtQixFQUN2QixPQUFPLEVBQ1AsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3ZCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUs7Z0JBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQ1gsa0RBQWtELEVBQ2xELEdBQUcsVUFBVSxvQ0FBb0MsQ0FDakQsQ0FBQztZQUVILE9BQU87UUFDUixDQUFDO1FBRUQsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUMsQ0FDRCxDQUFDO0lBRUYsZ0JBQWdCLENBQ2YsR0FBRyxDQUFDLG1CQUFtQixFQUN2QixPQUFPLEVBQ1AsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3ZCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUUzQyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUM7WUFDdEQsTUFBTSxDQUFDLElBQUksQ0FDViw4REFBOEQsTUFBTSxFQUFFLEVBQ3RFLEdBQUcsVUFBVSxvQ0FBb0MsQ0FDakQsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNiLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLEtBQUssQ0FDWCw0QkFBNEIsRUFDNUIsR0FBRyxVQUFVLG9DQUFvQyxDQUNqRCxDQUFDO2dCQUVGLE9BQU87WUFDUixDQUFDO1FBQ0YsQ0FBQzthQUFNLENBQUM7WUFDUCxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDRixDQUFDLENBQ0QsQ0FBQztJQUVGLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFhLEVBQUUsRUFBRTtRQUNyRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFbkIsbUVBQW1FO1FBQ25FLE1BQU0sRUFDTCxJQUFJLEVBQ0osUUFBUSxFQUNSLFdBQVcsRUFDWCxhQUFhLEVBQ2IsYUFBYSxFQUNiLGNBQWMsRUFDZCxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRWpDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUM7WUFDeEMsTUFBTSxDQUFDLElBQUksQ0FDViw0REFBNEQsRUFDNUQsR0FBRyxVQUFVLCtCQUErQixDQUM1QyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQ1YsU0FBUyxJQUFJLGVBQWUsUUFBUSxrQkFBa0IsV0FBVyxxQkFBcUIsYUFBYSxxQkFBcUIsYUFBYSxvQkFBb0IsY0FBYyxHQUFHLEVBQzFLLEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztRQUVILElBQUksV0FBVyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQWUsQ0FBQztRQUU3RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIsV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUM7YUFBTSxDQUFDO1lBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJO2dCQUM3QixNQUFNLENBQUMsSUFBSSxDQUNWLG1EQUFtRCxJQUFJLENBQUMsU0FBUyxDQUNoRSxXQUFXLENBQ1gsRUFBRSxFQUNILEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLGNBQWMsR0FBbUI7WUFDdEMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUM5QyxLQUFLLEVBQUU7Z0JBQ04sV0FBVztnQkFDWCxhQUFhO2dCQUNiLGFBQWE7Z0JBQ2IsY0FBYzthQUNkO1lBQ0QsUUFBUTtZQUNSLElBQUk7U0FDSixDQUFDO1FBRUYsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQyxNQUFNLENBQUMsSUFBSSxDQUNWLDZCQUE2QixFQUM3QixHQUFHLFVBQVUsK0JBQStCLENBQzVDLENBQUM7WUFDRixNQUFNLENBQUMsSUFBSSxDQUNWLGdCQUFnQixjQUFjLENBQUMsSUFBSSxFQUFFLEVBQ3JDLEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQ1YsYUFBYSxjQUFjLENBQUMsUUFBUSxFQUFFLEVBQ3RDLEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQ1YsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQzVELEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQ1YsZ0JBQWdCLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQ2xELEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQ1Ysa0JBQWtCLGNBQWMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLEVBQ3RELEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQ1Ysa0JBQWtCLGNBQWMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLEVBQ3RELEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQ1YsbUJBQW1CLGNBQWMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQ3hELEdBQUcsVUFBVSwrQkFBK0IsQ0FDNUMsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBYSxFQUFFLEVBQUU7UUFDckUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRW5CLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRSxDQUFDLENBQUMsQ0FBQztJQUVILGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3hFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQixVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hELFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxnQkFBZ0IsQ0FDZixHQUFHLENBQUMsc0JBQXNCLEVBQzFCLE9BQU8sRUFDUCxLQUFLLEVBQUUsQ0FBYSxFQUFFLEVBQUU7UUFDdkIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRW5CLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3RCxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FDN0MsYUFBYSxFQUNiLE9BQU8sQ0FDUCxDQUFDO0lBQ0gsQ0FBQyxDQUNELENBQUM7SUFFRixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFRLEVBQUUsRUFBRTtRQUNyRSxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztRQUUzQyxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDM0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1QiwwRkFBMEY7WUFDMUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXRCLE1BQU0sU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0JBQWdCLENBQ2YsR0FBRyxDQUFDLG1CQUFtQixFQUN2QixPQUFPLEVBQ1AsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3ZCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUs7Z0JBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQ1gsMkNBQTJDLEVBQzNDLEdBQUcsVUFBVSxvQ0FBb0MsQ0FDakQsQ0FBQztZQUVILE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUMzQiw4Q0FBOEMsQ0FDOUMsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZO1lBQUUsT0FBTztRQUUxQixJQUFJLENBQUM7WUFDSixNQUFNLFVBQVUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVsRCxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUk7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQ1YsdUNBQXVDLEVBQ3ZDLEdBQUcsVUFBVSxvQ0FBb0MsQ0FDakQsQ0FBQztZQUVILElBQUksSUFBSSxDQUFDLFVBQVU7Z0JBQUUsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSztnQkFDaEIsTUFBTSxDQUFDLEtBQUssQ0FDWCw2QkFBNkIsS0FBSyxFQUFFLEVBQ3BDLEdBQUcsVUFBVSxvQ0FBb0MsQ0FDakQsQ0FBQztZQUVILElBQUksSUFBSSxDQUFDLFVBQVU7Z0JBQUUsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDekQsQ0FBQztJQUNGLENBQUMsQ0FDRCxDQUFDO0lBRUYsZ0JBQWdCLENBQ2YsR0FBRyxDQUFDLG9CQUFvQixFQUN4QixPQUFPLEVBQ1AsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3ZCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUs7Z0JBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQ1gsNkNBQTZDLEVBQzdDLEdBQUcsVUFBVSxxQ0FBcUMsQ0FDbEQsQ0FBQztZQUVILE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUMzQixnREFBZ0QsQ0FDaEQsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZO1lBQUUsT0FBTztRQUUxQixJQUFJLENBQUM7WUFDSixNQUFNLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSTtnQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FDVix5Q0FBeUMsRUFDekMsR0FBRyxVQUFVLHFDQUFxQyxDQUNsRCxDQUFDO1lBRUgsSUFBSSxJQUFJLENBQUMsVUFBVTtnQkFBRSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNoQixJQUFJLE9BQU8sQ0FBQyxLQUFLO2dCQUNoQixNQUFNLENBQUMsS0FBSyxDQUNYLCtCQUErQixLQUFLLEVBQUUsRUFDdEMsR0FBRyxVQUFVLHFDQUFxQyxDQUNsRCxDQUFDO1lBRUgsSUFBSSxJQUFJLENBQUMsVUFBVTtnQkFBRSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUMzRCxDQUFDO0lBQ0YsQ0FBQyxDQUNELENBQUM7SUFFRixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBYSxFQUFFLEVBQUU7UUFDckUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRW5CLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLG1CQUFtQjtZQUMxRCxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUwsU0FBUyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3hELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZO1lBQy9CLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUMvQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRCxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQ3hDLGFBQWEsRUFDYixNQUFNLENBQ04sQ0FBQztZQUNILENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3hELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlO1lBQ2xDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUNsRCxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4RCxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQzNDLGFBQWEsRUFDYixNQUFNLENBQ04sQ0FBQztZQUNILENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3hELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhO1lBQ2hDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNoRCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQ3pDLGFBQWEsRUFDYixNQUFNLENBQ04sQ0FBQztZQUNILENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3hELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRO1lBQzNCLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMzQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRCxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3hELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQzlCLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUM5QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRCxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pFLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQWEsRUFBRSxFQUFFO1FBQ3hELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7WUFDbkMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDbkQsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6RCxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FDNUMsYUFBYSxFQUNiLE1BQU0sQ0FDTixDQUFDO1lBQ0gsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBb0M7SUFDcEQsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQix3QkFBd0I7Q0FDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGRvbS9ldmVudHMvYmFzZS5qc1xuXG5pbXBvcnQge1xuXHRDb2xvclNwYWNlLFxuXHRET01Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdEhTTCxcblx0UGFsZXR0ZU9wdGlvbnNcbn0gZnJvbSAnLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgSURCTWFuYWdlciB9IGZyb20gJy4uL2RiL2luZGV4LmpzJztcbmltcG9ydCB7IGNvcmVVdGlscywgc3VwZXJVdGlscywgdXRpbHMgfSBmcm9tICcuLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgY29uc3RzRGF0YSBhcyBjb25zdHMgfSBmcm9tICcuLi9kYXRhL2NvbnN0cy5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgZG9tRGF0YSB9IGZyb20gJy4uL2RhdGEvZG9tLmpzJztcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnLi9wYXJzZS5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vZGF0YS9tb2RlLmpzJztcbmltcG9ydCB7IHN0YXJ0IH0gZnJvbSAnLi4vcGFsZXR0ZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBVSU1hbmFnZXIgfSBmcm9tICcuLi91aS9pbmRleC5qcyc7XG5cbmNvbnN0IGJ1dHRvbkRlYm91bmNlID0gY29uc3RzLmRlYm91bmNlLmJ1dHRvbiB8fCAzMDA7XG5jb25zdCBpZHMgPSBkb21EYXRhLmlkcztcbmNvbnN0IGxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5jb25zdCB1aUVsZW1lbnRzID0gZG9tRGF0YS5lbGVtZW50cztcblxuY29uc3QgdGhpc01vZHVsZSA9ICdkb20vZXZlbnRzLmpzJztcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbmNvbnN0IGlkYiA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbmNvbnN0IHVpTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIoKTtcblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcjxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRFdmVudE1hcD4oXG5cdGlkOiBzdHJpbmcsXG5cdGV2ZW50VHlwZTogSyxcblx0Y2FsbGJhY2s6IChldjogSFRNTEVsZW1lbnRFdmVudE1hcFtLXSkgPT4gdm9pZFxuKTogdm9pZCB7XG5cdGNvbnN0IHRoaXNGdW5jdGlvbiA9ICdhZGRFdmVudExpc3RlbmVyKCknO1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG5cdGlmIChlbGVtZW50KSB7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuXHR9IGVsc2UgaWYgKGxvZ01vZGUud2Fybikge1xuXHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUud2FybiAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDIpXG5cdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0YEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0KTtcblx0fVxufVxuXG5jb25zdCBoYW5kbGVQYWxldHRlR2VuID0gY29yZVV0aWxzLmJhc2UuZGVib3VuY2UoKCkgPT4ge1xuXHRjb25zdCB0aGlzRnVuY3Rpb24gPSAnaGFuZGxlUGFsZXR0ZUdlbic7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBwYXJhbXMgPSBzdXBlclV0aWxzLmRvbS5nZXRHZW5CdXR0b25BcmdzKCk7XG5cblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdCdGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVycycsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNGdW5jdGlvbn1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB7XG5cdFx0XHRzd2F0Y2hlcyxcblx0XHRcdGN1c3RvbUNvbG9yLFxuXHRcdFx0dHlwZSxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrLFxuXHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0bGltaXRMaWdodFxuXHRcdH0gPSBwYXJhbXM7XG5cblx0XHRpZiAoIXR5cGUgfHwgIXN3YXRjaGVzKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0J3BhbGV0dGVUeXBlIGFuZC9vciBzd2F0Y2hlcyBhcmUgdW5kZWZpbmVkJyxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wdGlvbnM6IFBhbGV0dGVPcHRpb25zID0ge1xuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRmbGFnczoge1xuXHRcdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdFx0bGltaXREYXJrbmVzczogbGltaXREYXJrLFxuXHRcdFx0XHRsaW1pdEdyYXluZXNzOiBsaW1pdEdyYXksXG5cdFx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0XG5cdFx0XHR9LFxuXHRcdFx0c3dhdGNoZXMsXG5cdFx0XHR0eXBlXG5cdFx0fTtcblxuXHRcdHN0YXJ0LmdlblBhbGV0dGUob3B0aW9ucyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gaGFuZGxlIGdlbmVyYXRlIGJ1dHRvbiBjbGljazogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cdH1cbn0sIGJ1dHRvbkRlYm91bmNlKTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuXHRjb25zdCB0aGlzRnVuY3Rpb24gPSAnaW5pdGlhbGl6ZUV2ZW50TGlzdGVuZXJzKCknO1xuXG5cdGNvbnN0IGFkZENvbnZlcnNpb25MaXN0ZW5lciA9IChpZDogc3RyaW5nLCBjb2xvclNwYWNlOiBzdHJpbmcpID0+IHtcblx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKGJ1dHRvbikge1xuXHRcdFx0aWYgKGNvcmVVdGlscy5ndWFyZHMuaXNDb2xvclNwYWNlKGNvbG9yU3BhY2UpKSB7XG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG5cdFx0XHRcdFx0c3VwZXJVdGlscy5kb20uc3dpdGNoQ29sb3JTcGFjZShjb2xvclNwYWNlIGFzIENvbG9yU3BhY2UpXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAobG9nTW9kZS53YXJuKSB7XG5cdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRgSW52YWxpZCBjb2xvciBzcGFjZSBwcm92aWRlZDogJHtjb2xvclNwYWNlfWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChsb2dNb2RlLndhcm4pXG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBFbGVtZW50IHdpdGggaWQgXCIke2lkfVwiIG5vdCBmb3VuZC5gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fTtcblxuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtY215ay1idXR0b24nLCAnY215aycpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtaGV4LWJ1dHRvbicsICdoZXgnKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLWhzbC1idXR0b24nLCAnaHNsJyk7XG5cdGFkZENvbnZlcnNpb25MaXN0ZW5lcignc2hvdy1hcy1oc3YtYnV0dG9uJywgJ2hzdicpO1xuXHRhZGRDb252ZXJzaW9uTGlzdGVuZXIoJ3Nob3ctYXMtbGFiLWJ1dHRvbicsICdsYWInKTtcblx0YWRkQ29udmVyc2lvbkxpc3RlbmVyKCdzaG93LWFzLXJnYi1idXR0b24nLCAncmdiJyk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihpZHMuYWR2YW5jZWRNZW51QnV0dG9uLCAnY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHVpRWxlbWVudHMuZGl2cy5hZHZhbmNlZE1lbnU/LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdHVpRWxlbWVudHMuZGl2cy5hZHZhbmNlZE1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRpZHMuYXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbUhTTENvbG9yID0gdWlNYW5hZ2VyLmFwcGx5Q3VzdG9tQ29sb3IoKTtcblx0XHRcdGNvbnN0IGN1c3RvbUhTTENvbG9yQ2xvbmUgPSBjb3JlVXRpbHMuYmFzZS5jbG9uZShjdXN0b21IU0xDb2xvcik7XG5cblx0XHRcdGF3YWl0IGlkYi5zYXZlRGF0YShcblx0XHRcdFx0J2N1c3RvbUNvbG9yJyxcblx0XHRcdFx0J2FwcFNldHRpbmdzJyxcblx0XHRcdFx0Y3VzdG9tSFNMQ29sb3JDbG9uZVxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0J0N1c3RvbSBjb2xvciBzYXZlZCB0byBJbmRleGVkREInLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gYXBwbHlDdXN0b21Db2xvckJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdFx0KTtcblxuXHRcdFx0Ly8gKkRFVi1OT1RFKiB1bmZpbmlzaGVkLCBJIHRoaW5rPyBEb3VibGUtY2hlY2sgdGhpc1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGlkcy5jbGVhckN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dWlFbGVtZW50cy5pbnB1dHMuY3VzdG9tQ29sb3JJbnB1dCEudmFsdWUgPSAnI2ZmMDAwMCc7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdCdDdXN0b20gY29sb3IgY2xlYXJlZCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBjbGVhckN1c3RvbUNvbG9yQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGlkcy5jdXN0b21Db2xvck1lbnVCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR1aUVsZW1lbnRzLmRpdnMuY3VzdG9tQ29sb3JNZW51Py5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuZGl2cy5jdXN0b21Db2xvck1lbnU/LnNldEF0dHJpYnV0ZShcblx0XHRcdFx0J2FyaWEtaGlkZGVuJyxcblx0XHRcdFx0J3RydWUnXG5cdFx0XHQpO1xuXHRcdH1cblx0KTtcblxuXHRpZiAoIXVpRWxlbWVudHMuaW5wdXRzLmN1c3RvbUNvbG9ySW5wdXQpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDdXN0b20gY29sb3IgaW5wdXQgZWxlbWVudCBub3QgZm91bmQnKTtcblxuXHR1aUVsZW1lbnRzLmlucHV0cy5jdXN0b21Db2xvcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuXHRcdGlmICghdWlFbGVtZW50cy5zcGFucy5jdXN0b21Db2xvckRpc3BsYXkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0N1c3RvbSBjb2xvciBkaXNwbGF5IGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cblx0XHR1aUVsZW1lbnRzLnNwYW5zLmN1c3RvbUNvbG9yRGlzcGxheS50ZXh0Q29udGVudCA9XG5cdFx0XHR1aUVsZW1lbnRzLmlucHV0cy5jdXN0b21Db2xvcklucHV0IS52YWx1ZTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRpZHMuZGVsZXRlRGF0YWJhc2VCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBvbmx5IGFsbG93IGlmIGFwcGxpY2F0aW9uIGlzIGluIGRldmVsb3BtZW50IG1vZGVcblx0XHRcdGlmIChTdHJpbmcobW9kZS5lbnZpcm9ubWVudCkgPT09ICdwcm9kJykge1xuXHRcdFx0XHRpZiAobG9nTW9kZS53YXJuKSB7XG5cdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGRlbGV0ZSBkYXRhYmFzZSBpbiBwcm9kdWN0aW9uIG1vZGUuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZGVsZXRlRGF0YWJhc2VCdXR0b24gY2xpY2sgZXZlbnRgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY29uZmlybURlbGV0ZSA9IGNvbmZpcm0oXG5cdFx0XHRcdCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZSBlbnRpcmUgZGF0YWJhc2U/IFRoaXMgYWN0aW9uIGNhbm5vdCBiZSB1bmRvbmUuJ1xuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFjb25maXJtRGVsZXRlKSByZXR1cm47XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGlkYk1hbmFnZXIgPSBhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cdFx0XHRcdGF3YWl0IGlkYk1hbmFnZXIuZGVsZXRlRGF0YWJhc2UoKTtcblxuXHRcdFx0XHRpZiAobW9kZS5zaG93QWxlcnRzKSBhbGVydCgnRGF0YWJhc2UgZGVsZXRlZCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmluZm8pXG5cdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHQnRGF0YWJhc2UgZGVsZXRlZCBzdWNjZXNzZnVsbHkuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZGVsZXRlRGF0YWJhc2VCdXR0b24gY2xpY2sgZXZlbnRgXG5cdFx0XHRcdFx0KTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVsZXRlIGRhdGFiYXNlOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGRlbGV0ZURhdGFiYXNlQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cykgYWxlcnQoJ0ZhaWxlZCB0byBkZWxldGUgZGF0YWJhc2UuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoaWRzLmRlc2F0dXJhdGVCdXR0b24sICdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHVpRWxlbWVudHMuc2VsZWN0LnNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHRcdD8gcGFyc2VJbnQodWlFbGVtZW50cy5zZWxlY3Quc2VsZWN0ZWRDb2xvck9wdGlvbi52YWx1ZSwgMTApXG5cdFx0XHQ6IDA7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5jbGlja3MpXG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0J2Rlc2F0dXJhdGVCdXR0b24gY2xpY2tlZCcsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZGVzYXR1cmF0ZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdCk7XG5cblx0XHR1aU1hbmFnZXIuZGVzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGlkcy5kZXZlbG9wZXJNZW51QnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKFN0cmluZyhtb2RlLmVudmlyb25tZW50KSA9PT0gJ3Byb2QnKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgYWNjZXNzIGRldmVsb3BlciBtZW51IGluIHByb2R1Y3Rpb24gbW9kZS4nLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBkZXZlbG9wZXJNZW51QnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1aUVsZW1lbnRzLmRpdnMuZGV2ZWxvcGVyTWVudT8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHR1aUVsZW1lbnRzLmRpdnMuZGV2ZWxvcGVyTWVudT8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGlkcy5leHBvcnRQYWxldHRlQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgZm9ybWF0ID0gcGFyc2UucGFsZXR0ZUV4cG9ydEZvcm1hdCgpO1xuXG5cdFx0XHRpZiAobW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgRXhwb3J0IFBhbGV0dGUgQnV0dG9uIGNsaWNrIGV2ZW50OiBFeHBvcnQgZm9ybWF0IHNlbGVjdGVkOiAke2Zvcm1hdH1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZXhwb3J0UGFsZXR0ZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdFx0KTtcblxuXHRcdFx0aWYgKCFmb3JtYXQpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IgJiYgIW1vZGUucXVpZXQgJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J0V4cG9ydCBmb3JtYXQgbm90IHNlbGVjdGVkJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZXhwb3J0UGFsZXR0ZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1aU1hbmFnZXIuaGFuZGxlRXhwb3J0KGZvcm1hdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoaWRzLmdlbmVyYXRlQnV0dG9uLCAnY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdC8vIGNhcHR1cmVzIGRhdGEgZnJvbSBVSSBhdCB0aGUgdGltZSB0aGUgR2VuZXJhdGUgQnV0dG9uIGlzIGNsaWNrZWRcblx0XHRjb25zdCB7XG5cdFx0XHR0eXBlLFxuXHRcdFx0c3dhdGNoZXMsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9ID0gdWlNYW5hZ2VyLnB1bGxQYXJhbXNGcm9tVUkoKTtcblxuXHRcdGlmIChsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKVxuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdCdHZW5lcmF0ZSBCdXR0b24gY2xpY2sgZXZlbnQ6IFJldHJpZXZlZCBwYXJhbWV0ZXJzIGZyb20gVUkuJyxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBnZW5lcmF0ZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdCk7XG5cblx0XHRpZiAobG9nTW9kZS5pbmZvICYmIG1vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAxKVxuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBUeXBlOiAke3R5cGV9XFxuU3dhdGNoZXM6ICR7c3dhdGNoZXN9XFxuRW5hYmxlQWxwaGE6ICR7ZW5hYmxlQWxwaGF9XFxuTGltaXQgRGFya25lc3M6ICR7bGltaXREYXJrbmVzc31cXG5MaW1pdCBHcmF5bmVzczogJHtsaW1pdEdyYXluZXNzfVxcbkxpbWl0IExpZ2h0bmVzcyR7bGltaXRMaWdodG5lc3N9LmAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZ2VuZXJhdGVCdXR0b24gY2xpY2sgZXZlbnRgXG5cdFx0XHQpO1xuXG5cdFx0bGV0IGN1c3RvbUNvbG9yID0gKGF3YWl0IGlkYi5nZXRDdXN0b21Db2xvcigpKSBhcyBIU0wgfCBudWxsO1xuXG5cdFx0aWYgKCFjdXN0b21Db2xvcikge1xuXHRcdFx0Y3VzdG9tQ29sb3IgPSB1dGlscy5yYW5kb20uaHNsKHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLmluZm8pXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBVc2VyLWdlbmVyYXRlZCBDdXN0b20gQ29sb3IgZm91bmQgaW4gSW5kZXhlZERCOiAke0pTT04uc3RyaW5naWZ5KFxuXHRcdFx0XHRcdFx0Y3VzdG9tQ29sb3Jcblx0XHRcdFx0XHQpfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBnZW5lcmF0ZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCBwYWxldHRlT3B0aW9uczogUGFsZXR0ZU9wdGlvbnMgPSB7XG5cdFx0XHRjdXN0b21Db2xvcjogY29yZVV0aWxzLmJhc2UuY2xvbmUoY3VzdG9tQ29sb3IpLFxuXHRcdFx0ZmxhZ3M6IHtcblx0XHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRcdGxpbWl0R3JheW5lc3MsXG5cdFx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0XHR9LFxuXHRcdFx0c3dhdGNoZXMsXG5cdFx0XHR0eXBlXG5cdFx0fTtcblxuXHRcdGlmIChtb2RlLmRlYnVnICYmIGxvZ01vZGUuaW5mbykge1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBwYWxldHRlT3B0aW9ucyBvYmplY3QgZGF0YTpgLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0KTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgcGFsZXR0ZVR5cGU6ICR7cGFsZXR0ZU9wdGlvbnMudHlwZX1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0KTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgc3dhdGNoZXM6ICR7cGFsZXR0ZU9wdGlvbnMuc3dhdGNoZXN9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBnZW5lcmF0ZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdCk7XG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0YGN1c3RvbUNvbG9yOiAke0pTT04uc3RyaW5naWZ5KHBhbGV0dGVPcHRpb25zLmN1c3RvbUNvbG9yKX1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0KTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgZW5hYmxlQWxwaGE6ICR7cGFsZXR0ZU9wdGlvbnMuZmxhZ3MuZW5hYmxlQWxwaGF9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBnZW5lcmF0ZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdCk7XG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0YGxpbWl0RGFya25lc3M6ICR7cGFsZXR0ZU9wdGlvbnMuZmxhZ3MubGltaXREYXJrbmVzc31gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0KTtcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgbGltaXRHcmF5bmVzczogJHtwYWxldHRlT3B0aW9ucy5mbGFncy5saW1pdEdyYXluZXNzfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZ2VuZXJhdGVCdXR0b24gY2xpY2sgZXZlbnRgXG5cdFx0XHQpO1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBsaW1pdExpZ2h0bmVzczogJHtwYWxldHRlT3B0aW9ucy5mbGFncy5saW1pdExpZ2h0bmVzc31gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGdlbmVyYXRlQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRhd2FpdCBzdGFydC5nZW5QYWxldHRlKHBhbGV0dGVPcHRpb25zKTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihpZHMuaGVscE1lbnVCdXR0b24sICdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dWlFbGVtZW50cy5kaXZzLmhlbHBNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHR1aUVsZW1lbnRzLmRpdnMuaGVscE1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihpZHMuaGlzdG9yeU1lbnVCdXR0b24sICdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dWlFbGVtZW50cy5kaXZzLmhpc3RvcnlNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHR1aUVsZW1lbnRzLmRpdnMuaGlzdG9yeU1lbnU/LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblx0fSk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRpZHMuaW1wb3J0RXhwb3J0TWVudUJ1dHRvbixcblx0XHQnY2xpY2snLFxuXHRcdGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHVpRWxlbWVudHMuZGl2cy5pbXBvcnRFeHBvcnRNZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHVpRWxlbWVudHMuZGl2cy5pbXBvcnRFeHBvcnRNZW51Py5zZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdCdhcmlhLWhpZGRlbicsXG5cdFx0XHRcdCdmYWxzZSdcblx0XHRcdCk7XG5cdFx0fVxuXHQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoaWRzLmltcG9ydFBhbGV0dGVJbnB1dCwgJ2NoYW5nZScsIGFzeW5jIChlOiBFdmVudCkgPT4ge1xuXHRcdGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblxuXHRcdGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBmaWxlID0gaW5wdXQuZmlsZXNbMF07XG5cblx0XHRcdC8vICpERVYtTk9URSogaW1wbGVtZW50IGEgd2F5IHRvIGRldGVybWluZSB3aGV0aGVyIGZpbGUgZGVzY3JpYmVzIENTUywgSlNPTiwgb3IgWE1MIGltcG9ydFxuXHRcdFx0Y29uc3QgZm9ybWF0ID0gJ0pTT04nO1xuXG5cdFx0XHRhd2FpdCB1aU1hbmFnZXIuaGFuZGxlSW1wb3J0KGZpbGUsIGZvcm1hdCk7XG5cdFx0fVxuXHR9KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKFxuXHRcdGlkcy5yZXNldERhdGFiYXNlQnV0dG9uLFxuXHRcdCdjbGljaycsXG5cdFx0YXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKFN0cmluZyhtb2RlLmVudmlyb25tZW50KSA9PT0gJ3Byb2QnKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgcmVzZXQgZGF0YWJhc2UgaW4gcHJvZHVjdGlvbiBtb2RlLicsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IHJlc2V0RGF0YWJhc2VCdXR0b24gY2xpY2sgZXZlbnRgXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNvbmZpcm1SZXNldCA9IGNvbmZpcm0oXG5cdFx0XHRcdCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVzZXQgdGhlIGRhdGFiYXNlPydcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29uZmlybVJlc2V0KSByZXR1cm47XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGlkYk1hbmFnZXIgPSBhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cblx0XHRcdFx0aWRiTWFuYWdlci5yZXNldERhdGFiYXNlKCk7XG5cblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbylcblx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdCdEYXRhYmFzZSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgcmVzZXQuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gcmVzZXREYXRhYmFzZUJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnNob3dBbGVydHMpIGFsZXJ0KCdJbmRleGVkREIgc3VjY2Vzc2Z1bGx5IHJlc2V0IScpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEZhaWxlZCB0byByZXNldCBkYXRhYmFzZTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiByZXNldERhdGFiYXNlQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cykgYWxlcnQoJ0ZhaWxlZCB0byByZXNldCBkYXRhYmFzZS4nKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihcblx0XHRpZHMucmVzZXRQYWxldHRlSURCdXR0b24sXG5cdFx0J2NsaWNrJyxcblx0XHRhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRpZiAoU3RyaW5nKG1vZGUuZW52aXJvbm1lbnQpID09PSAncHJvZCcpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCByZXNldCBwYWxldHRlIElEIGluIHByb2R1Y3Rpb24gbW9kZS4nLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiByZXNldFBhbGV0dGVJREJ1dHRvbiBjbGljayBldmVudGBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY29uZmlybVJlc2V0ID0gY29uZmlybShcblx0XHRcdFx0J0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZXNldCB0aGUgcGFsZXR0ZSBJRD8nXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIWNvbmZpcm1SZXNldCkgcmV0dXJuO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBpZGIucmVzZXRQYWxldHRlSUQoKTtcblxuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdFx0J1BhbGV0dGUgSUQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHJlc2V0LicsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IHJlc2V0UGFsZXR0ZUlEQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cykgYWxlcnQoJ1BhbGV0dGUgSUQgcmVzZXQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEZhaWxlZCB0byByZXNldCBwYWxldHRlIElEOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IHJlc2V0UGFsZXR0ZUlEQnV0dG9uIGNsaWNrIGV2ZW50YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKG1vZGUuc2hvd0FsZXJ0cykgYWxlcnQoJ0ZhaWxlZCB0byByZXNldCBwYWxldHRlIElELicpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKGlkcy5zYXR1cmF0ZUJ1dHRvbiwgJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoIXVpRWxlbWVudHMuc2VsZWN0LnNlbGVjdGVkQ29sb3JPcHRpb24pIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU2VsZWN0ZWQgY29sb3Igb3B0aW9uIG5vdCBmb3VuZCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSB1aUVsZW1lbnRzLmlucHV0cy5zZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0XHQ/IHBhcnNlSW50KHVpRWxlbWVudHMuc2VsZWN0LnNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0dWlNYW5hZ2VyLnNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuZGl2cy5hZHZhbmNlZE1lbnUpXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IHVpRWxlbWVudHMuZGl2cy5hZHZhbmNlZE1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmFkdmFuY2VkTWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmFkdmFuY2VkTWVudS5zZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdFx0J2FyaWEtaGlkZGVuJyxcblx0XHRcdFx0XHQndHJ1ZSdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRpZiAodWlFbGVtZW50cy5kaXZzLmN1c3RvbUNvbG9yTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5kaXZzLmN1c3RvbUNvbG9yTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuY3VzdG9tQ29sb3JNZW51LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuY3VzdG9tQ29sb3JNZW51LnNldEF0dHJpYnV0ZShcblx0XHRcdFx0XHQnYXJpYS1oaWRkZW4nLFxuXHRcdFx0XHRcdCd0cnVlJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmRpdnMuZGV2ZWxvcGVyTWVudSlcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gdWlFbGVtZW50cy5kaXZzLmRldmVsb3Blck1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmRldmVsb3Blck1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuZGl2cy5kZXZlbG9wZXJNZW51LnNldEF0dHJpYnV0ZShcblx0XHRcdFx0XHQnYXJpYS1oaWRkZW4nLFxuXHRcdFx0XHRcdCd0cnVlJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmICh1aUVsZW1lbnRzLmRpdnMuaGVscE1lbnUpXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IHVpRWxlbWVudHMuZGl2cy5oZWxwTWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuaGVscE1lbnUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHVpRWxlbWVudHMuZGl2cy5oZWxwTWVudS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblx0XHRcdH1cblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRpZiAodWlFbGVtZW50cy5kaXZzLmhpc3RvcnlNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmRpdnMuaGlzdG9yeU1lbnUpIHtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmhpc3RvcnlNZW51LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuaGlzdG9yeU1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHVpRWxlbWVudHMuZGl2cy5pbXBvcnRFeHBvcnRNZW51KVxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSB1aUVsZW1lbnRzLmRpdnMuaW1wb3J0RXhwb3J0TWVudSkge1xuXHRcdFx0XHR1aUVsZW1lbnRzLmRpdnMuaW1wb3J0RXhwb3J0TWVudS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dWlFbGVtZW50cy5kaXZzLmltcG9ydEV4cG9ydE1lbnUuc2V0QXR0cmlidXRlKFxuXHRcdFx0XHRcdCdhcmlhLWhpZGRlbicsXG5cdFx0XHRcdFx0J3RydWUnXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgY29uc3QgYmFzZTogRE9NRm5fTWFzdGVySW50ZXJmYWNlWydldmVudHMnXSA9IHtcblx0YWRkRXZlbnRMaXN0ZW5lcixcblx0aGFuZGxlUGFsZXR0ZUdlbixcblx0aW5pdGlhbGl6ZUV2ZW50TGlzdGVuZXJzXG59O1xuIl19