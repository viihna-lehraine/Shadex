// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateColor1, randomSL, populateColorTextOutputBox } from './index.js';


// Generate analogous hues
function generateAnalogousHues(color, numBoxes) {
    const analogousHues = [];
    const baseHue = color.hue;
    const maxTotalDistance = 60;
    const minTotalDistance = 10 + (numBoxes - 2) * 9;
    const totalIncrement = Math.floor(Math.random() * (maxTotalDistance - minTotalDistance + 1)) + minTotalDistance;
    const increment = Math.floor(totalIncrement / (numBoxes - 1));

    for (let i = 1; i < numBoxes; i++) {
        analogousHues.push((baseHue + increment * i) % 360);
    }
    return analogousHues;
}


// Generate analogous palette
function generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    if (numBoxes < 2) {
        window.alert('To generate an analogous palette, please select a number of swatches greater than 1');
        return;
    }
    const colors = [];
    const color = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    const analogousHues = generateAnalogousHues(color, numBoxes);

    colors.push(color);

    for (let i = 0; i < analogousHues.length; i++) {
        let analogousHue = analogousHues[i];
        let analogousSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let analogousColor = {
            hue: analogousHue,
            saturation: analogousSatAndLightness.saturation,
            lightness: analogousSatAndLightness.lightness
        };

        colors.push(analogousColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${analogousColor.hue}, ${analogousColor.saturation}%, ${analogousColor.lightness}%)`;
            populateColorTextOutputBox(analogousColor, i + 2);
        }
    }
    return colors;
}


export { generateAnalogousPalette };