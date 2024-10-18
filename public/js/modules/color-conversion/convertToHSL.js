import { hexToRGB } from '../../export.js';


// Convert Hex to HSL
function hexToHSL(hexValue) {
    console.log('hexToHSL() executing');
    console.log('hexToHSL() - hexValue: ', hexValue, ' type: ', (typeof hexValue));

    try {
        console.log(`hexToHSL() - converting Hex to HSL: ${hexValue}`);
        console.log('hexToHSL() - calling hexToRGB()');
        const rgb = hexToRGB(hexValue.value);
        console.log(`hexToHSL() - converted RGB from Hex: ${JSON.stringify(rgb)}`);
        console.log('hexToHSL() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('hexToHSL() - calling rgbToHSL');
        const hsl = rgbToHSL(rgb.red, rgb.green, rgb.blue);
        console.log(`hexToHSL() - converted HSL from RGB: ${JSON.stringify(hsl)}`);
        console.log('hexToHSL() - hsl: ', hsl, ' type: ', (typeof hsl));
        console.log('hexToHSL complete - returning hsl as an object');
        return hsl; // return hsl as an object

    } catch (error) {
        console.error(`hexToHSL() - error converting Hex to HSL: ${error}`);
        console.log('hextoHSL() complete - returning { hue: 0, saturation: 0, lightness: 0 }')
        return { hue: 0, saturation: 0, lightness: 0 }; // return black for invalid inputs
    }
};


// convert RGB to HSL
function rgbToHSL(red, green, blue) {
    console.log('rgbToHSL() executing');
    console.log('rgbToHSL() - red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('rgbToHSL() > types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`rgbToHSL() - converting RGB to HSL: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`rgbToHSL() - invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

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

        console.log(`rgbToHSL() - converted HSL: H=${hue}, S=${saturation * 100}, L=${lightness * 100}`);

        
        hue = Math.round(hue);
        saturation = Math.round(saturation * 100);
        lightness = Math.round(lightness * 100);

        console.log('rgbToHSL() - hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
        console.log('rgbToHSL() - types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

        let hsl = { hue, saturation, lightness };

        console.log('rgbToHSL() - hsl: ', hsl, ' type: ', (typeof hsl));
        console.log('rgbToHSL() complete - returning hsl as an object');
        return hsl; // return the HSL object

    } catch (error) {
        console.error(`rgbToHSL() - error converting RGB to HSL: ${error}`);

        let hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness }; // return black for invalid inputs

        console.log('rgbToHSL() - hsl: ', hsl, ' type: ', (typeof hsl));
        console.log('rgbToHSL() - execution of rgbToHSL complete');
        return hsl; // return the HSL object
    }
};


// Convert HSV to HSL
function hsvToHSL(hue, saturation, value) {
    console.log('hsvToHSL() complete');
    console.log('hsvToHSL() - hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('hsvToHSL() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`hsvToHSL() - converting HSV to HSL: H=${hue}, S=${saturation}, V=${value}`);

        if (isNaN(hue) || isNaN(saturation) || isNaN(value)) {
            throw new Error(`hsvToHSL() - invalid HSV values: H=${hue}, S=${saturation}, V=${value}`);
        }

        saturation /= 100;
        value /= 100;

        let lightness = value * (1 - saturation / 2);
        let newSaturation = (lightness === 0 || lightness === 1) ? 0 : (value - lightness) / Math.min(lightness, 1 - lightness);

        console.log(`hsvToHSL() - converted HSL: H=${hue}, S=${newSaturation * 100}, L=${lightness * 100}`);

        hue = Math.round(hue);
        saturation = Math.round(saturation * 100);
        lightness = Math.round(lightness * 100);

        console.log('hsvToHSL() - hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
        console.log('hsvToHSL() - types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

        hsl = { hue, saturation, lightness };
        
        console.log('hsvToHSL() - hsl: ', hsl, ' type: ', (typeof hsl));
        console.log('hsvToHSL() - execution of hsvToHSL complete');
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`
    } catch (error) {
        console.error(`hsvToHSL() - error converting HSV to HSL: ${error}`);
        hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness }; // return black for invalid inputs
        console.log('hsvtoHSL() - hsl: ', hsl, ' type: ', (typeof hsl));
        console.log('hsvToHSL complete - returning hsl as a formatted string');
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
};


// Convert CMYK to HSL
function cmykToHSL(cyan, magenta, yellow, key) {
    console.log('cmykToHSL() executing');
    console.log('cmykToHSL() - cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('cmykToHSL() > types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`cmykToHSL() - converting CMYK to HSL: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`cmykToHSL() - converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        console.log('cmykToHSL() - rgb: ', rgb, ' type: ', (typeof rgb))
        console.log('cmykToHSL() complete');
        return rgbToHSL(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`cmykToHSL() - error converting CMYK to HSL: ${error}`);
        hue, saturation, lightness = 0; // return black for invalid inputs
        hsl = { hue, saturation, lightness };

        console.log('cmykToHSL() - hsl: ', hsl, ' type: ', (typeof hsl));
        console.log('cmykToHSL() complete - returning hsl as a formatted string');
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
};


//Convert Lab to HSL
function labToHSL(l, a, b) {
    console.log('labToHSL() executing');
    console.log('labToHSL() - l: ', l, ' a: ', a, ' b: ', b);
    console.log('labToHSL() > types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

    try {
        console.log(`labToHSL() - converting Lab to HSL: L=${l}, A=${a}, B=${b}`);
        const rgb = labToRGB(l, a, b);
        console.log(`labToHSL() - converted RGB from Lab: ${JSON.stringify(rgb)}`);
        console.log('labToHSL() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('labToHSL() complete');
        return rgbToHSL(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`labToHSL() - error converting Lab to HSL: ${error}`);
        hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness }; // return black for invalid inputs  
        console.log('labToHSL() - hsl: ', hsl, ' type: ', (typeof hsl));
        console.log('labToHSL() complete - returning hsl as a formatted string');
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`; 
    }
};


export { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL };