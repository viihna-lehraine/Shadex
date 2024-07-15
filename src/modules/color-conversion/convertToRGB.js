// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



// Convert Hex to RGB
function hexToRGB(hex) {
    // remove the hash at the beginning if it exists
    hex = hex.replace(/^#/, '');

    // parse RGB values    
    let bigint = parseInt(hex, 16);
    let red = (bigint >> 16) & 255;
    let green = (bigint >> 8) & 255;
    let blue = bigint & 255;

    return { red, green, blue };
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


// Convert Lab to RGB
function labToRGB(l, a, b) {
    const xyz = labToXYZ(l, a, b);
    return xyzToRGB(xyz.x, xyz.y, xyz.z);
}

export { hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, xyzToRGB, labToRGB };