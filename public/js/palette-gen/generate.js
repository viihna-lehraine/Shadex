import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { domHelpers } from '../helpers/dom.js';
import { palette } from './palette-index.js';
import { random } from '../utils/color-randomizer.js';
import { guards } from '../utils/type-guards.js';
function genPaletteBox(numBoxes, colors) {
    try {
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            console.error('paletteRow is undefined');
            return;
        }
        paletteRow.innerHTML = ''; // clear the row
        let paletteBoxCount = 1;
        for (let i = 0; i < numBoxes; i++) {
            const color = colors[i];
            if (!color) {
                console.warn(`Color at index ${i} is undefined.`);
                continue;
            }
            console.log(`Color at index ${i} being processed is: ${JSON.stringify(color.value)} in ${color.format}`);
            const colorValues = genAllColorValues(color);
            console.log(`Generated color values: ${JSON.stringify(colorValues)}`);
            const originalColorFormat = color.format;
            if (!guards.isFormat(originalColorFormat)) {
                console.warn(`Skipping unsupported color format: ${originalColorFormat}`);
                continue;
            }
            const originalColorValue = colorValues[originalColorFormat];
            if (!originalColorValue) {
                throw new Error(`Failed to generate color data for format ${originalColorFormat}`);
            }
            const { colorStripe, paletteBoxCount: newPaletteBoxCount } = domHelpers.makePaletteBox(color, paletteBoxCount);
            paletteRow.appendChild(colorStripe);
            dom.populateColorTextOutputBox(color, paletteBoxCount);
            paletteBoxCount = newPaletteBoxCount;
        }
    }
    catch (error) {
        console.error(`Error generating palette box: ${error}`);
    }
}
function genSelectedPaletteType(paletteType, numBoxes, baseColor, customColor = null, initialColorSpace = 'hex') {
    try {
        switch (paletteType) {
            case 1:
                console.log('Generating random palette');
                return palette.genRandomPalette(numBoxes, customColor, initialColorSpace);
            case 2:
                console.log('Generating complementary palette');
                return palette.genComplementaryPalette(numBoxes, baseColor, initialColorSpace);
            case 3:
                console.log('Generating triadic palette');
                return palette.genTriadicPalette(numBoxes, baseColor, initialColorSpace);
            case 4:
                console.log('Generating tetradic palette');
                return palette.genTetradicPalette(numBoxes, baseColor, initialColorSpace);
            case 5:
                console.log('Generating split complementary palette');
                return palette.genSplitComplementaryPalette(numBoxes, baseColor, initialColorSpace);
            case 6:
                console.log('Generating analogous palette');
                return palette.genAnalogousPalette(numBoxes, baseColor, initialColorSpace);
            case 7:
                console.log('Generating hexadic palette');
                return palette.genHexadicPalette(numBoxes, baseColor, initialColorSpace);
            case 8:
                console.log('Generating diadic palette');
                return palette.genDiadicPalette(numBoxes, baseColor, initialColorSpace);
            case 9:
                console.log('Generating monochromatic palette');
                return palette.genMonochromaticPalette(numBoxes, baseColor, initialColorSpace);
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
function startPaletteGen(paletteType, numBoxes, initialColorSpace = 'hex', customColor) {
    try {
        const baseColor = customColor ?? random.randomColor(initialColorSpace);
        const colors = genSelectedPaletteType(paletteType, numBoxes, baseColor, customColor, initialColorSpace);
        if (colors.length === 0) {
            console.error('Colors array is empty or undefined.');
            return;
        }
        else {
            console.log(`Colors array: ${JSON.stringify(colors)}`);
        }
        genPaletteBox(numBoxes, colors);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFsZXR0ZS1nZW4vZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbkUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUc1QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QyxTQUFTLGFBQWEsQ0FBQyxRQUFnQixFQUFFLE1BQXFCO0lBQzdELElBQUksQ0FBQztRQUNKLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN6QyxPQUFPO1FBQ1IsQ0FBQztRQUVELFVBQVUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsZ0JBQWdCO1FBQzNDLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztRQUV4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDWixPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ2xELFNBQVM7WUFDVixDQUFDO1lBRUQs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SyxDQUFDLEVBQUUsQ0FBQztZQUN6QixPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7WUFDckQsT0FBTztRQUNSLENBQUM7YUFBTSxDQUFDO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELGFBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBdUI7SUFDM0MsYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixlQUFlO0NBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbkFsbENvbG9yVmFsdWVzIH0gZnJvbSAnLi4vY29sb3ItY29udmVyc2lvbi9jb252ZXJzaW9uJztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4uL2RvbS9kb20tbWFpbic7XG5pbXBvcnQgeyBkb21IZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9kb20nO1xuaW1wb3J0ICogYXMgZm5PYmplY3RzIGZyb20gJy4uL2luZGV4L2ZuLW9iamVjdHMnO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi4vaW5kZXgvdHlwZXMnO1xuaW1wb3J0IHsgcGFsZXR0ZSB9IGZyb20gJy4vcGFsZXR0ZS1pbmRleCc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcbmltcG9ydCB7IGd1YXJkcyB9IGZyb20gJy4uL3V0aWxzL3R5cGUtZ3VhcmRzJztcblxuZnVuY3Rpb24gZ2VuUGFsZXR0ZUJveChudW1Cb3hlczogbnVtYmVyLCBjb2xvcnM6IHR5cGVzLkNvbG9yW10pOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRpZiAoIXBhbGV0dGVSb3cpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3BhbGV0dGVSb3cgaXMgdW5kZWZpbmVkJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJzsgLy8gY2xlYXIgdGhlIHJvd1xuXHRcdGxldCBwYWxldHRlQm94Q291bnQgPSAxO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1Cb3hlczsgaSsrKSB7XG5cdFx0XHRjb25zdCBjb2xvciA9IGNvbG9yc1tpXTtcblxuXHRcdFx0aWYgKCFjb2xvcikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYENvbG9yIGF0IGluZGV4ICR7aX0gaXMgdW5kZWZpbmVkLmApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGBDb2xvciBhdCBpbmRleCAke2l9IGJlaW5nIHByb2Nlc3NlZCBpczogJHtKU09OLnN0cmluZ2lmeShjb2xvci52YWx1ZSl9IGluICR7Y29sb3IuZm9ybWF0fWBcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9IGdlbkFsbENvbG9yVmFsdWVzKGNvbG9yKTtcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgR2VuZXJhdGVkIGNvbG9yIHZhbHVlczogJHtKU09OLnN0cmluZ2lmeShjb2xvclZhbHVlcyl9YFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IG9yaWdpbmFsQ29sb3JGb3JtYXQgPSBjb2xvci5mb3JtYXQgYXMgdHlwZXMuQ29sb3JTcGFjZTtcblxuXHRcdFx0aWYgKCFndWFyZHMuaXNGb3JtYXQob3JpZ2luYWxDb2xvckZvcm1hdCkpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdGBTa2lwcGluZyB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7b3JpZ2luYWxDb2xvckZvcm1hdH1gXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvcmlnaW5hbENvbG9yVmFsdWUgPSBjb2xvclZhbHVlc1tvcmlnaW5hbENvbG9yRm9ybWF0XTtcblxuXHRcdFx0aWYgKCFvcmlnaW5hbENvbG9yVmFsdWUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZ2VuZXJhdGUgY29sb3IgZGF0YSBmb3IgZm9ybWF0ICR7b3JpZ2luYWxDb2xvckZvcm1hdH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHsgY29sb3JTdHJpcGUsIHBhbGV0dGVCb3hDb3VudDogbmV3UGFsZXR0ZUJveENvdW50IH0gPVxuXHRcdFx0XHRkb21IZWxwZXJzLm1ha2VQYWxldHRlQm94KGNvbG9yLCBwYWxldHRlQm94Q291bnQpO1xuXG5cdFx0XHRwYWxldHRlUm93LmFwcGVuZENoaWxkKGNvbG9yU3RyaXBlKTtcblxuXHRcdFx0ZG9tLnBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94KGNvbG9yLCBwYWxldHRlQm94Q291bnQpO1xuXG5cdFx0XHRwYWxldHRlQm94Q291bnQgPSBuZXdQYWxldHRlQm94Q291bnQ7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGdlbmVyYXRpbmcgcGFsZXR0ZSBib3g6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2VuU2VsZWN0ZWRQYWxldHRlVHlwZShcblx0cGFsZXR0ZVR5cGU6IG51bWJlcixcblx0bnVtQm94ZXM6IG51bWJlcixcblx0YmFzZUNvbG9yOiB0eXBlcy5Db2xvcixcblx0Y3VzdG9tQ29sb3I6IHR5cGVzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdGluaXRpYWxDb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gJ2hleCdcbik6IHR5cGVzLkNvbG9yW10ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAocGFsZXR0ZVR5cGUpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Y29uc29sZS5sb2coJ0dlbmVyYXRpbmcgcmFuZG9tIHBhbGV0dGUnKTtcblx0XHRcdFx0cmV0dXJuIHBhbGV0dGUuZ2VuUmFuZG9tUGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdFx0XHQpO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRjb25zb2xlLmxvZygnR2VuZXJhdGluZyBjb21wbGVtZW50YXJ5IHBhbGV0dGUnKTtcblx0XHRcdFx0cmV0dXJuIHBhbGV0dGUuZ2VuQ29tcGxlbWVudGFyeVBhbGV0dGUoXG5cdFx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0XHRcdGluaXRpYWxDb2xvclNwYWNlXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdHZW5lcmF0aW5nIHRyaWFkaWMgcGFsZXR0ZScpO1xuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5UcmlhZGljUGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHRcdFx0KTtcblx0XHRcdGNhc2UgNDpcblx0XHRcdFx0Y29uc29sZS5sb2coJ0dlbmVyYXRpbmcgdGV0cmFkaWMgcGFsZXR0ZScpO1xuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5UZXRyYWRpY1BhbGV0dGUoXG5cdFx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0XHRcdGluaXRpYWxDb2xvclNwYWNlXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlIDU6XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdHZW5lcmF0aW5nIHNwbGl0IGNvbXBsZW1lbnRhcnkgcGFsZXR0ZScpO1xuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5TcGxpdENvbXBsZW1lbnRhcnlQYWxldHRlKFxuXHRcdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRcdGJhc2VDb2xvcixcblx0XHRcdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdFx0XHQpO1xuXHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHRjb25zb2xlLmxvZygnR2VuZXJhdGluZyBhbmFsb2dvdXMgcGFsZXR0ZScpO1xuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5BbmFsb2dvdXNQYWxldHRlKFxuXHRcdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRcdGJhc2VDb2xvcixcblx0XHRcdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdFx0XHQpO1xuXHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHRjb25zb2xlLmxvZygnR2VuZXJhdGluZyBoZXhhZGljIHBhbGV0dGUnKTtcblx0XHRcdFx0cmV0dXJuIHBhbGV0dGUuZ2VuSGV4YWRpY1BhbGV0dGUoXG5cdFx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0XHRcdGluaXRpYWxDb2xvclNwYWNlXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlIDg6XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdHZW5lcmF0aW5nIGRpYWRpYyBwYWxldHRlJyk7XG5cdFx0XHRcdHJldHVybiBwYWxldHRlLmdlbkRpYWRpY1BhbGV0dGUoXG5cdFx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0XHRcdGluaXRpYWxDb2xvclNwYWNlXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlIDk6XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdHZW5lcmF0aW5nIG1vbm9jaHJvbWF0aWMgcGFsZXR0ZScpO1xuXHRcdFx0XHRyZXR1cm4gcGFsZXR0ZS5nZW5Nb25vY2hyb21hdGljUGFsZXR0ZShcblx0XHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHRcdFx0KTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1VuYWJsZSB0byBkZXRlcm1pbmUgY29sb3Igc2NoZW1lJyk7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyBwYWxldHRlOiAke2Vycm9yfWApO1xuXHRcdHJldHVybiBbXTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdGFydFBhbGV0dGVHZW4oXG5cdHBhbGV0dGVUeXBlOiBudW1iZXIsXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdGluaXRpYWxDb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gJ2hleCcsXG5cdGN1c3RvbUNvbG9yOiB0eXBlcy5Db2xvciB8IG51bGxcbik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGJhc2VDb2xvcjogdHlwZXMuQ29sb3IgPVxuXHRcdFx0Y3VzdG9tQ29sb3IgPz8gcmFuZG9tLnJhbmRvbUNvbG9yKGluaXRpYWxDb2xvclNwYWNlKTtcblxuXHRcdGNvbnN0IGNvbG9yczogdHlwZXMuQ29sb3JbXSA9IGdlblNlbGVjdGVkUGFsZXR0ZVR5cGUoXG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdCk7XG5cblx0XHRpZiAoY29sb3JzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignQ29sb3JzIGFycmF5IGlzIGVtcHR5IG9yIHVuZGVmaW5lZC4nKTtcblx0XHRcdHJldHVybjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coYENvbG9ycyBhcnJheTogJHtKU09OLnN0cmluZ2lmeShjb2xvcnMpfWApO1xuXHRcdH1cblxuXHRcdGdlblBhbGV0dGVCb3gobnVtQm94ZXMsIGNvbG9ycyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3Igc3RhcnRpbmcgcGFsZXR0ZSBnZW5lcmF0aW9uOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZTogZm5PYmplY3RzLkdlbmVyYXRlID0ge1xuXHRnZW5QYWxldHRlQm94LFxuXHRnZW5TZWxlY3RlZFBhbGV0dGVUeXBlLFxuXHRzdGFydFBhbGV0dGVHZW5cbn07XG4iXX0=