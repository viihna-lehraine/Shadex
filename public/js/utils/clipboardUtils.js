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