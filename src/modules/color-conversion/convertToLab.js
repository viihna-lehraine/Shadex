// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { rgbToXYZ, hexToRGB, hslToRGB } from './index.js';


// Convert XYZ to Lab
function xyzToLab(x, y, z) {
    try {
        console.log(`Converting XYZ to Lab: X=${x}, Y=${y}, Z=${z}`);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            throw new Error(`Invalid XYZ values: X=${x}, Y=${y}, Z=${z}`);
        }

        const refX = 95.047, refY = 100.000, refZ = 108.883;

        x = x / refX;
        y = y / refY;
        z = z / refZ;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

        const l = (116 * y) - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);

        const lab = { l: l.toFixed(2), a: a.toFixed(2), b: b.toFixed(2) };
        console.log(`Converted Lab: ${JSON.stringify(lab)}`);

        return lab;
    } catch (error) {
        console.error(`Error converting XYZ to Lab: ${error}`);

        // Return black for invalid inputs
        return { l: 0, a: 0, b: 0 }; 
    }
}


// Convert Hex to Lab
function hexToLab(hex) {
    try {
        console.log(`Converting Hex to Lab: ${hex}`);
        const rgb = hexToRGB(hex);
        console.log(`Converted RGB from Hex: ${JSON.stringify(rgb)}`);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        const lab = xyzToLab(xyz.x, xyz.y, xyz.z);

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    } catch (error) {
        console.error(`Error converting Hex to Lab: ${error}`);

        // Return black for invalid inputs
        return { l: 0, a: 0, b: 0 }; 
    }
}


// Convert RGB to Lab
function rgbToLab(red, green, blue) {
    try {
        console.log(`Converting RGB to Lab: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        const xyz = rgbToXYZ(red, green, blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`Error converting RGB to Lab: ${error}`);
        
        // Return black for invalid inputs
        return { l: 0, a: 0, b: 0 }; 
    }
}


// Convert HSL to Lab
function hslToLab(hue, saturation, lightness) {
    try {
        console.log(`Converting HSL to Lab: H=${hue}, S=${saturation}, L=${lightness}`);
        const rgb = hslToRGB(hue, saturation, lightness);
        console.log(`Converted RGB from HSL: ${JSON.stringify(rgb)}`);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`Error converting HSL to Lab: ${error}`);
        
        // Return black for invalid inputs
        return { l: 0, a: 0, b: 0 }; 
    }
}


// Convert HSV to Lab
function hsvToLab(hue, saturation, value) {
    try {
        console.log(`Converting HSV to Lab: H=${hue}, S=${saturation}, V=${value}`);
        const rgb = hsvToRGB(hue, saturation, value);
        console.log(`Converted RGB from HSV: ${JSON.stringify(rgb)}`);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`Error converting HSV to Lab: ${error}`);
        
        // Return black for invalid inputs
        return { l: 0, a: 0, b: 0 };
    }
}


// Convert CMYK to Lab
function cmykToLab(cyan, magenta, yellow, key) {
    try {
        console.log(`Converting CMYK to Lab: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`Converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`Error converting CMYK to Lab: ${error}`);
        
        // Return black for invalid inputs
        return { l: 0, a: 0, b: 0 };
    }
}


export { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab }