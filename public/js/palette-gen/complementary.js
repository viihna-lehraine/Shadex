import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { paletteHelpers } from '../helpers/palette.js';
import { random } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
export function genComplementaryPalette(numBoxes, customColor = null, colorSpace = 'hex') {
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
            window.alert('To generate a complementary palette, please select a number of swatches greater than 1');
            return [];
        }
        const colors = [];
        const baseColorValues = genAllColorValues(clonedCustomColor ?? random.randomColor(colorSpace));
        const baseHSL = baseColorValues.hsl;
        if (!baseHSL) {
            throw new Error('Base HSL color is missing in the generated values');
        }
        colors.push(baseHSL);
        const complementaryHue = (baseHSL.value.hue + 180) % 360;
        for (let i = 2; i <= numBoxes; i++) {
            const adjustedHSLColor = paletteHelpers.adjustSL({
                value: {
                    hue: complementaryHue,
                    saturation: baseHSL.value.saturation,
                    lightness: baseHSL.value.lightness
                },
                format: 'hsl'
            });
            const complementaryColorValues = genAllColorValues(adjustedHSLColor);
            const complementaryColor = complementaryColorValues[colorSpace];
            if (complementaryColor) {
                colors.push(complementaryColor);
            }
            const colorBox = document.getElementById(`color-box-${i}`);
            if (colorBox) {
                const hexValue = complementaryColorValues.hex;
                colorBox.style.backgroundColor = hexValue
                    ? hexValue.value.hex
                    : '';
                dom.populateColorTextOutputBox(complementaryColor, i);
            }
        }
        console.log(`Generated complementary palette: ${JSON.stringify(colors)}`);
        return colors;
    }
    catch (error) {
        console.error('Error generating complementary palette:', error);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxlbWVudGFyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlLWdlbi9jb21wbGVtZW50YXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckMsTUFBTSxVQUFVLHVCQUF1QixDQUN0QyxRQUFnQixFQUNoQixjQUFrQyxJQUFJLEVBQ3RDLGFBQStCLEtBQUs7SUFFcEMsSUFBSSxDQUFDO1FBQ0osSUFBSSxpQkFBaUIsR0FBdUIsSUFBSSxDQUFDO1FBRWpELElBQUksV0FBVyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxPQUFPLENBQUMsS0FBSyxDQUNaLDhCQUE4QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQzNELENBQUM7Z0JBRUYsT0FBTyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FDWCx3RkFBd0YsQ0FDeEYsQ0FBQztZQUVGLE9BQU8sRUFBRSxDQUFDO1FBQ1gsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVsQixNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FDeEMsaUJBQWlCLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FDbkQsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxHQUFnQixDQUFDO1FBRWpELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQ2QsbURBQW1ELENBQ25ELENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyQixNQUFNLGdCQUFnQixHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXpELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxNQUFNLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hELEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsZ0JBQWdCO29CQUNyQixVQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVO29CQUNwQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTO2lCQUNsQztnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FBQztZQUVILE1BQU0sd0JBQXdCLEdBQzdCLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckMsTUFBTSxrQkFBa0IsR0FBRyx3QkFBd0IsQ0FDbEQsVUFBVSxDQUNLLENBQUM7WUFFakIsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO2dCQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDakMsQ0FBQztZQUVELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTNELElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ2QsTUFBTSxRQUFRLEdBQUcsd0JBQXdCLENBQUMsR0FFOUIsQ0FBQztnQkFDYixRQUFRLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxRQUFRO29CQUN4QyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHO29CQUNwQixDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUVOLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2RCxDQUFDO1FBQ0YsQ0FBQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQ1Ysb0NBQW9DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FDNUQsQ0FBQztRQUVGLE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRSxPQUFPLEVBQUUsQ0FBQztJQUNYLENBQUM7QUFDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2VuQWxsQ29sb3JWYWx1ZXMgfSBmcm9tICcuLi9jb2xvci1jb252ZXJzaW9uL2NvbnZlcnNpb24nO1xuaW1wb3J0IHsgZG9tIH0gZnJvbSAnLi4vZG9tL2RvbS1tYWluJztcbmltcG9ydCB7IHBhbGV0dGVIZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9wYWxldHRlJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXJhbmRvbWl6ZXInO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL3V0aWxzL2NvcmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuQ29tcGxlbWVudGFyeVBhbGV0dGUoXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdGN1c3RvbUNvbG9yOiB0eXBlcy5Db2xvciB8IG51bGwgPSBudWxsLFxuXHRjb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gJ2hleCdcbik6IHR5cGVzLkNvbG9yW10ge1xuXHR0cnkge1xuXHRcdGxldCBjbG9uZWRDdXN0b21Db2xvcjogdHlwZXMuQ29sb3IgfCBudWxsID0gbnVsbDtcblxuXHRcdGlmIChjdXN0b21Db2xvcikge1xuXHRcdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGN1c3RvbUNvbG9yKSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIGN1c3RvbSBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGN1c3RvbUNvbG9yKX1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRjbG9uZWRDdXN0b21Db2xvciA9IGNvcmUuY2xvbmUoY3VzdG9tQ29sb3IpO1xuXHRcdH1cblxuXHRcdGlmIChudW1Cb3hlcyA8IDIpIHtcblx0XHRcdHdpbmRvdy5hbGVydChcblx0XHRcdFx0J1RvIGdlbmVyYXRlIGEgY29tcGxlbWVudGFyeSBwYWxldHRlLCBwbGVhc2Ugc2VsZWN0IGEgbnVtYmVyIG9mIHN3YXRjaGVzIGdyZWF0ZXIgdGhhbiAxJ1xuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9ycyA9IFtdO1xuXG5cdFx0Y29uc3QgYmFzZUNvbG9yVmFsdWVzID0gZ2VuQWxsQ29sb3JWYWx1ZXMoXG5cdFx0XHRjbG9uZWRDdXN0b21Db2xvciA/PyByYW5kb20ucmFuZG9tQ29sb3IoY29sb3JTcGFjZSlcblx0XHQpO1xuXHRcdGNvbnN0IGJhc2VIU0wgPSBiYXNlQ29sb3JWYWx1ZXMuaHNsIGFzIHR5cGVzLkhTTDtcblxuXHRcdGlmICghYmFzZUhTTCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHQnQmFzZSBIU0wgY29sb3IgaXMgbWlzc2luZyBpbiB0aGUgZ2VuZXJhdGVkIHZhbHVlcydcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29sb3JzLnB1c2goYmFzZUhTTCk7XG5cblx0XHRjb25zdCBjb21wbGVtZW50YXJ5SHVlID0gKGJhc2VIU0wudmFsdWUuaHVlICsgMTgwKSAlIDM2MDtcblxuXHRcdGZvciAobGV0IGkgPSAyOyBpIDw9IG51bUJveGVzOyBpKyspIHtcblx0XHRcdGNvbnN0IGFkanVzdGVkSFNMQ29sb3IgPSBwYWxldHRlSGVscGVycy5hZGp1c3RTTCh7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBjb21wbGVtZW50YXJ5SHVlLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJhc2VIU0wudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJhc2VIU0wudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCBjb21wbGVtZW50YXJ5Q29sb3JWYWx1ZXMgPVxuXHRcdFx0XHRnZW5BbGxDb2xvclZhbHVlcyhhZGp1c3RlZEhTTENvbG9yKTtcblx0XHRcdGNvbnN0IGNvbXBsZW1lbnRhcnlDb2xvciA9IGNvbXBsZW1lbnRhcnlDb2xvclZhbHVlc1tcblx0XHRcdFx0Y29sb3JTcGFjZVxuXHRcdFx0XSBhcyB0eXBlcy5Db2xvcjtcblxuXHRcdFx0aWYgKGNvbXBsZW1lbnRhcnlDb2xvcikge1xuXHRcdFx0XHRjb2xvcnMucHVzaChjb21wbGVtZW50YXJ5Q29sb3IpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjb2xvci1ib3gtJHtpfWApO1xuXG5cdFx0XHRpZiAoY29sb3JCb3gpIHtcblx0XHRcdFx0Y29uc3QgaGV4VmFsdWUgPSBjb21wbGVtZW50YXJ5Q29sb3JWYWx1ZXMuaGV4IGFzXG5cdFx0XHRcdFx0fCB0eXBlcy5IZXhcblx0XHRcdFx0XHR8IHVuZGVmaW5lZDtcblx0XHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4VmFsdWVcblx0XHRcdFx0XHQ/IGhleFZhbHVlLnZhbHVlLmhleFxuXHRcdFx0XHRcdDogJyc7XG5cblx0XHRcdFx0ZG9tLnBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94KGNvbXBsZW1lbnRhcnlDb2xvciwgaSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgR2VuZXJhdGVkIGNvbXBsZW1lbnRhcnkgcGFsZXR0ZTogJHtKU09OLnN0cmluZ2lmeShjb2xvcnMpfWBcblx0XHQpO1xuXG5cdFx0cmV0dXJuIGNvbG9ycztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBnZW5lcmF0aW5nIGNvbXBsZW1lbnRhcnkgcGFsZXR0ZTonLCBlcnJvcik7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG4iXX0=