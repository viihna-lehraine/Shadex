import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { paletteHelpers } from '../helpers/palette.js';
import { random } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
export function genMonochromaticPalette(numBoxes, customColor = null, colorSpace = 'hex') {
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
            window.alert('To generate a monochromatic palette, please select a number of swatches greater than 1');
            return [];
        }
        const colors = [];
        const baseColorValues = genAllColorValues(clonedCustomColor ?? random.randomColor(colorSpace));
        const baseHSL = baseColorValues.hsl;
        if (!baseHSL) {
            throw new Error('Could not retrieve HSL color from genAllColorValues. HSL color is required for a monochromatic palette.');
        }
        colors.push(baseHSL);
        for (let i = 1; i < numBoxes; i++) {
            const { value: { saturation, lightness } } = random.randomSL();
            const monoColorValues = genAllColorValues({
                value: {
                    hue: baseHSL.value.hue,
                    saturation,
                    lightness
                },
                format: 'hsl'
            });
            const monoHSL = monoColorValues.hsl;
            colors.push(monoHSL);
            const colorBox = document.getElementById(`color-box-${i + 1}`);
            if (colorBox) {
                const hexColor = monoColorValues.hex;
                colorBox.style.backgroundColor = hexColor.value.hex;
                dom.populateColorTextOutputBox(monoHSL, i + 1);
            }
        }
        console.log(`Generated monochromatic palette: ${JSON.stringify(colors)}`);
        return colors;
    }
    catch (error) {
        console.error(`Error generating monochromatic palette: ${error}`);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ub2Nocm9tYXRpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlLWdlbi9tb25vY2hyb21hdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckMsTUFBTSxVQUFVLHVCQUF1QixDQUN0QyxRQUFnQixFQUNoQixjQUFrQyxJQUFJLEVBQ3RDLGFBQStCLEtBQUs7SUFFcEMsSUFBSSxDQUFDO1FBQ0osSUFBSSxpQkFBaUIsR0FBdUIsSUFBSSxDQUFDO1FBRWpELElBQUksV0FBVyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxPQUFPLENBQUMsS0FBSyxDQUNaLDhCQUE4QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQzNELENBQUM7Z0JBRUYsT0FBTyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FDWCx3RkFBd0YsQ0FDeEYsQ0FBQztZQUVGLE9BQU8sRUFBRSxDQUFDO1FBQ1gsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFrQixFQUFFLENBQUM7UUFDakMsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQ3hDLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQ25ELENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsR0FBZ0IsQ0FBQztRQUVqRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZCxNQUFNLElBQUksS0FBSyxDQUNkLHlHQUF5RyxDQUN6RyxDQUFDO1FBQ0gsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLE1BQU0sRUFDTCxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQ2hDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sZUFBZSxHQUFHLGlCQUFpQixDQUFDO2dCQUN6QyxLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRztvQkFDdEIsVUFBVTtvQkFDVixTQUFTO2lCQUNUO2dCQUNELE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQWdCLENBQUM7WUFFakQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVyQixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFL0QsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDZCxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsR0FBZ0IsQ0FBQztnQkFFbEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBRXBELEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hELENBQUM7UUFDRixDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FDVixvQ0FBb0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUM1RCxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5BbGxDb2xvclZhbHVlcyB9IGZyb20gJy4uL2NvbG9yLWNvbnZlcnNpb24vY29udmVyc2lvbic7XG5pbXBvcnQgeyBkb20gfSBmcm9tICcuLi9kb20vZG9tLW1haW4nO1xuaW1wb3J0IHsgcGFsZXR0ZUhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzL3BhbGV0dGUnO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi4vaW5kZXgvdHlwZXMnO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSAnLi4vdXRpbHMvY29sb3ItcmFuZG9taXplcic7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vdXRpbHMvY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5Nb25vY2hyb21hdGljUGFsZXR0ZShcblx0bnVtQm94ZXM6IG51bWJlcixcblx0Y3VzdG9tQ29sb3I6IHR5cGVzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdGNvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UgPSAnaGV4J1xuKTogdHlwZXMuQ29sb3JbXSB7XG5cdHRyeSB7XG5cdFx0bGV0IGNsb25lZEN1c3RvbUNvbG9yOiB0eXBlcy5Db2xvciB8IG51bGwgPSBudWxsO1xuXG5cdFx0aWYgKGN1c3RvbUNvbG9yKSB7XG5cdFx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY3VzdG9tQ29sb3IpKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgY3VzdG9tIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY3VzdG9tQ29sb3IpfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRcdGNsb25lZEN1c3RvbUNvbG9yID0gY29yZS5jbG9uZShjdXN0b21Db2xvcik7XG5cdFx0fVxuXG5cdFx0aWYgKG51bUJveGVzIDwgMikge1xuXHRcdFx0d2luZG93LmFsZXJ0KFxuXHRcdFx0XHQnVG8gZ2VuZXJhdGUgYSBtb25vY2hyb21hdGljIHBhbGV0dGUsIHBsZWFzZSBzZWxlY3QgYSBudW1iZXIgb2Ygc3dhdGNoZXMgZ3JlYXRlciB0aGFuIDEnXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29sb3JzOiB0eXBlcy5Db2xvcltdID0gW107XG5cdFx0Y29uc3QgYmFzZUNvbG9yVmFsdWVzID0gZ2VuQWxsQ29sb3JWYWx1ZXMoXG5cdFx0XHRjbG9uZWRDdXN0b21Db2xvciA/PyByYW5kb20ucmFuZG9tQ29sb3IoY29sb3JTcGFjZSlcblx0XHQpO1xuXHRcdGNvbnN0IGJhc2VIU0wgPSBiYXNlQ29sb3JWYWx1ZXMuaHNsIGFzIHR5cGVzLkhTTDtcblxuXHRcdGlmICghYmFzZUhTTCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHQnQ291bGQgbm90IHJldHJpZXZlIEhTTCBjb2xvciBmcm9tIGdlbkFsbENvbG9yVmFsdWVzLiBIU0wgY29sb3IgaXMgcmVxdWlyZWQgZm9yIGEgbW9ub2Nocm9tYXRpYyBwYWxldHRlLidcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29sb3JzLnB1c2goYmFzZUhTTCk7XG5cblx0XHRmb3IgKGxldCBpID0gMTsgaSA8IG51bUJveGVzOyBpKyspIHtcblx0XHRcdGNvbnN0IHtcblx0XHRcdFx0dmFsdWU6IHsgc2F0dXJhdGlvbiwgbGlnaHRuZXNzIH1cblx0XHRcdH0gPSByYW5kb20ucmFuZG9tU0woKTtcblx0XHRcdGNvbnN0IG1vbm9Db2xvclZhbHVlcyA9IGdlbkFsbENvbG9yVmFsdWVzKHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJhc2VIU0wudmFsdWUuaHVlLFxuXHRcdFx0XHRcdHNhdHVyYXRpb24sXG5cdFx0XHRcdFx0bGlnaHRuZXNzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgbW9ub0hTTCA9IG1vbm9Db2xvclZhbHVlcy5oc2wgYXMgdHlwZXMuSFNMO1xuXG5cdFx0XHRjb2xvcnMucHVzaChtb25vSFNMKTtcblxuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29sb3ItYm94LSR7aSArIDF9YCk7XG5cblx0XHRcdGlmIChjb2xvckJveCkge1xuXHRcdFx0XHRjb25zdCBoZXhDb2xvciA9IG1vbm9Db2xvclZhbHVlcy5oZXggYXMgdHlwZXMuSGV4O1xuXG5cdFx0XHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleENvbG9yLnZhbHVlLmhleDtcblxuXHRcdFx0XHRkb20ucG9wdWxhdGVDb2xvclRleHRPdXRwdXRCb3gobW9ub0hTTCwgaSArIDEpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0YEdlbmVyYXRlZCBtb25vY2hyb21hdGljIHBhbGV0dGU6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3JzKX1gXG5cdFx0KTtcblxuXHRcdHJldHVybiBjb2xvcnM7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyBtb25vY2hyb21hdGljIHBhbGV0dGU6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cbiJdfQ==