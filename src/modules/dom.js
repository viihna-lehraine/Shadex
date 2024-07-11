// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



// Populates .color-text-output-box with the HSL attribute
export function populateColorTextOutputBox(color, boxNumber) {
    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);

    if (colorTextOutputBox) {
        colorTextOutputBox.value = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
        colorTextOutputBox.setAttribute('data-format', 'hsl');
    }
}


// Populates #palette-row with .color-stripe elements
export function populateColorStripe(colors, numBoxes) {
    for (let i = 0; i < numBoxes; i++) {
        let colorStripe = document.getElementById(`color-stripe-${i + 1}`);

        colorStripe.style.backgroundColor = `hsl(${colors[i].hue}, ${colors[i].saturation}%, ${colors[i].lightness}%)`;
    }
}


// Show Tooltip for Copy to Clipbaoard
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
}