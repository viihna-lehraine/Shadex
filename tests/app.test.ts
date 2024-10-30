/**
 * @jest-environment jsdom
 */
import { generate } from '../src/palette-gen/generate';
import { idbFn } from '../src/dom/idb-fn';
import { domFn } from '../src/dom/dom-main';
import { core } from '../src/utils/core';
import * as colors from '../src/index/colors';

function simulateDOMContentLoaded() {
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
}

describe('ColorGen Main Script', () => {
    let generateSpy: jest.SpyInstance;
    let saveDataSpy: jest.SpyInstance;

    beforeEach(() => {
        document.body.innerHTML = `
            <button id="generate-button">Generate</button>
            <button id="saturate-button">Saturate</button>
            <select id="selected-color-options">
                <option value="0">Red</option>
                <option value="1">Green</option>
                <option value="2">Blue</option>
            </select>
        `;

        generateSpy = jest.spyOn(generate, 'startPaletteGen').mockResolvedValue();
        saveDataSpy = jest.spyOn(idbFn, 'saveData').mockResolvedValue();

        jest.clearAllMocks();
        simulateDOMContentLoaded();
    });

    it('should attach event listeners and trigger palette generation', async () => {
        const generateButton = document.getElementById('generate-button');

        generateButton?.click();

        expect(generateSpy).toHaveBeenCalledTimes(1);
    });

    it('should save color space to IndexedDB when applyColorSpaceButton is clicked', async () => {
        const applyColorSpaceButton = document.createElement('button');

        applyColorSpaceButton.id = 'apply-color-space-button';
        document.body.appendChild(applyColorSpaceButton);

        jest.spyOn(domFn, 'applySelectedColorSpace').mockReturnValue('rgb');

        applyColorSpaceButton.click();

        expect(saveDataSpy).toHaveBeenCalledWith(
            'settings',
            'appSettings',
            { colorSpace: 'rgb' }
        );
    });

    it('should correctly clone and save custom color to IndexedDB', async () => {
        const applyCustomColorButton = document.createElement('button');

        applyCustomColorButton.id = 'apply-custom-color-button';
        document.body.appendChild(applyCustomColorButton);

        const mockColor: colors.Color = {
            format: 'rgb',
            value: { red: 255, green: 0, blue: 0 },
        };

        jest.spyOn(domFn, 'applyCustomColor').mockReturnValue(mockColor);

        const saveColorSpy = jest.spyOn(idbFn, 'saveData').mockResolvedValue();

        applyCustomColorButton.click();

        expect(saveColorSpy).toHaveBeenCalledWith(
            'customColor',
            'appSettings',
            core.clone(mockColor)
        );
    });

    it('should toggle advanced menu visibility', () => {
        const advancedMenu = document.createElement('div');

        advancedMenu.id = 'advanced-menu';
        advancedMenu.classList.add('hidden');
        document.body.appendChild(advancedMenu);

        const toggleButton = document.createElement('button');

        toggleButton.id = 'advanced-menu-toggle';
        document.body.appendChild(toggleButton);

        toggleButton.click();

        expect(advancedMenu.classList.contains('hidden')).toBe(false);
        expect(advancedMenu.style.display).toBe('block');

        toggleButton.click();

        expect(advancedMenu.classList.contains('hidden')).toBe(true);
        expect(advancedMenu.style.display).toBe('none');
    });
});
