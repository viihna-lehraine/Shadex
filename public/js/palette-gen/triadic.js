import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { random } from '../utils/color-randomizer.js';
export function genTriadicHues(baseHue) {
    try {
        return [120, 240].map(increment => (baseHue + increment) % 360);
    }
    catch (error) {
        console.error(`Error generating triadic hues: ${error}`);
        return [];
    }
}
export function genTriadicPalette(numBoxes, customColor = null, initialColorSpace = 'hex') {
    try {
        if (numBoxes < 3) {
            window.alert('To generate a triadic palette, please select at least 3 swatches.');
            return [];
        }
        const colors = [];
        const baseColor = customColor ?? random.randomColor(initialColorSpace);
        const baseColorValues = genAllColorValues(baseColor);
        const baseHSL = baseColorValues.hsl;
        if (!baseHSL) {
            throw new Error('Base HSL value is required.');
        }
        colors.push(baseHSL);
        const triadicHues = genTriadicHues(baseHSL.value.hue);
        // generate triadic colors and add to palette
        triadicHues.forEach(hue => {
            const sl = random.randomSL();
            const color = genAllColorValues({
                value: { hue, ...sl.value },
                format: 'hsl'
            }).hsl;
            if (color) {
                colors.push(color);
            }
        });
        // generate additional colors if needed
        while (colors.length < numBoxes) {
            const baseHue = triadicHues[Math.floor(Math.random() * 3)];
            const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360;
            const sl = random.randomSL();
            const additionalColor = genAllColorValues({
                value: { hue, ...sl.value },
                format: 'hsl'
            }).hsl;
            if (additionalColor) {
                colors.push(additionalColor);
            }
        }
        // update the DOM with generated colors
        colors.forEach((color, index) => {
            const colorBox = document.getElementById(`color-box-${index + 1}`);
            if (colorBox) {
                const hexColor = genAllColorValues(color).hex;
                colorBox.style.backgroundColor = hexColor.value.hex;
                dom.populateColorTextOutputBox(color, index + 1);
            }
        });
        return colors;
    }
    catch (error) {
        console.error(`Error generating triadic palette: ${error}`);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpYWRpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlLWdlbi90cmlhZGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbkQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxPQUFlO0lBQzdDLElBQUksQ0FBQztRQUNKLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN6RCxPQUFPLEVBQUUsQ0FBQztJQUNYLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUNoQyxRQUFnQixFQUNoQixjQUFrQyxJQUFJLEVBQ3RDLG9CQUFzQyxLQUFLO0lBRTNDLElBQUksQ0FBQztRQUNKLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsbUVBQW1FLENBQ25FLENBQUM7WUFDRixPQUFPLEVBQUUsQ0FBQztRQUNYLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBa0IsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sU0FBUyxHQUFHLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFdkUsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckQsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQWdCLENBQUM7UUFFakQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXRELDZDQUE2QztRQUM3QyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM3QixNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQztnQkFDL0IsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRTtnQkFDM0IsTUFBTSxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUMsR0FBRyxDQUFDO1lBRVAsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILHVDQUF1QztRQUN2QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDakMsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsTUFBTSxHQUFHLEdBQ1IsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUU1RCxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDN0IsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ3pDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNCLE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUVQLElBQUksZUFBZSxFQUFFLENBQUM7Z0JBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNGLENBQUM7UUFFRCx1Q0FBdUM7UUFDdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkUsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDZCxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFnQixDQUFDO2dCQUMzRCxRQUFRLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDcEQsR0FBRyxDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzVELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5BbGxDb2xvclZhbHVlcyB9IGZyb20gJy4uL2NvbG9yLWNvbnZlcnNpb24vY29udmVyc2lvbic7XG5pbXBvcnQgeyBkb20gfSBmcm9tICcuLi9kb20vZG9tLW1haW4nO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi4vaW5kZXgvdHlwZXMnO1xuaW1wb3J0IHsgcmFuZG9tIH0gZnJvbSAnLi4vdXRpbHMvY29sb3ItcmFuZG9taXplcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5UcmlhZGljSHVlcyhiYXNlSHVlOiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIFsxMjAsIDI0MF0ubWFwKGluY3JlbWVudCA9PiAoYmFzZUh1ZSArIGluY3JlbWVudCkgJSAzNjApO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGdlbmVyYXRpbmcgdHJpYWRpYyBodWVzOiAke2Vycm9yfWApO1xuXHRcdHJldHVybiBbXTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuVHJpYWRpY1BhbGV0dGUoXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdGN1c3RvbUNvbG9yOiB0eXBlcy5Db2xvciB8IG51bGwgPSBudWxsLFxuXHRpbml0aWFsQ29sb3JTcGFjZTogdHlwZXMuQ29sb3JTcGFjZSA9ICdoZXgnXG4pOiB0eXBlcy5Db2xvcltdIHtcblx0dHJ5IHtcblx0XHRpZiAobnVtQm94ZXMgPCAzKSB7XG5cdFx0XHR3aW5kb3cuYWxlcnQoXG5cdFx0XHRcdCdUbyBnZW5lcmF0ZSBhIHRyaWFkaWMgcGFsZXR0ZSwgcGxlYXNlIHNlbGVjdCBhdCBsZWFzdCAzIHN3YXRjaGVzLidcblx0XHRcdCk7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29sb3JzOiB0eXBlcy5Db2xvcltdID0gW107XG5cdFx0Y29uc3QgYmFzZUNvbG9yID0gY3VzdG9tQ29sb3IgPz8gcmFuZG9tLnJhbmRvbUNvbG9yKGluaXRpYWxDb2xvclNwYWNlKTtcblxuXHRcdGNvbnN0IGJhc2VDb2xvclZhbHVlcyA9IGdlbkFsbENvbG9yVmFsdWVzKGJhc2VDb2xvcik7XG5cdFx0Y29uc3QgYmFzZUhTTCA9IGJhc2VDb2xvclZhbHVlcy5oc2wgYXMgdHlwZXMuSFNMO1xuXG5cdFx0aWYgKCFiYXNlSFNMKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Jhc2UgSFNMIHZhbHVlIGlzIHJlcXVpcmVkLicpO1xuXHRcdH1cblxuXHRcdGNvbG9ycy5wdXNoKGJhc2VIU0wpO1xuXG5cdFx0Y29uc3QgdHJpYWRpY0h1ZXMgPSBnZW5UcmlhZGljSHVlcyhiYXNlSFNMLnZhbHVlLmh1ZSk7XG5cblx0XHQvLyBnZW5lcmF0ZSB0cmlhZGljIGNvbG9ycyBhbmQgYWRkIHRvIHBhbGV0dGVcblx0XHR0cmlhZGljSHVlcy5mb3JFYWNoKGh1ZSA9PiB7XG5cdFx0XHRjb25zdCBzbCA9IHJhbmRvbS5yYW5kb21TTCgpO1xuXHRcdFx0Y29uc3QgY29sb3IgPSBnZW5BbGxDb2xvclZhbHVlcyh7XG5cdFx0XHRcdHZhbHVlOiB7IGh1ZSwgLi4uc2wudmFsdWUgfSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkuaHNsO1xuXG5cdFx0XHRpZiAoY29sb3IpIHtcblx0XHRcdFx0Y29sb3JzLnB1c2goY29sb3IpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gZ2VuZXJhdGUgYWRkaXRpb25hbCBjb2xvcnMgaWYgbmVlZGVkXG5cdFx0d2hpbGUgKGNvbG9ycy5sZW5ndGggPCBudW1Cb3hlcykge1xuXHRcdFx0Y29uc3QgYmFzZUh1ZSA9IHRyaWFkaWNIdWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpXTtcblx0XHRcdGNvbnN0IGh1ZSA9XG5cdFx0XHRcdChiYXNlSHVlICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTEpIC0gNSArIDM2MCkgJSAzNjA7XG5cblx0XHRcdGNvbnN0IHNsID0gcmFuZG9tLnJhbmRvbVNMKCk7XG5cdFx0XHRjb25zdCBhZGRpdGlvbmFsQ29sb3IgPSBnZW5BbGxDb2xvclZhbHVlcyh7XG5cdFx0XHRcdHZhbHVlOiB7IGh1ZSwgLi4uc2wudmFsdWUgfSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkuaHNsO1xuXG5cdFx0XHRpZiAoYWRkaXRpb25hbENvbG9yKSB7XG5cdFx0XHRcdGNvbG9ycy5wdXNoKGFkZGl0aW9uYWxDb2xvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHRoZSBET00gd2l0aCBnZW5lcmF0ZWQgY29sb3JzXG5cdFx0Y29sb3JzLmZvckVhY2goKGNvbG9yLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29sb3ItYm94LSR7aW5kZXggKyAxfWApO1xuXHRcdFx0aWYgKGNvbG9yQm94KSB7XG5cdFx0XHRcdGNvbnN0IGhleENvbG9yID0gZ2VuQWxsQ29sb3JWYWx1ZXMoY29sb3IpLmhleCBhcyB0eXBlcy5IZXg7XG5cdFx0XHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleENvbG9yLnZhbHVlLmhleDtcblx0XHRcdFx0ZG9tLnBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94KGNvbG9yLCBpbmRleCArIDEpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGNvbG9ycztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBnZW5lcmF0aW5nIHRyaWFkaWMgcGFsZXR0ZTogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gW107XG5cdH1cbn1cbiJdfQ==