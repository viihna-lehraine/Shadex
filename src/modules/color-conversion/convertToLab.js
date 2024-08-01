// ColorGen - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { rgbToXYZ, hexToRGB, hslToRGB, hsvToRGB } from './index.js';


// Convert XYZ to Lab
function xyzToLab(x, y, z) {
    console.log('executing xyzToLab');
    console.log('x: ', x, ' y: ', y, ' z: ', z);
    console.log('types - x: ', (typeof x), ' y: ', (typeof y), ' z: ', (typeof z));

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

        let l = (116 * y) - 16;
        let a = 500 * (x - y);
        let b = 200 * (y - z);

        console.log('l: ', l, ' a: ', a, ' b: ', b);
        console.log('types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));


        l = l.toFixed(2);
        a = a.toFixed(2);
        b = b.toFixed(2);

        console.log('truncating { l, a, b } values');
        console.log('l: ', l, ' a: ', a, ' b: ', b);
        console.log('types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

        const lab = { l, a, b };
        console.log(`Converted Lab: ${JSON.stringify(lab)}`);
        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of xyzToLab complete');

        return lab;
        
    } catch (error) {
        console.error(`Error converting XYZ to Lab: ${error}`);

        // Return black for invalid inputs
        const lab = { l: 0, a: 0, b: 0 };

        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of xyzToLab complete');

        return lab;
    }
}


// Convert Hex to Lab
function hexToLab(hex) {
    console.log('executing hexToLab');
    console.log('hex: ', hex, ' data type ', (typeof hex));

    try {
        console.log(`Converting Hex to Lab: ${hex}`);
        console.log('calling hexToRGB');
        const rgb = hexToRGB(hex);
        console.log(`Converted RGB from Hex: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('calling rgbToXYZ');
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log('xyz: ', xyz, ' type: ', (typeof xyz));
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('calling xyzToLab');
        const lab = xyzToLab(xyz.x, xyz.y, xyz.z);
        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of hexToLab complete');

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;

    } catch (error) {
        console.error(`Error converting Hex to Lab: ${error}`);

        // Return black for invalid inputs
        let l, a, b = 0;
        let lab = { l, a, b };

        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of hexToLab complete');

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
}


// Convert RGB to Lab
function rgbToLab(red, green, blue) {
    console.log('executing rgbToLab');
    console.log('red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`Converting RGB to Lab: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        console.log('calling rgbToXYZ');
        const xyz = rgbToXYZ(red, green, blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('xyz: ', xyz, ' type: ', (typeof xyz));
        console.log('execution of rgbToLab complete');

        return xyzToLab(xyz.x, xyz.y, xyz.z);

    } catch (error) {
        console.error(`Error converting RGB to Lab: ${error}`);
        
        // Return black for invalid inputs
        let l, a, b = 0;
        let lab = { l, a, b };

        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of rgbToLab complete');

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
}


// Convert HSL to Lab
function hslToLab(hue, saturation, lightness) {
    console.log('executing hslToLab');
    console.log('hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

    try {
        console.log(`Converting HSL to Lab: H=${hue}, S=${saturation}, L=${lightness}`);
        console.log('calling hslToRGB');
        const rgb = hslToRGB(hue, saturation, lightness);
        console.log(`Converted RGB from HSL: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('calling rgbToXYZ');
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('xyz: ', xyz, ' type: ', (typeof xyz));
        console.log('execution of hslToLab complete');

        return xyzToLab(xyz.x, xyz.y, xyz.z);

    } catch (error) {
        console.error(`Error converting HSL to Lab: ${error}`);
        
        // Return black for invalid inputs
        let l, a, b = 0;
        let lab = { l, a, b };

        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of hslToLab complete');

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
}


// Convert HSV to Lab
function hsvToLab(hue, saturation, value) {
    console.log('executing hsvToLab');
    console.log('hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`Converting HSV to Lab: H=${hue}, S=${saturation}, V=${value}`);
        console.log('calling hsvToRGB');
        const rgb = hsvToRGB(hue, saturation, value);
        console.log(`Converted RGB from HSV: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('calling rgbToXYZ');
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('xyz: ', xyz, ' type: ', (typeof xyz));
        console.log('execution of hsvToLab complete');

        return xyzToLab(xyz.x, xyz.y, xyz.z);

    } catch (error) {
        console.error(`Error converting HSV to Lab: ${error}`);
        
        // Return black for invalid inputs
        let l, a, b = 0;
        let lab = { l, a, b };

        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of hsvToLab complete');

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
}


// Convert CMYK to Lab
function cmykToLab(cyan, magenta, yellow, key) {
    console.log('executing cmykToLab');
    console.log('cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`Converting CMYK to Lab: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        console.log('calling cmykToRGB');
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`Converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('calling rgbToXYZ');
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('execution of cmykToLab complete. return statement calls xyzToLab');

        return xyzToLab(xyz.x, xyz.y, xyz.z);
        
    } catch (error) {
        console.error(`Error converting CMYK to Lab: ${error}`);
        
        // Return black for invalid inputs
        let l, a, b = 0;
        let lab = { l, a, b };

        console.log('lab: ', lab, ' type: ', (typeof lab));
        console.log('execution of cmykToLab complete');

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
}


export { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab }