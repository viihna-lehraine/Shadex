// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomHSL } from './index.js';
import { populateColorTextOutputBox } from './index.js';


// Generate Random Color Palette
function generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    const colors = [];
    
    for (let i = 0; i < numBoxes; i++) {
        // use custom color for 1st color, if it is defined
        const hslValues = (i === 0 && customColor) ? customColor : randomHSL(limitGrayAndBlack, limitLight); 
        
        if (typeof hslValues.hue !== 'number' || typeof hslValues.saturation !== 'number' || typeof hslValues.lightness !== 'number') {
            console.error('Invalid color values: ', hslValues);
            continue;
        }

        const randomColor = {
            hue: hslValues.hue,
            saturation: hslValues.saturation,
            lightness: hslValues.lightness
        };

        colors.push(randomColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${randomColor.hue}, ${randomColor.saturation}%, ${randomColor.lightness})`;
            populateColorTextOutputBox(randomColor, (i + 1));
        }
    }
    return colors;
}


export { generateRandomColorPalette };