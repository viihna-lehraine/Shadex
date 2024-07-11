// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateAndStoreColorValues } from '/src/modules/colorConversion.js'
import { populateColorTextOutputBox } from '/src/modules/dom.js';
import { attachEventListeners } from '/src/modules/dragAndDrop.js';
import { generateColor1, randomSL } from '/src/utils/randomUtils.js';
import { copyToClipboard } from '/src/utils/clipboardUtils.js';

let paletteTypeOptions = document.getElementById('palette-type-options');
let paletteNumberOptions = document.getElementById('palette-number-options');
let paletteBoxCount = 1;


// Define default behavior for generateButton click event
export function handleGenerateButtonClick() {
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = paletteTypeOptions.value;
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? 1 : 0;
    let limitLight = limitLightCheckbox.checked ? 1 : 0;
    let colors = [];

    if (selectedPaletteTypeOptionValue == "1") {
        if (numBoxes == 1) {
            colors = [generateColor1(limitGrayAndBlack, limitLight)];
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select "1" for "# of colors" to generate a single random color');
        }
    } else if (selectedPaletteTypeOptionValue == "2") {
        if (numBoxes !== 1) {
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select a number greater than "1" for "# of colors" to generate a complementary palette');
        }
    } else if (selectedPaletteTypeOptionValue == "3") {
        if (numBoxes == 3) {
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "3" for "# of colors" to generate a triadic color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "4") {
        if (numBoxes == 4) {
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "4" for "# of colors" to generate a tetradic color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "5") {
        if (numBoxes == 3) {
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "3" for "# of colors" to generate a split complementary color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "6") {
        if (numBoxes !== 1) {
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select a number greater than "1" for "# of colors" to generate an analogous color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "7") {
        if (numBoxes == 6) {
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "6" for "# of colors" to generate a hexadic palette');
        }
    } else if (selectedPaletteTypeOptionValue == "8") {
        if (numBoxes == 2) {
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "2" for "# of colors" to generate a diadic palette');
        }
    }
}


// Generate paletteBox {numBoxes} number of times 
function generatePaletteBox(colors, numBoxes) {
    const paletteRow = document.getElementById('palette-row');

    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    for (let i = 0; i < numBoxes; i++) {

        const { colorStripe, paletteBoxCount: newPaletteBoxCount } = makePaletteBox(colors[i], paletteBoxCount);

        paletteRow.appendChild(colorStripe);

        populateColorTextOutputBox(colors[i], paletteBoxCount);

        paletteBoxCount = newPaletteBoxCount;
    }
}


// Generate a paletteBox element with all child elements
function makePaletteBox(color, paletteBoxCount) {
    const colorValues = generateAndStoreColorValues(color.hue, color.saturation, color.lightness);

    let paletteBox = document.createElement('div');
    paletteBox.className = 'palette-box';
    paletteBox.id = `palette-box-${paletteBoxCount}`;

    let paletteBoxTopHalf = document.createElement('div');
    paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
    paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

    let colorTextOutputBox = document.createElement('div');
    colorTextOutputBox.className = 'color-text-output-box tooltip';
    colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
    colorTextOutputBox.setAttribute('data-format', 'hex');
    colorTextOutputBox.textContent = colorValues.hex; 

    let tooltipText = document.createElement('span');
    tooltipText.className = 'tooltiptext';
    tooltipText.textContent = 'Copied to clipboard!';

    colorTextOutputBox.appendChild(tooltipText);

    colorTextOutputBox.addEventListener('click', () => {
        copyToClipboard(colorTextOutputBox.textContent, colorTextOutputBox);
    });

    paletteBoxTopHalf.appendChild(colorTextOutputBox);

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
    attachEventListeners(colorStripe);

    colorStripe.appendChild(paletteBox);

    return { colorStripe, paletteBoxCount: paletteBoxCount + 1 };
}


// Generate complementary palette
function generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const complementaryHue = (color.hue + 180) % 360;

    colors.push(color);

    for (let i = 2; i <= numBoxes; i++) {
        let complementarySatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let complementaryColor = {
            hue: complementaryHue,
            saturation: complementarySatAndLightness.saturation,
            lightness: complementarySatAndLightness.lightness
        };

        colors.push(complementaryColor);

        let colorBox = document.getElementById(`color-box-${i}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${complementaryColor.hue}, ${complementaryColor.saturation}%, ${complementaryColor.lightness}%)`;
            populateColorTextOutputBox(complementaryColor, i);
        }
    }
    return colors;
}


// Generate triadic hues
function generateTriadicHues(color) {
    const triadicHues = [];
    const increments = [120, 240];

    increments.forEach(increment => {
        triadicHues.push((color.hue + increment) % 360);
    });
    return triadicHues;
}


// Generate triadic palette
function generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const triadicHues = generateTriadicHues(color);

    colors.push(color);

    for (let i = 0; i < numBoxes - 1; i++) {
        let triadicHue = triadicHues[i];
        let triadicSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let triadicColor = {
            hue: triadicHue,
            saturation: triadicSatAndLightness.saturation,
            lightness: triadicSatAndLightness.lightness
        };

        colors.push(triadicColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${triadicColor.hue}, ${triadicColor.saturation}%, ${triadicColor.lightness}%)`;
            populateColorTextOutputBox(triadicColor, i + 2);
        }
    }
    return colors;
}


// Generate tetradic hues
function generateTetradicHues(color) {
    const tetradicHues = [];
    const baseHue = color.hue;
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomOffset = Math.floor(Math.random() * 46) + 20;
    const distance = 90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);
    const hue3 = (hue1 + distance) % 360;
    const hue4 = (hue3 + 180) % 360;

    tetradicHues.push(hue1, hue2, hue3, hue4);
    return tetradicHues;
}


// Generate tetradic palette
function generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const tetradicHues = generateTetradicHues(color);

    colors.push(color);

    for (let i = 0; i < tetradicHues.length; i++) {
        let tetradicHue = tetradicHues[i];
        let tetradicSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let tetradicColor = {
            hue: tetradicHue,
            saturation: tetradicSatAndLightness.saturation,
            lightness: tetradicSatAndLightness.lightness
        };

        colors.push(tetradicColor);

        let colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${tetradicColor.hue}, ${tetradicColor.saturation}%, ${tetradicColor.lightness}%)`;
            populateColorTextOutputBox(tetradicColor, i + 1);
        }
    }
    return colors;
}


// Generate hexadic hues
function generateHexadicHues(color) {
    const hexadicHues = [];
    const baseHue = color.hue;
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomDistance = Math.floor(Math.random() * 71 + 10);
    const hue3 = (hue1 + randomDistance) % 360;
    const hue4 = (hue3 + 180) % 360;
    const hue5 = (hue1 - randomDistance) % 360;
    const hue6 = (hue5 + 180) % 360;

    hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);
    return hexadicHues;
}


// Generate hexadic palette
function generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const hexadicHues = generateHexadicHues(color);

    colors.push(color);

    for (let i = 0; i < hexadicHues.length; i++) {
        let hexadicHue = hexadicHues[i];
        let hexadicSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let hexadicColor = {
            hue: hexadicHue,
            saturation: hexadicSatAndLightness.saturation,
            lightness: hexadicSatAndLightness.lightness
        };

        colors.push(hexadicColor);

        let colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${hexadicColor.hue}, ${hexadicColor.saturation}%, ${hexadicColor.lightness}%)`;
            populateColorTextOutputBox(hexadicColor, i + 1);
        }
    }
    return colors;
}


// Generate split complementary hues
function generateSplitComplementaryHues(color, numBoxes) {
    const splitComplementaryHues = [];
    const baseHue = color.hue;
    const baseComplementaryHue = (baseHue + 180) % 360;
    const modifier = Math.floor(Math.random() * 11) + 20;

    if (numBoxes >= 2) {
        splitComplementaryHues.push((baseComplementaryHue + modifier) % 360);
    }
    if (numBoxes >= 3) {
        splitComplementaryHues.push((baseComplementaryHue - modifier + 360) % 360);
    }
    return splitComplementaryHues;
}


// Generate split complementary palette
function generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const splitComplementaryHues = generateSplitComplementaryHues(color, numBoxes);

    colors.push(color);

    for (let i = 0; i < splitComplementaryHues.length; i++) {
        let splitComplementaryHue = splitComplementaryHues[i];
        let splitComplementarySatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let splitComplementaryColor = {
            hue: splitComplementaryHue,
            saturation: splitComplementarySatAndLightness.saturation,
            lightness: splitComplementarySatAndLightness.lightness
        };

        colors.push(splitComplementaryColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${splitComplementaryColor.hue}, ${splitComplementaryColor.saturation}%, ${splitComplementaryColor.lightness}%)`;
            populateColorTextOutputBox(splitComplementaryColor, i + 2);
        }
    }
    return colors;
}


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
function generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
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
function generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight) {
    let colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
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