// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { showTooltip } from '../export.js';


// Copy Color Values to Clipboard on Click
function copyToClipboard(text, tooltipElement) {
    const colorValue = text.replace('Copied to clipboard!', '').trim(); // remove the tooltip text before copying
    
    navigator.clipboard.writeText(text).then(() => {
        showTooltip(tooltipElement);
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
    })
}


export { copyToClipboard };