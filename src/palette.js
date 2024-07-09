// Color Palette Generator - version 0.3

// Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal))

// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// All code herein is STRICTLY free (as in freedom) and will always remain that way. You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful! I only ask that you show me what you did so that I can observe and learn.

// This program comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND



// CURRENT IMPLEMENTATION


// the maximum number of swatches is 6

// the saturation and lightness attributes of all colors are completely random, with outputs evenly distributed from 0 to 100, There is no further mathematical manipulation applied to these attributes at this time

// generateComplementaryPalette() will always generate a palette with swatch #1 having a perfectly complementary hue to swatches 2, 3, and 4

// genrateTriadicPalette() only works for a set of exactly 3 swatches. Swatches are 120 degrees apart on the color wheel

// generateTetradicPalette() only works for a set of exactly 4 swatches. Swatches are 90 degrees apart on the color wheel

// generateSplitComplementaryPalette() only works for a set of exactly 3 swatches. Swatches 2 and 3 are at 180 degrees +/- a random  number of degrees between 20 and 30

// generateAnalogousPalette() works for a number of swatches between 2 and 6 (inclusive). First and last swatch are a maximum distance of 60 degrees apart, while individual swatches are a minimum of 10 degrees apart

// generateDiadicPalette() works for exactly 2 swatches. The distance between both hues is a randomly generated number between 45 and 75 (specifically, a multiple of 5). This number has weighted probability, with the greatest weights on 40 and 45 degrees

// limitGrayAndDark will set minimum saturation at 20 and lightness at 25

// limitLight functions the same as limitGray, while also limiting the maximum lightness to 75

// drag and drop color swatches

// convert between 6 color formats



// DEV NOTES


//  * random color should be able to generate a true random palette for any numBoxes value

//  * possible other palette types - monochromatic, double-complementary, square (tetradic at 90 degrees), neutral, warm, cool, pastel, high-contrast, retro, gradient, muted, jewel-tone, warm analogous, cool analogous, minimalist, earth-tone, greyscale, floral, sunset, ocean, bright-and-bold, gradient, neon, seasons (each), metallic, primary, secondary, low contrast, candy, desert, tropical, cosmic, forest, compound, flipped analogous, clash, custom interval, equidistant, complementary gradient, tonal, fluorescent

//  * color square, interactive (top left side of page. When clicking color swatch, should populate with a color square displaying the swatch's color

//  * save color palettes to history

//  * tooltips

//  * button animations

//  * top bar with FAQ & About



// BUGS

// None observed at this time




// IN PROGRESS

//  copy palette to clipboard on click



// BEGIN



const generateButton = document.getElementById('generate-button');
const paletteRow = document.getElementById('palette-row');
let paletteNumberOptions = document.getElementById('palette-number-options');
let paletteTypeOptions = document.getElementById('palette-type-options');
let paletteBoxCount = 1;
let dragSrcEl = null;

const conversionMap = {
    hsl: {
        rgb: hslToRGB,
        hex: hslToHex,
        hsv: hslToHSV,
        cmyk: hslToCMYK,
        lab: hslToLab
    },
    rgb: {
        hsl: rgbToHSL,
        hex: rgbToHex,
        hsv: rgbToHSV,
        cmyk: rgbToCMYK,
        lab: rgbToLab
    },
    hex: {
        rgb: hexToRGB,
        hsl: hexToHSL,
        hsv: hexToHSV,
        cmyk: hexToCMYK,
        lab: hexToLab
    },
    hsv: {
        rgb: hsvToRGB,
        hsl: hsvToHSL,
        hex: hsvToHex,
        cmyk: hsvToCMYK,
        lab: hsvToLab
    },
    cmyk: {
        rgb: cmykToRGB,
        hex: cmykToHex,
        hsl: cmykToHSL,
        hsv: cmykToHSV,
        lab: cmykToLab
    },
    lab: {
        rgb: labToRGB,
        hex: labToHex,
        hsl: labToHSL,
        hsv: labToHSV,
        cmyk: labToCMYK
    }
};

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


// Define button click behavior in terms of selected palette type
function handleGenerateButtonClick() {
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


// Generate a paletteBox element with all child elements
function makePaletteBox(color, paletteBoxCount) {
    let paletteBox = document.createElement('div');
    paletteBox.className = 'palette-box';
    paletteBox.id = `palette-box-${paletteBoxCount}`;

    let paletteBoxTopHalf = document.createElement('div');
    paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
    paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

    let colorTextOutputBox = document.createElement('div');
    colorTextOutputBox.className = 'color-text-output-box tooltip';
    colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
    colorTextOutputBox.setAttribute('data-format', 'hsl');
    colorTextOutputBox.textContent = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

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
    colorBox.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

    paletteBoxBottomHalf.appendChild(colorBox);
    paletteBox.appendChild(paletteBoxTopHalf);
    paletteBox.appendChild(paletteBoxBottomHalf);

    let colorStripe = document.createElement('div');
    colorStripe.className = 'color-stripe';
    colorStripe.id = `color-stripe-${paletteBoxCount}`;
    colorStripe.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

    colorStripe.setAttribute('draggable', true);
    attachEventListeners(colorStripe);

    colorStripe.appendChild(paletteBox);

    return { colorStripe, paletteBoxCount: paletteBoxCount + 1 };
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


// Populates .color-text-output-box with the HSL attribute
function populateColorTextOutputBox(color, boxNumber) {
    let colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);

    if (colorTextOutputBox) {
        colorTextOutputBox.value = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
        colorTextOutputBox.setAttribute('data-format', 'hsl');
    }
}


// Populates #palette-row with .color-stripe elements
function populateColorStripe(colors, numBoxes) {
    for (let i = 0; i < numBoxes; i++) {
        let colorStripe = document.getElementById(`color-stripe-${i + 1}`);

        colorStripe.style.backgroundColor = `hsl(${colors[i].hue}, ${colors[i].saturation}%, ${colors[i].lightness}%)`;
    }
}


// Random HSL generation for color 1
function randomHSL(limitGrayAndBlack, limitLight) {
    let hue = Math.floor(Math.random() * 360);
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    if ((limitGrayAndBlack === 1) || (limitLight === 1)) {
        saturation = Math.max(saturation, 20);
        lightness = Math.max(lightness, 25);
    }

    if (limitLight === 1) {
        lightness = Math.min(lightness, 75);
    }
    return { hue, saturation, lightness };
}


// Random saturation and lightness attributes of new HSL
function randomSL(limitGrayAndBlack, limitLight) {
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    if ((limitGrayAndBlack === 1) || (limitLight === 1)) {
        saturation = Math.max(saturation, 20);
        lightness = Math.max(lightness, 25);
    }

    if (limitLight === 1) {
        lightness = Math.min(lightness, 75);
    }
    return { saturation, lightness };
}


// Generates a randomized 1st color
function generateColor1(limitGrayAndBlack, limitLight) {
    let color = randomHSL(limitGrayAndBlack, limitLight);
    const colorBox1 = document.getElementById('color-box-1');

    if (colorBox1) {
        colorBox1.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
        populateColorTextOutputBox(color, 1);
    }
    return color;
}


// Generate random color
function generateRandomColor(limitGrayAndBlack, limitLight) {
    const color = generateColor1(limitGrayAndBlack, limitLight);

    populateColorTextOutputBox(color, 1);
    return color;
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


// Drag and Drop - 1st function
function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    this.classList.add('dragging');
}


// Drag and Drop - 2nd function
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    return false;
}


// Drag and Drop - 3rd function
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        const dragSrcId = dragSrcEl.id;
        const dropTargetId = this.id;
        const dragSrcText = dragSrcEl.querySelector('.color-text-output-box').value;
        const dropTargetText = this.querySelector('.color-text-output-box').value;
        const dragSrcOuterHTML = dragSrcEl.outerHTML;
        const dropTargetOuterHTML = this.outerHTML;

        dragSrcEl.outerHTML = dropTargetOuterHTML;
        this.outerHTML = dragSrcOuterHTML;

        const newDragSrcEl = document.getElementById(dropTargetId);
        const newDropTargetEl = document.getElementById(dragSrcId);

        newDragSrcEl.id = dragSrcId;
        newDropTargetEl.id = dropTargetId;

        newDragSrcEl.querySelector('.color-text-output-box').value = dropTargetText;
        newDropTargetEl.querySelector('.color-text-output-box').value = dragSrcText;

        attachEventListeners(newDragSrcEl);
        attachEventListeners(newDropTargetEl);
    }
    return false;
}


// Drag and Drop - 4th function
function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.color-stripe').forEach((el) => {
        el.classList.remove('dragging');
    });
}


// Drag and Drop - attach drag and drop event listeners to elements
function attachEventListeners(element) {
    if (element) {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('drop', handleDrop);
        element.addEventListener('dragend', handleDragEnd);
    }
}


// Convert Hex to HSL
function hexToHSL(hex) {
    const rgb = hexToRGB(hex);
    const hsl = rgbToHSL(rgb.red, rgb.green, rgb.blue);
}


// Convert Hex to RGB
function hexToRGB(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    let red = (bigint >> 16) & 255;
    let green = (bigint >> 8) & 255;
    let blue = bigint & 255;

    return { red, green, blue };
}


// Convert Hex to HSV
function hexToHSV(hex) {
    const rgb = hexToRGB(hex);

    return rgbToHSV(rgb.red, rgb.green, rgb.blue);
}


// Convert Hex to CMYK
function hexToCMYK(hex) {
    const rgb = hexToRGB(hex);

    return rgbToCMYK(rgb.red, rgb.blue, rgb.green);
}


// Convert Hex to Lab
function hexToLab(hex) {
    const rgb = hexToRGB(hex);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert HSL to Hex
function hslToHex(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);

    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert HSL to RGB
function hslToRGB(hue, saturation, lightness) {
    hue = hue / 360;
    saturation = saturation / 100;
    lightness = lightness / 100;

    let red, green, blue;

    if (saturation === 0) {
        red = green = blue = lightness;
    } else {
        const hueToRGB = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        const p = 2 * lightness - q;

        red = hueToRGB(p, q, hue + 1/3);
        green = hueToRGB(p, q, hue);
        blue = hueToRGB(p, q, hue - 1/3);
    }

    red = Math.round(red * 255);
    green = Math.round(green * 255);
    blue = Math.round(blue * 255);
    
    return { red, green, blue };
}


// Convert HSL to HSV
function hslToHSV(hue, saturation, lightness) {
    saturation /= 100;
    lightness /= 100;

    const value = lightness + saturation * Math.min(lightness, 1 - lightness);

    const newSaturation = value === 0 ? 0 : 2 * (1 - lightness / value);

    return {
        hue: Math.floor(hue),
        saturation: Math.floor(newSaturation * 100),
        value: Math.floor(value * 100)
    };
}


// Convert HSL to CMYK
function hslToCMYK(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}


// Convert HSL to Lab
function hslToLab(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);

}


// convert RGB to HSL
function rgbToHSL(red, green, blue) {
    red = red / 255;
    green = green / 255;
    blue = blue / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let hue, saturation, lightness = (max + min) / 2;

    if (max === min) {
        hue = 0;
        saturation = 0;
    } else {
        const delta = max - min;
        saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        switch (max) {
            case red:
                hue = (green - blue) / delta + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / delta + 2;
                break;
            case blue:
                hue = (red - green) / delta + 4;
                break;
        }
        hue *= 60;
    }
    return {
        hue: Math.round(hue),
        saturation: Math.round(saturation * 100),
        lightness: Math.round(lightness * 100)
    };
}


// convert RGB to Hex
function rgbToHex(red, green, blue) {
    return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}


// convert RGB to HSV
function rgbToHSV(red, green, blue) {

    red /= 255;
    green /= 255;
    blue /= 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const value = max;
    const delta = max - min;
    const saturation = max === 0 ? 0 : delta / max;
    let hue;

    if (max === min) {
        hue = 0; // achromatic
    } else {
        switch (max) {
            case red:
                hue = (green - blue) / delta + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / delta + 2;
                break;
            case blue:
                hue = (red - green) / delta + 4;
                break;
        }
        hue *= 60;
    }
    return {
        hue: Math.round(hue),
        saturation: Math.round(saturation * 100),
        value: Math.round(value * 100)
    };
}


// Convert RGB to CMYK
function rgbToCMYK(red, green, blue) {
    const redPrime = red / 255;
    const greenPrime = green / 255;
    const bluePrime = blue / 255;

    const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
    const cyan = (1 - redPrime - key) / (1 - key) || 0;
    const magenta = (1 - greenPrime - key) / (1 - key) || 0;
    const yellow = (1 - bluePrime - key) / (1 - key) || 0;

    return {
        cyan: Math.round(cyan * 100),
        magenta: Math.round(magenta * 100),
        yellow: Math.round(yellow * 100),
        key: Math.round(key * 100)
    };
}


// Convert RGB to Lab
function rgbToLab(red, green, blue) {
    const xyz = rgbToXYZ(red, green, blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert HSV to Hex
function hsvToHex(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert HSV to HSL
function hsvToHSL(hue, saturation, value) {
    saturation /= 100;
    value /= 100;

    let lightness = value * (1 - saturation / 2);
    let newSaturation = (lightness === 0 || lightness === 1) ? 0 : (value - lightness) / Math.min(lightness, 1 - lightness);

    return {
        hue: hue,
        saturation: Math.floor(newSaturation * 100),
        lightness: Math.floor(lightness * 100)
    };
}


// Convert HSV to RGB
function hsvToRGB(hue, saturation, value) {
    saturation /= 100;
    value /= 100;

    let red, green, blue;

    const i = Math.floor(hue / 60);
    const f = hue / 60 - i;
    const p = value * (1 - saturation);
    const q = value * (1 - saturation * f);
    const t = value * (1 - saturation * (1 - f));

    switch (i % 6) {
        case 0: red = value, green = t, blue = p; break;
        case 1: red = q, green = value; blue = p; break;
        case 2: red = p, green = value; blue = t; break;
        case 3: red = p, green = q, blue = value; break;
        case 4: red = t, green = p, blue = value; break;
        case 5: red = value, green = p, blue = q; break; 
    }

    red = Math.round(red * 255);
    green = Math.round(green * 255);
    blue = Math.round(blue * 255);

    return { red, green, blue };
}


// Convert HSV to CMYK
function hsvToCMYK(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}


// Convert HSV to Lab
function hsvToLab(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert CMYK to Hex
function cmykToHex(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert CMYK to HSL
function cmykToHSL(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHSL(rgb.red, rgb.green, rgb.blue);
}


// Convert CMYK to RGB
function cmykToRGB(cyan, magenta, yellow, key) {
    const red = 255 * (1 - cyan / 100) * (1 - key / 100);
    const green = 255 * (1 - magenta / 100) * (1 - key / 100);
    const blue = 255 * (1 - yellow / 100) * (1 - key / 100);

    return {
        red: Math.round(red),
        green: Math.round(green),
        blue: Math.round(blue)
    }
}


// Convert CMYK to HSV
function cmykToHSV(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHSV(rgb.red, rgb.green, rgb.blue);
}


// Convert CMYK to Lab
function cmykToLab(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert Lab to Hex
function labToHex(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


//Convert Lab to HSL
function labToHSL(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHSL(rgb.red, rgb.green, rgb.blue);
}


// Convert Lab to RGB
function labToRGB(l, a, b) {
    const xyz = labToXYZ(l, a, b);
    return xyzToRGB(xyz.x, xyz.y, xyz.z);
}


// Convert Lab to HSV
function labToHSV(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHSV(rgb.red, rgb.green, rgb.blue);
}


// Convert Lab to CMYK
function labToCMYK(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}



// Convert color component to Hex
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}


// Convert RGB to XYZ
function rgbToXYZ(red, green, blue) {
    red = red / 255; green = green / 255; blue = blue / 255;

    red = red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
    green = green > 0.04045 ? Math.pow((green + 0.055) / 1.055, 2.4) : green / 12.92;
    blue = blue > 0.04045 ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue / 12.92;

    red = red * 100; green = green * 100; blue * 100;

    const x = red * 0.4124 + green * 0.3576 + blue * 0.1805;
    const y = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    const z = red * 0.0193 + green * 0.1192 + blue * 0.9505;

    return { x, y, z};
}


// Convert XYZ to Lab
function xyzToLab(x, y, z) {
    const refX = 95.047, refY = 100.000, refZ = 108.883;

    x = x / refX;
    y = y / refY;
    z = z / refZ;

    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

    const l = (116 * y) - 16;
    const a = 500 * (x - z);
    const b = 200 * (y - z);

    return { l, a, b };
}


// Convert Lab to XYZ
function labToXYZ(l, a, b) {
    const refX = 95.047, refY = 100.000, refZ = 108.883;

    let y = (l + 16) / 116;
    let x = a / 500 + y;
    let z = y - b / 200;

    const pow = Math.pow;

    x = refX * (pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787);
    y = refY * (pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787);
    z = refZ * (pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787);

    return { x, y, z };
}


// Convert XYZ to RGB
function xyzToRGB(x, y, z) {
    x = x / 100;
    y = y / 100;
    z = z / 100;

    let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let blue = x * 0.0557 + y * -0.2040 + z * 1.0570;

    red = red > 0.0031308 ? 1.055 * Math.pow(red, 1 / 2.4) - 0.055 : 12.92 * red;
    green = green > 0.0031308 ? 1.055 * Math.pow(green, 1 / 2.4) - 0.055 : 12.92 * green;
    blue = blue > 0.0031308 ? 1.055 * Math.pow(blue, 1 / 2.4) - 0.055 : 12.92 * blue;

    red = Math.min(Math.max(0, red), 1);
    green = Math.min(Math.max(0, green), 1);
    blue = Math.min(Math.max(0, blue), 1);

    return {
        red: Math.round(red * 255),
        green: Math.round(green * 255),
        blue: Math.round(blue * 255)
    };
}


// Master Color Conversion Function
function convertColors(targetFormat) {
    const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');

    colorTextOutputBoxes.forEach(box => {
        const currentFormat = box.getAttribute('data-format');
        let color;

        if (currentFormat === 'hex') {
            color = box.textContent;
        } else {
            color = box.textContent.match(/-?\d*\.?\d+/g).map(Number);
        }

        console.log(`Converting from ${currentFormat} to ${targetFormat}:`, color);

        const conversionFn = conversionMap[currentFormat][targetFormat];

        if (!conversionFn) {
            console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
            return;
        }

        let newColor;
        if (Array.isArray(color)) {
            newColor = conversionFn(...color);
        } else {
            newColor = conversionFn(color);
        }

        console.log(`Converted color:`, newColor);

        box.textContent = formatColor(newColor, targetFormat);
        box.setAttribute('data-format', targetFormat);
        console.log(`Updated box textContent:`, box.textContent);
    });
}


// Master Color Formatting Function
function formatColor(color, format) {
    if (format === 'hex') {
        return color;
    } else if (format === 'rgb') {
        return `rgb(${color.red}, ${color.green}, ${color.blue})`;
    } else if (format === 'hsl') {
        return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
    } else if (format === 'hsv') {
        return `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`;
    } else if (format === 'cmyk') {
        return `cmyk(${color.cyan}%, ${color.magenta}%, ${color.yellow}%, ${color.key}%)`;
    } else if (format === 'lab') {
        return `lab(${color.l.toFixed(2)}, ${color.a.toFixed(2)}, ${color.b.toFixed(2)})`;
    }
    return color;
}



// Copy Color Values to Clipboard on Click
function copyToClipboard(text, tooltipElement) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard:', text);
        showTooltip(tooltipElement);
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
    });
}


// Show Tooltip for Copy to Clipbaoard
function showTooltip(tooltipElement) {
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