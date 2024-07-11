// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



const conversionMap = {
    hsl: {
        rgb: hslToRGB,
        hex: hslToHex,
        hsv: hslToHSV,
        cmyk: hslToCMYK,
        lab: hslToLab
    },
    rgb: {
        hsl: rgbToHSL,
        hex: rgbToHex,
        hsv: rgbToHSV,
        cmyk: rgbToCMYK,
        lab: rgbToLab
    },
    hex: {
        rgb: hexToRGB,
        hsl: hexToHSL,
        hsv: hexToHSV,
        cmyk: hexToCMYK,
        lab: hexToLab
    },
    hsv: {
        rgb: hsvToRGB,
        hsl: hsvToHSL,
        hex: hsvToHex,
        cmyk: hsvToCMYK,
        lab: hsvToLab
    },
    cmyk: {
        rgb: cmykToRGB,
        hex: cmykToHex,
        hsl: cmykToHSL,
        hsv: cmykToHSV,
        lab: cmykToLab
    },
    lab: {
        rgb: labToRGB,
        hex: labToHex,
        hsl: labToHSL,
        hsv: labToHSV,
        cmyk: labToCMYK
    }
};


// Master Color Conversion Function
export function convertColors(targetFormat) {
    const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');

    colorTextOutputBoxes.forEach(box => {
        const currentFormat = box.getAttribute('data-format');
        const colorValues = box.colorValues;

        if (!colorValues) {
            console.error(`No stored color values found for ${box.textContent}`);
            return;
        }

        const newColor = colorValues[targetFormat];
        if (!newColor) {
            console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
            return;
        }

        box.textContent = newColor;
        box.setAttribute('data-format', targetFormat);
    });
}


// Master Color Formatting Function
function formatColor(color, format) {
    if (format === 'hex') {
        return color;
    } else if (format === 'rgb') {
        return `rgb(${color.red}, ${color.green}, ${color.blue})`;
    } else if (format === 'hsl') {
        return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
    } else if (format === 'hsv') {
        return `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`;
    } else if (format === 'cmyk') {
        return `cmyk(${color.cyan}%, ${color.magenta}%, ${color.yellow}%, ${color.key}%)`;
    } else if (format === 'lab') {
        return `lab(${color.l.toFixed(2)}, ${color.a.toFixed(2)}, ${color.b.toFixed(2)})`;
    }
    return color;
}

// Generate All Color Values and Store as an Object
export function generateAndStoreColorValues(hue, saturation, lightness) {
    const colorValues = {};
    const rgb = hslToRGB(hue, saturation, lightness);

    // Generate and store all possible color values
    colorValues.hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colorValues.rgb = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
    colorValues.hex = rgbToHex(rgb.red, rgb.green, rgb.blue);
    colorValues.hsv = hslToHSV(hue, saturation, lightness);
    colorValues.cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
    colorValues.lab = rgbToLab(rgb.red, rgb.green, rgb.blue);

    return colorValues;
}


// Convert color component to Hexfunction componentToHex(c) {
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}


// Convert XYZ to Lab
function xyzToLab(x, y, z) {
    const refX = 95.047, refY = 100.000, refZ = 108.883;

    x = x / refX;
    y = y / refY;
    z = z / refZ;

    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

    const l = (116 * y) - 16;
    const a = 500 * (x - z);
    const b = 200 * (y - z);

    return { l, a, b };
}


// Convert XYZ to RGB
function xyzToRGB(x, y, z) {
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

    return {
        red: Math.round(red * 255),
        green: Math.round(green * 255),
        blue: Math.round(blue * 255)
    };
}


// Convert Hex to HSL
function hexToHSL(hex) {
    const rgb = hexToRGB(hex);
    const hsl = rgbToHSL(rgb.red, rgb.green, rgb.blue);
}


// Convert Hex to RGB
function hexToRGB(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    let red = (bigint >> 16) & 255;
    let green = (bigint >> 8) & 255;
    let blue = bigint & 255;

    return { red, green, blue };
}


// Convert Hex to HSV
function hexToHSV(hex) {
    const rgb = hexToRGB(hex);

    return rgbToHSV(rgb.red, rgb.green, rgb.blue);
}


// Convert Hex to CMYK
function hexToCMYK(hex) {
    const rgb = hexToRGB(hex);

    return rgbToCMYK(rgb.red, rgb.blue, rgb.green);
}


// Convert Hex to Lab
function hexToLab(hex) {
    const rgb = hexToRGB(hex);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);

    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert HSL to Hex
function hslToHex(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);

    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert HSL to RGB
function hslToRGB(hue, saturation, lightness) {
    hue = hue / 360;
    saturation = saturation / 100;
    lightness = lightness / 100;

    let red, green, blue;

    if (saturation === 0) {
        red = green = blue = lightness;
    } else {
        const hueToRGB = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        const p = 2 * lightness - q;

        red = hueToRGB(p, q, hue + 1/3);
        green = hueToRGB(p, q, hue);
        blue = hueToRGB(p, q, hue - 1/3);
    }

    red = Math.round(red * 255);
    green = Math.round(green * 255);
    blue = Math.round(blue * 255);
    
    return { red, green, blue };
}


// Convert HSL to HSV
function hslToHSV(hue, saturation, lightness) {
    saturation /= 100;
    lightness /= 100;

    const value = lightness + saturation * Math.min(lightness, 1 - lightness);

    const newSaturation = value === 0 ? 0 : 2 * (1 - lightness / value);

    return {
        hue: Math.floor(hue),
        saturation: Math.floor(newSaturation * 100),
        value: Math.floor(value * 100)
    };
}


// Convert HSL to CMYK
function hslToCMYK(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}


// Convert HSL to Lab
function hslToLab(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);

}


// convert RGB to HSL
function rgbToHSL(red, green, blue) {
    red = red / 255;
    green = green / 255;
    blue = blue / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let hue, saturation, lightness = (max + min) / 2;

    if (max === min) {
        hue = 0;
        saturation = 0;
    } else {
        const delta = max - min;
        saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
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
    };
}


// convert RGB to Hex
function rgbToHex(red, green, blue) {
    return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}


// convert RGB to HSV
function rgbToHSV(red, green, blue) {

    red /= 255;
    green /= 255;
    blue /= 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const value = max;
    const delta = max - min;
    const saturation = max === 0 ? 0 : delta / max;
    let hue;

    if (max === min) {
        hue = 0; // achromatic
    } else {
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
    };
}


// Convert RGB to CMYK
function rgbToCMYK(red, green, blue) {
    const redPrime = red / 255;
    const greenPrime = green / 255;
    const bluePrime = blue / 255;

    const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
    const cyan = (1 - redPrime - key) / (1 - key) || 0;
    const magenta = (1 - greenPrime - key) / (1 - key) || 0;
    const yellow = (1 - bluePrime - key) / (1 - key) || 0;

    return {
        cyan: Math.round(cyan * 100),
        magenta: Math.round(magenta * 100),
        yellow: Math.round(yellow * 100),
        key: Math.round(key * 100)
    };
}


// Convert RGB to Lab
function rgbToLab(red, green, blue) {
    const xyz = rgbToXYZ(red, green, blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert HSV to Hex
function hsvToHex(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert HSV to HSL
function hsvToHSL(hue, saturation, value) {
    saturation /= 100;
    value /= 100;

    let lightness = value * (1 - saturation / 2);
    let newSaturation = (lightness === 0 || lightness === 1) ? 0 : (value - lightness) / Math.min(lightness, 1 - lightness);

    return {
        hue: hue,
        saturation: Math.floor(newSaturation * 100),
        lightness: Math.floor(lightness * 100)
    };
}


// Convert HSV to RGB
function hsvToRGB(hue, saturation, value) {
    saturation /= 100;
    value /= 100;

    let red, green, blue;

    const i = Math.floor(hue / 60);
    const f = hue / 60 - i;
    const p = value * (1 - saturation);
    const q = value * (1 - saturation * f);
    const t = value * (1 - saturation * (1 - f));

    switch (i % 6) {
        case 0: red = value, green = t, blue = p; break;
        case 1: red = q, green = value; blue = p; break;
        case 2: red = p, green = value; blue = t; break;
        case 3: red = p, green = q, blue = value; break;
        case 4: red = t, green = p, blue = value; break;
        case 5: red = value, green = p, blue = q; break; 
    }

    red = Math.round(red * 255);
    green = Math.round(green * 255);
    blue = Math.round(blue * 255);

    return { red, green, blue };
}


// Convert HSV to CMYK
function hsvToCMYK(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}


// Convert HSV to Lab
function hsvToLab(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert CMYK to Hex
function cmykToHex(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


// Convert CMYK to HSL
function cmykToHSL(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHSL(rgb.red, rgb.green, rgb.blue);
}


// Convert CMYK to RGB
function cmykToRGB(cyan, magenta, yellow, key) {
    const red = 255 * (1 - cyan / 100) * (1 - key / 100);
    const green = 255 * (1 - magenta / 100) * (1 - key / 100);
    const blue = 255 * (1 - yellow / 100) * (1 - key / 100);

    return {
        red: Math.round(red),
        green: Math.round(green),
        blue: Math.round(blue)
    }
}


// Convert CMYK to HSV
function cmykToHSV(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHSV(rgb.red, rgb.green, rgb.blue);
}


// Convert CMYK to Lab
function cmykToLab(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    const xyz = rgbToXYZ(rgb.red, rgb.green, rgb.blue);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}


// Convert Lab to Hex
function labToHex(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}


//Convert Lab to HSL
function labToHSL(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHSL(rgb.red, rgb.green, rgb.blue);
}


// Convert Lab to RGB
function labToRGB(l, a, b) {
    const xyz = labToXYZ(l, a, b);
    return xyzToRGB(xyz.x, xyz.y, xyz.z);
}


// Convert Lab to HSV
function labToHSV(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHSV(rgb.red, rgb.green, rgb.blue);
}


// Convert Lab to CMYK
function labToCMYK(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}