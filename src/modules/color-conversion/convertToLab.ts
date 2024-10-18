import { cmykToRGB, hexToRGB, hslToRGB, hsvToRGB, rgbToXYZ } from '../../export';

export function xyzToLab(x: number, y: number, z: number) {
    try {
        const refX = 95.047, refY = 100.000, refZ = 108.883;

        x = x / refX;
        y = y / refY;
        z = z / refZ;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

        let l = (116 * y) - 16;
        let a = 500 * (x - y);
        let b = 200 * (y - z);

        l = l.toFixed(2);
        a = a.toFixed(2);
        b = b.toFixed(2);

        const lab = { l, a, b };

        return lab;
    } catch (error) {
        const lab = { l: 0, a: 0, b: 0 };

        return lab;
    }
};

export function hexToLab(hex: string) {
    try {
        const rgb = hexToRGB(hex);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
        const lab = xyzToLab(xyz.x, xyz.y, xyz.z);

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    } catch (error) {
        let l, a, b = 0;
        let lab = { l, a, b };

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};

export function rgbToLab(red: number, green: number, blue: number) {
    try {
        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`rgbToLab() - invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        const xyz = rgbToXYZ(red, green, blue);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        let l, a, b = 0;
        let lab = { l, a, b };

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};

export function hslToLab(hue: number, saturation: number, lightness: number) {
    try {
        const rgb = hslToRGB(hue, saturation, lightness);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        let l, a, b = 0;
        let lab = { l, a, b };

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};

export function hsvToLab(hue: number, saturation: number, value: number) {
    try {
        const rgb = hsvToRGB(hue, saturation, value);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        let l, a, b = 0;
        let lab = { l, a, b };

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};

export function cmykToLab(cyan: number, magenta: number, yellow: number, key: number) {
    try {
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

        return xyzToLab(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        let l, a, b = 0;
        let lab = { l, a, b };

        return `lab(${lab.l}, ${lab.a}, ${lab.b})`;
    }
};
