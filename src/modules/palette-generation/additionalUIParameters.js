// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE


function applyLimitGrayAndBlack (saturation, lightness) {
    saturation = Math.max(saturation, 20);
    lightness = Math.max(lightness, 25);
    return { saturation, lightness };
}


function applyLimitLight(lightness) {
    lightness = Math.min(lightness, 75);
    return lightness;
}


export { applyLimitGrayAndBlack, applyLimitLight };