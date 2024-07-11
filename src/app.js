// Color Palette Generator - version 0.31

// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// All code herein is STRICTLY free (as in freedom). You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful! I only ask that you show me what you did so that I can observe and learn.

// This program comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND

// This file initializes the application before further handling by additional JS modules. Modules are located at /src/modules/ and /src/utils/
// Module Names: colorConversion.js | dom.js | dragAndDrop.js | paletteGen.js | clipboardUtils.js | randomUtils.js

// BEGIN CODE



import { convertColors } from '/src/modules/colorConversion.js';
import { handleGenerateButtonClick } from '/src/modules/paletteGen.js';

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');

    document.getElementById('hex-conversion-button').addEventListener('click', () => convertColors('hex'));
    document.getElementById('rgb-conversion-button').addEventListener('click', () => convertColors('rgb'));
    document.getElementById('hsv-conversion-button').addEventListener('click', () => convertColors('hsv'));
    document.getElementById('hsl-conversion-button').addEventListener('click', () => convertColors('hsl'));
    document.getElementById('cmyk-conversion-button').addEventListener('click', () => convertColors('cmyk'));
    document.getElementById('lab-conversion-button').addEventListener('click', () => convertColors('lab'));

    // Prevent generateButton default click event and define intended click event
    generateButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleGenerateButtonClick();
    });
});