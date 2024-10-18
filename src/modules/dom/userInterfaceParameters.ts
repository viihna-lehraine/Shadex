function applyLimitGrayAndBlack (saturation, lightness) {
    console.log('executing applyLimitGrayAndBlack');

    saturation = Math.max(saturation, 20);
    lightness = Math.max(lightness, 25);
    
    console.log('applyLimitGrayAndBlack() limits applied');
    console.log('applyLimitGrayAndBlack() - saturation: ', saturation, ' type: ', (typeof saturation), ' lightness: ', lightness, ' type: ', (typeof lightness));
    console.log('execution of applyLimitGrayAndBlack complete; returning { saturation, lightness }');

    return { saturation, lightness };
};


function applyLimitLight(lightness) {
    console.log('executing applyLimitLight()');

    lightness = Math.min(lightness, 75);

    console.log('applyLimitLight limits applied');
    console.log('applyLimitLight() - lightness: ', lightness, ' type: ', (typeof lightness));
    console.log('execution of applyLimitLight() complete; returning variable lightess');

    return lightness;
};


export { applyLimitGrayAndBlack, applyLimitLight };