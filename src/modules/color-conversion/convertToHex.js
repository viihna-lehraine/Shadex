// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { hslToRGB } from "./index.js";


// Convert color component to Hexfunction componentToHex(c) {
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}


// convert RGB to Hex
function rgbToHex(red, green, blue) {
    return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}


// Convert HSL to Hex
function hslToHex(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);

    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert HSV to Hex
function hsvToHex(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert CMYK to Hex
function cmykToHex(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert Lab to Hex
function labToHex(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


export { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex }