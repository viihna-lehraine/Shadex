// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { attachDragAndDropEventListeners, generateAndStoreColorValues, hexToHSL, hslToHex } from '../export.js';


let paletteBoxCount = 1;


// Generate paletteBox {numBoxes} number of times 
function generatePaletteBox(colors, numBoxes) {
    console.log('generatePaletteBox() executing');
    console.log('generatePaletteBox() - colors: ', colors, ' data type ', (typeof colors));
    console.log('generatePaletteBox() - numBoxes: ', numBoxes, ' data type ', (typeof numBoxes));

    const paletteRow = document.getElementById('palette-row');

    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    for (let i = 0; i < numBoxes; i++) { // make sure colors[i] is defined for each iteration of i
        if (!colors[i]) {
            console.error(`generatePaletteBox() - color at index ${i} is undefined`);
            continue; // if colors[i] is undefined, skip this iteration 
        }

        console.log('generatePaletteBox() - calling generateAndStoreColorValues() with parameters (colors[i]: ', `(${colors[i]})`);

        const colorValues = generateAndStoreColorValues(colors[i]);

        console.log('generatePaletteBox() - calling makePaletteBox() with parameters (colorValues, paletteBox) and using result to define new, unnamed object with properties { colorStripe, paletteBoxCount: newPaletteBoxCount');

        const { colorStripe, paletteBoxCount: newPaletteBoxCount } = makePaletteBox(colorValues, paletteBoxCount);

        paletteRow.appendChild(colorStripe);

        console.log('generatePaletteBox() - paletteBoxCount: ', paletteBoxCount, ' data type: ', typeof(paletteBoxCount));
        console.log(`generatePaletteBox() - colors at index ${i}: ${colors[i]}, data type (typeof ${colors[i]}`);

        console.log(`generatePaletteBox() - calling populateColorTextOutputBox for palette-box #${paletteBoxCount} using parameters (colors[i], paletteBoxCount)`);
        populateColorTextOutputBox(colors[i], paletteBoxCount);

        console.log(`generatePaletteBox() complete for palette-box #${paletteBoxCount}`);
        paletteBoxCount = newPaletteBoxCount;
    }
};


function makePaletteBox(colorValues, paletteBoxCount) {
    console.log(`makePaletteBox() executing for palette-box #${paletteBoxCount}`);
    console.log('makePaletteBox() - colorValues: ', colorValues, ' data type: ', (typeof colorValues));
    console.log('makePaletteBox() - paletteBoxCount: ', paletteBoxCount, ' data type: ', (typeof paletteBoxCount));

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

    /* *DEV-NOTE* BROKEN AND INCOMPLETE FEATURE */
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

    // *DEV-NOTE* move to app.js
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(colorTextOutputBox.value);
            showTooltip(colorTextOutputBox);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    })

    // *DEV-NOTE* move to app.js
    colorTextOutputBox.addEventListener('input', (e) => {
        const colorValue = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
            document.getElementById(`color-box-${paletteBoxCount}`).style.backgroundColor = colorValue;
            document.getElementById(`color-stripe-${paletteBoxCount}`).style.backgroundColor = colorValue;
        }
        // *DEV-NOTE* needs error handling
    })

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
    console.log(`makePaletteBox() - calling attachDragAndDropEventListeners for palette-box ${paletteBoxCount}`);
    attachDragAndDropEventListeners(colorStripe);

    colorStripe.appendChild(paletteBox);

    console.log(`makePaletteBox() complete for palette-box #${paletteBoxCount} - returning colorStripe and iterating paletteBoxCount`);
    return { colorStripe, paletteBoxCount: paletteBoxCount + 1 };
};


// Populates .color-text-output-box with the hex attribute
function populateColorTextOutputBox(color, boxNumber) {
    console.log(`populateColorTextOutputBox() executing for palette-box #${boxNumber}`);

    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);

    if (colorTextOutputBox) {
        console.log(`populateColorTextOutputBox() - calling hslToHex with parameters (color.hue, color.saturation, color.lightness) for palette-box #${boxNumber}`);

        let hexValue = hslToHex(color.hue, color.saturation, color.lightness);
        console.log('makePaletteBox() - hexValue: ', hexValue, ' data type: ', (typeof hexValue));

        colorTextOutputBox.value = hexValue;
        colorTextOutputBox.setAttribute('data-format', 'hex');
    }

    console.log(`makePaletteBox() complete for palette-box #${boxNumber}`);
};


// Sature and Desaturate Button Element Selection
function getElementsForSelectedColor(selectedColor) {
    console.log('getElementsForSelectedColor() executing with parameter (selectedColor) - completing and returning elements as properties of an unnamed object');
    return {
        selectedColorTextOutputBox: document.getElementById(`color-text-output-box-${selectedColor}`),
        selectedColorBox: document.getElementById(`color-box-${selectedColor}`),
        selectedColorStripe: document.getElementById(`color-stripe-${selectedColor}`),
        selectedColorValue: colors[selectedColor]
    }
};


// Saturate Button functionality
function saturateColor(selectedColor) {
    getElementsForSelectedColor(selectedColor);
};


// Desaturate Button functionality
function desaturateColor(selectedColor) {
    getElementsForSelectedColor(selectedColor);
};


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
};


// Toggle Popup Div
function showCustomColorPopupDiv() {
    let popup = document.getElementById('popup-div');

    popup.classList.toggle('show');
};


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
     }
};


export { generatePaletteBox, makePaletteBox, populateColorTextOutputBox, getElementsForSelectedColor, saturateColor, desaturateColor, showTooltip, showCustomColorPopupDiv, applyCustomColor };