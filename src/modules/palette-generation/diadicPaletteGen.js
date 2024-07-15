// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateColor1, randomSL, populateColorTextOutputBox } from './index.js';


// Generate diadic hues
function generateDiadicHues(color, numBoxes) {
    const diadicHues = [];
    const baseHue = color.hue;
    const randomDistance = getWeightedRandomInterval();
    const hue1 = baseHue;
    const hue2 = (hue1 + randomDistance) % 360;

    diadicHues.push(hue1, hue2);
    return diadicHues;
}


// Generate disdic color palette
function generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    if (numBoxes < 2) {
        window.alert('To generate a diadic palette, please select a number of swatches greater than 1');
        return;
    }
    
    let colors = [];
    const color = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    const diadicHues = generateDiadicHues(color, numBoxes);

    colors.push(color);

    for (let i = 0; i < diadicHues.length; i++) {
        let diadicHue = diadicHues[i];
        let diadicSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let diadicColor = {
            hue: diadicHue,
            saturation: diadicSatAndLightness.saturation,
            lightness: diadicSatAndLightness.lightness
        };

        colors.push(diadicColor);

        let colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${diadicColor.hue}, ${diadicColor.saturation}%, ${diadicColor.lightness}%)`;
            populateColorTextOutputBox(diadicColor, i + 1);
        }
    }
    return colors;
}


// generate random weighted interval (for diadic palette)
function getWeightedRandomInterval() {
    const weights = [40, 45, 50, 55, 60, 65, 70];
    const probabilities = [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05];
    const cumulativeProbabilities = probabilities.reduce((acc, prob, i) => {
        acc[i] = (acc[i - 1] || 0) + prob;
        return acc;
    }, []);

    const random = Math.random();

    for (let i = 0; i < cumulativeProbabilities.length; i++) {
        if (random < cumulativeProbabilities[i]) {
            return weights[i];
        }
    }
    return weights[weights.length - 1];
}


export { generateDiadicPalette };