// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateAndStoreColorValues } from './color-conversion/index.js';
import { copyToClipboard } from '../utils/index.js';
import { attachDragAndDropEventListeners } from './dragAndDrop.js';
import { hexToHSL } from './color-conversion/index.js';


let paletteBoxCount = 1;


// Generate paletteBox {numBoxes} number of times 
function generatePaletteBox(colors, numBoxes) {
    const paletteRow = document.getElementById('palette-row');

    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    for (let i = 0; i < numBoxes; i++) {
        const { colorStripe, paletteBoxCount: newPaletteBoxCount } = makePaletteBox(colors[i], paletteBoxCount);

        paletteRow.appendChild(colorStripe);

        populateColorTextOutputBox(colors[i], paletteBoxCount);

        paletteBoxCount = newPaletteBoxCount;
    }
}


// Generate a paletteBox element with all child elements
function makePaletteBox(color, paletteBoxCount) {
    const colorValues = generateAndStoreColorValues(color.hue, color.saturation, color.lightness);

    let paletteBox = document.createElement('div');
    paletteBox.className = 'palette-box';
    paletteBox.id = `palette-box-${paletteBoxCount}`;

    let paletteBoxTopHalf = document.createElement('div');
    paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
    paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

    let colorTextOutputBox = document.createElement('div');
    colorTextOutputBox.className = 'color-text-output-box tooltip';
    colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
    colorTextOutputBox.setAttribute('data-format', 'hex');
    colorTextOutputBox.textContent = colorValues.hex;
    colorTextOutputBox.colorValues = colorValues;

    let tooltipText = document.createElement('span');
    tooltipText.className = 'tooltiptext';
    tooltipText.textContent = 'Copied to clipboard!';

    colorTextOutputBox.appendChild(tooltipText);

    colorTextOutputBox.addEventListener('click', () => {
        const colorValue = colorTextOutputBox.textContent.replace('Copied to clipboard', '').trim();
        copyToClipboard(colorValue, colorTextOutputBox);
    });

    paletteBoxTopHalf.appendChild(colorTextOutputBox);

    let paletteBoxBottomHalf = document.createElement('div');
    paletteBoxBottomHalf.className = 'palette-box-half palette-box-bottom-half';
    paletteBoxBottomHalf.id = `palette-box-bottom-half-${paletteBoxCount}`;

    let colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.id = `color-box-${paletteBoxCount}`;
    colorBox.style.backgroundColor = colorValues.hsl;

    paletteBoxBottomHalf.appendChild(colorBox);
    paletteBox.appendChild(paletteBoxTopHalf);
    paletteBox.appendChild(paletteBoxBottomHalf);

    let colorStripe = document.createElement('div');
    colorStripe.className = 'color-stripe';
    colorStripe.id = `color-stripe-${paletteBoxCount}`;
    colorStripe.style.backgroundColor = colorValues.hsl;

    colorStripe.setAttribute('draggable', true);
    attachDragAndDropEventListeners(colorStripe);

    colorStripe.appendChild(paletteBox);

    return { colorStripe, paletteBoxCount: paletteBoxCount + 1 };
}


// Populates .color-text-output-box with the HSL attribute
function populateColorTextOutputBox(color, boxNumber) {
    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);

    if (colorTextOutputBox) {
        colorTextOutputBox.value = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
        colorTextOutputBox.setAttribute('data-format', 'hsl');
    }
}


// Show Tooltip for Copy to Clipbaoard
function showTooltip(tooltipElement) {
    const tooltip = tooltipElement.querySelector('.tooltiptext');
    if (tooltip) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }, 1000);
    }
}


// Toggle Popup Div
function showCustomColorPopupDiv() {
    let popup = document.getElementById('popup-div');
    popup.classList.toggle('show');
}


// Apply Custom Color
function applyCustomColor() {
    let hexCustomColor = document.getElementById('custom-color-picker').value;
    let hslCustomColor = hexToHSL(hexCustomColor);
    
    return {
        hue: hslCustomColor.hue,
        saturation: hslCustomColor.saturation,
        lightness: hslCustomColor.lightness
    };
}


export { generatePaletteBox, populateColorTextOutputBox, showTooltip, showCustomColorPopupDiv, applyCustomColor };