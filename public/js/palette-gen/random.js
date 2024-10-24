import { genAllColorValues } from '../color-conversion/conversion.js';
import { random } from '../utils/color-randomizer.js';
export function genRandomPalette(numBoxes, customColor = null, initialColorSpace = 'hex') {
    try {
        const colors = [];
        for (let i = 0; i < numBoxes; i++) {
            const colorValues = i === 0 && customColor
                ? genAllColorValues(customColor)
                : genAllColorValues(random.randomColor(initialColorSpace));
            const selectedColor = colorValues[initialColorSpace];
            if (selectedColor) {
                colors.push(selectedColor);
            }
            else {
                console.warn(`Skipping color at index ${i} due to missing ${initialColorSpace} value.`);
            }
        }
        return colors;
    }
    catch (error) {
        console.error(`Error generating random palette: ${error}`);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhbGV0dGUtZ2VuL3JhbmRvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVuRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbkQsTUFBTSxVQUFVLGdCQUFnQixDQUMvQixRQUFnQixFQUNoQixjQUFrQyxJQUFJLEVBQ3RDLG9CQUFzQyxLQUFLO0lBRTNDLElBQUksQ0FBQztRQUNKLE1BQU0sTUFBTSxHQUFrQixFQUFFLENBQUM7UUFFakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLE1BQU0sV0FBVyxHQUNoQixDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVc7Z0JBQ3JCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUU3RCxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVyRCxJQUFJLGFBQWEsRUFBRSxDQUFDO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVCLENBQUM7aUJBQU0sQ0FBQztnQkFDUCxPQUFPLENBQUMsSUFBSSxDQUNYLDJCQUEyQixDQUFDLG1CQUFtQixpQkFBaUIsU0FBUyxDQUN6RSxDQUFDO1lBQ0gsQ0FBQztRQUNGLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDM0QsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbkFsbENvbG9yVmFsdWVzIH0gZnJvbSAnLi4vY29sb3ItY29udmVyc2lvbi9jb252ZXJzaW9uJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IHJhbmRvbSB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXJhbmRvbWl6ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuUmFuZG9tUGFsZXR0ZShcblx0bnVtQm94ZXM6IG51bWJlcixcblx0Y3VzdG9tQ29sb3I6IHR5cGVzLkNvbG9yIHwgbnVsbCA9IG51bGwsXG5cdGluaXRpYWxDb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gJ2hleCdcbik6IHR5cGVzLkNvbG9yW10ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yczogdHlwZXMuQ29sb3JbXSA9IFtdO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1Cb3hlczsgaSsrKSB7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9XG5cdFx0XHRcdGkgPT09IDAgJiYgY3VzdG9tQ29sb3Jcblx0XHRcdFx0XHQ/IGdlbkFsbENvbG9yVmFsdWVzKGN1c3RvbUNvbG9yKVxuXHRcdFx0XHRcdDogZ2VuQWxsQ29sb3JWYWx1ZXMocmFuZG9tLnJhbmRvbUNvbG9yKGluaXRpYWxDb2xvclNwYWNlKSk7XG5cblx0XHRcdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSBjb2xvclZhbHVlc1tpbml0aWFsQ29sb3JTcGFjZV07XG5cblx0XHRcdGlmIChzZWxlY3RlZENvbG9yKSB7XG5cdFx0XHRcdGNvbG9ycy5wdXNoKHNlbGVjdGVkQ29sb3IpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdGBTa2lwcGluZyBjb2xvciBhdCBpbmRleCAke2l9IGR1ZSB0byBtaXNzaW5nICR7aW5pdGlhbENvbG9yU3BhY2V9IHZhbHVlLmBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY29sb3JzO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGdlbmVyYXRpbmcgcmFuZG9tIHBhbGV0dGU6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG4iXX0=