// ColorGen - version 0.5.21-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



// Convert RGB to XYZ
function rgbToXYZ(red, green, blue) {
    console.log('executing rgbToXYZ');
    console.log('red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));
    
    try {
        console.log(`Converting RGB to XYZ: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

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

        console.log('x: ', x, ' y: ', y, ' z: ', z);
        console.log('types - x: ', (typeof x), ' y: ', (typeof y), ' z: ', (typeof z));

        const xyz = { x, y, z };

        console.log(`Converted XYZ from RGB: ${JSON.stringify(xyz)}`);
        console.log('xyz:, ', xyz, ' type: ', (typeof xyz));
        console.log('execution of rgbToXYZ complete; returning xyz as { x, y, z }');

        return xyz;
    } catch (error) {
        console.error(`Error converting RGB to XYZ: ${error}`);
        console.log('execution of rgbToXYZ complete; returning { x: 0, y: 0, z: 0 }');

        // Return black for invalid inputs
        return { x: 0, y: 0, z: 0 }; 
    }
};


// Convert Lab to XYZ
function labToXYZ(l, a, b) {
    console.log('executing labToXYZ');
    console.log('l: ', l, ' a: ', a, ' b: ', b);
    console.log('types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

    try {
        console.log(`Converting Lab to XYZ: L=${l}, A=${a}, B=${b}`);

        if (isNaN(l) || isNaN(a) || isNaN(b)) {
            throw new Error(`Invalid Lab values: L=${l}, A=${a}, B=${b}`);
        }

        const refX = 95.047, refY = 100.000, refZ = 108.883;

        let y = (l + 16) / 116;
        let x = a / 500 + y;
        let z = y - b / 200;

        const pow = Math.pow;

        x = refX * (pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787);
        y = refY * (pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787);
        z = refZ * (pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787);
        
        console.log('x: ', x, ' y: ', y, ' z: ', z);
        console.log('types - x: ', (typeof x), ' y: ', (typeof y), ' z: ', (typeof z));

        const xyz = { x, y, z };

        console.log(`Converted XYZ from Lab: ${JSON.stringify(xyz)}`);
        console.log('xyz:, ', xyz, ' type: ', (typeof xyz));
        console.log('execution of labToXYZ complete; returning xyz as { x, y, z }');
        
        return xyz;
    } catch (error) {
        console.error(`Error converting Lab to XYZ: ${error}`);

        console.log('execution of labToXYZ complete; returning { x: 0, y: 0, z: 0');
        
        // Return black for invalid inputs
        return { x: 0, y: 0, z: 0 }; 
    }
};


export { rgbToXYZ, labToXYZ }