import { convert } from '../../modules/color-convert/conversion-index';
import { CMYK, HSL, HSV, LAB, RGB } from '../../types/types';
import { hslToHexTryCaseHelper } from '../../helpers/conversion-helpers';

export function rgbToHex({ red, green, blue }: RGB): string {
    try {
        if ([red, green, blue].some(v => isNaN(v) || v < 0 || v > 255)) {
            console.warn(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
            return '#000000';
        }
    
        return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
    } catch (error) {
        console.warn(`rgbToHex error: ${error}`);
        return '#000000';
    }
}

export function hslToHex(hsl: HSL): string {
    try {
        const rgb: RGB = hslToHexTryCaseHelper(hsl);
        return rgbToHex(rgb);
    } catch (error) {
        console.warn(`hslToHex error: ${error}`);
        return '#000000';
    }
}

export function hsvToHex(hsv: HSV): string {
    try {
        const rgb: RGB = convert.hsvToRGB(hsv);
        return rgbToHex(rgb);
    } catch (error) {
        console.warn(`hsvToHex error: ${error}`);
        return '#000000';
    }
}

export function cmykToHex(cmyk: CMYK) {
    try {
        const rgb: RGB = convert.cmykToRGB(cmyk);

        return rgbToHex(rgb);
    } catch (error) {
        console.warn(`cmykToHex error: ${error}`);
        return '#000000';
    }
}

export function labToHex(lab: LAB): string {
    try {
        const rgb: RGB = convert.labToRGB(lab);

        return rgbToHex(rgb);
    } catch (error) {
        console.warn(`labToHex error: ${error}`);
        return '#000000';
    }
}

// converts a component (0-255) to a 2-digit hex string
export function componentToHex(component: number): string {
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    } catch (error) {
        console.error(`componentToHex error: ${error}`);
        return '00';
    }
}