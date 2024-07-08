// Color Palette Generator - version 0.0.21 (pre-alpha [non-working build])
// Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal))
// License -  GPU GPLv3
// this is STRICTLY free JavaScript. No outside calls are made and all code herein is COMPLETELY free and open-source
// Program comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND


// CURRENT IMPLEMENTATION

// the maximum number of swatches is 6

// the saturation and value attributes of all colors are completely random, with outputs evenly distributed from 0 to 100, There is no further mathematical manipulation applied to these attributes at this time

// generateComplementaryPalette() will always generate a palette with swatch #1 having a perfectly complementary hue to swatches 2, 3, and 4

// genrateTriadicPalette() only works for a set of exactly 3 swatches. Swatches are 120 degrees apart on the color wheel

// generateTetradicPalette() only works for a set of exactly 4 swatches. Swatches are 90 degrees apart on the color wheel

// generateSplitComplementaryPalette() only works for a set of exactly 3 swatches. Swatches 2 and 3 are at 180 degrees +/- a random  number of degrees between 20 and 30

// generateAnalogousPalette() works for a number of swatches between 2 and 6 (inclusive). First and last swatch are a maximum distance of 60 degrees apart, while individual swatches are a minimum of 10 degrees apart

// generateDyadicPalette() works for exactly 2 swatches. The distance between both hues is a randomly generated number between 45 and 75 (specifically, a multiple of 5). This number has weighted probability, with the greatest weights on 40 and 45 degrees

// limitGrayAndDark will set minimum saturation at 20 and value at 25

// limitLight functions the same as limitGray, while also limiting the maximum value to 75


// DEV NOTES

//  * try to spread value attributes apart across palettes for more variation

//  * random color should be able to generate a true random palette for any numBoxes value

//  * color stripe generation function stops palette box generation from working at all. Palette box elements fail to populate despite console logs pointing to the opposite

//  * implement monochromatic, double-complementary, square, neutral, warm, cool, pastel, high-contrast, retro, and gradient palettes


// BEGIN


const generateButton = document.getElementById('generateButton');
const paletteRow = document.getElementById('palette-row');
let paletteNumberOptions = document.getElementById('palette-number-options');
let paletteTypeOptions = document.getElementById('palette-type-options');
let paletteBoxCount = 1;


// Prevent default click event and define intended click event
generateButton.addEventListener('click', function(e) {
    e.preventDefault();
    handleGenerateButtonClick();
});


// Define button click behavior in terms of selected palette type
function handleGenerateButtonClick() {
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = paletteTypeOptions.value;
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? 1 : 0;
    let limitLight = limitLightCheckbox.checked ? 1 : 0;

    console.log("Button clicked, selected options:", { numBoxes, selectedPaletteTypeOptionValue });

    if (selectedPaletteTypeOptionValue == "1") {
        if (numBoxes == 1) {
            generateRandomColor(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select "1" for "# of colors" to generate a single random color');
        }
    } else if (selectedPaletteTypeOptionValue == "2") {
        if (numBoxes !== 1) {
            generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select a number greater than "1" for "# of colors" to generate a complementary palette');
        }
    } else if (selectedPaletteTypeOptionValue == "3") {
        if (numBoxes == 3) {
            generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select the number "3" for "# of colors" to generate a triadic color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "4") {
        if (numBoxes == 4) {
            generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select the number "4" for "# of colors" to generate a tetradic color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "5") {
        if (numBoxes == 3) {
            generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select the number "3" for "# of colors" to generate a split complementary color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "6") {
        if (numBoxes !== 1) {
            generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select a number greater than "1" for "# of colors" to generate an analogous color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "7") {
        if (numBoxes == 6) {
            generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select the number "6" for "# of colors" to generate a hexadic palette');
        }
    } else if (selectedPaletteTypeOptionValue == "8") {
        if (numBoxes == 2) {
            generateDyadicPalette(numBoxes, limitGrayAndBlack, limitLight);
        } else {
            window.alert('Please select the number "2" for "# of colors" to generate a dyadic palette');
        }
    }
}


// Generate a paletteBox element with all child elements
function makePaletteBox() {
    console.log("Creating palette box");

    let paletteBox = document.createElement('div');
    paletteBox.className = 'palette-box';
    paletteBox.id = `palette-box-${paletteBoxCount}`;

    let paletteBoxTopHalf = document.createElement('div');
    paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
    paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

    let colorTextOutputBox = document.createElement('input');
    colorTextOutputBox.className = 'color-text-output-box';
    colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;

    paletteBoxTopHalf.appendChild(colorTextOutputBox);

    let paletteBoxBottomHalf = document.createElement('div');
    paletteBoxBottomHalf.className = 'palette-box-half palette-box-bottom-half';
    paletteBoxBottomHalf.id = `palette-box-bottom-half-${paletteBoxCount}`;

    let colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.id = `color-box-${paletteBoxCount}`;

    paletteBoxBottomHalf.appendChild(colorBox);
    paletteBox.appendChild(paletteBoxTopHalf);
    paletteBox.appendChild(paletteBoxBottomHalf);

    paletteBoxCount++;

    console.log(`Palette box created with ID: palette-box-${paletteBoxCount - 1}`);

    return paletteBox;
}


// Generate paletteBox {numBoxes} number of times 
function generatePaletteBox(numBoxes) {

    console.log("generatePaletteBox() called with numBoxes: ", numBoxes);

    const paletteRow = document.getElementById('palette-row');
    if (!paletteRow) {
        console.error("ERROR - paletteRow element not found!");
    }

    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    console.log("Generating palette boxes");

    for (let i = 0; i < numBoxes; i++) {
        const paletteBox = makePaletteBox();
        if (paletteBox) {
            paletteRow.appendChild(paletteBox);
            console.log(`Appended palette box with ID: palette-box-${i + 1}`);
        } else {
            console.error("makePaletteBox did not return a valid element");
        }
    }

    console.log("paletteRow innerHTML after appending boxes: ", paletteRow.innerHTML);
}


// Populates .color-text-output-box with the HSL value
function populateColorTextOutputBox(color, boxNumber) {
    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
    if (colorTextOutputBox) {
        colorTextOutputBox.value = `hsl(${color.hue}, ${color.saturation}%, ${color.value}%)`;
    }
}

/*
// Populates #palette-row with .color-stripe elements
function populatePaletteRow(colors) {
    paletteRow.innerHTML = '';

    colors.forEach(color => {
        const colorStripe = document.createElement('div');
        colorStripe.className = 'color-stripe';
        colorStripe.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.value}%)`;
        colorStripe.style.flex = '1';
        paletteRow.appendChild(colorStripe);
    });
}
*/


// Random HSL generation for Color #1
function randomHSL(limitGrayAndBlack, limitLight) {
    let hue = Math.floor(Math.random() * 360);
    let saturation = Math.floor(Math.random() * 101);
    let value = Math.floor(Math.random() * 101);

    if ((limitGrayAndBlack === 1) || (limitLight === 1)) {
        saturation = Math.max(saturation, 20);
        value = Math.max(value, 25);
    }

    if (limitLight === 1) {
        value = Math.min(value, 75);
    }

    return { hue, saturation, value };
}


// Random saturation and value attributes of new HSL
function randomSL(limitGrayAndBlack, limitLight) {
    let saturation = Math.floor(Math.random() * 101);
    let value = Math.floor(Math.random() * 101);

    if ((limitGrayAndBlack === 1) || (limitLight === 1)) {
        saturation = Math.max(saturation, 20);
        value = Math.max(value, 25);
    }

    if (limitLight === 1) {
        value = Math.min(value, 75);
    }

    return { saturation, value };
}


// Generates a randomized 1st color
function generateColor1(limitGrayAndBlack, limitLight) {
    let color = randomHSL(limitGrayAndBlack, limitLight);
    const colorBox1 = document.getElementById('color-box-1');
    if (colorBox1) {
        colorBox1.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.value}%)`;
        populateColorTextOutputBox(color, 1);
    } 
    return color;
}


// Generate random color
function generateRandomColor(numBoxes, limitGrayAndBlack, limitLight) {
    generatePaletteBox(numBoxes);
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const colors = [color];

    populateColorTextOutputBox(color, 1);
//  populatePaletteRow(colors);
}


// Generate complementary palette
function generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight) {
    generatePaletteBox(numBoxes);
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const complementaryHue = (color.hue + 180) % 360;

    colors.push(color);

    for (let i = 2; i <= numBoxes; i++) {
        let complementarySatAndValue = randomSL(limitGrayAndBlack, limitLight);
        let complementaryColor = {
            hue: complementaryHue,
            saturation: complementarySatAndValue.saturation,
            value: complementarySatAndValue.value
        };
        colors.push(complementaryColor);

        let colorBox = document.getElementById(`color-box-${i}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${complementaryColor.hue}, ${complementaryColor.saturation}%, ${complementaryColor.value}%)`;
            populateColorTextOutputBox(complementaryColor, i);
        }
    }
    // populatePaletteRow(colors);
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
    generatePaletteBox(numBoxes);
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const triadicHues = generateTriadicHues(color);

    colors.push(color);

    for (let i = 0; i < numBoxes - 1; i++) {
        let triadicHue = triadicHues[i];
        let triadicSatAndValue = randomSL(limitGrayAndBlack, limitLight);
        let triadicColor = {
            hue: triadicHue,
            saturation: triadicSatAndValue.saturation,
            value: triadicSatAndValue.value
        };
        colors.push(triadicColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${triadicColor.hue}, ${triadicColor.saturation}%, ${triadicColor.value}%)`;
            populateColorTextOutputBox(triadicColor, i + 2);
        }
    }
//  populatePaletteRow(colors);
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
    generatePaletteBox(numBoxes);
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const tetradicHues = generateTetradicHues(color);

    colors.push(color);

    for (let i = 0; i < tetradicHues.length; i++) {
        let tetradicHue = tetradicHues[i];
        let tetradicSatAndValue = randomSL(limitGrayAndBlack, limitLight);
        let tetradicColor = {
            hue: tetradicHue,
            saturation: tetradicSatAndValue.saturation,
            value: tetradicSatAndValue.value
        };
        colors.push(tetradicColor);

        let colorBox = document.getElementById(`color-box-${i + 1}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${tetradicColor.hue}, ${tetradicColor.saturation}%, ${tetradicColor.value}%)`;
            populateColorTextOutputBox(tetradicColor, i + 1);
        }
    }
//  populatePaletteRow(colors);
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
    generatePaletteBox(numBoxes);
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const hexadicHues = generateHexadicHues(color);

    colors.push(color);

    for (let i = 0; i < hexadicHues.length; i++) {
        let hexadicHue = hexadicHues[i];
        let hexadicSatAndValue = randomSL(limitGrayAndBlack, limitLight);
        let hexadicColor = {
            hue: hexadicHue,
            saturation: hexadicSatAndValue.saturation,
            value: hexadicSatAndValue.value
        };
        colors.push(hexadicColor);

        let colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${hexadicColor.hue}, ${hexadicColor.saturation}%, ${hexadicColor.value}%)`;
            populateColorTextOutputBox(hexadicColor, i + 1);
        }
    }
//  populatePaletteRow(colors);
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
    generatePaletteBox(numBoxes);
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const splitComplementaryHues = generateSplitComplementaryHues(color, numBoxes);

    colors.push(color);

    for (let i = 0; i < splitComplementaryHues.length; i++) {
        let splitComplementaryHue = splitComplementaryHues[i];
        let splitComplementarySatAndValue = randomSL(limitGrayAndBlack, limitLight);
        let splitComplementaryColor = {
            hue: splitComplementaryHue,
            saturation: splitComplementarySatAndValue.saturation,
            value: splitComplementarySatAndValue.value
        };
        colors.push(splitComplementaryColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${splitComplementaryColor.hue}, ${splitComplementaryColor.saturation}%, ${splitComplementaryColor.value}%)`;
            populateColorTextOutputBox(splitComplementaryColor, i + 2);
        }
    }
//  populatePaletteRow(colors);
}


// Generate analogous hues
function generateAnalogousHues(color, numBoxes) {
    const analogousHues = [];
    const baseHue = color.hue;
    const maxTotalDistance = 60;
    const minTotalDistance = 10 + (numBoxes - 2) * 9;
    const totalIncrement = Math.floor(Math.random() * (maxTotalDistance - minTotalDistance + 1)) + minTotalDistance;
    const increment = totalIncrement / (numBoxes - 1);

    for (let i = 1; i < numBoxes; i++) {
        analogousHues.push((baseHue + increment * i) % 360);
    }

    return analogousHues;
}


// Generate analogous palette
function generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight) {
    generatePaletteBox(numBoxes);
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const analogousHues = generateAnalogousHues(color, numBoxes);

    colors.push(color);

    for (let i = 0; i < analogousHues.length; i++) {
        let analogousHue = analogousHues[i];
        let analogousSatAndValue = randomSL(limitGrayAndBlack, limitLight);
        let analogousColor = {
            hue: analogousHue,
            saturation: analogousSatAndValue.saturation,
            value: analogousSatAndValue.value
        };
        colors.push(analogousColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${analogousColor.hue}, ${analogousColor.saturation}%, ${analogousColor.value}%)`;
            populateColorTextOutputBox(analogousColor, i + 2);
        }
    }
//  populatePaletteRow(colors);
}


// Generate dyadic hues
function generateDyadicHues(color, numBoxes) {
    const dyadicHues = [];
    const baseHue = color.hue;
    const randomDistance = getWeightedRandomInterval();
    const hue1 = baseHue;
    const hue2 = (hue1 + randomDistance) % 360;

    dyadicHues.push(hue1, hue2);

    return dyadicHues;
}


// Generate dyadic color palette

function generateDyadicPalette(numBoxes, limitGrayAndBlack, limitLight) {
    generatePaletteBox(numBoxes);
    let colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const dyadicHues = generateDyadicHues(color, numBoxes);

    colors.push(color);

    for (let i = 0; i < dyadicHues.length; i++) {
        let dyadicHue = dyadicHues[i];
        let dyadicSatAndValue = randomSL(limitGrayAndBlack, limitLight);
        let dyadicColor = {
            hue: dyadicHue,
            saturation: dyadicSatAndValue.saturation,
            value: dyadicSatAndValue.value
        };
        let colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${dyadicColor.hue}, ${dyadicColor.saturation}%, ${dyadicColor.value}%)`;
            populateColorTextOutputBox(dyadicColor, i + 1);
        }
    }
//  populatePaletteRow(colors);
}


// generate random weighted interval (for dyadic palette)
function getWeightedRandomInterval() {
    const weights = [40, 45, 50, 55, 60, 65, 70];
    const probabilities = [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]; // Sum should be 1
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

    // executes in case of rounding errors
    return weights[weights.length - 1];
}