// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE


function applyLimitGrayAndBlack (saturation, lightness) {
    console.log('executing applyLimitGrayAndBlack');

    saturation = Math.max(saturation, 20);
    lightness = Math.max(lightness, 25);
    
    console.log('applyLimitGrayAndBlack limits applied');
    console.log('saturation: ', saturation, ' type: ', (typeof saturation), ' lightness: ', lightness, ' type: ', (typeof lightness));

    console.log('execution of applyLimitGrayAndBlack complete; returning { saturation, lightness }');

    return { saturation, lightness };
}


function applyLimitLight(lightness) {
    console.log('executing applyLimitLight');

    lightness = Math.min(lightness, 75);

    console.log('applyLimitLight limits applied');
    console.log('lightness: ', lightness, ' type: ', (typeof lightness));
    console.log('execution of applyLimitLight complete; returning variable lightess');

    return lightness;
}


export { applyLimitGrayAndBlack, applyLimitLight };