import { LAB, RGB, XYZ } from '../../types/types';

const defaulXYZ: XYZ = { x: 0, y: 0, z: 0 };

export function rgbToXYZ({ red, green, blue }: RGB): XYZ {
    try {
        red = red / 255;
        green = green / 255;
        blue = blue / 255;

        red = red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
        green = green > 0.04045 ? Math.pow((green + 0.055) / 1.055, 2.4) : green / 12.92;
        blue = blue > 0.04045 ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue / 12.92;

        red = red * 100;
        green = green * 100;
        blue = blue * 100;

        const x = red * 0.4124 + green * 0.3576 + blue * 0.1805;
        const y = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        const z = red * 0.0193 + green * 0.1192 + blue * 0.9505;

        const xyz = { x, y, z };

        return xyz;
    } catch (error) {
        console.error(`rgbToXYZ error: ${error}`);
        return defaulXYZ;
    }
}

export function labToXYZ({ l, a, b }: LAB): XYZ {
    try {
        const refX = 95.047, refY = 100.000, refZ = 108.883;

        let y = (l + 16) / 116;
        let x = a / 500 + y;
        let z = y - b / 200;

        const pow = Math.pow;

        x = refX * (pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787);
        y = refY * (pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787);
        z = refZ * (pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787);

        const xyz = { x, y, z };

        return xyz;
    } catch (error) {
        console.error(`labToXYZ error: ${error}`);
        return { x: 0, y: 0, z: 0 };
    }
}
