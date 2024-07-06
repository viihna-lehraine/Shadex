const generateButton = document.getElementById('generateButton');
const palleteRow = document.getElementById('pallete-row');
let palleteBoxCount = 1;

// prevent default click event and define intended click event
generateButton.addEventListener('click', function(e) {
    e.preventDefault();
    handleGenerateButtonClick();
});

// define button click behavior in terms of selected pallete type
function handleGenerateButtonClick() {
    let palleteTypeOptions = document.getElementById('pallete-type-options');
    let selectedPalleteTypeOptionValue = palleteTypeOptions.options[pallete-type-options.selectedIndex].value;
    if (selectedPalleteTypeOptionValue == "0") {
        generateMonochromaticPallete();
    };
};

// generate a palleteBox element
function makePaletteBox() {
    let palleteBox = document.createElement('div');
    palleteBox.className = 'palette-box'; 
    palleteBox.id = `palette-box-${palleteBoxCount}`;
    palleteBoxCount++;
    return palleteBox;
};


// generate palleteBox {numBoxes} number of times 
function generatePalleteBox(numBoxes) {
    // clear any existing palleteBox elements
    palleteRow.innerHTML = ''; 

    for (let i = 0; i < numBoxes; i++) {
        const paletteBox = makePaletteBox();
        paletteRow.appendChild(paletteBox);
    }
};


// Pallete Generation Functions

// generate complementary pallete
function generateComplementaryPallete() {
    let palleteBoxDiv = document.createElement('div');
    let hue = Math.floor((Math.random() * 360));
    let saturation = Math.floor((Math.random() * 101));
    let value = Math.floor((Math.random() * 101));
    let complementaryHue = ((hue + 180) % 360);
    let complementarySaturation = (100 - saturation);
    let complementaryValue = (100 - value);

    makePaletteBox(4);
};