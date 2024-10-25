import { genAllColorValues } from '../color-conversion/conversion.js';
import { conversionHelpers } from '../helpers/conversion.js';
import { paletteHelpers } from '../helpers/palette.js';
import { random } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
export function genAnalogousHues(color, numBoxes) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return [];
        }
        const clonedColor = core.clone(color);
        const hslColor = clonedColor.format === 'hsl'
            ? clonedColor
            : conversionHelpers.convertColorToHSL(clonedColor);
        if (!hslColor) {
            console.error(`Failed to retrieve HSL color from ${color.format}`);
            return [];
        }
        const analogousHues = [];
        const baseHue = hslColor.value.hue;
        const maxTotalDistance = 60;
        const minTotalDistance = 10 + (numBoxes - 2) * 9;
        const totalIncrement = Math.floor(Math.random() * (maxTotalDistance - minTotalDistance + 1)) + minTotalDistance;
        const increment = Math.floor(totalIncrement / (numBoxes - 1));
        for (let i = 1; i < numBoxes; i++) {
            analogousHues.push((baseHue + increment * i) % 360);
        }
        return analogousHues;
    }
    catch (error) {
        console.error(`Error generating analogous hues: ${error}`);
        return [];
    }
}
export function genAnalogousPalette(numBoxes, customColor = null, initialColorSpace = 'hex') {
    try {
        let clonedCustomColor = null;
        if (customColor) {
            if (!paletteHelpers.validateColorValues(customColor)) {
                console.error(`Invalid custom color value ${JSON.stringify(customColor)}`);
                return [];
            }
            clonedCustomColor = core.clone(customColor);
        }
        if (numBoxes < 2) {
            window.alert('To generate an analogous palette, please select a number of swatches greater than 1');
            return [];
        }
        const colors = [];
        const baseColorValues = clonedCustomColor
            ? genAllColorValues(clonedCustomColor)
            : genAllColorValues(random.randomColor(initialColorSpace));
        const baseColor = baseColorValues[initialColorSpace];
        if (!baseColor) {
            throw new Error('Base color is missing in the generated values');
        }
        colors.push(baseColor);
        const analogousHues = genAnalogousHues(baseColorValues.hsl, numBoxes);
        analogousHues.forEach((hue, i) => {
            const sl = random.randomSL();
            const analogousColorValues = genAllColorValues({
                value: {
                    hue,
                    saturation: sl.value.saturation,
                    lightness: sl.value.lightness
                },
                format: 'hsl'
            });
            const analogousColor = analogousColorValues.hsl;
            if (analogousColor) {
                colors.push(analogousColor);
            }
            const colorBox = document.getElementById(`color-box-${i + 2}`);
            if (colorBox) {
                const hexValue = analogousColorValues.hex;
                colorBox.style.backgroundColor = hexValue
                    ? hexValue.value.hex
                    : '';
            }
        });
        console.log(`Generated analogous palette: ${JSON.stringify(colors)}`);
        return colors;
    }
    catch (error) {
        console.error(`Error generating analogous palette: ${error}`);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbG9nb3VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhbGV0dGUtZ2VuL2FuYWxvZ291cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckMsTUFBTSxVQUFVLGdCQUFnQixDQUMvQixLQUFrQixFQUNsQixRQUFnQjtJQUVoQixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDaEQsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFOUQsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDO1FBRUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxNQUFNLFFBQVEsR0FDYixXQUFXLENBQUMsTUFBTSxLQUFLLEtBQUs7WUFDM0IsQ0FBQyxDQUFFLFdBQXlCO1lBQzVCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNuRSxPQUFPLEVBQUUsQ0FBQztRQUNYLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBYSxFQUFFLENB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L0IsU0FBUyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUztpQkFDN0I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUM7WUFFSCxNQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUM7WUFFaEQsSUFBSSxjQUFjLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBRUQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRS9ELElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ2QsTUFBTSxRQUFRLEdBQUcsb0JBQW9CLENBQUMsR0FFMUIsQ0FBQztnQkFDYixRQUFRLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxRQUFRO29CQUN4QyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHO29CQUNwQixDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ1AsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEUsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5BbGxDb2xvclZhbHVlcyB9IGZyb20gJy4uL2NvbG9yLWNvbnZlcnNpb24vY29udmVyc2lvbic7XG5pbXBvcnQgeyBjb252ZXJzaW9uSGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvY29udmVyc2lvbic7XG5pbXBvcnQgeyBwYWxldHRlSGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvcGFsZXR0ZSc7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuLi9pbmRleC90eXBlcyc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcbmltcG9ydCB7IGNvcmUgfSBmcm9tICcuLi91dGlscy9jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbkFuYWxvZ291c0h1ZXMoXG5cdGNvbG9yOiB0eXBlcy5Db2xvcixcblx0bnVtQm94ZXM6IG51bWJlclxuKTogbnVtYmVyW10ge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpO1xuXHRcdGNvbnN0IGhzbENvbG9yID1cblx0XHRcdGNsb25lZENvbG9yLmZvcm1hdCA9PT0gJ2hzbCdcblx0XHRcdFx0PyAoY2xvbmVkQ29sb3IgYXMgdHlwZXMuSFNMKVxuXHRcdFx0XHQ6IGNvbnZlcnNpb25IZWxwZXJzLmNvbnZlcnRDb2xvclRvSFNMKGNsb25lZENvbG9yKTtcblxuXHRcdGlmICghaHNsQ29sb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byByZXRyaWV2ZSBIU0wgY29sb3IgZnJvbSAke2NvbG9yLmZvcm1hdH1gKTtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRjb25zdCBhbmFsb2dvdXNIdWVzOiBudW1iZXJbXSA9IFtdO1xuXHRcdGNvbnN0IGJhc2VIdWUgPSBoc2xDb2xvci52YWx1ZS5odWU7XG5cdFx0Y29uc3QgbWF4VG90YWxEaXN0YW5jZSA9IDYwO1xuXHRcdGNvbnN0IG1pblRvdGFsRGlzdGFuY2UgPSAxMCArIChudW1Cb3hlcyAtIDIpICogOTtcblx0XHRjb25zdCB0b3RhbEluY3JlbWVudCA9XG5cdFx0XHRNYXRoLmZsb29yKFxuXHRcdFx0XHRNYXRoLnJhbmRvbSgpICogKG1heFRvdGFsRGlzdGFuY2UgLSBtaW5Ub3RhbERpc3RhbmNlICsgMSlcblx0XHRcdCkgKyBtaW5Ub3RhbERpc3RhbmNlO1xuXHRcdGNvbnN0IGluY3JlbWVudCA9IE1hdGguZmxvb3IodG90YWxJbmNyZW1lbnQgLyAobnVtQm94ZXMgLSAxKSk7XG5cblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IG51bUJveGVzOyBpKyspIHtcblx0XHRcdGFuYWxvZ291c0h1ZXMucHVzaCgoYmFzZUh1ZSArIGluY3JlbWVudCAqIGkpICUgMzYwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYW5hbG9nb3VzSHVlcztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBnZW5lcmF0aW5nIGFuYWxvZ291cyBodWVzOiAke2Vycm9yfWApO1xuXHRcdHJldHVybiBbXTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuQW5hbG9nb3VzUGFsZXR0ZShcblx0bnVtQm94ZXM6IG51bWJlcixcblx0Y3VzdG9tQ29sb3I6IHR5cGVzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdGluaXRpYWxDb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gJ2hleCdcbik6IHR5cGVzLkNvbG9yW10ge1xuXHR0cnkge1xuXHRcdGxldCBjbG9uZWRDdXN0b21Db2xvcjogdHlwZXMuQ29sb3IgfCBudWxsID0gbnVsbDtcblxuXHRcdGlmIChjdXN0b21Db2xvcikge1xuXHRcdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGN1c3RvbUNvbG9yKSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIGN1c3RvbSBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGN1c3RvbUNvbG9yKX1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRjbG9uZWRDdXN0b21Db2xvciA9IGNvcmUuY2xvbmUoY3VzdG9tQ29sb3IpO1xuXHRcdH1cblxuXHRcdGlmIChudW1Cb3hlcyA8IDIpIHtcblx0XHRcdHdpbmRvdy5hbGVydChcblx0XHRcdFx0J1RvIGdlbmVyYXRlIGFuIGFuYWxvZ291cyBwYWxldHRlLCBwbGVhc2Ugc2VsZWN0IGEgbnVtYmVyIG9mIHN3YXRjaGVzIGdyZWF0ZXIgdGhhbiAxJ1xuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9yczogdHlwZXMuQ29sb3JbXSA9IFtdO1xuXHRcdGNvbnN0IGJhc2VDb2xvclZhbHVlcyA9IGNsb25lZEN1c3RvbUNvbG9yXG5cdFx0XHQ/IGdlbkFsbENvbG9yVmFsdWVzKGNsb25lZEN1c3RvbUNvbG9yKVxuXHRcdFx0OiBnZW5BbGxDb2xvclZhbHVlcyhyYW5kb20ucmFuZG9tQ29sb3IoaW5pdGlhbENvbG9yU3BhY2UpKTtcblx0XHRjb25zdCBiYXNlQ29sb3IgPSBiYXNlQ29sb3JWYWx1ZXNbaW5pdGlhbENvbG9yU3BhY2VdO1xuXG5cdFx0aWYgKCFiYXNlQ29sb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQmFzZSBjb2xvciBpcyBtaXNzaW5nIGluIHRoZSBnZW5lcmF0ZWQgdmFsdWVzJyk7XG5cdFx0fVxuXG5cdFx0Y29sb3JzLnB1c2goYmFzZUNvbG9yKTtcblxuXHRcdGNvbnN0IGFuYWxvZ291c0h1ZXMgPSBnZW5BbmFsb2dvdXNIdWVzKFxuXHRcdFx0YmFzZUNvbG9yVmFsdWVzLmhzbCBhcyB0eXBlcy5IU0wsXG5cdFx0XHRudW1Cb3hlc1xuXHRcdCk7XG5cblx0XHRhbmFsb2dvdXNIdWVzLmZvckVhY2goKGh1ZSwgaSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2wgPSByYW5kb20ucmFuZG9tU0woKTtcblx0XHRcdGNvbnN0IGFuYWxvZ291c0NvbG9yVmFsdWVzID0gZ2VuQWxsQ29sb3JWYWx1ZXMoe1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBzbC52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogc2wudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCBhbmFsb2dvdXNDb2xvciA9IGFuYWxvZ291c0NvbG9yVmFsdWVzLmhzbDtcblxuXHRcdFx0aWYgKGFuYWxvZ291c0NvbG9yKSB7XG5cdFx0XHRcdGNvbG9ycy5wdXNoKGFuYWxvZ291c0NvbG9yKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29sb3ItYm94LSR7aSArIDJ9YCk7XG5cblx0XHRcdGlmIChjb2xvckJveCkge1xuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IGFuYWxvZ291c0NvbG9yVmFsdWVzLmhleCBhc1xuXHRcdFx0XHRcdHwgdHlwZXMuSGV4XG5cdFx0XHRcdFx0fCB1bmRlZmluZWQ7XG5cdFx0XHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleFZhbHVlXG5cdFx0XHRcdFx0PyBoZXhWYWx1ZS52YWx1ZS5oZXhcblx0XHRcdFx0XHQ6ICcnO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Y29uc29sZS5sb2coYEdlbmVyYXRlZCBhbmFsb2dvdXMgcGFsZXR0ZTogJHtKU09OLnN0cmluZ2lmeShjb2xvcnMpfWApO1xuXG5cdFx0cmV0dXJuIGNvbG9ycztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBnZW5lcmF0aW5nIGFuYWxvZ291cyBwYWxldHRlOiAke2Vycm9yfWApO1xuXHRcdHJldHVybiBbXTtcblx0fVxufVxuIl19