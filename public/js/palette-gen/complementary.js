import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { paletteHelpers } from '../helpers/palette.js';
import { random } from '../utils/color-randomizer.js';
export function genComplementaryPalette(numBoxes, baseColor = null, initialColorSpace = 'hex') {
    try {
        if (numBoxes < 2) {
            window.alert('To generate a complementary palette, please select a number of swatches greater than 1');
            return [];
        }
        const colors = [];
        const baseColorValues = genAllColorValues(baseColor ?? random.randomColor(initialColorSpace));
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
            const complementaryColor = complementaryColorValues[initialColorSpace];
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
        return colors;
    }
    catch (error) {
        console.error('Error generating complementary palette:', error);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxlbWVudGFyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlLWdlbi9jb21wbGVtZW50YXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRW5ELE1BQU0sVUFBVSx1QkFBdUIsQ0FDdEMsUUFBZ0IsRUFDaEIsWUFBZ0MsSUFBSSxFQUNwQyxvQkFBc0MsS0FBSztJQUUzQyxJQUFJLENBQUM7UUFDSixJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsS0FBSyxDQUNYLHdGQUF3RixDQUN4RixDQUFDO1lBRUYsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWxCLE1BQU0sZUFBZSxHQUFHLGlCQUFpQixDQUN4QyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUNsRCxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQWdCLENBQUM7UUFFakQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDZCxtREFBbUQsQ0FDbkQsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFekQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQztnQkFDaEQsS0FBSyxFQUFFO29CQUNOLEdBQUcsRUFBRSxnQkFBZ0I7b0JBQ3JCLFVBQVUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVU7b0JBQ3BDLFNBQVMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVM7aUJBQ2xDO2dCQUNELE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDO1lBRUgsTUFBTSx3QkFBd0IsR0FDN0IsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNyQyxNQUFNLGtCQUFrQixHQUFHLHdCQUF3QixDQUNsRCxpQkFBaUIsQ0FDRixDQUFDO1lBRWpCLElBQUksa0JBQWtCLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFFRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUUzRCxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNkLE1BQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDLEdBRTlCLENBQUM7Z0JBQ2IsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsUUFBUTtvQkFDeEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRztvQkFDcEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFFTixHQUFHLENBQUMsMEJBQTBCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkQsQ0FBQztRQUNGLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMseUNBQXlDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEUsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbkFsbENvbG9yVmFsdWVzIH0gZnJvbSAnLi4vY29sb3ItY29udmVyc2lvbi9jb252ZXJzaW9uJztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4uL2RvbS9kb20tbWFpbic7XG5pbXBvcnQgeyBwYWxldHRlSGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvcGFsZXR0ZSc7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuLi9pbmRleC90eXBlcyc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbkNvbXBsZW1lbnRhcnlQYWxldHRlKFxuXHRudW1Cb3hlczogbnVtYmVyLFxuXHRiYXNlQ29sb3I6IHR5cGVzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdGluaXRpYWxDb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gJ2hleCdcbik6IHR5cGVzLkNvbG9yW10ge1xuXHR0cnkge1xuXHRcdGlmIChudW1Cb3hlcyA8IDIpIHtcblx0XHRcdHdpbmRvdy5hbGVydChcblx0XHRcdFx0J1RvIGdlbmVyYXRlIGEgY29tcGxlbWVudGFyeSBwYWxldHRlLCBwbGVhc2Ugc2VsZWN0IGEgbnVtYmVyIG9mIHN3YXRjaGVzIGdyZWF0ZXIgdGhhbiAxJ1xuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9ycyA9IFtdO1xuXG5cdFx0Y29uc3QgYmFzZUNvbG9yVmFsdWVzID0gZ2VuQWxsQ29sb3JWYWx1ZXMoXG5cdFx0XHRiYXNlQ29sb3IgPz8gcmFuZG9tLnJhbmRvbUNvbG9yKGluaXRpYWxDb2xvclNwYWNlKVxuXHRcdCk7XG5cdFx0Y29uc3QgYmFzZUhTTCA9IGJhc2VDb2xvclZhbHVlcy5oc2wgYXMgdHlwZXMuSFNMO1xuXG5cdFx0aWYgKCFiYXNlSFNMKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCdCYXNlIEhTTCBjb2xvciBpcyBtaXNzaW5nIGluIHRoZSBnZW5lcmF0ZWQgdmFsdWVzJ1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb2xvcnMucHVzaChiYXNlSFNMKTtcblxuXHRcdGNvbnN0IGNvbXBsZW1lbnRhcnlIdWUgPSAoYmFzZUhTTC52YWx1ZS5odWUgKyAxODApICUgMzYwO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDI7IGkgPD0gbnVtQm94ZXM7IGkrKykge1xuXHRcdFx0Y29uc3QgYWRqdXN0ZWRIU0xDb2xvciA9IHBhbGV0dGVIZWxwZXJzLmFkanVzdFNMKHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGNvbXBsZW1lbnRhcnlIdWUsXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYmFzZUhTTC52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYmFzZUhTTC52YWx1ZS5saWdodG5lc3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSk7XG5cblx0XHRcdGNvbnN0IGNvbXBsZW1lbnRhcnlDb2xvclZhbHVlcyA9XG5cdFx0XHRcdGdlbkFsbENvbG9yVmFsdWVzKGFkanVzdGVkSFNMQ29sb3IpO1xuXHRcdFx0Y29uc3QgY29tcGxlbWVudGFyeUNvbG9yID0gY29tcGxlbWVudGFyeUNvbG9yVmFsdWVzW1xuXHRcdFx0XHRpbml0aWFsQ29sb3JTcGFjZVxuXHRcdFx0XSBhcyB0eXBlcy5Db2xvcjtcblxuXHRcdFx0aWYgKGNvbXBsZW1lbnRhcnlDb2xvcikge1xuXHRcdFx0XHRjb2xvcnMucHVzaChjb21wbGVtZW50YXJ5Q29sb3IpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjb2xvci1ib3gtJHtpfWApO1xuXG5cdFx0XHRpZiAoY29sb3JCb3gpIHtcblx0XHRcdFx0Y29uc3QgaGV4VmFsdWUgPSBjb21wbGVtZW50YXJ5Q29sb3JWYWx1ZXMuaGV4IGFzXG5cdFx0XHRcdFx0fCB0eXBlcy5IZXhcblx0XHRcdFx0XHR8IHVuZGVmaW5lZDtcblx0XHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4VmFsdWVcblx0XHRcdFx0XHQ/IGhleFZhbHVlLnZhbHVlLmhleFxuXHRcdFx0XHRcdDogJyc7XG5cblx0XHRcdFx0ZG9tLnBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94KGNvbXBsZW1lbnRhcnlDb2xvciwgaSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbG9ycztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBnZW5lcmF0aW5nIGNvbXBsZW1lbnRhcnkgcGFsZXR0ZTonLCBlcnJvcik7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG4iXX0=