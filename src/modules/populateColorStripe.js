// was chillin' in dom.js
// not in use so I ditched it and put it here

// Populates #palette-row with .color-stripe elements
function populateColorStripe(colors, numBoxes) {
    for (let i = 0; i < numBoxes; i++) {
        let colorStripe = document.getElementById(`color-stripe-${i + 1}`);

        colorStripe.style.backgroundColor = `hsl(${colors[i].hue}, ${colors[i].saturation}%, ${colors[i].lightness}%)`;
    }
}