import {cmykToRGB, hexToRGB, labToRGB } from './toRGB';
import { CMYK, HSL, HSV, LAB, RGB } from '../../index';

const defaultHSL: HSL = { hue: 0, saturation: 0, lightness: 0 };

export function hexToHSL(hexValue: string): HSL {
    try {
        const rgb: RGB = hexToRGB(hexValue);
        return rgbToHSL(rgb);
    } catch (error) {
        console.error(`hexToHSL() error: ${error}`);
        return defaultHSL;
    }
}

export function rgbToHSL({ red, green, blue }: RGB): HSL {
    try {
        red /= 255;
        green /= 255;
        blue /= 255;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);

        let hue = 0, saturation = 0, lightness = (max + min) / 2;

        if (max !== min) {
            const delta = max - min;

            saturation = lightness > 0.5
                ? delta / (2 - max - min)
                : delta / (max + min);
            
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
            lightness: Math.round(lightness * 100)
        }
    } catch (error) {
        console.error(`rgbToHSL() error: ${error}`);
        return defaultHSL;
    }
}

export function hsvToHSL({ hue, saturation, value }: HSV): HSL {
    try {
        const newSaturation =
            value * (1 - saturation / 100) === 0 || value === 0
                ? 0
                : (value - value * (1 - saturation / 100)) / Math.min(value, 100 - value);
        
        const lightness = value * (1 - saturation / 200);

        return {
            hue: Math.round(hue),
            saturation: Math.round(newSaturation * 100),
            lightness: Math.round(lightness)
        }
    } catch (error) {
        console.error(`hsvToHSL() error: ${error}`);
        return defaultHSL;
    }
}

export function cmykToHSL({ cyan, magenta, yellow, key }: CMYK): HSL {
    try {
        const rgb: RGB = cmykToRGB({ cyan, magenta, yellow, key });

        return rgbToHSL(rgb);
    } catch (error) {
        console.error(`cmykToHSL() error: ${error}`);
        return defaultHSL;
    }
};

export function labToHSL({ l, a, b }: LAB): HSL {
    try {
        const rgb = labToRGB({ l, a, b });
        return rgbToHSL(rgb);
    } catch (error) {
        console.error(`labToHSL() error: ${error}`);
        return defaultHSL;
    }
};
