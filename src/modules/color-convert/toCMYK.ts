import {
    hexToCMYKTryCaseHelper,
    hslToCMYKTryCaseHelper,
    hsvToCMYKTryCaseHelper,
    labToCMYKTryCaseHelper
} from '../../helpers/conversion-helpers';
import { CMYK, HSL, HSV, LAB, RGB } from '../../types/types';

export function hexToCMYK(hex: string): CMYK {
    try {
        return hexToCMYKTryCaseHelper(hex);
    } catch (error) {
        console.error(`Error converting hex to CMYK: ${error}`);
        return fallbackCMYK();
    }
}

export function rgbToCMYK(rgb: RGB): CMYK {
    try {
        const redPrime = rgb.red / 255;
        const greenPrime = rgb.green / 255;
        const bluePrime = rgb.blue / 255;

        const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
        const cyan = (1 - redPrime - key) / (1 - key) || 0;
        const magenta = (1 - greenPrime - key) / (1 - key) || 0;
        const yellow = (1 - bluePrime - key) / (1 - key) || 0;

        return {
            cyan: Math.round(cyan * 100),
            magenta: Math.round(magenta * 100),
            yellow: Math.round(yellow * 100),
            key: Math.round(key * 100)
        }
    } catch (error) {
        console.error(`Error converting RGB to CMYK: ${error}`);
        return fallbackCMYK();
    }
}

export function hslToCMYK(hsl: HSL): CMYK {
    try {
        return hslToCMYKTryCaseHelper(hsl);
    } catch (error) {
        console.error(`Error converting HSL to CMYK: ${error}`);
        return fallbackCMYK(); 
    }
}

export function hsvToCMYK(hsv: HSV): CMYK {
    try {
        return hsvToCMYKTryCaseHelper(hsv);
    } catch (error) {
        console.error(`Error converting HSV to CMYK: ${error}`);
        return fallbackCMYK();
    }
}

export function labToCMYK(lab: LAB): CMYK {
    try {
        return labToCMYKTryCaseHelper(lab);
    } catch (error) {
        console.error(`Error converting Lab to CMYK: ${error}`);
        return fallbackCMYK();
    }
}

function fallbackCMYK(): CMYK {
    return { cyan: 0, magenta: 0, yellow: 0, key: 0 };
}
