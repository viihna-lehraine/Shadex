import { applyLimitGrayAndBlack, applyLimitLight, generateAndStoreColorValues, populateColorTextOutputBox, randomCMYK, randomHex, randomHSL, randomHSV, randomLab, randomRGB, randomSL } from '../../export';


function generateTetradicHues(baseHue) {
    const tetradicHues = [];
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomOffset = Math.floor(Math.random() * 46) + 20;
    const distance = 90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);
    const hue3 = (hue1 + distance) % 360;
    const hue4 = (hue3 + 180) % 360;

    tetradicHues.push(hue1, hue2, hue3, hue4);

    console.log('tetradicHues: ', tetradicHues);

    return tetradicHues;
};

export function generateTetradicPalette(numBoxes: number, limitGrayAndBlack: boolean, limitLight: boolean, customColor: unknown = null, initialColorSpace: string = 'hex') {
    if (numBoxes < 4) {
        window.alert('To generate a tetradic palette, please select a number of swatches greater than 3');

        return [];
    }

    const colors = [];
    let baseColor;

    // generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        baseColor = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
    } else {
        switch (initialColorSpace) {
            case 'hex':
                baseColor = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'rgb':
                baseColor = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsl':
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsv':
                baseColor = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'cmyk':
                baseColor = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'lab':
                baseColor = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            default:
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
        }
    }

    // use baseColor.hue to generate tetradic hues
    const tetradicHues = generateTetradicHues(baseColor.hue);

    // first color is the base color (randomized or customColor)
    colors.push(baseColor);

    // generate main tetradic colors (colors 2-4, i = (1 || 2 || 3))
    for (let i = 1; i < 4; i++) {
        const hue = tetradicHues[i];

        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);

        if (limitGrayAndBlack) {
            ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        }

        if (limitLight) {
            lightness = applyLimitLight(lightness);
        }

        const color = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');

        colors.push(color);
    }

    // if numBoxes = 5 || 6, add additional variations
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 4); // Randomly select one of the first four colors
        const baseHue = tetradicHues[baseColorIndex];
        const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360; // Generate hue within ±5 of baseHue
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);
        let isValid = false;
        let attempts = 0;
        const maxAttempts = 100;

        // ensure saturation and lightness are at least 10 units away
        while (!isValid && attempts < maxAttempts) {
            isValid = true;
            const baseColor = colors[baseColorIndex];

            if (Math.abs(saturation - baseColor.saturation) < 10) {
                saturation = baseColor.saturation + (saturation >= baseColor.saturation ? 10 : -10);
            }

            if (Math.abs(lightness - baseColor.lightness) < 10) {
                lightness = baseColor.lightness + (lightness >= baseColor.lightness ? 10 : -10);
            }

            // adjust if saturation or lightness are not inside the range 0-100
            if (saturation > 100) saturation = 100;
            if (saturation < 0) saturation = 0;
            if (lightness > 100) lightness = 100;
            if (lightness < 0) lightness = 0;

            // ensure limitGrayAndBlack and limitLight are still acting as additional limits
            if (limitGrayAndBlack) {
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }

            if (limitLight) {
                lightness = applyLimitLight(lightness);
            }

            if (Math.abs(saturation - baseColor.saturation) < 10 || Math.abs(lightness - baseColor.lightness) < 10) {
                console.log('calling randomSL to define const newSL');

                const newSL = randomSL(limitGrayAndBlack, limitLight);
                saturation = newSL.saturation;
                lightness = newSL.lightness;
                isValid = false;
            }

            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.warn('Reached maximum attempts to find valid saturation and lightness values.');
            console.log('Executing Option B - manually set saturation and lightness within acceptable range');

            // generate valid values within accepted bounds, excluding the range ±10 relative to the base color (exclusive)
            const baseColor = colors[baseColorIndex];
            saturation = Math.random() > 0.5 ? baseColor.saturation + 10 : baseColor.saturation - 10;
            lightness = Math.random() > 0.5 ? baseColor.lightness + 10 : baseColor.lightness - 10;
            
            if (saturation > 100) {
                saturation = 100;

                if (limitGrayAndBlack) {
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }

                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }

            if (saturation < 0) {
                saturation = 0;

                if (limitGrayAndBlack) {
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }

                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }

            if (lightness > 100) {
                lightness = 100;

                if (limitGrayAndBlack) {
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }

                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }
            
            if (lightness < 0) {
                lightness = 0;

                if (limitGrayAndBlack) {
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }

                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }

            // re-apply limits if necessary
            if (limitGrayAndBlack) {
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }

            if (limitLight) {
                lightness = applyLimitLight(lightness);
            }
        }

        const additionalColor = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');

        colors.push(additionalColor);
    }

    // update the DOM with generated colors
    colors.forEach((color, index) => {
        const colorBox = document.getElementById(`color-box-${index + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = color.hsl;

            populateColorTextOutputBox(color, index + 1);
        }
    })

    return colors;
};
