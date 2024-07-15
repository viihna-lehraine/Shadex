// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { rgbToXYZ, hexToRGB } from './index.js';


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


// Convert Hex to Lab
function hexToLab(hex) {
    const rgb = hexToRGB(hex);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    const lab = xyzToLab(xyz.x, xyz.y, xyz.z);

    return `lab(${lab.l.toFixed(2)}, ${lab.a.toFixed(2)}, ${lab.b.toFixed(2)})`;
}


// Convert RGB to Lab
function rgbToLab(red, green, blue) {
    const xyz = rgbToXYZ(red, green, blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert HSL to Lab
function hslToLab(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);

}


// Convert HSV to Lab
function hsvToLab(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert CMYK to Lab
function cmykToLab(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


export { xyzToLab, hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab }