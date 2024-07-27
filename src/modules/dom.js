// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { generateAndStoreColorValues } from './color-conversion/index.js';
import { attachDragAndDropEventListeners } from './dragAndDrop.js';
import { hexToHSL, hslToHex } from './color-conversion/index.js';
/* import { copyToClipboard } from '../utils/index.js'; */


let paletteBoxCount = 1;


// Generate paletteBox {numBoxes} number of times 
function generatePaletteBox(colors, numBoxes) {
    console.log('executing generatePaletteBox');
    console.log('colors: ', colors, ' data type ', (typeof colors));
    console.log('numBoxes: ', numBoxes, ' data type ', (typeof numBoxes));

    const paletteRow = document.getElementById('palette-row');

    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    for (let i = 0; i < numBoxes; i++) {
        // make sure colors[i] is defined for each iteration of i
        if (!colors[i]) {
            console.error(`Color at index ${i} is undefined`);
            // if colors[i] is undefined, skip this iteration 
            continue;
        }

        console.log(`calling genrateAndStoreColorValues (from within generatePaletteBox) for colors array at index ${i}`);

        const colorValues = generateAndStoreColorValues(colors[i]);

        console.log('calling makePaletteBox from within generatePaletteBox');

        const { colorStripe, paletteBoxCount: newPaletteBoxCount } = makePaletteBox(colorValues, paletteBoxCount);

        paletteRow.appendChild(colorStripe);

        console.log('paletteBoxCount: ', paletteBoxCount, ' data type: ', typeof(paletteBoxCount));
        console.log(`colors at index ${i}: ${colors[i]}, data type (typeof ${colors[i]}`);

        console.log(`calling populateColorTextOutputBox from within generatePaletteBox for palette-box #${paletteBoxCount}`);
        populateColorTextOutputBox(colors[i], paletteBoxCount);

        console.log(`execution of generatePaletteBox for palette-box #${paletteBoxCount}`);

        paletteBoxCount = newPaletteBoxCount;
    }
}


function makePaletteBox(colorValues, paletteBoxCount) {
    console.log(`executing makePaletteBox for palette-box #${paletteBoxCount}`);
    console.log('colorValues: ', colorValues, ' data type: ', (typeof colorValues));
    console.log('paletteBoxCount: ', paletteBoxCount, ' data type: ', (typeof paletteBoxCount));

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

    /* BROKEN AND INCOMPLETE FEATURE */
    // Ensure the text in color-text-output-box is selectable
    colorTextOutputBox.readOnly = false;
    // Ensure the cursor indicates text selection is possible
    colorTextOutputBox.style.cursor = 'text';

    let copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';

    let tooltipText = document.createElement('span');
    tooltipText.className = 'tooltiptext';
    tooltipText.textContent = 'Copied to clipboard!';

    // move to app.js
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(colorTextOutputBox.value);
            showTooltip(colorTextOutputBox);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });

    // move to app.js
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
    console.log(`calling attachDragAndDropEventListeners for palette-box ${paletteBoxCount}`);
    attachDragAndDropEventListeners(colorStripe);

    colorStripe.appendChild(paletteBox);

    console.log(`execution of makePaletteBox for palette-box #${paletteBoxCount} finalizing`);
    console.log('returning colorStripe and iterating paletteBoxCount');
    return { colorStripe, paletteBoxCount: paletteBoxCount + 1 };
}


// Populates .color-text-output-box with the hex attribute
function populateColorTextOutputBox(color, boxNumber) {
    console.log(`executing populateColorTextOutputBox for palette-box #${boxNumber}`);
    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);

    if (colorTextOutputBox) {
        console.log(`calling hslToHex from within populateColorTextOutputBox for palette-box #${boxNumber}`);
        let hexValue = hslToHex(color.hue, color.saturation, color.lightness);
        console.log('hexValue: ', hexValue, ' data type: ', (typeof hexValue));
        colorTextOutputBox.value = hexValue;
        colorTextOutputBox.setAttribute('data-format', 'hex');
    }

    console.log(`execution of populateColorTextOutputBox for palette-box #${boxNumber} complete`);
}


// Sature and Desaturate Button Element Selection
function getElementsForSelectedColor(selectedColor) {
    return {
        selectedColorTextOutputBox: document.getElementById(`color-text-output-box-${selectedColor}`),
        selectedColorBox: document.getElementById(`color-box-${selectedColor}`),
        selectedColorStripe: document.getElementById(`color-stripe-${selectedColor}`),
        selectedColorValue: colors[selectedColor]
    };
}


// Saturate Button functionality
function saturateColor(selectedColor) {
    getElementsForSelectedColor(selectedColor);
}


// Desaturate Button functionality
function desaturateColor(selectedColor) {
    getElementsForSelectedColor(selectedColor);
}


// Show Tooltip for Copy to Clipboard
function showTooltip(tooltipElement) {
    console.log('executing showTooltip');

    const tooltip = tooltipElement.querySelector('.tooltiptext');
    if (tooltip) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }, 1000);
    }

    console.log('execution complete showTooltip complete');
}


// Toggle Popup Div
function showCustomColorPopupDiv() {
    let popup = document.getElementById('popup-div');
    popup.classList.toggle('show');
}


// Apply Custom Color
function applyCustomColor() {
    let hexCustomColor = document.getElementById('custom-color-picker').value;
    console.log('hexCustomColor: ', hexCustomColor);
    let hslCustomColor = hexToHSL(hexCustomColor);
    console.log('hslCustomColor: ', hslCustomColor);

    console.log('execution of applyCustomColor finalizing - returning object with properties "format" and "value"');
    return { 
        format: 'hsl',
        value: `hsl(${hslCustomColor.hue}, ${hslCustomColor.saturation}%, ${hslCustomColor.lightness}%)`
     };
}


export { generatePaletteBox, saturateColor, desaturateColor, populateColorTextOutputBox, showTooltip, showCustomColorPopupDiv, applyCustomColor };