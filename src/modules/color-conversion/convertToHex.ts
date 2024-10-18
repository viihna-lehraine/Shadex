import { cmykToRGB, hslToHexTryCaseHelper, hsvToRGB, labToRGB } from '../../export';

export function componentToHex(c) {
    try {
        const hex = c.toString(16);

        return hex.length === 1 ? '0' + hex : hex;
    } catch (error) {
        return '00';
    }
}

export function rgbToHex(red: number, green: number, blue: number) {
    try {
        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
    } catch (error) {
        return '#000000';
    }
}

export function hslToHex(hue: number, saturation: number, lightness: number) {
    try {
        hslToHexTryCaseHelper(hue, saturation, lightness);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        return '#000000';
    }
};

export function hsvToHex(hue: number, saturation: number, value: number) {
    try {
        const rgb = hsvToRGB(hue, saturation, value);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        return '#000000';
    }
}

export function cmykToHex(cyan: number, magenta: number, yellow: number, key: number) {
    try {
        const rgb = cmykToRGB(cyan, magenta, yellow, key);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        return '#000000';
    }
}

export function labToHex(l: number, a: number, b: number) {
    try {
        const rgb = labToRGB(l, a, b);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        return '#000000';
    }
}
