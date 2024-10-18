import { labToXYZ } from '../../export';

export function xyzToRGB(x: number, y: number, z: number) {
    try {
        x = x / 100;
        y = y / 100;
        z = z / 100;

        let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let blue = x * 0.0557 + y * -0.2040 + z * 1.0570;

        red = red > 0.0031308 ? 1.055 * Math.pow(red, 1 / 2.4) - 0.055 : 12.92 * red;
        green = green > 0.0031308 ? 1.055 * Math.pow(green, 1 / 2.4) - 0.055 : 12.92 * green;
        blue = blue > 0.0031308 ? 1.055 * Math.pow(blue, 1 / 2.4) - 0.055 : 12.92 * blue;

        red = Math.min(Math.max(0, red), 1);
        green = Math.min(Math.max(0, green), 1);
        blue = Math.min(Math.max(0, blue), 1);

        red = Math.round(red * 255);
        green = Math.round(green * 255);
        blue = Math.round(blue * 255);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`xyzToRGB() - invalid RGB values from XYZ: R=${red}, G=${green}, B=${blue}`);
        }

        return { red, green, blue };
    } catch (error) {
        return { red: 0, green: 0, blue: 0 } // return black for invalid inputs
    }
};

export function hexToRGB(hexValue: string) {
    try {
        // remove the hash at the beginning if it exists
        hexValue = hexValue.replace(/^#/, '');

        // parse RGB values
        let bigint = parseInt(hexValue, 16);
        let red = (bigint >> 16) & 255;
        let green = (bigint >> 8) & 255;
        let blue = bigint & 255;

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`hexToRGB() - invalid RGB values from hex: R=${red}, G=${green}, B=${blue}`);
        }

        return { red, green, blue };
    } catch (error) {        
        return { red: 0, green: 0, blue: 0 }; // return black for invalid inputs
    }
};

export function hslToRGB(hue: number, saturation: number, lightness: number) {
    try {
        hue = hue / 360;
        saturation = saturation / 100;
        lightness = lightness / 100;

        let red, green, blue;

        if (saturation === 0) {
            red = green = blue = lightness;
        } else {
            const hueToRGB = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;

            red = hueToRGB(p, q, hue + 1 / 3);
            green = hueToRGB(p, q, hue);
            blue = hueToRGB(p, q, hue - 1 / 3);
        }

        red = Math.round(red * 255);
        green = Math.round(green * 255);
        blue = Math.round(blue * 255);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`hslToRGB() - invalid RGB values from HSL: R=${red}, G=${green}, B=${blue}`);
        }

        return { red, green, blue };
    } catch (error) {
        return { red: 0, green: 0, blue: 0 }; // return black for invalid inputs
    }
};

export function hsvToRGB(hue: number, saturation: number, value: number) {
    try {
        hue = hue / 360;
        saturation /= 100;
        value /= 100;

        let red = 0, green = 0, blue = 0;

        const i = Math.floor(hue / 60);
        const f = hue / 60 - i;
        const p = value * (1 - saturation);
        const q = value * (1 - saturation * f);
        const t = value * (1 - saturation * (1 - f));

        switch (i % 6) {
            case 0: red = value, green = t, blue = p; break;
            case 1: red = q, green = value, blue = p; break;
            case 2: red = p, green = value, blue = t; break;
            case 3: red = p, green = q, blue = value; break;
            case 4: red = t, green = p, blue = value; break;
            case 5: red = value, green = p, blue = q; break;
            default:
                throw new Error('Unexpected value of i');
        }

        red = Math.round(red * 255);
        green = Math.round(green * 255);
        blue = Math.round(blue * 255);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`hsvToRGB() - invalid RGB values from HSV: R=${red}, G=${green}, B=${blue}`);
        }

        return { red, green, blue };
    } catch (error) {

        return { red: 0, green: 0, blue: 0 }; // return black for invalid inputs
    }
};

export function cmykToRGB(cyan: number, magenta: number, yellow: number, key: number) {
    try {
        let red = 255 * (1 - cyan / 100) * (1 - key / 100);
        let green = 255 * (1 - magenta / 100) * (1 - key / 100);
        let blue = 255 * (1 - yellow / 100) * (1 - key / 100);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`cmykToRGB() - invalid RGB values from CMYK: R=${red}, G=${green}, B=${blue}`);
        }

        red = Math.round(red);
        green = Math.round(green);
        blue = Math.round(blue);

        return { red, green, blue };
    } catch (error) {
        return { red: 0, green: 0, blue: 0 }; // return black for invalid inputs
    }
};

export function labToRGB(l: number, a: number, b: number) {
    try {
        const xyz = labToXYZ(l, a, b);
        return xyzToRGB(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        return { red: 0, green: 0, blue: 0 }; // return black for invalid inputs
    }
};
