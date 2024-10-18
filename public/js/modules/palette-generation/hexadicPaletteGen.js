import { generateAndStoreColorValues, populateColorTextOutputBox, randomSL } from '../../export.js';


// Generate hexadic hues
function generateHexadicHues(color) {
    console.log('executing genenerateHexadicHues');
    console.log('color: ', color);

    const hexadicHues = [];
    const baseHue = color.hue;
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomDistance = Math.floor(Math.random() * 71 + 10);
    const hue3 = (hue1 + randomDistance) % 360;
    const hue4 = (hue3 + 180) % 360;
    const hue5 = (hue1 + 360 - randomDistance) % 360;
    const hue6 = (hue5 + 180) % 360;

    hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);
    
    console.log('hexadicHues: ', hexadicHues);
    console.log('generateHexadicHues execution complete');

    return hexadicHues;
};


// Generate hexadic palette
function generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {
    console.log('executing generateHexadicPalette');
    console.log(`numBoxes: ${numBoxes}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, customColor: ${customColor}, initialColorSpace: ${initialColorSpace}`);

    if (numBoxes < 6) {
        window.alert('To generate a hexadic palette, please select a number of swatches greater than 5');

        return [];
    }

    // Generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        console.log('calling generateAndStoreColorValues to define baseColor');

        baseColor = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
    } else {
        switch (initialColorSpace) {
            case 'hex':
                console.log('calling generateAndStoreColorValues');

                baseColor = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');

                break;
            case 'rgb':
                console.log('calling generateAndStoreColorValues');
            
                baseColor = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');

                break;
            case 'hsl':
                console.log('calling generateAndStoreColorValues');

                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');

                break;
            case 'hsv':
                console.log('calling generateAndStoreColorValues');

                baseColor = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');

                break;
            case 'cmyk':
                console.log('calling generateAndStoreColorValues');

                baseColor = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');

                break;
            case 'lab':
                console.log('calling generateAndStoreColorValues');

                baseColor = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');

                break;
            default:
                console.log('calling generateAndStoreColorValues');

                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
        }
    }

    console.log('calling generateHexadicHues to define hexadicHues');

    const hexadicHues = generateHexadicHues(baseColor.hue);

    console.log('hexadicHues: ', hexadicHues);

    for (let i = 0; i < numBoxes; i++) {
        const hue = hexadicHues[i % 6]; // Cycle through the hexadic hues
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);

        if (limitGrayAndBlack) {
            console.log('calling applyLimitGrayAndBlack');

            ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        }

        if (limitLight) {
            console.log('calling applyLimitLight');

            lightness = applyLimitLight(lightness);
        }

        console.log('calling generateAndStoreColorValues to define hexadicColor');

        const hexadicColor = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');

        colors.push(hexadicColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            console.log(`applying background color ${hexadicColor.hsl} to color-box #${i + 1}`);

            colorBox.style.backgroundColor = hexadicColor.hsl;

            console.log(`calling populateColorTextOutputBox for palette-box #${i + 1}`);

            populateColorTextOutputBox(hexadicColor, i + 1);
        }
    }

    console.log('generateHexadicPalette execution complete');

    return colors;
};


export { generateHexadicHues, generateHexadicPalette };