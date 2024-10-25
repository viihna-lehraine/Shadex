import { genAllColorValues } from '../color-conversion/conversion.js';
import { paletteHelpers } from '../helpers/palette.js';
import { random } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
export function genRandomPalette(numBoxes, customColor = null, colorSpace = 'hex') {
    try {
        let clonedCustomColor = null;
        if (customColor) {
            if (!paletteHelpers.validateColorValues(customColor)) {
                console.error(`Invalid custom color value ${JSON.stringify(customColor)}`);
                return [];
            }
            clonedCustomColor = core.clone(customColor);
        }
        const colors = [];
        for (let i = 0; i < numBoxes; i++) {
            const colorValues = i === 0 && clonedCustomColor
                ? genAllColorValues(clonedCustomColor)
                : genAllColorValues(random.randomColor(colorSpace));
            const selectedColor = colorValues[colorSpace];
            if (selectedColor) {
                colors.push(selectedColor);
            }
            else {
                console.warn(`Skipping color at index ${i} due to missing ${colorSpace} value.`);
            }
        }
        console.log(`Generated random palette: ${JSON.stringify(colors)}`);
        return colors;
    }
    catch (error) {
        console.error(`Error generating random palette: ${error}`);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhbGV0dGUtZ2VuL3JhbmRvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckMsTUFBTSxVQUFVLGdCQUFnQixDQUMvQixRQUFnQixFQUNoQixjQUFrQyxJQUFJLEVBQ3RDLGFBQStCLEtBQUs7SUFFcEMsSUFBSSxDQUFDO1FBQ0osSUFBSSxpQkFBaUIsR0FBdUIsSUFBSSxDQUFDO1FBRWpELElBQUksV0FBVyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxPQUFPLENBQUMsS0FBSyxDQUNaLDhCQUE4QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQzNELENBQUM7Z0JBRUYsT0FBTyxFQUFFLENBQUM7WUFDWCxDQUFDO1lBRUQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQWtCLEVBQUUsQ0FBQztRQUVqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsTUFBTSxXQUFXLEdBQ2hCLENBQUMsS0FBSyxDQUFDLElBQUksaUJBQWlCO2dCQUMzQixDQUFDLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTlDLElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDNUIsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQ1gsMkJBQTJCLENBQUMsbUJBQW1CLFVBQVUsU0FBUyxDQUNsRSxDQUFDO1lBQ0gsQ0FBQztRQUNGLENBQUM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRSxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFM0QsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbkFsbENvbG9yVmFsdWVzIH0gZnJvbSAnLi4vY29sb3ItY29udmVyc2lvbi9jb252ZXJzaW9uJztcbmltcG9ydCB7IHBhbGV0dGVIZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9wYWxldHRlJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXJhbmRvbWl6ZXInO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL3V0aWxzL2NvcmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuUmFuZG9tUGFsZXR0ZShcblx0bnVtQm94ZXM6IG51bWJlcixcblx0Y3VzdG9tQ29sb3I6IHR5cGVzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdGNvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UgPSAnaGV4J1xuKTogdHlwZXMuQ29sb3JbXSB7XG5cdHRyeSB7XG5cdFx0bGV0IGNsb25lZEN1c3RvbUNvbG9yOiB0eXBlcy5Db2xvciB8IG51bGwgPSBudWxsO1xuXG5cdFx0aWYgKGN1c3RvbUNvbG9yKSB7XG5cdFx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY3VzdG9tQ29sb3IpKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgY3VzdG9tIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY3VzdG9tQ29sb3IpfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRcdGNsb25lZEN1c3RvbUNvbG9yID0gY29yZS5jbG9uZShjdXN0b21Db2xvcik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29sb3JzOiB0eXBlcy5Db2xvcltdID0gW107XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bUJveGVzOyBpKyspIHtcblx0XHRcdGNvbnN0IGNvbG9yVmFsdWVzID1cblx0XHRcdFx0aSA9PT0gMCAmJiBjbG9uZWRDdXN0b21Db2xvclxuXHRcdFx0XHRcdD8gZ2VuQWxsQ29sb3JWYWx1ZXMoY2xvbmVkQ3VzdG9tQ29sb3IpXG5cdFx0XHRcdFx0OiBnZW5BbGxDb2xvclZhbHVlcyhyYW5kb20ucmFuZG9tQ29sb3IoY29sb3JTcGFjZSkpO1xuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IGNvbG9yVmFsdWVzW2NvbG9yU3BhY2VdO1xuXG5cdFx0XHRpZiAoc2VsZWN0ZWRDb2xvcikge1xuXHRcdFx0XHRjb2xvcnMucHVzaChzZWxlY3RlZENvbG9yKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0XHRgU2tpcHBpbmcgY29sb3IgYXQgaW5kZXggJHtpfSBkdWUgdG8gbWlzc2luZyAke2NvbG9yU3BhY2V9IHZhbHVlLmBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZyhgR2VuZXJhdGVkIHJhbmRvbSBwYWxldHRlOiAke0pTT04uc3RyaW5naWZ5KGNvbG9ycyl9YCk7XG5cblx0XHRyZXR1cm4gY29sb3JzO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGdlbmVyYXRpbmcgcmFuZG9tIHBhbGV0dGU6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cbiJdfQ==