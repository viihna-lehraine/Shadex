// Color Palette Generator - version 0.0.1
// Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal))
// License -  GPU GPLv3
// this is STRICTLY free JavaScript. No outside calls are made and all code herein is COMPLETELY free and open-source
// Program comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND


// CURRENT IMPLEMENTATION

// the maximum number of swatches is 4

// the saturation and value attributes of all colors are completely random, with outputs evenly distributed from 0 to 100, There is no further mathematical manipulation applied to these attributes at this time

// generateComplementaryPalette() will always generate a palette with swatch #1 having a perfectly complementary hue to swatches 2, 3, and 4

// genrateTriadicPalette() only works for a set of exactly 3 swatches

// generateTetradic() only works for a set of exactly 4 swatches


// BEGIN


const generateButton = document.getElementById('generateButton');
const paletteRow = document.getElementById('palette-row');
let paletteNumberOptions = document.getElementById('palette-number-options');
let paletteTypeOptions = document.getElementById('palette-type-options');
let paletteBoxCount = 1;


// prevent default click event and define intended click event
generateButton.addEventListener('click', function(e) {
    e.preventDefault();
    handleGenerateButtonClick();
});


// define button click behavior in terms of selected palette type
function handleGenerateButtonClick() {
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = paletteTypeOptions.value;

    if (selectedPaletteTypeOptionValue == "1") {
        if (numBoxes == 1) {
            generateRandomColor(numBoxes);
        } else {
            window.alert('Please select "1" for "# of colors" to generate a single random color');
        }
    } else if (selectedPaletteTypeOptionValue == "2") {
        if (numBoxes !== 1) {
            generateComplementaryPalette(numBoxes);
        } else {
            window.alert('Please select a number greater than "1" for "# of colors" to generate a complementary palette');
        }
    } else if (selectedPaletteTypeOptionValue == "3") {
        if (numBoxes == 3) {
            generateTriadicPalette(numBoxes);
        } else {
            window.alert('Please select the number "3" to generate a triadic color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "4") {
        if (numBoxes == 4) {
            generateTetradicPalette(numBoxes);
        } else {
            window.alert('Please select the number "4" to generate a triadic color palette');
        }
    } else if (slectedPaletteTypeOptionValue == "5") {
        if (numBoxes == 3) {
            generateSplitComplementaryPalette(numBoxes);
        } else {
            window.alert('Please select the number "3" to generate a split complementary color palette');
        }
    }
};


// generate a palleteBox element with all child elements
function makePaletteBox() {
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
    return paletteBox;
};


// generate palleteBox {numBoxes} number of times 
function generatePaletteBox(numBoxes) {
    paletteRow.innerHTML = '';
    paletteBoxCount = 1;

    for (let i = 0; i < numBoxes; i++) {
        const paletteBox = makePaletteBox();
        paletteRow.appendChild(paletteBox);
    }
};


// random HSL generation for Color #1
function randomHSL() {
    let hue = Math.floor((Math.random() * 360));
    let saturation = Math.floor((Math.random() * 101));
    let value = Math.floor((Math.random() * 101));
    return {hue, saturation, value};            // returns h, s, and l as an object
};

// random saturation and value attributes of new HSL
function random_SL() {
    let saturation = Math.floor((Math.random() * 101));
    let value = Math.floor((Math.random() * 101));
    return {saturation, value}
}

// generates a randomized first color
function generateColor1() {
    let color = randomHSL();

    colorBox1 = document.getElementById('color-box-1');
    colorBox1.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.value}%)`;
    
    return color;
};


// generate random color
function generateRandomColor(numBoxes) {
    generatePaletteBox(numBoxes);
    generateColor1();
};


// generate complementary palette
function generateComplementaryPalette(numBoxes) {
    generatePaletteBox(numBoxes);
    generateColor1();
    let color = generateColor1();
    generateComplementaryColors(numBoxes, color);
};


// generate colors for complementary palette
function generateComplementaryColors(numBoxes, color) {
    let complementaryHue = ((color.hue + 180) % 360);
    let complementarySatAndValue = random_SL();
    let colorBox2 = document.getElementById('color-box-2');

    colorBox2.style.backgroundColor = `hsl(${complementaryHue}, ${complementarySatAndValue.saturation}%, ${complementarySatAndValue.value}%)`;

    if (numBoxes >= 3) {
        let complementarySatAndValue2 = random_SL();
        let colorBox3 = document.getElementById('color-box-3');

        colorBox3.style.backgroundColor = `hsl(${complementaryHue}, ${complementarySatAndValue2.saturation}%, ${complementarySatAndValue2.value}%)`;
    }
    if (numBoxes >= 4) {
        let complementarySatAndValue3 = random_SL();
        let colorBox4 = document.getElementById('color-box-4');

        colorBox4.style.backgroundColor = `hsl(${complementaryHue}, ${complementarySatAndValue3.saturation}%, ${complementarySatAndValue3.value}%)`
    } 
};


// generate triadic hues from color1
function generateTriadicHues(color) {
    const triadicHues = [];
    const increments = [120, 240];

    increments.forEach(increment => {
        triadicHues.push((color.hue + increment) % 360);
    });

    return triadicHues;
};


// generate colors for triadic palette
function generateTriadicColors(numBoxes, color) {
    const triadicHues = generateTriadicHues(color);

    for (let i = 0; i < numBoxes - 1; i++) {
        const triadicHue = triadicHues[i];
        const triadicSatAndValue = random_SL();
        const colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${triadicHue}, ${triadicSatAndValue.saturation}%, ${triadicSatAndValue.value}%)`;
        }
    }
};


// generate triadic palette
function generateTriadicPalette(numBoxes) {
    generatePaletteBox(numBoxes);
    generateColor1();
    let color = generateColor1();
    generateTriadicColors(numBoxes, color);
};


// generate tetradic hues
function generateTetradicHues(color) {
    const tetradicHues = [];
    const increments = [90, 180, 270];

    increments.forEach(increment => {
        tetradicHues.push((color.hue + increment) % 360);
    });

    return tetradicHues;
};


// generate colors for tetradic palette
function generateTetradicPalette(numBoxes) {
    generatePaletteBox(numBoxes);
    generateColor1();
    let color = generateColor1();
    generateTetradicColors(numBoxes, color);
};


// generate colors for tetradic palette
function generateTetradicColors(numBoxes, color) {
    const tetradicHues = generateTetradicHues(color);

    for (let i = 0; i < numBoxes - 1; i++) {
        const tetradicHue = tetradicHues[i];
        const tetradicSatAndValue = random_SL();
        const colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${tetradicHue}, ${tetradicSatAndValue.saturation}%, ${tetradicSatAndValue.value}%)`;
        }
    }
};


// generate colors for split complementary palette
function generateSplitComplementaryHues(color) {
    // for 7/7/24
}