import { rgbToXYZ, hexToRGB, hslToRGB, hsvToRGB } from '../../export.js';


// Convert XYZ to Lab
function xyzToLab(x, y, z) {
    console.log('xyzToLab() executing');
    console.log('xyzToLab() - x: ', x, ' y: ', y, ' z: ', z);
    console.log('xyzToLab() > types - x: ', (typeof x), ' y: ', (typeof y), ' z: ', (typeof z));

    try {
        console.log(`xyzToLab() - converting XYZ to Lab: X=${x}, Y=${y}, Z=${z}`);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            throw new Error(`xyzToLab() - invalid XYZ values: X=${x}, Y=${y}, Z=${z}`);
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

        console.log('xyzToLab() - l: ', l, ' a: ', a, ' b: ', b);
        console.log('xyzToLab() - types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));


        l = l.toFixed(2);
        a = a.toFixed(2);
        b = b.toFixed(2);

        console.log('xyzToLab() - truncating { l, a, b } values');
        console.log('xyzToLab() - l: ', l, ' a: ', a, ' b: ', b);
        console.log('xyzToLab() - types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

        const lab = { l, a, b };

        console.log(`xyzToLab() - converted Lab: ${JSON.stringify(lab)}`);
        console.log('xyzToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('xyzToLab() complete - returning lab');
        return lab;
    } catch (error) {
        console.error(`xyzToLab() - error converting XYZ to Lab: ${error}`);

        const lab = { l: 0, a: 0, b: 0 }; // return black for invalid inputs

        console.log('xyzToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('xyzToLab() - execution of xyzToLab complete');
        return lab;
    }
};


// Convert Hex to Lab
function hexToLab(hex) {
    console.log('hexToLab() executing');
    console.log('hexToLab() - hex: ', hex, ' data type ', (typeof hex));

    try {
        console.log(`hexToLab() - converting Hex to Lab: ${hex}`);
        console.log('hexToLab() - calling hexToRGB');

        const rgb = hexToRGB(hex);

        console.log(`hexToLab() - converted RGB from Hex: ${JSON.stringify(rgb)}`);
        console.log('hexToLab() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('hexToLab() - calling rgbToXYZ() with parameters (rgb.red, rgb.green, rgb.blue)');

        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

        console.log('hexToLab() - xyz: ', xyz, ' type: ', (typeof xyz));
        console.log(`hexToLab() - converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('hexToLab() - calling xyzToLab() with parameters (xyz.x, xyz.y, xyz.z)');

        const lab = xyzToLab(xyz.x, xyz.y, xyz.z);

        console.log('hexToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('hexToLab() complete - returning lab as a formatted string');
        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    } catch (error) {
        console.error(`hexToLab() - error converting Hex to Lab: ${error}`);

        let l, a, b = 0; // return black for invalid inputs
        let lab = { l, a, b };

        console.log('hexToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('hexToLab() complete - returning lab as a formatted string');
        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};


// Convert RGB to Lab
function rgbToLab(red, green, blue) {
    console.log('rgbToLab() executing');
    console.log('rgbToLab() - red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('rgbToLab() > types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`rgbToLab() - converting RGB to Lab: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`rgbToLab() - invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        console.log('rgbToLab() - calling rgbToXYZ() with parameters (red, green, blue)');

        const xyz = rgbToXYZ(red, green, blue);

        console.log(`rgbToLab() - converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('rgbToLab() - xyz: ', xyz, ' type: ', (typeof xyz));
        console.log('rgbToLab() complete - returning result of xyzToLab() with parameters (xyz.x, xyz.y, xyz.z)');

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`rgbToLab() - error converting RGB to Lab: ${error}`);
        
        // Return black for invalid inputs
        let l, a, b = 0;
        let lab = { l, a, b };

        console.log('rgbToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('rgbToLab() complete - reutrning lab as a formatted string');
        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};


// Convert HSL to Lab
function hslToLab(hue, saturation, lightness) {
    console.log('hslToLab() executing');
    console.log('hslToLab() - hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('hslToLab() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

    try {
        console.log(`hslToLab() - converting HSL to Lab: H=${hue}, S=${saturation}, L=${lightness}`);
        console.log('hslToLab() - calling hslToRGB() with parameters (hue, saturation, lightness)');

        const rgb = hslToRGB(hue, saturation, lightness);

        console.log(`hslToLab() - converted RGB from HSL: ${JSON.stringify(rgb)}`);
        console.log('hslToLab() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('hslToLab() - calling rgbToXYZ() with parameters (rgb.red, rgb.green, rgb.blue)');

        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

        console.log(`hslToLab() - converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('hslToLab() - xyz: ', xyz, ' type: ', (typeof xyz));
        console.log('hslToLab() complete - returning results of xyzToLab() with parameters (xyz.x, xyz.y, xyz.z)');

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`hslToLab() - error converting HSL to Lab: ${error}`);
        
        let l, a, b = 0; // return black for invalid inputs
        let lab = { l, a, b };

        console.log('hslToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('hslToLab() complete - returning lab as a formatted string');
        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};


// Convert HSV to Lab
function hsvToLab(hue, saturation, value) {
    console.log('hsvToLab() executing');
    console.log('hsvToLab() - hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('hsvToLab() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`hsvToLab() - converting HSV to Lab: H=${hue}, S=${saturation}, V=${value}`);
        console.log('hsvToLab() - calling hsvToRGB() with parameters (hue, saturation, value)');

        const rgb = hsvToRGB(hue, saturation, value);

        console.log(`hsvToLab() - converted RGB from HSV: ${JSON.stringify(rgb)}`);
        console.log('hsvToLab() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('hsvToLab() - calling rgbToXYZ() with parameters (rgb.red, rgb.green, rgb.blue)');

        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

        console.log(`hsvToLab() - converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('hsvToLab() - xyz: ', xyz, ' type: ', (typeof xyz));
        console.log('hsvToLab() complete - returning result of xyzToLab() with parameters (xyz.x, xyz.y, xyz.z)');

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`hsvToLab() - error converting HSV to Lab: ${error}`);
        
        let l, a, b = 0; // return black for invalid inputs
        let lab = { l, a, b };

        console.log('hsvToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('hsvToLab() complete - returning lab as a formatted string');
        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};


// Convert CMYK to Lab
function cmykToLab(cyan, magenta, yellow, key) {
    console.log('cmykToLab() executing');
    console.log('cmykToLab() - cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('cmykToLab() > types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`cmykToLab() - converting CMYK to Lab: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        console.log('cmykToLab() - calling cmykToRGB() with parameters (cyan, magenta, yellow, key)');

        const rgb = cmykToRGB(cyan, magenta, yellow, key);

        console.log(`cmykToLab() - converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        console.log('cmykToLab() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('cmykToLab() - calling rgbToXYZ() with parameters (rgb.red, rgb.green, rgb.blue)');

        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

        console.log(`cmykToLab() - converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('cmykToLab() - complete - returning result of xyzToLab() with parameters (xyz.x, xyz.y, xyz.z)');

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`cmykToLab() - error converting CMYK to Lab: ${error}`);
        
        let l, a, b = 0;
        let lab = { l, a, b }; // return black for invalid inputs

        console.log('cmykToLab() - lab: ', lab, ' type: ', (typeof lab));
        console.log('cmykToLab() complete - returning lab as a formatted string');
        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};


export { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab };