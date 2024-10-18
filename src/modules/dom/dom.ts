import {
    attachDragAndDropEventListeners,
    generateAndStoreColorValues,
    hexToHSL,
    hslToHex
} from '../../export';

let paletteBoxCount = 1;

// generate paletteBox {numBoxes} number of times 
const paletteRow = document.getElementById('palette-row');
    if (!paletteRow) {
        console.error('generatePaletteBox() - paletteRow is undefined');
        return;
    }

    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    for (let i = 0; i < numBoxes; i++) { // make sure colors[i] is defined for each iteration of i
        if (!colors[i]) {
            console.error(`generatePaletteBox() - color at index ${i} is undefined`);
            continue; // if colors[i] is undefined, skip this iteration 
        }

        const colorValues = generateAndStoreColorValues(colors[i]);

        const { colorStripe, paletteBoxCount: newPaletteBoxCount } = makePaletteBox(colorValues, paletteBoxCount);

        paletteRow.appendChild(colorStripe);
        populateColorTextOutputBox(colors[i], paletteBoxCount);
        paletteBoxCount = newPaletteBoxCount;
    }
};

export function makePaletteBox(colorValues: { hex: string, hsl: string }, paletteBoxCount: number) {
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
    // ensure the text in color-text-output-box is selectable
    colorTextOutputBox.readOnly = false;
    // ensure the cursor indicates text selection is possible
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
        const target = e.target as HTMLInputElement | null;
        if (target) {
            const colorValue = target.value;
            if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
                document.getElementById(`color-box-${paletteBoxCount}`)!.style.backgroundColor = colorValue;
                document.getElementById(`color-stripe-${paletteBoxCount}`)!.style.backgroundColor = colorValue;
            }
        }
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
};

// populates .color-text-output-box with the hex attribute
export function populateColorTextOutputBox(color, boxNumber) {
    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);

    if (colorTextOutputBox) {
        let hexValue = hslToHex(color.hue, color.saturation, color.lightness);

        colorTextOutputBox.value = hexValue;
        colorTextOutputBox.setAttribute('data-format', 'hex');
    }

    console.log(`makePaletteBox() complete for palette-box #${boxNumber}`);
};

// sature and desaturate Button Element Selection
export function getElementsForSelectedColor(selectedColor: number) {
    return {
        selectedColorTextOutputBox: document.getElementById(`color-text-output-box-${selectedColor}`),
        selectedColorBox: document.getElementById(`color-box-${selectedColor}`),
        selectedColorStripe: document.getElementById(`color-stripe-${selectedColor}`),
    };
}

// saturate button functionality
export function saturateColor(selectedColor) {
    getElementsForSelectedColor(selectedColor);
};

// desaturate button functionality
export function desaturateColor(selectedColor) {
    getElementsForSelectedColor(selectedColor);
};

// show tooltip for copy to clipboard
export function showTooltip(tooltipElement) {
    const tooltip = tooltipElement.querySelector('.tooltiptext');
    if (tooltip) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }, 1000);
    }

    console.log('execution of showTooltip complete');
};

// toggle popup div
export function showCustomColorPopupDiv() {
    const popup = document.getElementById('popup-div');

    popup.classList.toggle('show');
};

export function applyCustomColor() {
    let hexCustomColor = document.getElementById('custom-color-picker').value;
    let hslCustomColor = hexToHSL(hexCustomColor);

    return { 
        format: 'hsl',
        value: `hsl(${hslCustomColor.hue}, ${hslCustomColor.saturation}%, ${hslCustomColor.lightness}%)`
     }
};