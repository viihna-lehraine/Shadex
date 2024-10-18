import { cmykToRGB, hexToRGB, labToRGB } from '../../export';
import { CMYK, HSL, HSV, LAB, RGB } from '../../index';

const defaultHSV: HSV = { hue: 0, saturation: 0, value: 0 };

export function hexToHSV(hexValue: string): HSV {
    try {
        const rgb = hexToRGB(hexValue);
        return rgbToHSV(rgb);
    } catch (error) {
        console.error(`hexToHSV() error: ${error}`);
        return defaultHSV;
    }
}

export function rgbToHSV({ red, green, blue }: RGB): HSV {
    try {
        red /= 255;
        green /= 255;
        blue /= 255;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const delta = max - min;

        let hue = 0;
        const value = max;
        const saturation = max === 0 ? 0 : delta / max;

        if (max !== min) {
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }

            hue *= 60;
        }

        return {
            hue: Math.round(hue),
            saturation: Math.round(saturation * 100),
            value: Math.round(value * 100)
        }
    } catch (error) {
        console.error(`rgbToHSV() error: ${error}`);
        return defaultHSV;
    }
}

export function hslToHSV({ hue, saturation, lightness }: HSL): HSV {
    try {
        const s = saturation / 100;
        const l = lightness / 100;

        const value = l + s * Math.min(l, 1 - 1);
        const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

        return {
            hue: Math.round(hue),
            saturation: Math.round(newSaturation * 100),
            value: Math.round(value * 100)
        }
    } catch (error) {
        console.error(`hslToHSV() error: ${error}`);
        return defaultHSV;
    }
}

export function cmykToHSV(cmyk: CMYK): HSV {
    try {
        const rgb: RGB = cmykToRGB(cmyk);
        return rgbToHSV(rgb);
    } catch (error) {
        console.error(`cmykToHSV() error: ${error}`);
        return defaultHSV;
    }
};

export function labToHSV({ l, a, b }: LAB): HSV {
    try {
        const rgb: RGB = labToRGB({ l, a, b });
        return rgbToHSV(rgb);
    } catch (error) {
        console.error(`labToHSV() error: ${error}`);
        return defaultHSV;
    }
};
