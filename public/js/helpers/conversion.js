import { convert } from '../color-spaces/color-space-index.js';
import { paletteHelpers } from '../helpers/palette.js';
import { core } from '../utils/core.js';
import { defaults } from '../config/defaults.js';
function applyGammaCorrection(value) {
    try {
        return value > 0.0031308
            ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
            : 12.92 * value;
    }
    catch (error) {
        console.error(`Error applying gamma correction: ${error}`);
        return value;
    }
}
function clampRGB(rgb) {
    if (!paletteHelpers.validateColorValues(rgb)) {
        console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
        return core.clone(defaults.defaultRGB);
    }
    try {
        return {
            value: {
                red: Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255),
                green: Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255),
                blue: Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255)
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`Error clamping RGB values: ${error}`);
        return rgb;
    }
}
function cmykToHSLHelper(cmyk) {
    try {
        if (!paletteHelpers.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.defaultHSL);
        }
        const rgb = convert.cmykToRGB(core.clone(cmyk));
        return convert.rgbToHSL(rgb);
    }
    catch (error) {
        console.error(`Error converting CMYK to HSL: ${error}`);
        return core.clone(defaults.defaultHSL);
    }
}
function cmykToHSVHelper(cmyk) {
    try {
        if (!paletteHelpers.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.defaultHSV);
        }
        const rgb = convert.cmykToRGB(core.clone(cmyk));
        return convert.rgbToHSV(rgb);
    }
    catch (error) {
        console.error(`Error converting CMYK to HSV: ${error}`);
        return core.clone(defaults.defaultHSV);
    }
}
function cmykToXYZHelper(cmyk) {
    try {
        if (!paletteHelpers.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.defaultXYZ);
        }
        const rgb = convert.cmykToRGB(core.clone(cmyk));
        return convert.rgbToXYZ(rgb);
    }
    catch (error) {
        console.error(`Error converting CMYK to XYZ: ${error}`);
        return core.clone(defaults.defaultXYZ);
    }
}
function convertColorToCMYK(color) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.defaultCMYK);
        }
        switch (color.format) {
            case 'cmyk':
                return color;
            case 'hex':
                return hexToCMYKHelper(core.clone(color));
            case 'hsl':
                return hslToCMYKHelper(core.clone(color));
            case 'hsv':
                return hsvToCMYKHelper(core.clone(color));
            case 'lab':
                return labToCMYKHelper(core.clone(color));
            case 'rgb':
                return convert.rgbToCMYK(core.clone(color));
            case 'xyz':
                return convert.xyzToCMYK(core.clone(color));
            default:
                console.error('Unsupported color format');
                return null;
        }
    }
    catch (error) {
        console.error(`Error converting color to CMYK: ${error}`);
        return null;
    }
}
function convertColorToHex(color) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.defaultHex);
        }
        switch (color.format) {
            case 'cmyk':
                return convert.cmykToHex(core.clone(color));
            case 'hex':
                return color;
            case 'hsl':
                return convert.hslToHex(core.clone(color));
            case 'hsv':
                return convert.hsvToHex(core.clone(color));
            case 'lab':
                return convert.labToHex(core.clone(color));
            case 'rgb':
                return convert.rgbToHex(core.clone(color));
            case 'xyz':
                return convert.xyzToHex(core.clone(color));
            default:
                console.error('Unsupported color format');
                return null;
        }
    }
    catch (error) {
        console.error(`Error converting color to hex: ${error}`);
        return null;
    }
}
function convertColorToHSL(color) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.defaultHSL);
        }
        switch (color.format) {
            case 'cmyk':
                return convert.cmykToHSL(core.clone(color));
            case 'hex':
                return convert.hexToHSL(core.clone(color));
            case 'hsl':
                return color;
            case 'hsv':
                return convert.hsvToHSL(core.clone(color));
            case 'lab':
                return convert.labToHSL(core.clone(color));
            case 'rgb':
                return convert.rgbToHSL(core.clone(color));
            case 'xyz':
                return convert.xyzToHSL(core.clone(color));
            default:
                console.error('Unsupported color format');
                return null;
        }
    }
    catch (error) {
        console.error(`Error converting color to HSL: ${error}`);
        return null;
    }
}
function convertColorToHSV(color) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.defaultHSV);
        }
        switch (color.format) {
            case 'cmyk':
                return convert.cmykToHSV(core.clone(color));
            case 'hex':
                return convert.hexToHSV(core.clone(color));
            case 'hsl':
                return convert.hslToHSV(core.clone(color));
            case 'hsv':
                return color;
            case 'lab':
                return convert.labToHSV(core.clone(color));
            case 'rgb':
                return convert.rgbToHSV(core.clone(color));
            case 'xyz':
                return convert.xyzToHSV(core.clone(color));
            default:
                console.error('Unsupported color format');
                return null;
        }
    }
    catch (error) {
        console.error(`Error converting color to HSV: ${error}`);
        return null;
    }
}
function convertColorToLAB(color) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.defaultLAB);
        }
        switch (color.format) {
            case 'cmyk':
                return convert.cmykToLAB(core.clone(color));
            case 'hex':
                return convert.hexToLAB(core.clone(color));
            case 'hsl':
                return convert.hslToLAB(core.clone(color));
            case 'hsv':
                return convert.hsvToLAB(core.clone(color));
            case 'lab':
                return color;
            case 'rgb':
                return convert.rgbToLAB(core.clone(color));
            case 'xyz':
                return convert.xyzToLAB(core.clone(color));
            default:
                console.error('Unsupported color format');
                return null;
        }
    }
    catch (error) {
        console.error(`Error converting color to LAB: ${error}`);
        return null;
    }
}
function convertColorToRGB(color) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.defaultRGB);
        }
        switch (color.format) {
            case 'cmyk':
                return convert.cmykToRGB(core.clone(color));
            case 'hex':
                return convert.hexToRGB(core.clone(color));
            case 'hsl':
                return convert.hslToRGB(core.clone(color));
            case 'hsv':
                return convert.hsvToRGB(core.clone(color));
            case 'lab':
                return convert.labToRGB(core.clone(color));
            case 'rgb':
                return color;
            case 'xyz':
                return convert.xyzToRGB(core.clone(color));
            default:
                console.error('Unsupported color format');
                return null;
        }
    }
    catch (error) {
        console.error(`Error converting color to RGB: ${error}`);
        return null;
    }
}
function hexToCMYKHelper(hex) {
    try {
        if (!paletteHelpers.validateColorValues(hex)) {
            console.error(`Invalid hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.defaultCMYK);
        }
        const rgb = convert.hexToRGB(core.clone(hex));
        return convert.rgbToCMYK(rgb);
    }
    catch (error) {
        console.error(`Error converting hex to CMYK: ${error}`);
        return core.clone(defaults.defaultCMYK);
    }
}
function hexToHSLHelper(hex) {
    try {
        if (!paletteHelpers.validateColorValues(hex)) {
            console.error(`Invalid hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.defaultHSL);
        }
        const rgb = convert.hexToRGB(core.clone(hex));
        return convert.rgbToHSL(rgb);
    }
    catch (error) {
        console.error(`Error converting hex to HSL: ${error}`);
        return core.clone(defaults.defaultHSL);
    }
}
function hexToHSVHelper(hex) {
    try {
        if (!paletteHelpers.validateColorValues(hex)) {
            console.error(`Invalid hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.defaultHSV);
        }
        const rgb = convert.hexToRGB(core.clone(hex));
        return convert.rgbToHSV(rgb);
    }
    catch (error) {
        console.error(`Error converting hex to HSV: ${error}`);
        return core.clone(defaults.defaultHSV);
    }
}
function hexToXYZHelper(hex) {
    try {
        if (!paletteHelpers.validateColorValues(hex)) {
            console.error(`Invalid hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.defaultXYZ);
        }
        const lab = convert.hexToLAB(core.clone(hex));
        const xyz = convert.labToXYZ(lab);
        return xyz;
    }
    catch (error) {
        console.error(`Error converting hex to XYZ: ${error}`);
        return core.clone(defaults.defaultXYZ);
    }
}
export function hueToRGB(p, q, t) {
    try {
        const clonedP = core.clone(p);
        const clonedQ = core.clone(q);
        let clonedT = core.clone(t);
        if (clonedT < 0)
            clonedT += 1;
        if (clonedT > 1)
            clonedT -= 1;
        if (clonedT < 1 / 6)
            return clonedP + (clonedQ - clonedP) * 6 * clonedT;
        if (clonedT < 1 / 2)
            return clonedQ;
        if (clonedT < 2 / 3)
            return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;
        return clonedP;
    }
    catch (error) {
        console.error(`Error converting hue to RGB: ${error}`);
        return 0;
    }
}
function hslAddFormat(value) {
    try {
        if (!paletteHelpers.validateColorValues({ value: value, format: 'hsl' })) {
            console.error(`Invalid HSL value ${JSON.stringify(value)}`);
            return core.clone(defaults.defaultHSL);
        }
        return { value: value, format: 'hsl' };
    }
    catch (error) {
        console.error(`Error adding HSL format: ${error}`);
        return core.clone(defaults.defaultHSL);
    }
}
function hslToCMYKHelper(hsl) {
    try {
        if (!paletteHelpers.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.defaultCMYK);
        }
        const rgb = convert.hslToRGB(core.clone(hsl));
        return convert.rgbToCMYK(rgb);
    }
    catch (error) {
        console.error(`Error converting HSL to CMYK: ${error}`);
        return core.clone(defaults.defaultCMYK);
    }
}
function hslToHexHelper(hsl) {
    try {
        if (!paletteHelpers.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.defaultHex);
        }
        const rgb = convert.hslToRGB(core.clone(hsl));
        return convert.rgbToHex(rgb);
    }
    catch (error) {
        console.error(`Error converting HSL to hex: ${error}`);
        return core.clone(defaults.defaultHex);
    }
}
function hslToHSVHelper(hsl) {
    try {
        if (!paletteHelpers.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.defaultHSV);
        }
        const rgb = convert.hslToRGB(core.clone(hsl));
        return convert.rgbToHSV(rgb);
    }
    catch (error) {
        console.error(`Error converting HSL to HSV: ${error}`);
        return core.clone(defaults.defaultHSV);
    }
}
function hslToXYZHelper(hsl) {
    try {
        if (!paletteHelpers.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.defaultXYZ);
        }
        const lab = convert.hslToLAB(core.clone(hsl));
        return convert.labToXYZ(lab);
    }
    catch (error) {
        console.error(`Error converting HSL to XYZ: ${error}`);
        return core.clone(defaults.defaultXYZ);
    }
}
function hsvToCMYKHelper(hsv) {
    try {
        if (!paletteHelpers.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.defaultCMYK);
        }
        const rgb = convert.hsvToRGB(core.clone(hsv));
        return convert.rgbToCMYK(rgb);
    }
    catch (error) {
        console.error(`Error converting HSV to CMYK: ${error}`);
        return core.clone(defaults.defaultCMYK);
    }
}
function hsvToHSLHelper(hsv) {
    try {
        if (!paletteHelpers.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.defaultHSL);
        }
        const rgb = convert.hsvToRGB(core.clone(hsv));
        return convert.rgbToHSL(rgb);
    }
    catch (error) {
        console.error(`Error converting HSV to HSL: ${error}`);
        return core.clone(defaults.defaultHSL);
    }
}
function hsvToXYZHelper(hsv) {
    try {
        if (!paletteHelpers.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.defaultXYZ);
        }
        const rgb = convert.hsvToRGB(core.clone(hsv));
        return convert.rgbToXYZ(rgb);
    }
    catch (error) {
        console.error(`Error converting HSV to XYZ: ${error}`);
        return core.clone(defaults.defaultXYZ);
    }
}
function labToCMYKHelper(lab) {
    try {
        if (!paletteHelpers.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.defaultCMYK);
        }
        const rgb = convert.labToRGB(core.clone(lab));
        return convert.rgbToCMYK(rgb);
    }
    catch (error) {
        console.error(`Error converting LAB to CMYK: ${error}`);
        return core.clone(defaults.defaultCMYK);
    }
}
function labToHSLHelper(lab) {
    try {
        if (!paletteHelpers.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.defaultHSL);
        }
        const rgb = convert.labToRGB(core.clone(lab));
        return convert.rgbToHSL(rgb);
    }
    catch (error) {
        console.error(`Error converting LAB to HSL: ${error}`);
        return core.clone(defaults.defaultHSL);
    }
}
function labToHSVHelper(lab) {
    try {
        if (!paletteHelpers.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.defaultHSV);
        }
        const rgb = convert.labToRGB(core.clone(lab));
        return convert.rgbToHSV(rgb);
    }
    catch (error) {
        console.error(`Error converting LAB to HSV: ${error}`);
        return core.clone(defaults.defaultHSV);
    }
}
function labToXYZHelper(lab) {
    try {
        if (!paletteHelpers.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.defaultXYZ);
        }
        return convert.labToXYZ(core.clone(lab));
    }
    catch (error) {
        console.error(`Error converting LAB to XYZ: ${error}`);
        return defaults.defaultXYZ;
    }
}
function rgbToHSLHelper(rgb) {
    try {
        if (!paletteHelpers.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.defaultHSL);
        }
        return convert.rgbToHSL(core.clone(rgb));
    }
    catch (error) {
        console.error(`Error converting RGB to HSL: ${error}`);
        return core.clone(defaults.defaultHSL);
    }
}
function rgbToHSVHelper(rgb) {
    try {
        if (!paletteHelpers.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.defaultHSV);
        }
        return convert.rgbToHSV(core.clone(rgb));
    }
    catch (error) {
        console.error(`Error converting RGB to HSV: ${error}`);
        return core.clone(defaults.defaultHSV);
    }
}
function xyzToCMYKHelper(xyz) {
    try {
        if (!paletteHelpers.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.defaultCMYK);
        }
        const lab = convert.xyzToLAB(core.clone(xyz));
        return convert.labToCMYK(lab);
    }
    catch (error) {
        console.error(`Error converting XYZ to CMYK: ${error}`);
        return core.clone(defaults.defaultCMYK);
    }
}
function xyzToHexHelper(xyz) {
    try {
        if (!paletteHelpers.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.defaultHex);
        }
        const lab = convert.xyzToLAB(core.clone(xyz));
        return convert.labToHex(lab);
    }
    catch (error) {
        console.error(`Error converting XYZ to hex: ${error}`);
        return core.clone(defaults.defaultHex);
    }
}
function xyzToHSLHelper(xyz) {
    try {
        if (!paletteHelpers.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.defaultHSL);
        }
        const lab = convert.xyzToLAB(core.clone(xyz));
        return convert.labToHSL(lab);
    }
    catch (error) {
        console.error(`Error converting XYZ to HSL: ${error}`);
        return core.clone(defaults.defaultHSL);
    }
}
function xyzToHSVHelper(xyz) {
    try {
        if (!paletteHelpers.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.defaultHSV);
        }
        const lab = convert.xyzToLAB(core.clone(xyz));
        return convert.labToHSV(lab);
    }
    catch (error) {
        console.error(`Error converting XYZ to HSV: ${error}`);
        return core.clone(defaults.defaultHSV);
    }
}
export const conversionHelpers = {
    applyGammaCorrection,
    clampRGB,
    cmykToHSLHelper,
    cmykToHSVHelper,
    cmykToXYZHelper,
    convertColorToCMYK,
    convertColorToHex,
    convertColorToHSL,
    convertColorToHSV,
    convertColorToLAB,
    convertColorToRGB,
    hexToCMYKHelper,
    hexToHSLHelper,
    hexToHSVHelper,
    hexToXYZHelper,
    hslAddFormat,
    hslToCMYKHelper,
    hslToHexHelper,
    hslToHSVHelper,
    hslToXYZHelper,
    hsvToCMYKHelper,
    hsvToHSLHelper,
    hsvToXYZHelper,
    hueToRGB,
    labToCMYKHelper,
    labToHSLHelper,
    labToHSVHelper,
    labToXYZHelper,
    rgbToHSLHelper,
    rgbToHSVHelper,
    xyzToCMYKHelper,
    xyzToHexHelper,
    xyzToHSLHelper,
    xyzToHSVHelper
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2NvbnZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzVELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUdwRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUU5QyxTQUFTLG9CQUFvQixDQUFDLEtBQWE7SUFDMUMsSUFBSSxDQUFDO1FBQ0osT0FBTyxLQUFLLEdBQUcsU0FBUztZQUN2QixDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLO1lBQzFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFM0QsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWU7SUFDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTFELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELElBQUksQ0FBQztRQUNKLE9BQU87WUFDTixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLElB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Q0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXZELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBZ0M7SUFDN0Qsb0JBQW9CO0lBQ3BCLFFBQVE7SUFDUixlQUFlO0lBQ2YsZUFBZTtJQUNmLGVBQWU7SUFDZixrQkFBa0I7SUFDbEIsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixpQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixlQUFlO0lBQ2YsY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBQ2QsWUFBWTtJQUNaLGVBQWU7SUFDZixjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxlQUFlO0lBQ2YsY0FBYztJQUNkLGNBQWM7SUFDZCxRQUFRO0lBQ1IsZUFBZTtJQUNmLGNBQWM7SUFDZCxjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBQ2QsZUFBZTtJQUNmLGNBQWM7SUFDZCxjQUFjO0lBQ2QsY0FBYztDQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb252ZXJ0IH0gZnJvbSAnLi4vY29sb3Itc3BhY2VzL2NvbG9yLXNwYWNlLWluZGV4JztcbmltcG9ydCB7IHBhbGV0dGVIZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9wYWxldHRlJztcbmltcG9ydCAqIGFzIGZuT2JqZWN0cyBmcm9tICcuLi9pbmRleC9mbi1vYmplY3RzJztcbmltcG9ydCAqIGFzIGNvbG9ycyBmcm9tICcuLi9pbmRleC9jb2xvcnMnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL3V0aWxzL2NvcmUnO1xuaW1wb3J0IHsgZGVmYXVsdHMgfSBmcm9tICcuLi9jb25maWcvZGVmYXVsdHMnO1xuXG5mdW5jdGlvbiBhcHBseUdhbW1hQ29ycmVjdGlvbih2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gdmFsdWUgPiAwLjAwMzEzMDhcblx0XHRcdD8gMS4wNTUgKiBNYXRoLnBvdyh2YWx1ZSwgMSAvIDIuNCkgLSAwLjA1NVxuXHRcdFx0OiAxMi45MiAqIHZhbHVlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGFwcGx5aW5nIGdhbW1hIGNvcnJlY3Rpb246ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gY2xhbXBSR0IocmdiOiBjb2xvcnMuUkdCKTogY29sb3JzLlJHQiB7XG5cdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdFJHQik7XG5cdH1cblxuXHR0cnkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgcmdiLnZhbHVlLnJlZCksIDEpICogMjU1KSxcblx0XHRcdFx0Z3JlZW46IE1hdGgucm91bmQoXG5cdFx0XHRcdFx0TWF0aC5taW4oTWF0aC5tYXgoMCwgcmdiLnZhbHVlLmdyZWVuKSwgMSkgKiAyNTVcblx0XHRcdFx0KSxcblx0XHRcdFx0Ymx1ZTogTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCByZ2IudmFsdWUuYmx1ZSksIDEpICogMjU1KVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNsYW1waW5nIFJHQiB2YWx1ZXM6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gcmdiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNteWtUb0hTTEhlbHBlcihjbXlrOiBjb2xvcnMuQ01ZSyk6IGNvbG9ycy5IU0wge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhjbXlrKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU0wpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJnYjogY29sb3JzLlJHQiA9IGNvbnZlcnQuY215a1RvUkdCKGNvcmUuY2xvbmUoY215aykpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnQucmdiVG9IU0wocmdiKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIENNWUsgdG8gSFNMOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTTCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY215a1RvSFNWSGVscGVyKGNteWs6IGNvbG9ycy5DTVlLKTogY29sb3JzLkhTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNteWspKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTVik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmdiOiBjb2xvcnMuUkdCID0gY29udmVydC5jbXlrVG9SR0IoY29yZS5jbG9uZShjbXlrKSk7XG5cblx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0hTVihyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgQ01ZSyB0byBIU1Y6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNWKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjbXlrVG9YWVpIZWxwZXIoY215azogY29sb3JzLkNNWUspOiBjb2xvcnMuWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY215aykpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgQ01ZSyB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNteWspfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0WFlaKTtcblx0XHR9XG5cblx0XHRjb25zdCByZ2I6IGNvbG9ycy5SR0IgPSBjb252ZXJ0LmNteWtUb1JHQihjb3JlLmNsb25lKGNteWspKTtcblxuXHRcdHJldHVybiBjb252ZXJ0LnJnYlRvWFlaKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBDTVlLIHRvIFhZWjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRYWVopO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDb2xvclRvQ01ZSyhjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3JzLkNNWUsgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0Q01ZSyk7XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gY29sb3IgYXMgY29sb3JzLkNNWUs7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gaGV4VG9DTVlLSGVscGVyKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5IZXgpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvQ01ZS0hlbHBlcihjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuSFNMKTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBoc3ZUb0NNWUtIZWxwZXIoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkhTVik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gbGFiVG9DTVlLSGVscGVyKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5MQUIpO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQucmdiVG9DTVlLKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5SR0IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQueHl6VG9DTVlLKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5YWVopO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgY29sb3IgdG8gQ01ZSzogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDb2xvclRvSGV4KGNvbG9yOiBjb2xvcnMuQ29sb3IpOiBjb2xvcnMuSGV4IHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhleCk7XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5jbXlrVG9IZXgoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkNNWUspO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGNvbG9yIGFzIGNvbG9ycy5IZXg7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5oc2xUb0hleChjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuSFNMKTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LmhzdlRvSGV4KGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5IU1YpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQubGFiVG9IZXgoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkxBQik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0hleChjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuUkdCKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0Lnh5elRvSGV4KGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5YWVopO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgY29sb3IgdG8gaGV4OiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29udmVydENvbG9yVG9IU0woY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9ycy5IU0wgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LmNteWtUb0hTTChjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuQ01ZSyk7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5oZXhUb0hTTChjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuSGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBjb2xvciBhcyBjb2xvcnMuSFNMO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQuaHN2VG9IU0woY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkhTVik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5sYWJUb0hTTChjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuTEFCKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LnJnYlRvSFNMKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5SR0IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQueHl6VG9IU0woY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLlhZWik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQnKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBjb2xvciB0byBIU0w6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0Q29sb3JUb0hTVihjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3JzLkhTViB8IG51bGwge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU1YpO1xuXHRcdH1cblxuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQuY215a1RvSFNWKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5DTVlLKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LmhleFRvSFNWKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5IZXgpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQuaHNsVG9IU1YoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkhTTCk7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gY29sb3IgYXMgY29sb3JzLkhTVjtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LmxhYlRvSFNWKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5MQUIpO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQucmdiVG9IU1YoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLlJHQik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC54eXpUb0hTVihjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuWFlaKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdCcpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIGNvbG9yIHRvIEhTVjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDb2xvclRvTEFCKGNvbG9yOiBjb2xvcnMuQ29sb3IpOiBjb2xvcnMuTEFCIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdExBQik7XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5jbXlrVG9MQUIoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkNNWUspO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQuaGV4VG9MQUIoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5oc2xUb0xBQihjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuSFNMKTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LmhzdlRvTEFCKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5IU1YpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGNvbG9yIGFzIGNvbG9ycy5MQUI7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0xBQihjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuUkdCKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0Lnh5elRvTEFCKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5YWVopO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgY29sb3IgdG8gTEFCOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29udmVydENvbG9yVG9SR0IoY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9ycy5SR0IgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0UkdCKTtcblx0XHR9XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LmNteWtUb1JHQihjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuQ01ZSyk7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5oZXhUb1JHQihjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuSGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0LmhzbFRvUkdCKGNvcmUuY2xvbmUoY29sb3IpIGFzIGNvbG9ycy5IU0wpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQuaHN2VG9SR0IoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLkhTVik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gY29udmVydC5sYWJUb1JHQihjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuTEFCKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBjb2xvciBhcyBjb2xvcnMuUkdCO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnQueHl6VG9SR0IoY29yZS5jbG9uZShjb2xvcikgYXMgY29sb3JzLlhZWik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQnKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBjb2xvciB0byBSR0I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb0NNWUtIZWxwZXIoaGV4OiBjb2xvcnMuSGV4KTogY29sb3JzLkNNWUsge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhoZXgpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRDTVlLKTtcblx0XHR9XG5cblx0XHRjb25zdCByZ2I6IGNvbG9ycy5SR0IgPSBjb252ZXJ0LmhleFRvUkdCKGNvcmUuY2xvbmUoaGV4KSk7XG5cblx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0NNWUsocmdiKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIGhleCB0byBDTVlLOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdENNWUspO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvSFNMSGVscGVyKGhleDogY29sb3JzLkhleCk6IGNvbG9ycy5IU0wge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhoZXgpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU0wpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJnYjogY29sb3JzLlJHQiA9IGNvbnZlcnQuaGV4VG9SR0IoY29yZS5jbG9uZShoZXgpKTtcblxuXHRcdHJldHVybiBjb252ZXJ0LnJnYlRvSFNMKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBoZXggdG8gSFNMOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTTCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9IU1ZIZWxwZXIoaGV4OiBjb2xvcnMuSGV4KTogY29sb3JzLkhTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGhleCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgaGV4IHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaGV4KX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTVik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmdiOiBjb2xvcnMuUkdCID0gY29udmVydC5oZXhUb1JHQihjb3JlLmNsb25lKGhleCkpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnQucmdiVG9IU1YocmdiKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIGhleCB0byBIU1Y6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNWKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb1hZWkhlbHBlcihoZXg6IGNvbG9ycy5IZXgpOiBjb2xvcnMuWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaGV4KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBoZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0WFlaKTtcblx0XHR9XG5cblx0XHRjb25zdCBsYWI6IGNvbG9ycy5MQUIgPSBjb252ZXJ0LmhleFRvTEFCKGNvcmUuY2xvbmUoaGV4KSk7XG5cdFx0Y29uc3QgeHl6OiBjb2xvcnMuWFlaID0gY29udmVydC5sYWJUb1hZWihsYWIpO1xuXG5cdFx0cmV0dXJuIHh5ejtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIGhleCB0byBYWVo6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0WFlaKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaHVlVG9SR0IocDogbnVtYmVyLCBxOiBudW1iZXIsIHQ6IG51bWJlcik6IG51bWJlciB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY2xvbmVkUCA9IGNvcmUuY2xvbmUocCk7XG5cdFx0Y29uc3QgY2xvbmVkUSA9IGNvcmUuY2xvbmUocSk7XG5cdFx0bGV0IGNsb25lZFQgPSBjb3JlLmNsb25lKHQpO1xuXG5cdFx0aWYgKGNsb25lZFQgPCAwKSBjbG9uZWRUICs9IDE7XG5cdFx0aWYgKGNsb25lZFQgPiAxKSBjbG9uZWRUIC09IDE7XG5cdFx0aWYgKGNsb25lZFQgPCAxIC8gNikgcmV0dXJuIGNsb25lZFAgKyAoY2xvbmVkUSAtIGNsb25lZFApICogNiAqIGNsb25lZFQ7XG5cdFx0aWYgKGNsb25lZFQgPCAxIC8gMikgcmV0dXJuIGNsb25lZFE7XG5cdFx0aWYgKGNsb25lZFQgPCAyIC8gMylcblx0XHRcdHJldHVybiBjbG9uZWRQICsgKGNsb25lZFEgLSBjbG9uZWRQKSAqICgyIC8gMyAtIGNsb25lZFQpICogNjtcblxuXHRcdHJldHVybiBjbG9uZWRQO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgaHVlIHRvIFJHQjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiAwO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbEFkZEZvcm1hdCh2YWx1ZTogY29sb3JzLkhTTFZhbHVlKTogY29sb3JzLkhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKFxuXHRcdFx0IXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoeyB2YWx1ZTogdmFsdWUsIGZvcm1hdDogJ2hzbCcgfSlcblx0XHQpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRyZXR1cm4geyB2YWx1ZTogdmFsdWUsIGZvcm1hdDogJ2hzbCcgfSBhcyBjb2xvcnMuSFNMO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGFkZGluZyBIU0wgZm9ybWF0OiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTTCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9DTVlLSGVscGVyKGhzbDogY29sb3JzLkhTTCk6IGNvbG9ycy5DTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0Q01ZSyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmdiOiBjb2xvcnMuUkdCID0gY29udmVydC5oc2xUb1JHQihjb3JlLmNsb25lKGhzbCkpO1xuXHRcdHJldHVybiBjb252ZXJ0LnJnYlRvQ01ZSyhyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNMIHRvIENNWUs6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0Q01ZSyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9IZXhIZWxwZXIoaHNsOiBjb2xvcnMuSFNMKTogY29sb3JzLkhleCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhleCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmdiOiBjb2xvcnMuUkdCID0gY29udmVydC5oc2xUb1JHQihjb3JlLmNsb25lKGhzbCkpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnQucmdiVG9IZXgocmdiKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBoZXg6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hTVkhlbHBlcihoc2w6IGNvbG9ycy5IU0wpOiBjb2xvcnMuSFNWIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNWKTtcblx0XHR9XG5cblx0XHRjb25zdCByZ2I6IGNvbG9ycy5SR0IgPSBjb252ZXJ0LmhzbFRvUkdCKGNvcmUuY2xvbmUoaHNsKSk7XG5cblx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0hTVihyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNMIHRvIEhTVjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU1YpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvWFlaSGVscGVyKGhzbDogY29sb3JzLkhTTCk6IGNvbG9ycy5YWVoge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRYWVopO1xuXHRcdH1cblxuXHRcdGNvbnN0IGxhYjogY29sb3JzLkxBQiA9IGNvbnZlcnQuaHNsVG9MQUIoY29yZS5jbG9uZShoc2wpKTtcblxuXHRcdHJldHVybiBjb252ZXJ0LmxhYlRvWFlaKGxhYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU0wgdG8gWFlaOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdFhZWik7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHN2VG9DTVlLSGVscGVyKGhzdjogY29sb3JzLkhTVik6IGNvbG9ycy5DTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHN2KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0Q01ZSyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmdiOiBjb2xvcnMuUkdCID0gY29udmVydC5oc3ZUb1JHQihjb3JlLmNsb25lKGhzdikpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnQucmdiVG9DTVlLKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU1YgdG8gQ01ZSzogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRDTVlLKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc3ZUb0hTTEhlbHBlcihoc3Y6IGNvbG9ycy5IU1YpOiBjb2xvcnMuSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHN2KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRjb25zdCByZ2I6IGNvbG9ycy5SR0IgPSBjb252ZXJ0LmhzdlRvUkdCKGNvcmUuY2xvbmUoaHN2KSk7XG5cblx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0hTTChyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNWIHRvIEhTTDogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU0wpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzdlRvWFlaSGVscGVyKGhzdjogY29sb3JzLkhTVik6IGNvbG9ycy5YWVoge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTViB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzdil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRYWVopO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJnYjogY29sb3JzLlJHQiA9IGNvbnZlcnQuaHN2VG9SR0IoY29yZS5jbG9uZShoc3YpKTtcblxuXHRcdHJldHVybiBjb252ZXJ0LnJnYlRvWFlaKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU1YgdG8gWFlaOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdFhZWik7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9DTVlLSGVscGVyKGxhYjogY29sb3JzLkxBQik6IGNvbG9ycy5DTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0Q01ZSyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmdiOiBjb2xvcnMuUkdCID0gY29udmVydC5sYWJUb1JHQihjb3JlLmNsb25lKGxhYikpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnQucmdiVG9DTVlLKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBMQUIgdG8gQ01ZSzogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRDTVlLKTtcblx0fVxufVxuXG5mdW5jdGlvbiBsYWJUb0hTTEhlbHBlcihsYWI6IGNvbG9ycy5MQUIpOiBjb2xvcnMuSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRjb25zdCByZ2I6IGNvbG9ycy5SR0IgPSBjb252ZXJ0LmxhYlRvUkdCKGNvcmUuY2xvbmUobGFiKSk7XG5cblx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0hTTChyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgTEFCIHRvIEhTTDogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU0wpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxhYlRvSFNWSGVscGVyKGxhYjogY29sb3JzLkxBQik6IGNvbG9ycy5IU1Yge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU1YpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJnYjogY29sb3JzLlJHQiA9IGNvbnZlcnQubGFiVG9SR0IoY29yZS5jbG9uZShsYWIpKTtcblxuXHRcdHJldHVybiBjb252ZXJ0LnJnYlRvSFNWKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBMQUIgdG8gSFNWOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTVik7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9YWVpIZWxwZXIobGFiOiBjb2xvcnMuTEFCKTogY29sb3JzLlhZWiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdFhZWik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnZlcnQubGFiVG9YWVooY29yZS5jbG9uZShsYWIpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIExBQiB0byBYWVo6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdFhZWjtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0hTTEhlbHBlcihyZ2I6IGNvbG9ycy5SR0IpOiBjb2xvcnMuSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udmVydC5yZ2JUb0hTTChjb3JlLmNsb25lKHJnYikpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgUkdCIHRvIEhTTDogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU0wpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvSFNWSGVscGVyKHJnYjogY29sb3JzLlJHQik6IGNvbG9ycy5IU1Yge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU1YpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb252ZXJ0LnJnYlRvSFNWKGNvcmUuY2xvbmUocmdiKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBSR0IgdG8gSFNWOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTVik7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9DTVlLSGVscGVyKHh5ejogY29sb3JzLlhZWik6IGNvbG9ycy5DTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0Q01ZSyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbGFiOiBjb2xvcnMuTEFCID0gY29udmVydC54eXpUb0xBQihjb3JlLmNsb25lKHh5eikpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnQubGFiVG9DTVlLKGxhYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBYWVogdG8gQ01ZSzogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRDTVlLKTtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb0hleEhlbHBlcih4eXo6IGNvbG9ycy5YWVopOiBjb2xvcnMuSGV4IHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SGV4KTtcblx0XHR9XG5cblx0XHRjb25zdCBsYWI6IGNvbG9ycy5MQUIgPSBjb252ZXJ0Lnh5elRvTEFCKGNvcmUuY2xvbmUoeHl6KSk7XG5cblx0XHRyZXR1cm4gY29udmVydC5sYWJUb0hleChsYWIpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgWFlaIHRvIGhleDogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIZXgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHh5elRvSFNMSGVscGVyKHh5ejogY29sb3JzLlhZWik6IGNvbG9ycy5IU0wge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIU0wpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGxhYjogY29sb3JzLkxBQiA9IGNvbnZlcnQueHl6VG9MQUIoY29yZS5jbG9uZSh4eXopKTtcblxuXHRcdHJldHVybiBjb252ZXJ0LmxhYlRvSFNMKGxhYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBYWVogdG8gSFNMOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTTCk7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9IU1ZIZWxwZXIoeHl6OiBjb2xvcnMuWFlaKTogY29sb3JzLkhTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKHh5eikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdEhTVik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbGFiOiBjb2xvcnMuTEFCID0gY29udmVydC54eXpUb0xBQihjb3JlLmNsb25lKHh5eikpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnQubGFiVG9IU1YobGFiKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIFhZWiB0byBIU1Y6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0SFNWKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgY29udmVyc2lvbkhlbHBlcnM6IGZuT2JqZWN0cy5Db252ZXJzaW9uSGVscGVycyA9IHtcblx0YXBwbHlHYW1tYUNvcnJlY3Rpb24sXG5cdGNsYW1wUkdCLFxuXHRjbXlrVG9IU0xIZWxwZXIsXG5cdGNteWtUb0hTVkhlbHBlcixcblx0Y215a1RvWFlaSGVscGVyLFxuXHRjb252ZXJ0Q29sb3JUb0NNWUssXG5cdGNvbnZlcnRDb2xvclRvSGV4LFxuXHRjb252ZXJ0Q29sb3JUb0hTTCxcblx0Y29udmVydENvbG9yVG9IU1YsXG5cdGNvbnZlcnRDb2xvclRvTEFCLFxuXHRjb252ZXJ0Q29sb3JUb1JHQixcblx0aGV4VG9DTVlLSGVscGVyLFxuXHRoZXhUb0hTTEhlbHBlcixcblx0aGV4VG9IU1ZIZWxwZXIsXG5cdGhleFRvWFlaSGVscGVyLFxuXHRoc2xBZGRGb3JtYXQsXG5cdGhzbFRvQ01ZS0hlbHBlcixcblx0aHNsVG9IZXhIZWxwZXIsXG5cdGhzbFRvSFNWSGVscGVyLFxuXHRoc2xUb1hZWkhlbHBlcixcblx0aHN2VG9DTVlLSGVscGVyLFxuXHRoc3ZUb0hTTEhlbHBlcixcblx0aHN2VG9YWVpIZWxwZXIsXG5cdGh1ZVRvUkdCLFxuXHRsYWJUb0NNWUtIZWxwZXIsXG5cdGxhYlRvSFNMSGVscGVyLFxuXHRsYWJUb0hTVkhlbHBlcixcblx0bGFiVG9YWVpIZWxwZXIsXG5cdHJnYlRvSFNMSGVscGVyLFxuXHRyZ2JUb0hTVkhlbHBlcixcblx0eHl6VG9DTVlLSGVscGVyLFxuXHR4eXpUb0hleEhlbHBlcixcblx0eHl6VG9IU0xIZWxwZXIsXG5cdHh5elRvSFNWSGVscGVyXG59O1xuIl19