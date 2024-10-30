import { genHues } from './hues.js';
import { genAllColorValues } from '../color-spaces/conversion.js';
import { defaults } from '../config/defaults.js';
import { domFn } from '../dom/dom-main.js';
import { idbFn } from '../dom/idb-fn.js';
import { genRandomColor } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
import { transform } from '../utils/transform.js';
export function genPalette() {
    const slColorSpace = 'sl';
    function getBaseColor(customColor, colorSpace) {
        const color = core.clone(customColor ?? genRandomColor(colorSpace));
        if (color.format === 'sl' || color.format === 'sv') {
            throw new Error(`Invalid color format: ${color.format} in getBaseColor`);
        }
        return color;
    }
    function createPaletteItem(color) {
        const colorConversions = genAllColorValues(color);
        return {
            id: `${color.format}_${Math.random()}`,
            color,
            colorConversions: {
                cmyk: colorConversions.cmyk,
                hex: colorConversions.hex,
                hsl: colorConversions.hsl,
                hsv: colorConversions.hsv,
                lab: colorConversions.lab,
                rgb: colorConversions.rgb,
                sl: colorConversions.sl,
                sv: colorConversions.sv,
                xyz: colorConversions.xyz
            },
            colorStringConversions: {
                cmykString: colorConversions.cmyk
                    ? transform.colorToColorString(colorConversions.cmyk)
                    : defaults.defaultCMYKString,
                hslString: colorConversions.hsl
                    ? transform.colorToColorString(colorConversions.hsl)
                    : defaults.defaultHSLString,
                hsvString: colorConversions.hsv
                    ? transform.colorToColorString(colorConversions.hsv)
                    : defaults.defaultHSVString,
                slString: colorConversions.sl
                    ? transform.colorToColorString(colorConversions.sl)
                    : defaults.defaultSLString,
                svString: colorConversions.sv
                    ? transform.colorToColorString(colorConversions.sv)
                    : defaults.defaultSVString
            },
            cssStrings: {
                cmykCSSString: colorConversions.cmyk
                    ? transform.getCSSColorString(colorConversions.cmyk)
                    : '',
                hexCSSString: colorConversions.hex?.value.hex ?? '',
                hslCSSString: colorConversions.hsl
                    ? transform.getCSSColorString(colorConversions.hsl)
                    : '',
                hsvCSSString: colorConversions.hsv
                    ? transform.getCSSColorString(colorConversions.hsv)
                    : '',
                labCSSString: colorConversions.lab
                    ? transform.getCSSColorString(colorConversions.lab)
                    : '',
                xyzCSSString: colorConversions.xyz
                    ? transform.getCSSColorString(colorConversions.xyz)
                    : ''
            },
            rawColorStrings: {
                cmykRawString: colorConversions.cmyk
                    ? transform.getRawColorString(colorConversions.cmyk)
                    : '',
                hexRawString: colorConversions.hex
                    ? transform.getRawColorString(colorConversions.hex)
                    : '',
                hslRawString: colorConversions.hsl
                    ? transform.getRawColorString(colorConversions.hsl)
                    : '',
                hsvRawString: colorConversions.hsv
                    ? transform.getRawColorString(colorConversions.hsv)
                    : '',
                labRawString: colorConversions.lab
                    ? transform.getRawColorString(colorConversions.lab)
                    : '',
                slRawString: colorConversions.sl
                    ? transform.getRawColorString(colorConversions.sl)
                    : '',
                svRawString: colorConversions.sv
                    ? transform.getRawColorString(colorConversions.sv)
                    : '',
                xyzRawString: colorConversions.xyz
                    ? transform.getRawColorString(colorConversions.xyz)
                    : ''
            }
        };
    }
    function createPaletteObject(type, items, baseColor, numBoxes) {
        const validColorSpace = (format) => ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(format);
        const originalColorSpace = validColorSpace(baseColor.format)
            ? baseColor.format
            : 'hex';
        return {
            id: `${type}_${Date.now()}`,
            items,
            flags: {
                enableAlpha: false,
                limitDark: false,
                limitGray: false,
                limitLight: false
            },
            metadata: {
                numBoxes,
                originalColorSpace,
                paletteType: type,
                customColor: {
                    originalColor: baseColor,
                    colorConversions: items[0]?.colorConversions || {}
                }
            }
        };
    }
    function generatePaletteItems(baseColor, colorSpace, hues) {
        const paletteItems = [
            createPaletteItem(baseColor)
        ];
        hues.forEach((hue, i) => {
            const sl = genRandomColor(slColorSpace);
            const newColor = genAllColorValues({
                value: { hue, ...sl.value },
                format: 'hsl'
            }).hsl;
            if (newColor) {
                paletteItems.push(createPaletteItem(newColor));
                updateColorBox(newColor, colorSpace, i + 1);
            }
        });
        return paletteItems;
    }
    async function savePaletteToDB(type, items, baseColor, numBoxes) {
        const newPalette = createPaletteObject(type, items, baseColor, numBoxes);
        await idbFn.savePalette(newPalette.id, {
            tableID: parseInt(newPalette.id.split('_')[1]),
            palette: newPalette
        });
        console.log(`Saved ${type} palette: ${JSON.stringify(newPalette)}`);
        return newPalette;
    }
    function updateColorBox(color, colorSpace, index) {
        if (color.format === 'sl' || color.format === 'sv') {
            console.error(`Invalid color format: ${color.format}`);
            return;
        }
        const colorBox = document.getElementById(`color-box-${index + 1}`);
        if (colorBox) {
            const colorValues = genAllColorValues(color);
            const selectedColor = colorValues[colorSpace];
            if (selectedColor) {
                const hexColor = colorValues.hex;
                colorBox.style.backgroundColor = hexColor.value.hex;
                domFn.populateColorTextOutputBox(selectedColor, index + 1);
            }
        }
    }
    async function analogous(numBoxes, customColor = null, colorSpace = 'hex') {
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseColorValues = genAllColorValues(baseColor);
        const hues = genHues.analogous(baseColorValues.hsl, numBoxes);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, hues);
        return await savePaletteToDB('analogous', paletteItems, baseColor, numBoxes);
    }
    async function complementary(numBoxes, customColor = null, colorSpace = 'hex') {
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseHSL = genAllColorValues(baseColor).hsl;
        const complementaryHue = (baseHSL.value.hue + 180) % 360;
        const hues = Array(numBoxes - 1).fill(complementaryHue);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, hues);
        return await savePaletteToDB('complementary', paletteItems, baseColor, numBoxes);
    }
    async function diadic(numBoxes, customColor = null, colorSpace = 'hex') {
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseHSL = genAllColorValues(baseColor).hsl;
        const hues = genHues.diadic(baseHSL.value.hue);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, hues);
        return await savePaletteToDB('diadic', paletteItems, baseColor, numBoxes);
    }
    async function hexadic(numBoxes, customColor = null, colorSpace = 'hex') {
        if (numBoxes < 6) {
            console.warn('Hexadic palette requires at least 6 swatches.');
            return createPaletteObject('hexadic', [], defaults.defaultHex, 0);
        }
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseHSL = genAllColorValues(baseColor).hsl;
        const hues = genHues.hexadic(baseHSL);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, hues);
        return await savePaletteToDB('hexadic', paletteItems, baseColor, numBoxes);
    }
    async function monochromatic(numBoxes, customColor = null, colorSpace = 'hex') {
        if (numBoxes < 2) {
            console.warn('Monochromatic palette requires at least 2 swatches.');
            return createPaletteObject('monochromatic', [], defaults.defaultHex, 0);
        }
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseHSL = genAllColorValues(baseColor).hsl;
        const hues = Array(numBoxes - 1).fill(baseHSL.value.hue);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, hues);
        return await savePaletteToDB('monochromatic', paletteItems, baseColor, numBoxes);
    }
    async function random(numBoxes, customColor = null, colorSpace = 'hex') {
        const baseColor = getBaseColor(customColor, colorSpace);
        const paletteItems = [
            createPaletteItem(baseColor)
        ];
        for (let i = 1; i < numBoxes; i++) {
            const randomColor = genRandomColor(colorSpace);
            paletteItems.push(createPaletteItem(randomColor));
            updateColorBox(randomColor, colorSpace, i);
        }
        return await savePaletteToDB('random', paletteItems, baseColor, numBoxes);
    }
    async function splitComplementary(numBoxes, customColor = null, colorSpace = 'hex') {
        if (numBoxes < 3) {
            console.warn('Split complementary palette requires at least 3 swatches.');
            return createPaletteObject('splitComplementary', [], defaults.defaultHex, 0);
        }
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseHSL = genAllColorValues(baseColor).hsl;
        const hues = genHues.splitComplementary(baseHSL.value.hue);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, hues);
        return await savePaletteToDB('splitComplementary', paletteItems, baseColor, numBoxes);
    }
    async function tetradic(numBoxes, customColor = null, colorSpace = 'hex') {
        if (numBoxes < 4) {
            console.warn('Tetradic palette requires at least 4 swatches.');
            return createPaletteObject('tetradic', [], defaults.defaultHex, 0);
        }
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseHSL = genAllColorValues(baseColor).hsl;
        const tetradicHues = genHues.tetradic(baseHSL.value.hue);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, tetradicHues);
        return await savePaletteToDB('tetradic', paletteItems, baseColor, numBoxes);
    }
    async function triadic(numBoxes, customColor = null, colorSpace = 'hex') {
        if (numBoxes < 3) {
            console.warn('Triadic palette requires at least 3 swatches.');
            return createPaletteObject('triadic', [], defaults.defaultHex, 0);
        }
        const baseColor = getBaseColor(customColor, colorSpace);
        const baseHSL = genAllColorValues(baseColor).hsl;
        const hues = genHues.triadic(baseHSL.value.hue);
        const paletteItems = generatePaletteItems(baseColor, colorSpace, hues);
        return await savePaletteToDB('triadic', paletteItems, baseColor, numBoxes);
    }
    return {
        getBaseColor,
        createPaletteObject,
        createPaletteItem,
        generatePaletteItems,
        savePaletteToDB,
        updateColorBox,
        analogous,
        complementary,
        diadic,
        hexadic,
        monochromatic,
        random,
        splitComplementary,
        tetradic,
        triadic
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFsZXR0ZS1nZW4vcGFsZXR0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJdEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRS9DLE1BQU0sVUFBVSxVQUFVO0lBQ3pCLE1BQU0sWUFBWSxHQUE4QixJQUFJLENBQUM7SUFFckQsU0FBUyxZQUFZLENBQ3BCLFdBQWdDLEVBQ2hDLFVBQTZCO1FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRXBFLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNwRCxNQUFNLElBQUksS0FBSyxDQUNkLHlCQUF5QixLQUFLLENBQUMsTUFBTSxrQkFBa0IsQ0FDdkQsQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPLEtBQXFELENBQUM7SUFDOUQsQ0FBQztJQUVELFNBQVMsaUJBQWlCLENBQ3pCLEtBQW1EO1FBRW5ELE1BQU0sZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEQsT0FBTztZQUNOLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3RDLEtBQUs7WUFDTCxnQkFBZ0IsRUFBRTtnQkFDakIsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQW1CO2dCQUMxQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsR0FBaUI7Z0JBQ3ZDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFpQjtnQkFDdkMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLEdBQWlCO2dCQUN2QyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsR0FBaUI7Z0JBQ3ZDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFpQjtnQkFDdkMsRUFBRSxFQUFFLGdCQUFnQixDQUFDLEVBQWU7Z0JBQ3BDLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFlO2dCQUNwQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsR0FBaUI7YUFDdkM7WUFDRCxzQkFBc0IsRUFBRTtnQkFDdkIsVUFBVSxFQUFFLGdCQUFnQixDQUFDLElBQUk7b0JBQ2hDLENBQUMsQ0FBRSxTQUFTLENBQUMsa0JBQWtCLENBQzdCLGdCQUFnQixDQUFDLElBQUksQ0FDQztvQkFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUI7Z0JBQzdCLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHO29CQUM5QixDQUFDLENBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUM3QixnQkFBZ0IsQ0FBQyxHQUFHLENBQ0M7b0JBQ3ZCLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCO2dCQUM1QixTQUFTLEVBQUUsZ0JBQWdCLENBQUMsR0FBRztvQkFDOUIsQ0FBQyxDQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FDN0IsZ0JBQWdCLENBQUMsR0FBRyxDQUNDO29CQUN2QixDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQjtnQkFDNUIsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEVBQUU7b0JBQzVCLENBQUMsQ0FBRSxTQUFTLENBQUMsa0JBQWtCLENBQzdCLGdCQUFnQixDQUFDLEVBQUUsQ0FDQztvQkFDdEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlO2dCQUMzQixRQUFRLEVBQUUsZ0JBQWdCLENBQUMsRUFBRTtvQkFDNUIsQ0FBQyxDQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FDN0IsZ0JBQWdCLENBQUMsRUFBRSxDQUNDO29CQUN0QixDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWU7YUFDM0I7WUFDRCxVQUFVLEVBQUU7Z0JBQ1gsYUFBYSxFQUFFLGdCQUFnQixDQUFDLElBQUk7b0JBQ25DLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO29CQUNwRCxDQUFDLENBQUMsRUFBRTtnQkFDTCxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRTtnQkFDbkQsWUFBWSxFQUFFLGdCQUFnQixDQUFDLEdBQUc7b0JBQ2pDLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO29CQUNuRCxDQUFDLENBQUMsRUFBRTtnQkFDTCxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsR0FBRztvQkFDakMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7b0JBQ25ELENBQUMsQ0FBQyxFQUFFO2dCQUNMLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHO29CQUNqQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztvQkFDbkQsQ0FBQyxDQUFDLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFLGdCQUFnQixDQUFDLEdBQUc7b0JBQ2pDLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO29CQUNuRCxDQUFDLENBQUMsRUFBRTthQUNMO1lBQ0QsZUFBZSxFQUFFO2dCQUNoQixhQUFhLEVBQUUsZ0JBQWdCLENBQUMsSUFBSTtvQkFDbkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7b0JBQ3BELENBQUMsQ0FBQyxFQUFFO2dCQUNMLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHO29CQUNqQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztvQkFDbkQsQ0FBQyxDQUFDLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFLGdCQUFnQixDQUFDLEdBQUc7b0JBQ2pDLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO29CQUNuRCxDQUFDLENBQUMsRUFBRTtnQkFDTCxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsR0FBRztvQkFDakMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7b0JBQ25ELENBQUMsQ0FBQyxFQUFFO2dCQUNMLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHO29CQUNqQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztvQkFDbkQsQ0FBQyxDQUFDLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLGdCQUFnQixDQUFDLEVBQUU7b0JBQy9CLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO29CQUNsRCxDQUFDLENBQUMsRUFBRTtnQkFDTCxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsRUFBRTtvQkFDL0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7b0JBQ2xELENBQUMsQ0FBQyxFQUFFO2dCQUNMLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHO29CQUNqQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztvQkFDbkQsQ0FBQyxDQUFDLEVBQUU7YUFDTDtTQUNELENBQUM7SUFDSCxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FDM0IsSUFBWSxFQUNaLEtBQTRCLEVBQzVCLFNBQXVCLEVBQ3ZCLFFBQWdCO1FBRWhCLE1BQU0sZUFBZSxHQUFHLENBQUMsTUFBYyxFQUErQixFQUFFLENBQ3ZFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sa0JBQWtCLEdBQXNCLGVBQWUsQ0FDNUQsU0FBUyxDQUFDLE1BQU0sQ0FDaEI7WUFDQSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU07WUFDbEIsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUVULE9BQU87WUFDTixFQUFFLEVBQUUsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzNCLEtBQUs7WUFDTCxLQUFLLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsVUFBVSxFQUFFLEtBQUs7YUFDakI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1QsUUFBUTtnQkFDUixrQkFBa0I7Z0JBQ2xCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixXQUFXLEVBQUU7b0JBQ1osYUFBYSxFQUFFLFNBQVM7b0JBQ3hCLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsSUFBSSxFQUFFO2lCQUNsRDthQUNEO1NBQ0QsQ0FBQztJQUNILENBQUM7SUFFRCxTQUFTLG9CQUFvQixDQUM1QixTQUF1RCxFQUN2RCxVQUE2QixFQUM3QixJQUFjO1FBRWQsTUFBTSxZQUFZLEdBQTBCO1lBQzNDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztTQUM1QixDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QixNQUFNLEVBQUUsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFjLENBQUM7WUFDckQsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ2xDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNCLE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUVQLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ2QsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxjQUFjLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxZQUFZLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUssVUFBVSxlQUFlLENBQzdCLElBQVksRUFDWixLQUE0QixFQUM1QixTQUF1QixFQUN2QixRQUFnQjtRQUVoQixNQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FDckMsSUFBSSxFQUNKLEtBQUssRUFDTCxTQUFTLEVBQ1QsUUFBUSxDQUNSLENBQUM7UUFFRixNQUFNLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxPQUFPLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sRUFBRSxVQUFVO1NBQ25CLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLGFBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEUsT0FBTyxVQUFVLENBQUM7SUFDbkIsQ0FBQztJQUVELFNBQVMsY0FBYyxDQUN0QixLQUFtQixFQUNuQixVQUE2QixFQUM3QixLQUFhO1FBRWIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5FLElBQUksUUFBUSxFQUFFLENBQUM7WUFDZCxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FDcEMsS0FBcUQsQ0FDckQsQ0FBQztZQUNGLE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQWlCLENBQUM7WUFFOUQsSUFBSSxhQUFhLEVBQUUsQ0FBQztnQkFDbkIsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQWlCLENBQUM7Z0JBRS9DLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUVwRCxLQUFLLENBQUMsMEJBQTBCLENBQUMsYUFBYSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7SUFFRCxLQUFLLFVBQVUsU0FBUyxDQUN2QixRQUFnQixFQUNoQixjQUFtQyxJQUFJLEVBQ3ZDLGFBQWdDLEtBQUs7UUFFckMsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN4RCxNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUM3QixlQUFlLENBQUMsR0FBaUIsRUFDakMsUUFBUSxDQUNSLENBQUM7UUFDRixNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZFLE9BQU8sTUFBTSxlQUFlLENBQzNCLFdBQVcsRUFDWCxZQUFZLEVBQ1osU0FBUyxFQUNULFFBQVEsQ0FDUixDQUFDO0lBQ0gsQ0FBQztJQUVELEtBQUssVUFBVSxhQUFhLENBQzNCLFFBQWdCLEVBQ2hCLGNBQW1DLElBQUksRUFDdkMsYUFBZ0MsS0FBSztRQUVyQyxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQWlCLENBQUM7UUFDL0QsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN6RCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sWUFBWSxHQUFHLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFdkUsT0FBTyxNQUFNLGVBQWUsQ0FDM0IsZUFBZSxFQUNmLFlBQVksRUFDWixTQUFTLEVBQ1QsUUFBUSxDQUNSLENBQUM7SUFDSCxDQUFDO0lBRUQsS0FBSyxVQUFVLE1BQU0sQ0FDcEIsUUFBZ0IsRUFDaEIsY0FBbUMsSUFBSSxFQUN2QyxhQUFnQyxLQUFLO1FBRXJDLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBaUIsQ0FBQztRQUMvRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxZQUFZLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV2RSxPQUFPLE1BQU0sZUFBZSxDQUMzQixRQUFRLEVBQ1IsWUFBWSxFQUNaLFNBQVMsRUFDVCxRQUFRLENBQ1IsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLFVBQVUsT0FBTyxDQUNyQixRQUFnQixFQUNoQixjQUFtQyxJQUFJLEVBQ3ZDLGFBQWdDLEtBQUs7UUFFckMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBRTlELE9BQU8sbUJBQW1CLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQWlCLENBQUM7UUFDL0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZFLE9BQU8sTUFBTSxlQUFlLENBQzNCLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULFFBQVEsQ0FDUixDQUFDO0lBQ0gsQ0FBQztJQUVELEtBQUssVUFBVSxhQUFhLENBQzNCLFFBQWdCLEVBQ2hCLGNBQW1DLElBQUksRUFDdkMsYUFBZ0MsS0FBSztRQUVyQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLHFEQUFxRCxDQUFDLENBQUM7WUFFcEUsT0FBTyxtQkFBbUIsQ0FDekIsZUFBZSxFQUNmLEVBQUUsRUFDRixRQUFRLENBQUMsVUFBVSxFQUNuQixDQUFDLENBQ0QsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQWlCLENBQUM7UUFDL0QsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6RCxNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZFLE9BQU8sTUFBTSxlQUFlLENBQzNCLGVBQWUsRUFDZixZQUFZLEVBQ1osU0FBUyxFQUNULFFBQVEsQ0FDUixDQUFDO0lBQ0gsQ0FBQztJQUVELEtBQUssVUFBVSxNQUFNLENBQ3BCLFFBQWdCLEVBQ2hCLGNBQW1DLElBQUksRUFDdkMsYUFBZ0MsS0FBSztRQUVyQyxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sWUFBWSxHQUEwQjtZQUMzQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUM7U0FDNUIsQ0FBQztRQUVGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNuQyxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUc1QyxDQUFDO1lBRUYsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRWxELGNBQWMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFRCxPQUFPLE1BQU0sZUFBZSxDQUMzQixRQUFRLEVBQ1IsWUFBWSxFQUNaLFNBQVMsRUFDVCxRQUFRLENBQ1IsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLFVBQVUsa0JBQWtCLENBQ2hDLFFBQWdCLEVBQ2hCLGNBQW1DLElBQUksRUFDdkMsYUFBZ0MsS0FBSztRQUVyQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixPQUFPLENBQUMsSUFBSSxDQUNYLDJEQUEyRCxDQUMzRCxDQUFDO1lBRUYsT0FBTyxtQkFBbUIsQ0FDekIsb0JBQW9CLEVBQ3BCLEVBQUUsRUFDRixRQUFRLENBQUMsVUFBVSxFQUNuQixDQUFDLENBQ0QsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQWlCLENBQUM7UUFDL0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0QsTUFBTSxZQUFZLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV2RSxPQUFPLE1BQU0sZUFBZSxDQUMzQixvQkFBb0IsRUFDcEIsWUFBWSxFQUNaLFNBQVMsRUFDVCxRQUFRLENBQ1IsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLFVBQVUsUUFBUSxDQUN0QixRQUFnQixFQUNoQixjQUFtQyxJQUFJLEVBQ3ZDLGFBQWdDLEtBQUs7UUFFckMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1lBRS9ELE9BQU8sbUJBQW1CLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQWlCLENBQUM7UUFDL0QsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sWUFBWSxHQUFHLG9CQUFvQixDQUN4QyxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksQ0FDWixDQUFDO1FBQ0YsT0FBTyxNQUFNLGVBQWUsQ0FDM0IsVUFBVSxFQUNWLFlBQVksRUFDWixTQUFTLEVBQ1QsUUFBUSxDQUNSLENBQUM7SUFDSCxDQUFDO0lBRUQsS0FBSyxVQUFVLE9BQU8sQ0FDckIsUUFBZ0IsRUFDaEIsY0FBbUMsSUFBSSxFQUN2QyxhQUFnQyxLQUFLO1FBRXJDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztZQUU5RCxPQUFPLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBRUQsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN4RCxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFpQixDQUFDO1FBQy9ELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZFLE9BQU8sTUFBTSxlQUFlLENBQzNCLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULFFBQVEsQ0FDUixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTixZQUFZO1FBQ1osbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQixvQkFBb0I7UUFDcEIsZUFBZTtRQUNmLGNBQWM7UUFDZCxTQUFTO1FBQ1QsYUFBYTtRQUNiLE1BQU07UUFDTixPQUFPO1FBQ1AsYUFBYTtRQUNiLE1BQU07UUFDTixrQkFBa0I7UUFDbEIsUUFBUTtRQUNSLE9BQU87S0FDUCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbkh1ZXMgfSBmcm9tICcuL2h1ZXMnO1xuaW1wb3J0IHsgZ2VuQWxsQ29sb3JWYWx1ZXMgfSBmcm9tICcuLi9jb2xvci1zcGFjZXMvY29udmVyc2lvbic7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0cyc7XG5pbXBvcnQgeyBkb21GbiB9IGZyb20gJy4uL2RvbS9kb20tbWFpbic7XG5pbXBvcnQgeyBpZGJGbiB9IGZyb20gJy4uL2RvbS9pZGItZm4nO1xuaW1wb3J0ICogYXMgY29sb3JzIGZyb20gJy4uL2luZGV4L2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBwYWxldHRlIGZyb20gJy4uL2luZGV4L3BhbGV0dGUnO1xuaW1wb3J0ICogYXMgZm5PYmplY3RzIGZyb20gJy4uL2luZGV4L2ZuLW9iamVjdHMnO1xuaW1wb3J0IHsgZ2VuUmFuZG9tQ29sb3IgfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcbmltcG9ydCB7IGNvcmUgfSBmcm9tICcuLi91dGlscy9jb3JlJztcbmltcG9ydCB7IHRyYW5zZm9ybSB9IGZyb20gJy4uL3V0aWxzL3RyYW5zZm9ybSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5QYWxldHRlKCk6IGZuT2JqZWN0cy5HZW5QYWxldHRlIHtcblx0Y29uc3Qgc2xDb2xvclNwYWNlOiBjb2xvcnMuQ29sb3JTcGFjZUV4dGVuZGVkID0gJ3NsJztcblxuXHRmdW5jdGlvbiBnZXRCYXNlQ29sb3IoXG5cdFx0Y3VzdG9tQ29sb3I6IGNvbG9ycy5Db2xvciB8IG51bGwsXG5cdFx0Y29sb3JTcGFjZTogY29sb3JzLkNvbG9yU3BhY2Vcblx0KTogRXhjbHVkZTxjb2xvcnMuQ29sb3IsIGNvbG9ycy5TTCB8IGNvbG9ycy5TVj4ge1xuXHRcdGNvbnN0IGNvbG9yID0gY29yZS5jbG9uZShjdXN0b21Db2xvciA/PyBnZW5SYW5kb21Db2xvcihjb2xvclNwYWNlKSk7XG5cblx0XHRpZiAoY29sb3IuZm9ybWF0ID09PSAnc2wnIHx8IGNvbG9yLmZvcm1hdCA9PT0gJ3N2Jykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgSW52YWxpZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3IuZm9ybWF0fSBpbiBnZXRCYXNlQ29sb3JgXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb2xvciBhcyBFeGNsdWRlPGNvbG9ycy5Db2xvciwgY29sb3JzLlNMIHwgY29sb3JzLlNWPjtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZVBhbGV0dGVJdGVtKFxuXHRcdGNvbG9yOiBFeGNsdWRlPGNvbG9ycy5Db2xvciwgY29sb3JzLlNMIHwgY29sb3JzLlNWPlxuXHQpOiBwYWxldHRlLlBhbGV0dGVJdGVtIHtcblx0XHRjb25zdCBjb2xvckNvbnZlcnNpb25zID0gZ2VuQWxsQ29sb3JWYWx1ZXMoY29sb3IpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGlkOiBgJHtjb2xvci5mb3JtYXR9XyR7TWF0aC5yYW5kb20oKX1gLFxuXHRcdFx0Y29sb3IsXG5cdFx0XHRjb2xvckNvbnZlcnNpb25zOiB7XG5cdFx0XHRcdGNteWs6IGNvbG9yQ29udmVyc2lvbnMuY215ayBhcyBjb2xvcnMuQ01ZSyxcblx0XHRcdFx0aGV4OiBjb2xvckNvbnZlcnNpb25zLmhleCBhcyBjb2xvcnMuSGV4LFxuXHRcdFx0XHRoc2w6IGNvbG9yQ29udmVyc2lvbnMuaHNsIGFzIGNvbG9ycy5IU0wsXG5cdFx0XHRcdGhzdjogY29sb3JDb252ZXJzaW9ucy5oc3YgYXMgY29sb3JzLkhTVixcblx0XHRcdFx0bGFiOiBjb2xvckNvbnZlcnNpb25zLmxhYiBhcyBjb2xvcnMuTEFCLFxuXHRcdFx0XHRyZ2I6IGNvbG9yQ29udmVyc2lvbnMucmdiIGFzIGNvbG9ycy5SR0IsXG5cdFx0XHRcdHNsOiBjb2xvckNvbnZlcnNpb25zLnNsIGFzIGNvbG9ycy5TTCxcblx0XHRcdFx0c3Y6IGNvbG9yQ29udmVyc2lvbnMuc3YgYXMgY29sb3JzLlNWLFxuXHRcdFx0XHR4eXo6IGNvbG9yQ29udmVyc2lvbnMueHl6IGFzIGNvbG9ycy5YWVpcblx0XHRcdH0sXG5cdFx0XHRjb2xvclN0cmluZ0NvbnZlcnNpb25zOiB7XG5cdFx0XHRcdGNteWtTdHJpbmc6IGNvbG9yQ29udmVyc2lvbnMuY215a1xuXHRcdFx0XHRcdD8gKHRyYW5zZm9ybS5jb2xvclRvQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdGNvbG9yQ29udmVyc2lvbnMuY215a1xuXHRcdFx0XHRcdFx0KSBhcyBjb2xvcnMuQ01ZS1N0cmluZylcblx0XHRcdFx0XHQ6IGRlZmF1bHRzLmRlZmF1bHRDTVlLU3RyaW5nLFxuXHRcdFx0XHRoc2xTdHJpbmc6IGNvbG9yQ29udmVyc2lvbnMuaHNsXG5cdFx0XHRcdFx0PyAodHJhbnNmb3JtLmNvbG9yVG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0Y29sb3JDb252ZXJzaW9ucy5oc2xcblx0XHRcdFx0XHRcdCkgYXMgY29sb3JzLkhTTFN0cmluZylcblx0XHRcdFx0XHQ6IGRlZmF1bHRzLmRlZmF1bHRIU0xTdHJpbmcsXG5cdFx0XHRcdGhzdlN0cmluZzogY29sb3JDb252ZXJzaW9ucy5oc3Zcblx0XHRcdFx0XHQ/ICh0cmFuc2Zvcm0uY29sb3JUb0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRjb2xvckNvbnZlcnNpb25zLmhzdlxuXHRcdFx0XHRcdFx0KSBhcyBjb2xvcnMuSFNWU3RyaW5nKVxuXHRcdFx0XHRcdDogZGVmYXVsdHMuZGVmYXVsdEhTVlN0cmluZyxcblx0XHRcdFx0c2xTdHJpbmc6IGNvbG9yQ29udmVyc2lvbnMuc2xcblx0XHRcdFx0XHQ/ICh0cmFuc2Zvcm0uY29sb3JUb0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRjb2xvckNvbnZlcnNpb25zLnNsXG5cdFx0XHRcdFx0XHQpIGFzIGNvbG9ycy5TTFN0cmluZylcblx0XHRcdFx0XHQ6IGRlZmF1bHRzLmRlZmF1bHRTTFN0cmluZyxcblx0XHRcdFx0c3ZTdHJpbmc6IGNvbG9yQ29udmVyc2lvbnMuc3Zcblx0XHRcdFx0XHQ/ICh0cmFuc2Zvcm0uY29sb3JUb0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRjb2xvckNvbnZlcnNpb25zLnN2XG5cdFx0XHRcdFx0XHQpIGFzIGNvbG9ycy5TVlN0cmluZylcblx0XHRcdFx0XHQ6IGRlZmF1bHRzLmRlZmF1bHRTVlN0cmluZ1xuXHRcdFx0fSxcblx0XHRcdGNzc1N0cmluZ3M6IHtcblx0XHRcdFx0Y215a0NTU1N0cmluZzogY29sb3JDb252ZXJzaW9ucy5jbXlrXG5cdFx0XHRcdFx0PyB0cmFuc2Zvcm0uZ2V0Q1NTQ29sb3JTdHJpbmcoY29sb3JDb252ZXJzaW9ucy5jbXlrKVxuXHRcdFx0XHRcdDogJycsXG5cdFx0XHRcdGhleENTU1N0cmluZzogY29sb3JDb252ZXJzaW9ucy5oZXg/LnZhbHVlLmhleCA/PyAnJyxcblx0XHRcdFx0aHNsQ1NTU3RyaW5nOiBjb2xvckNvbnZlcnNpb25zLmhzbFxuXHRcdFx0XHRcdD8gdHJhbnNmb3JtLmdldENTU0NvbG9yU3RyaW5nKGNvbG9yQ29udmVyc2lvbnMuaHNsKVxuXHRcdFx0XHRcdDogJycsXG5cdFx0XHRcdGhzdkNTU1N0cmluZzogY29sb3JDb252ZXJzaW9ucy5oc3Zcblx0XHRcdFx0XHQ/IHRyYW5zZm9ybS5nZXRDU1NDb2xvclN0cmluZyhjb2xvckNvbnZlcnNpb25zLmhzdilcblx0XHRcdFx0XHQ6ICcnLFxuXHRcdFx0XHRsYWJDU1NTdHJpbmc6IGNvbG9yQ29udmVyc2lvbnMubGFiXG5cdFx0XHRcdFx0PyB0cmFuc2Zvcm0uZ2V0Q1NTQ29sb3JTdHJpbmcoY29sb3JDb252ZXJzaW9ucy5sYWIpXG5cdFx0XHRcdFx0OiAnJyxcblx0XHRcdFx0eHl6Q1NTU3RyaW5nOiBjb2xvckNvbnZlcnNpb25zLnh5elxuXHRcdFx0XHRcdD8gdHJhbnNmb3JtLmdldENTU0NvbG9yU3RyaW5nKGNvbG9yQ29udmVyc2lvbnMueHl6KVxuXHRcdFx0XHRcdDogJydcblx0XHRcdH0sXG5cdFx0XHRyYXdDb2xvclN0cmluZ3M6IHtcblx0XHRcdFx0Y215a1Jhd1N0cmluZzogY29sb3JDb252ZXJzaW9ucy5jbXlrXG5cdFx0XHRcdFx0PyB0cmFuc2Zvcm0uZ2V0UmF3Q29sb3JTdHJpbmcoY29sb3JDb252ZXJzaW9ucy5jbXlrKVxuXHRcdFx0XHRcdDogJycsXG5cdFx0XHRcdGhleFJhd1N0cmluZzogY29sb3JDb252ZXJzaW9ucy5oZXhcblx0XHRcdFx0XHQ/IHRyYW5zZm9ybS5nZXRSYXdDb2xvclN0cmluZyhjb2xvckNvbnZlcnNpb25zLmhleClcblx0XHRcdFx0XHQ6ICcnLFxuXHRcdFx0XHRoc2xSYXdTdHJpbmc6IGNvbG9yQ29udmVyc2lvbnMuaHNsXG5cdFx0XHRcdFx0PyB0cmFuc2Zvcm0uZ2V0UmF3Q29sb3JTdHJpbmcoY29sb3JDb252ZXJzaW9ucy5oc2wpXG5cdFx0XHRcdFx0OiAnJyxcblx0XHRcdFx0aHN2UmF3U3RyaW5nOiBjb2xvckNvbnZlcnNpb25zLmhzdlxuXHRcdFx0XHRcdD8gdHJhbnNmb3JtLmdldFJhd0NvbG9yU3RyaW5nKGNvbG9yQ29udmVyc2lvbnMuaHN2KVxuXHRcdFx0XHRcdDogJycsXG5cdFx0XHRcdGxhYlJhd1N0cmluZzogY29sb3JDb252ZXJzaW9ucy5sYWJcblx0XHRcdFx0XHQ/IHRyYW5zZm9ybS5nZXRSYXdDb2xvclN0cmluZyhjb2xvckNvbnZlcnNpb25zLmxhYilcblx0XHRcdFx0XHQ6ICcnLFxuXHRcdFx0XHRzbFJhd1N0cmluZzogY29sb3JDb252ZXJzaW9ucy5zbFxuXHRcdFx0XHRcdD8gdHJhbnNmb3JtLmdldFJhd0NvbG9yU3RyaW5nKGNvbG9yQ29udmVyc2lvbnMuc2wpXG5cdFx0XHRcdFx0OiAnJyxcblx0XHRcdFx0c3ZSYXdTdHJpbmc6IGNvbG9yQ29udmVyc2lvbnMuc3Zcblx0XHRcdFx0XHQ/IHRyYW5zZm9ybS5nZXRSYXdDb2xvclN0cmluZyhjb2xvckNvbnZlcnNpb25zLnN2KVxuXHRcdFx0XHRcdDogJycsXG5cdFx0XHRcdHh5elJhd1N0cmluZzogY29sb3JDb252ZXJzaW9ucy54eXpcblx0XHRcdFx0XHQ/IHRyYW5zZm9ybS5nZXRSYXdDb2xvclN0cmluZyhjb2xvckNvbnZlcnNpb25zLnh5eilcblx0XHRcdFx0XHQ6ICcnXG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZVBhbGV0dGVPYmplY3QoXG5cdFx0dHlwZTogc3RyaW5nLFxuXHRcdGl0ZW1zOiBwYWxldHRlLlBhbGV0dGVJdGVtW10sXG5cdFx0YmFzZUNvbG9yOiBjb2xvcnMuQ29sb3IsXG5cdFx0bnVtQm94ZXM6IG51bWJlclxuXHQpOiBwYWxldHRlLlBhbGV0dGUge1xuXHRcdGNvbnN0IHZhbGlkQ29sb3JTcGFjZSA9IChmb3JtYXQ6IHN0cmluZyk6IGZvcm1hdCBpcyBjb2xvcnMuQ29sb3JTcGFjZSA9PlxuXHRcdFx0WydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAneHl6J10uaW5jbHVkZXMoZm9ybWF0KTtcblx0XHRjb25zdCBvcmlnaW5hbENvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlID0gdmFsaWRDb2xvclNwYWNlKFxuXHRcdFx0YmFzZUNvbG9yLmZvcm1hdFxuXHRcdClcblx0XHRcdD8gYmFzZUNvbG9yLmZvcm1hdFxuXHRcdFx0OiAnaGV4JztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRpZDogYCR7dHlwZX1fJHtEYXRlLm5vdygpfWAsXG5cdFx0XHRpdGVtcyxcblx0XHRcdGZsYWdzOiB7XG5cdFx0XHRcdGVuYWJsZUFscGhhOiBmYWxzZSxcblx0XHRcdFx0bGltaXREYXJrOiBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5OiBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHRtZXRhZGF0YToge1xuXHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0b3JpZ2luYWxDb2xvclNwYWNlLFxuXHRcdFx0XHRwYWxldHRlVHlwZTogdHlwZSxcblx0XHRcdFx0Y3VzdG9tQ29sb3I6IHtcblx0XHRcdFx0XHRvcmlnaW5hbENvbG9yOiBiYXNlQ29sb3IsXG5cdFx0XHRcdFx0Y29sb3JDb252ZXJzaW9uczogaXRlbXNbMF0/LmNvbG9yQ29udmVyc2lvbnMgfHwge31cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBnZW5lcmF0ZVBhbGV0dGVJdGVtcyhcblx0XHRiYXNlQ29sb3I6IEV4Y2x1ZGU8Y29sb3JzLkNvbG9yLCBjb2xvcnMuU0wgfCBjb2xvcnMuU1Y+LFxuXHRcdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlLFxuXHRcdGh1ZXM6IG51bWJlcltdXG5cdCk6IHBhbGV0dGUuUGFsZXR0ZUl0ZW1bXSB7XG5cdFx0Y29uc3QgcGFsZXR0ZUl0ZW1zOiBwYWxldHRlLlBhbGV0dGVJdGVtW10gPSBbXG5cdFx0XHRjcmVhdGVQYWxldHRlSXRlbShiYXNlQ29sb3IpXG5cdFx0XTtcblxuXHRcdGh1ZXMuZm9yRWFjaCgoaHVlLCBpKSA9PiB7XG5cdFx0XHRjb25zdCBzbCA9IGdlblJhbmRvbUNvbG9yKHNsQ29sb3JTcGFjZSkgYXMgY29sb3JzLlNMO1xuXHRcdFx0Y29uc3QgbmV3Q29sb3IgPSBnZW5BbGxDb2xvclZhbHVlcyh7XG5cdFx0XHRcdHZhbHVlOiB7IGh1ZSwgLi4uc2wudmFsdWUgfSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkuaHNsO1xuXG5cdFx0XHRpZiAobmV3Q29sb3IpIHtcblx0XHRcdFx0cGFsZXR0ZUl0ZW1zLnB1c2goY3JlYXRlUGFsZXR0ZUl0ZW0obmV3Q29sb3IpKTtcblx0XHRcdFx0dXBkYXRlQ29sb3JCb3gobmV3Q29sb3IsIGNvbG9yU3BhY2UsIGkgKyAxKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBwYWxldHRlSXRlbXM7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBzYXZlUGFsZXR0ZVRvREIoXG5cdFx0dHlwZTogc3RyaW5nLFxuXHRcdGl0ZW1zOiBwYWxldHRlLlBhbGV0dGVJdGVtW10sXG5cdFx0YmFzZUNvbG9yOiBjb2xvcnMuQ29sb3IsXG5cdFx0bnVtQm94ZXM6IG51bWJlclxuXHQpOiBQcm9taXNlPHBhbGV0dGUuUGFsZXR0ZT4ge1xuXHRcdGNvbnN0IG5ld1BhbGV0dGUgPSBjcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdFx0dHlwZSxcblx0XHRcdGl0ZW1zLFxuXHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0bnVtQm94ZXNcblx0XHQpO1xuXG5cdFx0YXdhaXQgaWRiRm4uc2F2ZVBhbGV0dGUobmV3UGFsZXR0ZS5pZCwge1xuXHRcdFx0dGFibGVJRDogcGFyc2VJbnQobmV3UGFsZXR0ZS5pZC5zcGxpdCgnXycpWzFdKSxcblx0XHRcdHBhbGV0dGU6IG5ld1BhbGV0dGVcblx0XHR9KTtcblxuXHRcdGNvbnNvbGUubG9nKGBTYXZlZCAke3R5cGV9IHBhbGV0dGU6ICR7SlNPTi5zdHJpbmdpZnkobmV3UGFsZXR0ZSl9YCk7XG5cdFx0cmV0dXJuIG5ld1BhbGV0dGU7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVDb2xvckJveChcblx0XHRjb2xvcjogY29sb3JzLkNvbG9yLFxuXHRcdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlLFxuXHRcdGluZGV4OiBudW1iZXJcblx0KTogdm9pZCB7XG5cdFx0aWYgKGNvbG9yLmZvcm1hdCA9PT0gJ3NsJyB8fCBjb2xvci5mb3JtYXQgPT09ICdzdicpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjb2xvci1ib3gtJHtpbmRleCArIDF9YCk7XG5cblx0XHRpZiAoY29sb3JCb3gpIHtcblx0XHRcdGNvbnN0IGNvbG9yVmFsdWVzID0gZ2VuQWxsQ29sb3JWYWx1ZXMoXG5cdFx0XHRcdGNvbG9yIGFzIEV4Y2x1ZGU8Y29sb3JzLkNvbG9yLCBjb2xvcnMuU0wgfCBjb2xvcnMuU1Y+XG5cdFx0XHQpO1xuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IGNvbG9yVmFsdWVzW2NvbG9yU3BhY2VdIGFzIGNvbG9ycy5Db2xvcjtcblxuXHRcdFx0aWYgKHNlbGVjdGVkQ29sb3IpIHtcblx0XHRcdFx0Y29uc3QgaGV4Q29sb3IgPSBjb2xvclZhbHVlcy5oZXggYXMgY29sb3JzLkhleDtcblxuXHRcdFx0XHRjb2xvckJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhDb2xvci52YWx1ZS5oZXg7XG5cblx0XHRcdFx0ZG9tRm4ucG9wdWxhdGVDb2xvclRleHRPdXRwdXRCb3goc2VsZWN0ZWRDb2xvciwgaW5kZXggKyAxKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBhbmFsb2dvdXMoXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRjdXN0b21Db2xvcjogY29sb3JzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdFx0Y29sb3JTcGFjZTogY29sb3JzLkNvbG9yU3BhY2UgPSAnaGV4J1xuXHQpOiBQcm9taXNlPHBhbGV0dGUuUGFsZXR0ZT4ge1xuXHRcdGNvbnN0IGJhc2VDb2xvciA9IGdldEJhc2VDb2xvcihjdXN0b21Db2xvciwgY29sb3JTcGFjZSk7XG5cdFx0Y29uc3QgYmFzZUNvbG9yVmFsdWVzID0gZ2VuQWxsQ29sb3JWYWx1ZXMoYmFzZUNvbG9yKTtcblx0XHRjb25zdCBodWVzID0gZ2VuSHVlcy5hbmFsb2dvdXMoXG5cdFx0XHRiYXNlQ29sb3JWYWx1ZXMuaHNsIGFzIGNvbG9ycy5IU0wsXG5cdFx0XHRudW1Cb3hlc1xuXHRcdCk7XG5cdFx0Y29uc3QgcGFsZXR0ZUl0ZW1zID0gZ2VuZXJhdGVQYWxldHRlSXRlbXMoYmFzZUNvbG9yLCBjb2xvclNwYWNlLCBodWVzKTtcblxuXHRcdHJldHVybiBhd2FpdCBzYXZlUGFsZXR0ZVRvREIoXG5cdFx0XHQnYW5hbG9nb3VzJyxcblx0XHRcdHBhbGV0dGVJdGVtcyxcblx0XHRcdGJhc2VDb2xvcixcblx0XHRcdG51bUJveGVzXG5cdFx0KTtcblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIGNvbXBsZW1lbnRhcnkoXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRjdXN0b21Db2xvcjogY29sb3JzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdFx0Y29sb3JTcGFjZTogY29sb3JzLkNvbG9yU3BhY2UgPSAnaGV4J1xuXHQpOiBQcm9taXNlPHBhbGV0dGUuUGFsZXR0ZT4ge1xuXHRcdGNvbnN0IGJhc2VDb2xvciA9IGdldEJhc2VDb2xvcihjdXN0b21Db2xvciwgY29sb3JTcGFjZSk7XG5cdFx0Y29uc3QgYmFzZUhTTCA9IGdlbkFsbENvbG9yVmFsdWVzKGJhc2VDb2xvcikuaHNsIGFzIGNvbG9ycy5IU0w7XG5cdFx0Y29uc3QgY29tcGxlbWVudGFyeUh1ZSA9IChiYXNlSFNMLnZhbHVlLmh1ZSArIDE4MCkgJSAzNjA7XG5cdFx0Y29uc3QgaHVlcyA9IEFycmF5KG51bUJveGVzIC0gMSkuZmlsbChjb21wbGVtZW50YXJ5SHVlKTtcblx0XHRjb25zdCBwYWxldHRlSXRlbXMgPSBnZW5lcmF0ZVBhbGV0dGVJdGVtcyhiYXNlQ29sb3IsIGNvbG9yU3BhY2UsIGh1ZXMpO1xuXG5cdFx0cmV0dXJuIGF3YWl0IHNhdmVQYWxldHRlVG9EQihcblx0XHRcdCdjb21wbGVtZW50YXJ5Jyxcblx0XHRcdHBhbGV0dGVJdGVtcyxcblx0XHRcdGJhc2VDb2xvcixcblx0XHRcdG51bUJveGVzXG5cdFx0KTtcblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIGRpYWRpYyhcblx0XHRudW1Cb3hlczogbnVtYmVyLFxuXHRcdGN1c3RvbUNvbG9yOiBjb2xvcnMuQ29sb3IgfCBudWxsID0gbnVsbCxcblx0XHRjb2xvclNwYWNlOiBjb2xvcnMuQ29sb3JTcGFjZSA9ICdoZXgnXG5cdCk6IFByb21pc2U8cGFsZXR0ZS5QYWxldHRlPiB7XG5cdFx0Y29uc3QgYmFzZUNvbG9yID0gZ2V0QmFzZUNvbG9yKGN1c3RvbUNvbG9yLCBjb2xvclNwYWNlKTtcblx0XHRjb25zdCBiYXNlSFNMID0gZ2VuQWxsQ29sb3JWYWx1ZXMoYmFzZUNvbG9yKS5oc2wgYXMgY29sb3JzLkhTTDtcblx0XHRjb25zdCBodWVzID0gZ2VuSHVlcy5kaWFkaWMoYmFzZUhTTC52YWx1ZS5odWUpO1xuXHRcdGNvbnN0IHBhbGV0dGVJdGVtcyA9IGdlbmVyYXRlUGFsZXR0ZUl0ZW1zKGJhc2VDb2xvciwgY29sb3JTcGFjZSwgaHVlcyk7XG5cblx0XHRyZXR1cm4gYXdhaXQgc2F2ZVBhbGV0dGVUb0RCKFxuXHRcdFx0J2RpYWRpYycsXG5cdFx0XHRwYWxldHRlSXRlbXMsXG5cdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRudW1Cb3hlc1xuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBoZXhhZGljKFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0Y3VzdG9tQ29sb3I6IGNvbG9ycy5Db2xvciB8IG51bGwgPSBudWxsLFxuXHRcdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlID0gJ2hleCdcblx0KTogUHJvbWlzZTxwYWxldHRlLlBhbGV0dGU+IHtcblx0XHRpZiAobnVtQm94ZXMgPCA2KSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0hleGFkaWMgcGFsZXR0ZSByZXF1aXJlcyBhdCBsZWFzdCA2IHN3YXRjaGVzLicpO1xuXG5cdFx0XHRyZXR1cm4gY3JlYXRlUGFsZXR0ZU9iamVjdCgnaGV4YWRpYycsIFtdLCBkZWZhdWx0cy5kZWZhdWx0SGV4LCAwKTtcblx0XHR9XG5cblx0XHRjb25zdCBiYXNlQ29sb3IgPSBnZXRCYXNlQ29sb3IoY3VzdG9tQ29sb3IsIGNvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGJhc2VIU0wgPSBnZW5BbGxDb2xvclZhbHVlcyhiYXNlQ29sb3IpLmhzbCBhcyBjb2xvcnMuSFNMO1xuXHRcdGNvbnN0IGh1ZXMgPSBnZW5IdWVzLmhleGFkaWMoYmFzZUhTTCk7XG5cdFx0Y29uc3QgcGFsZXR0ZUl0ZW1zID0gZ2VuZXJhdGVQYWxldHRlSXRlbXMoYmFzZUNvbG9yLCBjb2xvclNwYWNlLCBodWVzKTtcblxuXHRcdHJldHVybiBhd2FpdCBzYXZlUGFsZXR0ZVRvREIoXG5cdFx0XHQnaGV4YWRpYycsXG5cdFx0XHRwYWxldHRlSXRlbXMsXG5cdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRudW1Cb3hlc1xuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBtb25vY2hyb21hdGljKFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0Y3VzdG9tQ29sb3I6IGNvbG9ycy5Db2xvciB8IG51bGwgPSBudWxsLFxuXHRcdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlID0gJ2hleCdcblx0KTogUHJvbWlzZTxwYWxldHRlLlBhbGV0dGU+IHtcblx0XHRpZiAobnVtQm94ZXMgPCAyKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ01vbm9jaHJvbWF0aWMgcGFsZXR0ZSByZXF1aXJlcyBhdCBsZWFzdCAyIHN3YXRjaGVzLicpO1xuXG5cdFx0XHRyZXR1cm4gY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHRcdFx0J21vbm9jaHJvbWF0aWMnLFxuXHRcdFx0XHRbXSxcblx0XHRcdFx0ZGVmYXVsdHMuZGVmYXVsdEhleCxcblx0XHRcdFx0MFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCBiYXNlQ29sb3IgPSBnZXRCYXNlQ29sb3IoY3VzdG9tQ29sb3IsIGNvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGJhc2VIU0wgPSBnZW5BbGxDb2xvclZhbHVlcyhiYXNlQ29sb3IpLmhzbCBhcyBjb2xvcnMuSFNMO1xuXHRcdGNvbnN0IGh1ZXMgPSBBcnJheShudW1Cb3hlcyAtIDEpLmZpbGwoYmFzZUhTTC52YWx1ZS5odWUpO1xuXHRcdGNvbnN0IHBhbGV0dGVJdGVtcyA9IGdlbmVyYXRlUGFsZXR0ZUl0ZW1zKGJhc2VDb2xvciwgY29sb3JTcGFjZSwgaHVlcyk7XG5cblx0XHRyZXR1cm4gYXdhaXQgc2F2ZVBhbGV0dGVUb0RCKFxuXHRcdFx0J21vbm9jaHJvbWF0aWMnLFxuXHRcdFx0cGFsZXR0ZUl0ZW1zLFxuXHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0bnVtQm94ZXNcblx0XHQpO1xuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gcmFuZG9tKFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0Y3VzdG9tQ29sb3I6IGNvbG9ycy5Db2xvciB8IG51bGwgPSBudWxsLFxuXHRcdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlID0gJ2hleCdcblx0KTogUHJvbWlzZTxwYWxldHRlLlBhbGV0dGU+IHtcblx0XHRjb25zdCBiYXNlQ29sb3IgPSBnZXRCYXNlQ29sb3IoY3VzdG9tQ29sb3IsIGNvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IHBhbGV0dGVJdGVtczogcGFsZXR0ZS5QYWxldHRlSXRlbVtdID0gW1xuXHRcdFx0Y3JlYXRlUGFsZXR0ZUl0ZW0oYmFzZUNvbG9yKVxuXHRcdF07XG5cblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IG51bUJveGVzOyBpKyspIHtcblx0XHRcdGNvbnN0IHJhbmRvbUNvbG9yID0gZ2VuUmFuZG9tQ29sb3IoY29sb3JTcGFjZSkgYXMgRXhjbHVkZTxcblx0XHRcdFx0Y29sb3JzLkNvbG9yLFxuXHRcdFx0XHRjb2xvcnMuU0wgfCBjb2xvcnMuU1Zcblx0XHRcdD47XG5cblx0XHRcdHBhbGV0dGVJdGVtcy5wdXNoKGNyZWF0ZVBhbGV0dGVJdGVtKHJhbmRvbUNvbG9yKSk7XG5cblx0XHRcdHVwZGF0ZUNvbG9yQm94KHJhbmRvbUNvbG9yLCBjb2xvclNwYWNlLCBpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXdhaXQgc2F2ZVBhbGV0dGVUb0RCKFxuXHRcdFx0J3JhbmRvbScsXG5cdFx0XHRwYWxldHRlSXRlbXMsXG5cdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRudW1Cb3hlc1xuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBzcGxpdENvbXBsZW1lbnRhcnkoXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRjdXN0b21Db2xvcjogY29sb3JzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdFx0Y29sb3JTcGFjZTogY29sb3JzLkNvbG9yU3BhY2UgPSAnaGV4J1xuXHQpOiBQcm9taXNlPHBhbGV0dGUuUGFsZXR0ZT4ge1xuXHRcdGlmIChudW1Cb3hlcyA8IDMpIHtcblx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0J1NwbGl0IGNvbXBsZW1lbnRhcnkgcGFsZXR0ZSByZXF1aXJlcyBhdCBsZWFzdCAzIHN3YXRjaGVzLidcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBjcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdFx0XHQnc3BsaXRDb21wbGVtZW50YXJ5Jyxcblx0XHRcdFx0W10sXG5cdFx0XHRcdGRlZmF1bHRzLmRlZmF1bHRIZXgsXG5cdFx0XHRcdDBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYmFzZUNvbG9yID0gZ2V0QmFzZUNvbG9yKGN1c3RvbUNvbG9yLCBjb2xvclNwYWNlKTtcblx0XHRjb25zdCBiYXNlSFNMID0gZ2VuQWxsQ29sb3JWYWx1ZXMoYmFzZUNvbG9yKS5oc2wgYXMgY29sb3JzLkhTTDtcblx0XHRjb25zdCBodWVzID0gZ2VuSHVlcy5zcGxpdENvbXBsZW1lbnRhcnkoYmFzZUhTTC52YWx1ZS5odWUpO1xuXHRcdGNvbnN0IHBhbGV0dGVJdGVtcyA9IGdlbmVyYXRlUGFsZXR0ZUl0ZW1zKGJhc2VDb2xvciwgY29sb3JTcGFjZSwgaHVlcyk7XG5cblx0XHRyZXR1cm4gYXdhaXQgc2F2ZVBhbGV0dGVUb0RCKFxuXHRcdFx0J3NwbGl0Q29tcGxlbWVudGFyeScsXG5cdFx0XHRwYWxldHRlSXRlbXMsXG5cdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRudW1Cb3hlc1xuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiB0ZXRyYWRpYyhcblx0XHRudW1Cb3hlczogbnVtYmVyLFxuXHRcdGN1c3RvbUNvbG9yOiBjb2xvcnMuQ29sb3IgfCBudWxsID0gbnVsbCxcblx0XHRjb2xvclNwYWNlOiBjb2xvcnMuQ29sb3JTcGFjZSA9ICdoZXgnXG5cdCk6IFByb21pc2U8cGFsZXR0ZS5QYWxldHRlPiB7XG5cdFx0aWYgKG51bUJveGVzIDwgNCkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdUZXRyYWRpYyBwYWxldHRlIHJlcXVpcmVzIGF0IGxlYXN0IDQgc3dhdGNoZXMuJyk7XG5cblx0XHRcdHJldHVybiBjcmVhdGVQYWxldHRlT2JqZWN0KCd0ZXRyYWRpYycsIFtdLCBkZWZhdWx0cy5kZWZhdWx0SGV4LCAwKTtcblx0XHR9XG5cblx0XHRjb25zdCBiYXNlQ29sb3IgPSBnZXRCYXNlQ29sb3IoY3VzdG9tQ29sb3IsIGNvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGJhc2VIU0wgPSBnZW5BbGxDb2xvclZhbHVlcyhiYXNlQ29sb3IpLmhzbCBhcyBjb2xvcnMuSFNMO1xuXHRcdGNvbnN0IHRldHJhZGljSHVlcyA9IGdlbkh1ZXMudGV0cmFkaWMoYmFzZUhTTC52YWx1ZS5odWUpO1xuXHRcdGNvbnN0IHBhbGV0dGVJdGVtcyA9IGdlbmVyYXRlUGFsZXR0ZUl0ZW1zKFxuXHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0Y29sb3JTcGFjZSxcblx0XHRcdHRldHJhZGljSHVlc1xuXHRcdCk7XG5cdFx0cmV0dXJuIGF3YWl0IHNhdmVQYWxldHRlVG9EQihcblx0XHRcdCd0ZXRyYWRpYycsXG5cdFx0XHRwYWxldHRlSXRlbXMsXG5cdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRudW1Cb3hlc1xuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiB0cmlhZGljKFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0Y3VzdG9tQ29sb3I6IGNvbG9ycy5Db2xvciB8IG51bGwgPSBudWxsLFxuXHRcdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlID0gJ2hleCdcblx0KTogUHJvbWlzZTxwYWxldHRlLlBhbGV0dGU+IHtcblx0XHRpZiAobnVtQm94ZXMgPCAzKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ1RyaWFkaWMgcGFsZXR0ZSByZXF1aXJlcyBhdCBsZWFzdCAzIHN3YXRjaGVzLicpO1xuXG5cdFx0XHRyZXR1cm4gY3JlYXRlUGFsZXR0ZU9iamVjdCgndHJpYWRpYycsIFtdLCBkZWZhdWx0cy5kZWZhdWx0SGV4LCAwKTtcblx0XHR9XG5cblx0XHRjb25zdCBiYXNlQ29sb3IgPSBnZXRCYXNlQ29sb3IoY3VzdG9tQ29sb3IsIGNvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGJhc2VIU0wgPSBnZW5BbGxDb2xvclZhbHVlcyhiYXNlQ29sb3IpLmhzbCBhcyBjb2xvcnMuSFNMO1xuXHRcdGNvbnN0IGh1ZXMgPSBnZW5IdWVzLnRyaWFkaWMoYmFzZUhTTC52YWx1ZS5odWUpO1xuXHRcdGNvbnN0IHBhbGV0dGVJdGVtcyA9IGdlbmVyYXRlUGFsZXR0ZUl0ZW1zKGJhc2VDb2xvciwgY29sb3JTcGFjZSwgaHVlcyk7XG5cblx0XHRyZXR1cm4gYXdhaXQgc2F2ZVBhbGV0dGVUb0RCKFxuXHRcdFx0J3RyaWFkaWMnLFxuXHRcdFx0cGFsZXR0ZUl0ZW1zLFxuXHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0bnVtQm94ZXNcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRnZXRCYXNlQ29sb3IsXG5cdFx0Y3JlYXRlUGFsZXR0ZU9iamVjdCxcblx0XHRjcmVhdGVQYWxldHRlSXRlbSxcblx0XHRnZW5lcmF0ZVBhbGV0dGVJdGVtcyxcblx0XHRzYXZlUGFsZXR0ZVRvREIsXG5cdFx0dXBkYXRlQ29sb3JCb3gsXG5cdFx0YW5hbG9nb3VzLFxuXHRcdGNvbXBsZW1lbnRhcnksXG5cdFx0ZGlhZGljLFxuXHRcdGhleGFkaWMsXG5cdFx0bW9ub2Nocm9tYXRpYyxcblx0XHRyYW5kb20sXG5cdFx0c3BsaXRDb21wbGVtZW50YXJ5LFxuXHRcdHRldHJhZGljLFxuXHRcdHRyaWFkaWNcblx0fTtcbn1cbiJdfQ==