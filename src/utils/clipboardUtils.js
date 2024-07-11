// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { showTooltip } from "/src/modules/dom.js";


// Copy Color Values to Clipboard on Click
export function copyToClipboard(text, tooltipElement) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard:', text);
        showTooltip(tooltipElement);
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
    });
}