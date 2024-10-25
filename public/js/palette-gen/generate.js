import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { domHelpers } from '../helpers/dom.js';
import { paletteHelpers } from '../helpers/palette.js';
import { palette } from './palette-index.js';
import { random } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
import { guards } from '../utils/type-guards.js';
function genPaletteBox(colors, numBoxes) {
    try {
        const clonedColors = core.clone(colors);
        const areAllColorsValid = Object.entries(clonedColors).every(([key, clonedColor]) => {
            if (!paletteHelpers.validateColorValues(clonedColor)) {
                console.error(`Invalid color (${key}): ${JSON.stringify(clonedColor)}`);
                return false;
            }
            return true;
        });
        if (!areAllColorsValid) {
            console.error('One or more colors are invalid.');
            return;
        }
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            console.error('paletteRow is undefined');
            return;
        }
        paletteRow.innerHTML = '';
        let paletteBoxCount = 1;
        for (let i = 0; i < numBoxes; i++) {
            const clonedColor = clonedColors[i];
            if (!clonedColor) {
                console.warn(`Color at index ${i} is undefined.`);
                continue;
            }
            else if (!paletteHelpers.validateColorValues(clonedColor)) {
                console.error(`Invalid color at index ${i}: ${JSON.stringify(clonedColor)}`);
                continue;
            }
            console.log(`Color at index ${i} being processed is: ${JSON.stringify(clonedColor.value)} in ${clonedColor.format}`);
            const clonedColorValues = genAllColorValues(clonedColor);
            console.log(`Generated color values: ${JSON.stringify(clonedColorValues)}`);
            const clonedOriginalColorFormat = clonedColor.format;
            if (!guards.isFormat(clonedOriginalColorFormat)) {
                console.warn(`Skipping unsupported color format: ${clonedOriginalColorFormat}`);
                continue;
            }
            const clonedOriginalColorValue = clonedColorValues[clonedOriginalColorFormat];
            if (!clonedOriginalColorValue) {
                throw new Error(`Failed to generate color data for format ${clonedOriginalColorFormat}`);
            }
            const { colorStripe, paletteBoxCount: newPaletteBoxCount } = domHelpers.makePaletteBox(clonedColor, paletteBoxCount);
            paletteRow.appendChild(colorStripe);
            dom.populateColorTextOutputBox(clonedColor, paletteBoxCount);
            paletteBoxCount = newPaletteBoxCount;
        }
    }
    catch (error) {
        console.error(`Error generating palette box: ${error}`);
    }
}
function genSelectedPaletteType(paletteType, numBoxes, baseColor, customColor = null, initialColorSpace = 'hex') {
    try {
        let clonedCustomColor = null;
        if (!paletteHelpers.validateColorValues(baseColor)) {
            console.error(`Invalid base color: ${JSON.stringify(baseColor)}`);
            return [];
        }
        if (customColor) {
            if (!paletteHelpers.validateColorValues(customColor)) {
                console.error(`Invalid custom color value ${JSON.stringify(customColor)}`);
                return [];
            }
            clonedCustomColor = core.clone(customColor);
        }
        const clonedBaseColor = core.clone(baseColor);
        clonedCustomColor = core.clone(customColor);
        switch (paletteType) {
            case 1:
                console.log('Generating random palette');
                return palette.genRandomPalette(numBoxes, clonedCustomColor, initialColorSpace);
            case 2:
                console.log('Generating complementary palette');
                return palette.genComplementaryPalette(numBoxes, clonedBaseColor, initialColorSpace);
            case 3:
                console.log('Generating triadic palette');
                return palette.genTriadicPalette(numBoxes, clonedBaseColor, initialColorSpace);
            case 4:
                console.log('Generating tetradic palette');
                return palette.genTetradicPalette(numBoxes, clonedBaseColor, initialColorSpace);
            case 5:
                console.log('Generating split complementary palette');
                return palette.genSplitComplementaryPalette(numBoxes, clonedBaseColor, initialColorSpace);
            case 6:
                console.log('Generating analogous palette');
                return palette.genAnalogousPalette(numBoxes, clonedBaseColor, initialColorSpace);
            case 7:
                console.log('Generating hexadic palette');
                return palette.genHexadicPalette(numBoxes, clonedBaseColor, initialColorSpace);
            case 8:
                console.log('Generating diadic palette');
                return palette.genDiadicPalette(numBoxes, clonedBaseColor, initialColorSpace);
            case 9:
                console.log('Generating monochromatic palette');
                return palette.genMonochromaticPalette(numBoxes, clonedBaseColor, initialColorSpace);
            default:
                console.error('Unable to determine color scheme');
                return [];
        }
    }
    catch (error) {
        console.error(`Error generating palette: ${error}`);
        return [];
    }
}
function startPaletteGen(paletteType, numBoxes, colorSpace = 'hex', customColor) {
    try {
        const baseColor = customColor ?? random.randomColor(colorSpace);
        const clonedCustomColor = core.clone(customColor);
        const clonedBaseColor = core.clone(baseColor);
        const colors = genSelectedPaletteType(paletteType, numBoxes, clonedBaseColor, clonedCustomColor, colorSpace);
        const clonedColors = core.clone(colors);
        if (colors.length === 0) {
            console.error('Colors array is empty or undefined.');
            return;
        }
        else {
            console.log(`Colors array: ${JSON.stringify(colors)}`);
        }
        console.log(`Calling genPaletteBox with clonedColors ${JSON.stringify(clonedColors)} and numBoxes ${numBoxes}`);
        genPaletteBox(clonedColors, numBoxes);
    }
    catch (error) {
        console.error(`Error starting palette generation: ${error}`);
    }
}
export const generate = {
    genPaletteBox,
    genSelectedPaletteType,
    startPaletteGen
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFsZXR0ZS1nZW4vZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbkUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QyxTQUFTLGFBQWEsQ0FBQyxNQUFxQixFQUFFLFFBQWdCO0lBQzdELElBQUksQ0FBQztRQUNKLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FDM0QsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztnQkFDdEQsT0FBTyxDQUFDLEtBQUssQ0FDWixrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FDeEQsQ0FBQztnQkFFRixPQUFPLEtBQUssQ0FBQztZQUNkLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUMsQ0FDRCxD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RUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQXVCO0lBQzNDLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsZUFBZTtDQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5BbGxDb2xvclZhbHVlcyB9IGZyb20gJy4uL2NvbG9yLWNvbnZlcnNpb24vY29udmVyc2lvbic7XG5pbXBvcnQgeyBkb20gfSBmcm9tICcuLi9kb20vZG9tLW1haW4nO1xuaW1wb3J0IHsgZG9tSGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvZG9tJztcbmltcG9ydCB7IHBhbGV0dGVIZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9wYWxldHRlJztcbmltcG9ydCAqIGFzIGZuT2JqZWN0cyBmcm9tICcuLi9pbmRleC9mbi1vYmplY3RzJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IHBhbGV0dGUgfSBmcm9tICcuL3BhbGV0dGUtaW5kZXgnO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSAnLi4vdXRpbHMvY29sb3ItcmFuZG9taXplcic7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vdXRpbHMvY29yZSc7XG5pbXBvcnQgeyBndWFyZHMgfSBmcm9tICcuLi91dGlscy90eXBlLWd1YXJkcyc7XG5cbmZ1bmN0aW9uIGdlblBhbGV0dGVCb3goY29sb3JzOiB0eXBlcy5Db2xvcltdLCBudW1Cb3hlczogbnVtYmVyKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY2xvbmVkQ29sb3JzID0gY29yZS5jbG9uZShjb2xvcnMpO1xuXHRcdGNvbnN0IGFyZUFsbENvbG9yc1ZhbGlkID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3JzKS5ldmVyeShcblx0XHRcdChba2V5LCBjbG9uZWRDb2xvcl0pID0+IHtcblx0XHRcdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNsb25lZENvbG9yKSkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHRgSW52YWxpZCBjb2xvciAoJHtrZXl9KTogJHtKU09OLnN0cmluZ2lmeShjbG9uZWRDb2xvcil9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0aWYgKCFhcmVBbGxDb2xvcnNWYWxpZCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignT25lIG9yIG1vcmUgY29sb3JzIGFyZSBpbnZhbGlkLicpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGFsZXR0ZVJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWxldHRlLXJvdycpO1xuXG5cdFx0aWYgKCFwYWxldHRlUm93KSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdwYWxldHRlUm93IGlzIHVuZGVmaW5lZCcpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJztcblx0XHRsZXQgcGFsZXR0ZUJveENvdW50ID0gMTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQm94ZXM7IGkrKykge1xuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZWRDb2xvcnNbaV07XG5cblx0XHRcdGlmICghY2xvbmVkQ29sb3IpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBDb2xvciBhdCBpbmRleCAke2l9IGlzIHVuZGVmaW5lZC5gKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH0gZWxzZSBpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgY29sb3IgYXQgaW5kZXggJHtpfTogJHtKU09OLnN0cmluZ2lmeShjbG9uZWRDb2xvcil9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0YENvbG9yIGF0IGluZGV4ICR7aX0gYmVpbmcgcHJvY2Vzc2VkIGlzOiAke0pTT04uc3RyaW5naWZ5KGNsb25lZENvbG9yLnZhbHVlKX0gaW4gJHtjbG9uZWRDb2xvci5mb3JtYXR9YFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGNsb25lZENvbG9yVmFsdWVzID0gZ2VuQWxsQ29sb3JWYWx1ZXMoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGBHZW5lcmF0ZWQgY29sb3IgdmFsdWVzOiAke0pTT04uc3RyaW5naWZ5KGNsb25lZENvbG9yVmFsdWVzKX1gXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgY2xvbmVkT3JpZ2luYWxDb2xvckZvcm1hdCA9XG5cdFx0XHRcdGNsb25lZENvbG9yLmZvcm1hdCBhcyB0eXBlcy5Db2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIWd1YXJkcy5pc0Zvcm1hdChjbG9uZWRPcmlnaW5hbENvbG9yRm9ybWF0KSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0YFNraXBwaW5nIHVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjbG9uZWRPcmlnaW5hbENvbG9yRm9ybWF0fWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkT3JpZ2luYWxDb2xvclZhbHVlID1cblx0XHRcdFx0Y2xvbmVkQ29sb3JWYWx1ZXNbY2xvbmVkT3JpZ2luYWxDb2xvckZvcm1hdF07XG5cblx0XHRcdGlmICghY2xvbmVkT3JpZ2luYWxDb2xvclZhbHVlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGdlbmVyYXRlIGNvbG9yIGRhdGEgZm9yIGZvcm1hdCAke2Nsb25lZE9yaWdpbmFsQ29sb3JGb3JtYXR9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB7IGNvbG9yU3RyaXBlLCBwYWxldHRlQm94Q291bnQ6IG5ld1BhbGV0dGVCb3hDb3VudCB9ID1cblx0XHRcdFx0ZG9tSGVscGVycy5tYWtlUGFsZXR0ZUJveChjbG9uZWRDb2xvciwgcGFsZXR0ZUJveENvdW50KTtcblxuXHRcdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZChjb2xvclN0cmlwZSk7XG5cblx0XHRcdGRvbS5wb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveChjbG9uZWRDb2xvciwgcGFsZXR0ZUJveENvdW50KTtcblxuXHRcdFx0cGFsZXR0ZUJveENvdW50ID0gbmV3UGFsZXR0ZUJveENvdW50O1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBnZW5lcmF0aW5nIHBhbGV0dGUgYm94OiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdlblNlbGVjdGVkUGFsZXR0ZVR5cGUoXG5cdHBhbGV0dGVUeXBlOiBudW1iZXIsXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdGJhc2VDb2xvcjogdHlwZXMuQ29sb3IsXG5cdGN1c3RvbUNvbG9yOiB0eXBlcy5Db2xvciB8IG51bGwgPSBudWxsLFxuXHRpbml0aWFsQ29sb3JTcGFjZTogdHlwZXMuQ29sb3JTcGFjZSA9ICdoZXgnXG4pOiB0eXBlcy5Db2xvcltdIHtcblx0dHJ5IHtcblx0XHRsZXQgY2xvbmVkQ3VzdG9tQ29sb3I6IHR5cGVzLkNvbG9yIHwgbnVsbCA9IG51bGw7XG5cblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoYmFzZUNvbG9yKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBiYXNlIGNvbG9yOiAke0pTT04uc3RyaW5naWZ5KGJhc2VDb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRpZiAoY3VzdG9tQ29sb3IpIHtcblx0XHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhjdXN0b21Db2xvcikpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBjdXN0b20gY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjdXN0b21Db2xvcil9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdFx0Y2xvbmVkQ3VzdG9tQ29sb3IgPSBjb3JlLmNsb25lKGN1c3RvbUNvbG9yKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRCYXNlQ29sb3IgPSBjb3JlLmNsb25lKGJhc2VDb2xvcik7XG5cdFx0Y2xvbmVkQ3VzdG9tQ29sb3IgPSBjb3JlLmNsb25lKGN1c3RvbUNvbG9yKTtcblxuXHRcdHN3aXRjaCAocGFsZXR0ZVR5cGUpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Y29uc29sZS5sb2coJ0dlbmVyYXRpbmcgcmFuZG9tIHBhbGV0dGUnKTtcblxuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5SYW5kb21QYWxldHRlKFxuXHRcdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRcdGNsb25lZEN1c3RvbUNvbG9yLFxuXHRcdFx0XHRcdGluaXRpYWxDb2xvclNwYWNlXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdHZW5lcmF0aW5nIGNvbXBsZW1lbnRhcnkgcGFsZXR0ZScpO1xuXG5cdFx0XHRcdHJldHVybiBwYWxldHRlLmdlbkNvbXBsZW1lbnRhcnlQYWxldHRlKFxuXHRcdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRcdGNsb25lZEJhc2VDb2xvcixcblx0XHRcdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdFx0XHQpO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRjb25zb2xlLmxvZygnR2VuZXJhdGluZyB0cmlhZGljIHBhbGV0dGUnKTtcblxuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5UcmlhZGljUGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRjbG9uZWRCYXNlQ29sb3IsXG5cdFx0XHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHRcdFx0KTtcblx0XHRcdGNhc2UgNDpcblx0XHRcdFx0Y29uc29sZS5sb2coJ0dlbmVyYXRpbmcgdGV0cmFkaWMgcGFsZXR0ZScpO1xuXG5cdFx0XHRcdHJldHVybiBwYWxldHRlLmdlblRldHJhZGljUGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRjbG9uZWRCYXNlQ29sb3IsXG5cdFx0XHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHRcdFx0KTtcblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0Y29uc29sZS5sb2coJ0dlbmVyYXRpbmcgc3BsaXQgY29tcGxlbWVudGFyeSBwYWxldHRlJyk7XG5cblx0XHRcdFx0cmV0dXJuIHBhbGV0dGUuZ2VuU3BsaXRDb21wbGVtZW50YXJ5UGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRjbG9uZWRCYXNlQ29sb3IsXG5cdFx0XHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHRcdFx0KTtcblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0Y29uc29sZS5sb2coJ0dlbmVyYXRpbmcgYW5hbG9nb3VzIHBhbGV0dGUnKTtcblxuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5BbmFsb2dvdXNQYWxldHRlKFxuXHRcdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRcdGNsb25lZEJhc2VDb2xvcixcblx0XHRcdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdFx0XHQpO1xuXHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHRjb25zb2xlLmxvZygnR2VuZXJhdGluZyBoZXhhZGljIHBhbGV0dGUnKTtcblxuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5IZXhhZGljUGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRjbG9uZWRCYXNlQ29sb3IsXG5cdFx0XHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHRcdFx0KTtcblx0XHRcdGNhc2UgODpcblx0XHRcdFx0Y29uc29sZS5sb2coJ0dlbmVyYXRpbmcgZGlhZGljIHBhbGV0dGUnKTtcblxuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5EaWFkaWNQYWxldHRlKFxuXHRcdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRcdGNsb25lZEJhc2VDb2xvcixcblx0XHRcdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdFx0XHQpO1xuXHRcdFx0Y2FzZSA5OlxuXHRcdFx0XHRjb25zb2xlLmxvZygnR2VuZXJhdGluZyBtb25vY2hyb21hdGljIHBhbGV0dGUnKTtcblxuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5Nb25vY2hyb21hdGljUGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRjbG9uZWRCYXNlQ29sb3IsXG5cdFx0XHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHRcdFx0KTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1VuYWJsZSB0byBkZXRlcm1pbmUgY29sb3Igc2NoZW1lJyk7XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBnZW5lcmF0aW5nIHBhbGV0dGU6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RhcnRQYWxldHRlR2VuKFxuXHRwYWxldHRlVHlwZTogbnVtYmVyLFxuXHRudW1Cb3hlczogbnVtYmVyLFxuXHRjb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gJ2hleCcsXG5cdGN1c3RvbUNvbG9yOiB0eXBlcy5Db2xvciB8IG51bGxcbik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGJhc2VDb2xvcjogdHlwZXMuQ29sb3IgPVxuXHRcdFx0Y3VzdG9tQ29sb3IgPz8gcmFuZG9tLnJhbmRvbUNvbG9yKGNvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGNsb25lZEN1c3RvbUNvbG9yID0gY29yZS5jbG9uZShjdXN0b21Db2xvcik7XG5cdFx0Y29uc3QgY2xvbmVkQmFzZUNvbG9yID0gY29yZS5jbG9uZShiYXNlQ29sb3IpO1xuXHRcdGNvbnN0IGNvbG9yczogdHlwZXMuQ29sb3JbXSA9IGdlblNlbGVjdGVkUGFsZXR0ZVR5cGUoXG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y2xvbmVkQmFzZUNvbG9yLFxuXHRcdFx0Y2xvbmVkQ3VzdG9tQ29sb3IsXG5cdFx0XHRjb2xvclNwYWNlXG5cdFx0KTtcblx0XHRjb25zdCBjbG9uZWRDb2xvcnMgPSBjb3JlLmNsb25lKGNvbG9ycyk7XG5cblx0XHRpZiAoY29sb3JzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignQ29sb3JzIGFycmF5IGlzIGVtcHR5IG9yIHVuZGVmaW5lZC4nKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhgQ29sb3JzIGFycmF5OiAke0pTT04uc3RyaW5naWZ5KGNvbG9ycyl9YCk7XG5cdFx0fVxuXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgQ2FsbGluZyBnZW5QYWxldHRlQm94IHdpdGggY2xvbmVkQ29sb3JzICR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkQ29sb3JzKX0gYW5kIG51bUJveGVzICR7bnVtQm94ZXN9YFxuXHRcdCk7XG5cblx0XHRnZW5QYWxldHRlQm94KGNsb25lZENvbG9ycywgbnVtQm94ZXMpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIHN0YXJ0aW5nIHBhbGV0dGUgZ2VuZXJhdGlvbjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGU6IGZuT2JqZWN0cy5HZW5lcmF0ZSA9IHtcblx0Z2VuUGFsZXR0ZUJveCxcblx0Z2VuU2VsZWN0ZWRQYWxldHRlVHlwZSxcblx0c3RhcnRQYWxldHRlR2VuXG59O1xuIl19