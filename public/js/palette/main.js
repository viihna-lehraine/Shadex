// File: src/palette/main.js
import { IDBManager } from '../idb/index.js';
import { core, helpers, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { genPalette as genPaletteType } from './main/index.js';
import { paletteHelpers } from './common/index.js';
import { transform } from '../common/transform/index.js';
const defaultPalette = data.defaults.palette.unbrandedData;
const defaultBrandedPalete = transform.brandPalette(defaultPalette);
const limits = paletteHelpers.limits;
const mode = data.mode;
const idb = IDBManager.getInstance();
const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;
async function genPalette(options) {
    try {
        let { numBoxes, customColor } = options;
        const idb = IDBManager.getInstance();
        if (customColor === null || customColor === undefined) {
            if (mode.errorLogs)
                console.error('Custom color is null or undefined.');
            return;
        }
        const validatedCustomColor = helpers.dom.validateAndConvertColor(customColor) ??
            utils.random.hsl(options.enableAlpha);
        if (mode.debug)
            console.log(`Custom color: ${JSON.stringify(customColor)}`);
        options.customColor = validatedCustomColor;
        const palette = await generate.selectedPalette(options);
        if (palette.items.length === 0) {
            if (mode.errorLogs)
                console.error('Colors array is empty or invalid.');
            return;
        }
        if (!mode.quiet)
            console.log(`Colors array generated: ${JSON.stringify(palette.items)}`);
        const tableId = await idb.getNextTableID();
        if (!tableId)
            throw new Error('Table ID is null or undefined.');
        await genPaletteDOMBox(palette.items, numBoxes, tableId);
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error starting palette generation: ${error}`);
    }
}
async function genPaletteDOMBox(items, numBoxes, tableId) {
    try {
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            if (mode.errorLogs)
                console.error('paletteRow is undefined.');
            return;
        }
        paletteRow.innerHTML = '';
        const fragment = document.createDocumentFragment();
        items.slice(0, numBoxes).forEach((item, i) => {
            const color = { value: item.colors.hsl, format: 'hsl' };
            const { colorStripe } = helpers.dom.makePaletteBox(color, i + 1);
            fragment.appendChild(colorStripe);
            utils.palette.populateOutputBox(color, i + 1);
        });
        paletteRow.appendChild(fragment);
        if (!mode.quiet)
            console.log('Palette boxes generated and rendered.');
        await idb.saveData('tables', tableId, { palette: items });
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error generating palette box: ${error}`);
    }
}
export const start = {
    genPalette,
    genPaletteDOMBox
};
// ******** GENERATE ********
function limitedHSL(baseHue, limitDark, limitGray, limitLight, alphaValue) {
    let hsl;
    do {
        hsl = {
            value: {
                hue: core.brand.asRadial(baseHue),
                saturation: core.brand.asPercentile(Math.random() * 100),
                lightness: core.brand.asPercentile(Math.random() * 100),
                alpha: alphaValue
                    ? core.brand.asAlphaRange(alphaValue)
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
    } while ((limitGray && isTooGray(hsl)) ||
        (limitDark && isTooDark(hsl)) ||
        (limitLight && isTooLight(hsl)));
    return hsl;
}
async function selectedPalette(options) {
    try {
        const { paletteType, numBoxes, customColor, enableAlpha, limitDarkness, limitGrayness, limitLightness } = options;
        const args = {
            numBoxes,
            customColor,
            enableAlpha,
            limitDark: limitDarkness,
            limitGray: limitGrayness,
            limitLight: limitLightness
        };
        switch (paletteType) {
            case 1:
                return genPaletteType.random(args);
            case 2:
                return genPaletteType.complementary(args);
            case 3:
                return genPaletteType.triadic(args);
            case 4:
                return genPaletteType.tetradic(args);
            case 5:
                return genPaletteType.splitComplementary(args);
            case 6:
                return genPaletteType.analogous(args);
            case 7:
                return genPaletteType.hexadic(args);
            case 8:
                return genPaletteType.diadic(args);
            case 9:
                return genPaletteType.monochromatic(args);
            default:
                if (mode.errorLogs)
                    console.error('Invalid palette type.');
                return Promise.resolve(defaultBrandedPalete);
        }
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error generating palette: ${error}`);
        return Promise.resolve(defaultBrandedPalete);
    }
}
export const generate = {
    limitedHSL,
    selectedPalette
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBVzVCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFVBQVUsSUFBSSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXpELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUMzRCxNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFcEUsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztBQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRXZCLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUVyQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25DLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUVyQyxLQUFLLFVBQVUsVUFBVSxDQUFDLE9BQXVCO0lBQ2hELElBQUksQ0FBQztRQUNKLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXhDLE1BQU0sR0FBRyxHQUFH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QUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsS0FBSyxDQUFDO2dCQUNMLE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxLQUFLLENBQUM7Z0JBQ0wsT0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLEtBQUssQ0FBQztnQkFDTCxPQUFPLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0M7Z0JBQ0MsSUFBSSxJQUFJLENBQUMsU0FBUztvQkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBRTNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV4RSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUM5QyxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBK0I7SUFDbkQsVUFBVTtJQUNWLGVBQWU7Q0FDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL3BhbGV0dGUvbWFpbi5qc1xuXG5pbXBvcnQge1xuXHRHZW5QYWxldHRlQXJncyxcblx0SFNMLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlR2VuZXJhdGVGbkludGVyZmFjZSxcblx0UGFsZXR0ZUl0ZW0sXG5cdFBhbGV0dGVPcHRpb25zLFxuXHRQYWxldHRlU3RhcnRGbkludGVyZmFjZVxufSBmcm9tICcuLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBJREJNYW5hZ2VyIH0gZnJvbSAnLi4vaWRiL2luZGV4LmpzJztcbmltcG9ydCB7IGNvcmUsIGhlbHBlcnMsIHV0aWxzIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGdlblBhbGV0dGUgYXMgZ2VuUGFsZXR0ZVR5cGUgfSBmcm9tICcuL21haW4vaW5kZXguanMnO1xuaW1wb3J0IHsgcGFsZXR0ZUhlbHBlcnMgfSBmcm9tICcuL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICcuLi9jb21tb24vdHJhbnNmb3JtL2luZGV4LmpzJztcblxuY29uc3QgZGVmYXVsdFBhbGV0dGUgPSBkYXRhLmRlZmF1bHRzLnBhbGV0dGUudW5icmFuZGVkRGF0YTtcbmNvbnN0IGRlZmF1bHRCcmFuZGVkUGFsZXRlID0gdHJhbnNmb3JtLmJyYW5kUGFsZXR0ZShkZWZhdWx0UGFsZXR0ZSk7XG5cbmNvbnN0IGxpbWl0cyA9IHBhbGV0dGVIZWxwZXJzLmxpbWl0cztcbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmNvbnN0IGlkYiA9IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuY29uc3QgaXNUb29EYXJrID0gbGltaXRzLmlzVG9vRGFyaztcbmNvbnN0IGlzVG9vR3JheSA9IGxpbWl0cy5pc1Rvb0dyYXk7XG5jb25zdCBpc1Rvb0xpZ2h0ID0gbGltaXRzLmlzVG9vTGlnaHQ7XG5cbmFzeW5jIGZ1bmN0aW9uIGdlblBhbGV0dGUob3B0aW9uczogUGFsZXR0ZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcblx0dHJ5IHtcblx0XHRsZXQgeyBudW1Cb3hlcywgY3VzdG9tQ29sb3IgfSA9IG9wdGlvbnM7XG5cblx0XHRjb25zdCBpZGIgPSBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cblx0XHRpZiAoY3VzdG9tQ29sb3IgPT09IG51bGwgfHwgY3VzdG9tQ29sb3IgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdDdXN0b20gY29sb3IgaXMgbnVsbCBvciB1bmRlZmluZWQuJyk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB2YWxpZGF0ZWRDdXN0b21Db2xvcjogSFNMID1cblx0XHRcdChoZWxwZXJzLmRvbS52YWxpZGF0ZUFuZENvbnZlcnRDb2xvcihjdXN0b21Db2xvcikgYXMgSFNMKSA/P1xuXHRcdFx0dXRpbHMucmFuZG9tLmhzbChvcHRpb25zLmVuYWJsZUFscGhhKTtcblxuXHRcdGlmIChtb2RlLmRlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coYEN1c3RvbSBjb2xvcjogJHtKU09OLnN0cmluZ2lmeShjdXN0b21Db2xvcil9YCk7XG5cblx0XHRvcHRpb25zLmN1c3RvbUNvbG9yID0gdmFsaWRhdGVkQ3VzdG9tQ29sb3I7XG5cblx0XHRjb25zdCBwYWxldHRlID0gYXdhaXQgZ2VuZXJhdGUuc2VsZWN0ZWRQYWxldHRlKG9wdGlvbnMpO1xuXG5cdFx0aWYgKHBhbGV0dGUuaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0NvbG9ycyBhcnJheSBpcyBlbXB0eSBvciBpbnZhbGlkLicpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGBDb2xvcnMgYXJyYXkgZ2VuZXJhdGVkOiAke0pTT04uc3RyaW5naWZ5KHBhbGV0dGUuaXRlbXMpfWBcblx0XHRcdCk7XG5cblx0XHRjb25zdCB0YWJsZUlkID0gYXdhaXQgaWRiLmdldE5leHRUYWJsZUlEKCk7XG5cblx0XHRpZiAoIXRhYmxlSWQpIHRocm93IG5ldyBFcnJvcignVGFibGUgSUQgaXMgbnVsbCBvciB1bmRlZmluZWQuJyk7XG5cblx0XHRhd2FpdCBnZW5QYWxldHRlRE9NQm94KHBhbGV0dGUuaXRlbXMsIG51bUJveGVzLCB0YWJsZUlkKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBzdGFydGluZyBwYWxldHRlIGdlbmVyYXRpb246ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VuUGFsZXR0ZURPTUJveChcblx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdHRhYmxlSWQ6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZVJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWxldHRlLXJvdycpO1xuXG5cdFx0aWYgKCFwYWxldHRlUm93KSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoJ3BhbGV0dGVSb3cgaXMgdW5kZWZpbmVkLicpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJztcblxuXHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG5cdFx0aXRlbXMuc2xpY2UoMCwgbnVtQm94ZXMpLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcblx0XHRcdGNvbnN0IGNvbG9yOiBIU0wgPSB7IHZhbHVlOiBpdGVtLmNvbG9ycy5oc2wsIGZvcm1hdDogJ2hzbCcgfTtcblx0XHRcdGNvbnN0IHsgY29sb3JTdHJpcGUgfSA9IGhlbHBlcnMuZG9tLm1ha2VQYWxldHRlQm94KGNvbG9yLCBpICsgMSk7XG5cblx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGNvbG9yU3RyaXBlKTtcblxuXHRcdFx0dXRpbHMucGFsZXR0ZS5wb3B1bGF0ZU91dHB1dEJveChjb2xvciwgaSArIDEpO1xuXHRcdH0pO1xuXG5cdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdQYWxldHRlIGJveGVzIGdlbmVyYXRlZCBhbmQgcmVuZGVyZWQuJyk7XG5cblx0XHRhd2FpdCBpZGIuc2F2ZURhdGEoJ3RhYmxlcycsIHRhYmxlSWQsIHsgcGFsZXR0ZTogaXRlbXMgfSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyBwYWxldHRlIGJveDogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3Qgc3RhcnQ6IFBhbGV0dGVTdGFydEZuSW50ZXJmYWNlID0ge1xuXHRnZW5QYWxldHRlLFxuXHRnZW5QYWxldHRlRE9NQm94XG59IGFzIGNvbnN0O1xuXG4vLyAqKioqKioqKiBHRU5FUkFURSAqKioqKioqKlxuXG5mdW5jdGlvbiBsaW1pdGVkSFNMKFxuXHRiYXNlSHVlOiBudW1iZXIsXG5cdGxpbWl0RGFyazogYm9vbGVhbixcblx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRsaW1pdExpZ2h0OiBib29sZWFuLFxuXHRhbHBoYVZhbHVlOiBudW1iZXIgfCBudWxsXG4pOiBIU0wge1xuXHRsZXQgaHNsOiBIU0w7XG5cblx0ZG8ge1xuXHRcdGhzbCA9IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogY29yZS5icmFuZC5hc1JhZGlhbChiYXNlSHVlKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yYW5kb20oKSAqIDEwMCksXG5cdFx0XHRcdGxpZ2h0bmVzczogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yYW5kb20oKSAqIDEwMCksXG5cdFx0XHRcdGFscGhhOiBhbHBoYVZhbHVlXG5cdFx0XHRcdFx0PyBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhbHBoYVZhbHVlKVxuXHRcdFx0XHRcdDogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSB3aGlsZSAoXG5cdFx0KGxpbWl0R3JheSAmJiBpc1Rvb0dyYXkoaHNsKSkgfHxcblx0XHQobGltaXREYXJrICYmIGlzVG9vRGFyayhoc2wpKSB8fFxuXHRcdChsaW1pdExpZ2h0ICYmIGlzVG9vTGlnaHQoaHNsKSlcblx0KTtcblxuXHRyZXR1cm4gaHNsO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZWxlY3RlZFBhbGV0dGUob3B0aW9uczogUGFsZXR0ZU9wdGlvbnMpOiBQcm9taXNlPFBhbGV0dGU+IHtcblx0dHJ5IHtcblx0XHRjb25zdCB7XG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9ID0gb3B0aW9ucztcblxuXHRcdGNvbnN0IGFyZ3M6IEdlblBhbGV0dGVBcmdzID0ge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrOiBsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5OiBsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodDogbGltaXRMaWdodG5lc3Ncblx0XHR9O1xuXG5cdFx0c3dpdGNoIChwYWxldHRlVHlwZSkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRyZXR1cm4gZ2VuUGFsZXR0ZVR5cGUucmFuZG9tKGFyZ3MpO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRyZXR1cm4gZ2VuUGFsZXR0ZVR5cGUuY29tcGxlbWVudGFyeShhcmdzKTtcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0cmV0dXJuIGdlblBhbGV0dGVUeXBlLnRyaWFkaWMoYXJncyk7XG5cdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdHJldHVybiBnZW5QYWxldHRlVHlwZS50ZXRyYWRpYyhhcmdzKTtcblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0cmV0dXJuIGdlblBhbGV0dGVUeXBlLnNwbGl0Q29tcGxlbWVudGFyeShhcmdzKTtcblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0cmV0dXJuIGdlblBhbGV0dGVUeXBlLmFuYWxvZ291cyhhcmdzKTtcblx0XHRcdGNhc2UgNzpcblx0XHRcdFx0cmV0dXJuIGdlblBhbGV0dGVUeXBlLmhleGFkaWMoYXJncyk7XG5cdFx0XHRjYXNlIDg6XG5cdFx0XHRcdHJldHVybiBnZW5QYWxldHRlVHlwZS5kaWFkaWMoYXJncyk7XG5cdFx0XHRjYXNlIDk6XG5cdFx0XHRcdHJldHVybiBnZW5QYWxldHRlVHlwZS5tb25vY2hyb21hdGljKGFyZ3MpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKCdJbnZhbGlkIHBhbGV0dGUgdHlwZS4nKTtcblxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRlZmF1bHRCcmFuZGVkUGFsZXRlKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBFcnJvciBnZW5lcmF0aW5nIHBhbGV0dGU6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRlZmF1bHRCcmFuZGVkUGFsZXRlKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGU6IFBhbGV0dGVHZW5lcmF0ZUZuSW50ZXJmYWNlID0ge1xuXHRsaW1pdGVkSFNMLFxuXHRzZWxlY3RlZFBhbGV0dGVcbn0gYXMgY29uc3Q7XG4iXX0=