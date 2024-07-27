// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



// Convert Hex to RGB
function hexToRGB(hexValue) {
    console.log('executing hexToRGB');
    console.log('hexValue: ', hexValue, ' data type ', (typeof hexValue));

    try {
        console.log(`Converting Hex to RGB: ${hexValue}`);
        // Remove the hash at the beginning if it exists
        hexValue = hexValue.replace(/^#/, '');

        // Parse RGB values
        let bigint = parseInt(hex, 16);
        let red = (bigint >> 16) & 255;
        let green = (bigint >> 8) & 255;
        let blue = bigint & 255;

        console.log('red: ', red, ' green: ', green, ' blue: ', blue);
        console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values from hex: R=${red}, G=${green}, B=${blue}`);
        }

        console.log('execution of hexToRGB complete');

        return { red, green, blue };
    } catch (error) {
        console.error(`Error converting Hex to RGB: ${error}`);
        console.log('execution of hexToRGB complete');
        return { red: 0, green: 0, blue: 0 }; // return black for invalid inputs
    }
}


// Convert HSL to RGB
function hslToRGB(hue, saturation, lightness) {
    console.log('executing hslToRGB');
    console.log('hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

    try { // Ensure hue, saturation, and lightness are numbers
        if (typeof hue === 'string') hue = parseFloat(hue);
        if (typeof saturation === 'string') saturation = parseFloat(saturation);
        if (typeof lightness === 'string') lightness = parseFloat(lightness);

        if (isNaN(hue) || isNaN(saturation) || isNaN(lightness)) {
            throw new Error(`Invalid HSL values: H=${hue}, S=${saturation}, L=${lightness}`);
        }

        console.log(`Converting HSL to RGB: H=${hue}, S=${saturation}, L=${lightness}`);
        
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
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;

            console.log('calling hueToRGB 3x, once each for parameters red, green, and blue');

            red = hueToRGB(p, q, hue + 1 / 3);
            green = hueToRGB(p, q, hue);
            blue = hueToRGB(p, q, hue - 1 / 3);
        }

        red = Math.round(red * 255);
        green = Math.round(green * 255);
        blue = Math.round(blue * 255);

        console.log('red: ', red, ' green: ', green, ' blue: ', blue);
        console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values from HSL: R=${red}, G=${green}, B=${blue}`);
        }

        console.log('execution of hslToRGB complete');

        return { red, green, blue };
    } catch (error) {
        console.error(`Error converting HSL to RGB: ${error}`);

        console.log('execution of hslToRGB complete');
        
        // Return black for invalid inputs
        return { red: 0, green: 0, blue: 0 };
    }
}


// Convert HSV to RGB
function hsvToRGB(hue, saturation, value) {
    console.log('executing hsvToRGB');
    console.log('hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`Converting HSV to RGB: H=${hue}, S=${saturation}, V=${value}`);
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
            case 1: red = q, green = value, blue = p; break;
            case 2: red = p, green = value, blue = t; break;
            case 3: red = p, green = q, blue = value; break;
            case 4: red = t, green = p, blue = value; break;
            case 5: red = value, green = p, blue = q; break;
        }

        red = Math.round(red * 255);
        green = Math.round(green * 255);
        blue = Math.round(blue * 255);

        console.log('red: ', red, ' green: ', green, ' blue: ', blue);
        console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ' (typeof blue));

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values from HSV: R=${red}, G=${green}, B=${blue}`);
        }

        console.log('execution of hsvToRGB complete; returning { red, green, blue }');

        return { red, green, blue };
    } catch (error) {
        console.error(`Error converting HSV to RGB: ${error}`);
        
        console.log('execution of hsvToRGB complete; returning { red: 0, green: 0, blue: 0 }');

        // Return black for invalid inputs
        return { red: 0, green: 0, blue: 0 };
    }
}


// Convert CMYK to RGB
function cmykToRGB(cyan, magenta, yellow, key) {
    console.log('executing cmykToRGB');
    console.log('cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`Converting CMYK to RGB: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);

        const red = 255 * (1 - cyan / 100) * (1 - key / 100);
        const green = 255 * (1 - magenta / 100) * (1 - key / 100);
        const blue = 255 * (1 - yellow / 100) * (1 - key / 100);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values from CMYK: R=${red}, G=${green}, B=${blue}`);
        }

        red = Math.round(red);
        green = Math.round(green);
        blue = Math.round(blue);

        console.log('red: ', red, ' green: ', green, ' blue: ', blue);
        console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ' (typeof blue));

        console.log('execution of cmykToRGB complete; returning { red, green, blue }');

        return { red, green, blue };

    } catch (error) {
        console.error(`Error converting CMYK to RGB: ${error}`);

        console.log('execution of cmykToRGB complete; returning { red: 0, green: 0, blue: 0 }');
        
        // Return black for invalid inputs
        return { red: 0, green: 0, blue: 0 };
    }
}


// Convert XYZ to RGB
function xyzToRGB(x, y, z) {
    console.log('executing xyzToRGB');
    console.log('x: ', x, ' y: ', y, ' z: ', z);
    console.log('types')

    try {
        console.log(`Converting XYZ to RGB: X=${x}, Y=${y}, Z=${z}`);
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

        console.log('red: ', red, ' green: ', green, ' blue: ', blue);
        console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ' (typeof blue));

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values from XYZ: R=${red}, G=${green}, B=${blue}`);
        }

        console.log('execution of xyzToRGB complete; returning { red, green, blue }')

        return { red, green, blue };
    } catch (error) {
        console.error(`Error converting XYZ to RGB: ${error}`);
        
        console.log('execution of xyzToRGB complete; returning { red: 0, green: 0, blue: 0');
        // Return black for invalid inputs
        return { red: 0, green: 0, blue: 0 };
    }
}


// Convert Lab to RGB
function labToRGB(l, a, b) {
    console.log('executing labToRGB');
    console.log('l: ', l, ' a: ', a, ' b: ', b);
    console.log('types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

    try {
        console.log(`Converting Lab to RGB: L=${l}, A=${a}, B=${b}`);
        console.log('calling labToXYZ');
        const xyz = labToXYZ(l, a, b);
        console.log(`Converted XYZ from Lab: ${JSON.stringify(xyz)}`);
        console.log('xyz: ', xyz, ' type: ', (typeof xyz));

        console.log('execution of labToRGB complete; will return the result of calling xyzToRGB');

        return xyzToRGB(xyz.x, xyz.y, xyz.z);
    } catch (error) {
        console.error(`Error converting Lab to RGB: ${error}`);
        
        console.log('execution of labToRGB complete; returning { red: 0, green: 0, blue: 0');

        // Return black for invalid inputs
        return { red: 0, green: 0, blue: 0 };
    }
}

export { hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, xyzToRGB, labToRGB };