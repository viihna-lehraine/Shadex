// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE

import { generateAndStoreColorValues } from './color-conversion/index.js';
import { copyToClipboard } from '../utils/index.js';
import { attachDragAndDropEventListeners } from './dragAndDrop.js';
import { hexToHSL, hslToHex } from './color-conversion/index.js';


let paletteBoxCount = 1;


// Generate paletteBox {numBoxes} number of times 
function generatePaletteBox(colors, numBoxes) {
    const paletteRow = document.getElementById('palette-row');

    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    for (let i = 0; i < numBoxes; i++) {
        // make sure colors[i] is defined for each iteration of i
        if (!colors[i]) {
            console.error(`Color at index ${i} is undefined`);
            // if colors[i] is undefined, skip this iteration 
        }
        const colorValues = generateAndStoreColorValues(colors[i].hue, colors[i].saturation, colors[i].lightness);
        const { colorStripe, paletteBoxCount: newPaletteBoxCount } = makePaletteBox(colorValues, paletteBoxCount);

        paletteRow.appendChild(colorStripe);

        populateColorTextOutputBox(colors[i], paletteBoxCount);

        paletteBoxCount = newPaletteBoxCount;
    }
}


function makePaletteBox(colorValues, paletteBoxCount) {
    let paletteBox = document.createElement('div');
    paletteBox.className = 'palette-box';
    paletteBox.id = `palette-box-${paletteBoxCount}`;

    let paletteBoxTopHalf = document.createElement('div');
    paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
    paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

    let colorTextOutputBox = document.createElement('input');
    colorTextOutputBox.type = 'text';
    colorTextOutputBox.className = 'color-text-output-box tooltip';
    colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
    colorTextOutputBox.setAttribute('data-format', 'hex');
    colorTextOutputBox.value = colorValues.hex;
    colorTextOutputBox.colorValues = colorValues;

    // Ensure the text is selectable
    colorTextOutputBox.readOnly = false;
    colorTextOutputBox.style.cursor = 'text'; // Ensure the cursor indicates text selection is possible

    let copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';

    let tooltipText = document.createElement('span');
    tooltipText.className = 'tooltiptext';
    tooltipText.textContent = 'Copied to clipboard!';

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(colorTextOutputBox.value);
            showTooltip(colorTextOutputBox);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });

    colorTextOutputBox.addEventListener('input', (e) => {
        const colorValue = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
            document.getElementById(`color-box-${paletteBoxCount}`).style.backgroundColor = colorValue;
            document.getElementById(`color-stripe-${paletteBoxCount}`).style.backgroundColor = colorValue;
        }
        // needs error handling
    });

    paletteBoxTopHalf.appendChild(colorTextOutputBox);
    paletteBoxTopHalf.appendChild(copyButton);

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


// Populates .color-text-output-box with the hex attribute
function populateColorTextOutputBox(color, boxNumber) {
    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);

    if (colorTextOutputBox) {
        let hexValue = hslToHex(color.hue, color.saturation, color.lightness);
        colorTextOutputBox.value = hexValue;
        colorTextOutputBox.setAttribute('data-format', 'hex');
    }
}


// Saturate Button functionality
saturateColor(selectedColor) {
    let selectedColorTextOutputBox = document.getElementById(`color-text-output-box-${selectedColor}`);
    let selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    let selectedColorStripe = document.getElementById(`color-stripe-${selectedColor}`);
    let selectedColorValue = colors[selectedColor];
};


// Desaturate Button functionality
desaturateColor(selectedColor) {
    let selectedColorTextOutputBox = document.getElementById(`color-text-output-box-${selectedColor}`);
    let selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    let selectedColorStripe = document.getElementById(`color-stripe-${selectedColor}`);
        let selectedColorValue = colors[selectedColor];
};


// Show Tooltip for Copy to Clipboard
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


export { generatePaletteBox, saturateColor, desaturateColor, populateColorTextOutputBox, showTooltip, showCustomColorPopupDiv, applyCustomColor };