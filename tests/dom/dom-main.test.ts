/**
 * @jest-environment jsdom
 */
import { domFn } from '../../src/dom/dom-main';
import { domHelpers } from '../../src/helpers/dom';
import * as colors from '../../src/index/colors';
import * as domTypes from '../../src/index/dom-types';
import { generate } from '../../src/palette-gen/generate';

describe('domFn Module', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div>
                <button id="hex-conversion-button"></button>
                <button id="rgb-conversion-button"></button>
                <input id="custom-color-picker" value="#ff0000" />
                <select id="custom-color-format">
                    <option value="hex" selected>Hex</option>
                </select>
                <div id="color-box-1"></div>
            </div>
        `;
    });

    describe('addConversionButtonEventListeners', () => {
        it('should attach event listeners to conversion buttons', () => {
            const spy = jest.spyOn(domFn, 'convertColors');
            domFn.addConversionButtonEventListeners();

            const hexButton = document.getElementById('hex-conversion-button');
            hexButton?.dispatchEvent(new Event('click'));

            expect(spy).toHaveBeenCalledWith('hex');
        });
    });

    describe('applyCustomColor', () => {
        it('should return a parsed color from the color picker', () => {
            const result = domFn.applyCustomColor();
            expect(result).toEqual({
                format: 'hex',
                value: { hex: '#ff0000' }
            });
        });

        it('should return a random color if the picker is missing', () => {
            document.getElementById('custom-color-picker')?.remove();
            const randomColor = domFn.applyCustomColor();
            expect(randomColor.format).toBe('hex');
        });
    });

    describe('applyFirstColorToUI', () => {
        it('should apply color to UI element', () => {
            const color = { format: 'rgb', value: { red: 255, green: 0, blue: 0 } };
            const spy = jest.spyOn(domFn, 'populateColorTextOutputBox');

            domFn.applyFirstColorToUI('rgb');

            const colorBox = document.getElementById('color-box-1');
            expect(colorBox?.style.backgroundColor).toBe('rgb(255, 0, 0)');
            expect(spy).toHaveBeenCalledWith(color, 1);
        });
    });

    describe('convertColors', () => {
        it('should convert colors between formats', () => {
            const inputElement = document.createElement('input') as domTypes.ColorInputElement;
            inputElement.className = 'color-text-output-box';
            inputElement.setAttribute('data-format', 'rgb');
            inputElement.colorValues = { format: 'rgb', value: { red: 255, green: 0, blue: 0 } };
            document.body.appendChild(inputElement);

            domFn.convertColors('hex');
            expect(inputElement.value).toContain('#ff0000');
        });

        it('should show a toast if conversion is not supported', () => {
            const showToastSpy = jest.spyOn(domHelpers, 'showToast');
            domFn.convertColors('xyz' as colors.ColorSpace);
            expect(showToastSpy).toHaveBeenCalledWith('Conversion not supported.');
        });
    });

    describe('copyToClipboard', () => {
        it('should copy text to the clipboard', async () => {
            const mockWriteText = jest.fn();
            Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

            const tooltip = document.createElement('div');
            domFn.copyToClipboard('Copied!', tooltip);

            expect(mockWriteText).toHaveBeenCalledWith('Copied!');
        });
    });

    describe('defineUIButtons', () => {
        it('should return button references', () => {
            const buttons = domFn.defineUIButtons();
            expect(buttons.generateButton).not.toBeNull();
        });

        it('should return null for missing buttons', () => {
            document.getElementById('generate-button')?.remove();
            const buttons = domFn.defineUIButtons();
            expect(buttons.generateButton).toBeNull();
        });
    });

    describe('populateColorTextOutputBox', () => {
        it('should populate the color text output box', () => {
            const inputElement = document.createElement('input');
            inputElement.id = 'color-text-output-box-1';
            document.body.appendChild(inputElement);

            const color: colors.RGB = { format: 'rgb', value: { red: 255, green: 0, blue: 0 } };
            domFn.populateColorTextOutputBox(color, 1);

            expect(inputElement.value).toBe('rgb(255, 0, 0)');
        });
    });

    describe('handleGenButtonClick', () => {
        it('should generate a palette', () => {
            const startPaletteGenSpy = jest.spyOn(generate, 'startPaletteGen');
            domFn.handleGenButtonClick();

            expect(startPaletteGenSpy).toHaveBeenCalled();
        });
    });

    describe('showCustomColorPopupDiv', () => {
        it('should toggle the popup visibility', () => {
            const popup = document.createElement('div');
            popup.id = 'popup-div';
            document.body.appendChild(popup);

            domFn.showCustomColorPopupDiv();
            expect(popup.classList.contains('show')).toBe(true);
        });
    });
});
