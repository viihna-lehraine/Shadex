import { convert } from './conversion-index';
import { CMYK, HSL, HSV, LAB, RGB, XYZ } from '../../types/types';

const defaultLAB: LAB = { l: 0, a: 0, b: 0 };

export function xyzToLAB({ x, y, z}: XYZ): LAB {
    try {
        const refX = 95.047, refY = 100.000, refZ = 108.883;

        x = x / refX;
        y = y / refY;
        z = z / refZ;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

        let l = parseFloat(((116 * y) - 16).toFixed(2));
        let a = parseFloat((500 * (x - y)).toFixed(2));
        let b = parseFloat((200 * (y - z)).toFixed(2));

        return { l, a, b };
    } catch (error) {
        console.error(`xyzToLab() error: ${error}`);
        return defaultLAB;
    }
}

export function hexToLAB(hex: string): LAB {
    try {
        const rgb: RGB = convert.hexToRGB(hex);
        const xyz: XYZ = convert.rgbToXYZ(rgb);

        return xyzToLAB(xyz);
    } catch (error) {
        console.error(`hexToLAB() error: ${error}`);
        return defaultLAB;
    }
}

export function rgbToLAB(rgb: RGB): LAB {
    try {
        const xyz: XYZ = convert.rgbToXYZ(rgb);
        return xyzToLAB(xyz);
    } catch (error) {
        console.error(`rgbToLab() error: ${error}`);
        return defaultLAB;
    }
}

export function hslToLAB(hsl: HSL): LAB {
    try {
        const rgb: RGB = convert.hslToRGB(hsl);
        const xyz: XYZ = convert.rgbToXYZ(rgb);

        return xyzToLAB(xyz);
    } catch (error) {
        console.error(`hslToLab() error: ${error}`);
        return defaultLAB;
    }
}

export function hsvToLAB(hsv: HSV): LAB {
    try {
        const rgb: RGB = convert.hsvToRGB(hsv);
        const xyz: XYZ = convert.rgbToXYZ(rgb);

        return xyzToLAB(xyz);
    } catch (error) {
        console.error(`hsvToLab() error: ${error}`);
        return defaultLAB;
    }
}

export function cmykToLAB(cmyk: CMYK): LAB {
    try {
        const rgb: RGB = convert.cmykToRGB(cmyk);
        const xyz: XYZ = convert.rgbToXYZ(rgb);

        return xyzToLAB(xyz);
    } catch (error) {
        console.error(`cmykToLab() error: ${error}`);
        return defaultLAB;
    }
}
