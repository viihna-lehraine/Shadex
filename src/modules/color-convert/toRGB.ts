import { labToXYZ } from './toXYZ';
import { CMYK, HSL, HSV, LAB, RGB, XYZ } from '../../types/types';

export function xyzToRGB({ x, y, z }: XYZ): RGB {
    try {
        x /= 100;
        y /= 100;
        z /= 100;

        let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let blue = x * 0.0557 + y * -0.2040 + z * 1.0570;

        red = applyGammaCorrection(red);
        green = applyGammaCorrection(green);
        blue = applyGammaCorrection(blue);

        return clampRGB({ red, green, blue });
    } catch (error) {
        console.error('xyzToRGB error');
        return { red: 0, green: 0, blue: 0 }
    }
}

export function hexToRGB(hexValue: string): RGB {
    try {
        // remove the hash at the beginning if it exists
        const strippedHex = hexValue.replace(/^#/, '');
        const bigint = parseInt(strippedHex, 16);

        return {
            red: (bigint >> 16 & 255),
            green: (bigint >> 8 & 255),
            blue: (bigint & 255)
        };
    } catch (error) {        
        console.error('hexToRGB error');
        return { red: 0, green: 0, blue: 0 };
    }
}

export function hslToRGB({ hue, saturation, lightness }: HSL ): RGB {
    try {
        const s = saturation / 100;
        const l = lightness / 100;

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        return {
            red: Math.round(hueToRGB(p, q, hue + 1 / 3) * 255),
            green: Math.round(hueToRGB(p, q, hue) * 255),
            blue: Math.round(hueToRGB(p, q, hue - 1 / 3) * 255)
        };
    } catch (error) {
        return { red: 0, green: 0, blue: 0 };
    }
}

export function hsvToRGB({ hue, saturation, value }: HSV): RGB {
    try {
        const s = saturation / 100;
        const v = value / 100;

        const i = Math.floor(hue / 60) % 6;
        const f = hue / 60 - i;

        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        let rgb: RGB = { red: 0, green: 0, blue: 0 };

        switch (i) {
            case 0: rgb = { red: v, green: t, blue: p }; break;
            case 1: rgb = { red: q, green: v, blue: p }; break;
            case 2: rgb = { red: p, green: v, blue: t }; break;
            case 3: rgb = { red: p, green: q, blue: v }; break;
            case 4: rgb = { red: t, green: p, blue: v }; break;
            case 5: rgb = { red: v, green: p, blue: q }; break;
        }

        return clampRGB(rgb);
    } catch (error) {

        return { red: 0, green: 0, blue: 0 };
    }
}

export function cmykToRGB({ cyan, magenta, yellow, key }: CMYK): RGB {
    try {
        const r = 255 * (1 - cyan / 100) * (1 - key / 100);
        const g = 255 * (1 - magenta / 100) * (1 - key / 100);
        const b = 255 * (1 - yellow / 100) * (1 - key / 100);

        return clampRGB({ red: r, green: g, blue: b });
    } catch (error) {
        return { red: 0, green: 0, blue: 0 };
    }
}

export function labToRGB({ l, a, b }: LAB): RGB {
    const xyz = labToXYZ({ l, a, b });
    return xyzToRGB(xyz);
}

function applyGammaCorrection(value: number): number {
    return value > 0.0031308 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 12.92 * value;
}

function clampRGB({ red, green, blue }: RGB ): RGB {
    return {
        red: Math.round(Math.min(Math.max(0, red), 1) * 255),
        green: Math.round(Math.min(Math.max(0, green), 1) * 255),
        blue: Math.round(Math.min(Math.max(0, blue), 1) * 255)
    };
}

function hueToRGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 /6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

    return p;
}