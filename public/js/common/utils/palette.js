// File: src/common/utils/palette.ts
import { core } from '../core.js';
import { helpers } from '../helpers.js';
function createObject(type, items, baseColor, numBoxes, paletteID, enableAlpha, limitBright, limitDark, limitGray) {
    return {
        id: `${type}_${paletteID}`,
        items,
        flags: {
            enableAlpha: enableAlpha,
            limitDark: limitDark,
            limitGray: limitGray,
            limitLight: limitBright
        },
        metadata: {
            numBoxes,
            paletteType: type,
            customColor: {
                hslColor: baseColor,
                convertedColors: items[0]?.colors || {}
            }
        }
    };
}
export function populateOutputBox(color, boxNumber) {
    try {
        const clonedColor = core.isColor(color)
            ? core.clone(color)
            : core.colorStringToColor(color);
        if (!core.validateColorValues(clonedColor)) {
            console.error('Invalid color values.');
            helpers.dom.showToast('Invalid color values.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = core.getCSSColorString(clonedColor);
        console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        console.error('Failed to populate color text output box:', error);
        return;
    }
}
export const palette = { createObject, populateOutputBox };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFHcEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMvQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXJDLFNBQVMsWUFBWSxDQUNwQixJQUFZLEVBQ1osS0FBb0IsRUFDcEIsU0FBYyxFQUNkLFFBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLFdBQW9CLEVBQ3BCLFdBQW9CLEVBQ3BCLFNBQWtCLEVBQ2xCLFNBQWtCO0lBRWxCLE9BQU87UUFDTixFQUFFLEVBQUUsR0FBRyxJQUFJLElBQUksU0FBUyxFQUFFO1FBQzFCLEtBQUs7UUFDTCxLQUFLLEVBQUU7WUFDTixXQUFXLEVBQUUsV0FBVztZQUN4QixTQUFTLEVBQUUsU0FBUztZQUNwQixTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsV0FBVztTQUN2QjtRQUNELFFBQVEsRUFBRTtZQUNULFFBQVE7WUFDUixXQUFXLEVBQUUsSUFBSTtZQUNqQixXQUFXLEVBQUU7Z0JBQ1osUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLEVBQUU7YUFDdkM7U0FDRDtLQUNELENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUNoQyxLQUEwQixFQUMxQixTQUFpQjtJQUVqQixJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDbkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7WUFDNUMsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRXZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFFL0MsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ2pELHlCQUF5QixTQUFTLEVBQUUsQ0FDVCxDQUFDO1FBRTdCLElBQUksQ0FBQyxrQkFBa0I7WUFBRSxPQUFPO1FBRWhDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTdELE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztRQUVyRSxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7UUFDNUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsRSxPQUFPO0lBQ1IsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50c1xuXG5pbXBvcnQgeyBDb2xvciwgQ29sb3JTdHJpbmcsIEhTTCwgUGFsZXR0ZSwgUGFsZXR0ZUl0ZW0gfSBmcm9tICcuLi8uLi9pbmRleCc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdChcblx0dHlwZTogc3RyaW5nLFxuXHRpdGVtczogUGFsZXR0ZUl0ZW1bXSxcblx0YmFzZUNvbG9yOiBIU0wsXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdHBhbGV0dGVJRDogbnVtYmVyLFxuXHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0bGltaXRCcmlnaHQ6IGJvb2xlYW4sXG5cdGxpbWl0RGFyazogYm9vbGVhbixcblx0bGltaXRHcmF5OiBib29sZWFuXG4pOiBQYWxldHRlIHtcblx0cmV0dXJuIHtcblx0XHRpZDogYCR7dHlwZX1fJHtwYWxldHRlSUR9YCxcblx0XHRpdGVtcyxcblx0XHRmbGFnczoge1xuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrOiBsaW1pdERhcmssXG5cdFx0XHRsaW1pdEdyYXk6IGxpbWl0R3JheSxcblx0XHRcdGxpbWl0TGlnaHQ6IGxpbWl0QnJpZ2h0XG5cdFx0fSxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRwYWxldHRlVHlwZTogdHlwZSxcblx0XHRcdGN1c3RvbUNvbG9yOiB7XG5cdFx0XHRcdGhzbENvbG9yOiBiYXNlQ29sb3IsXG5cdFx0XHRcdGNvbnZlcnRlZENvbG9yczogaXRlbXNbMF0/LmNvbG9ycyB8fCB7fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlT3V0cHV0Qm94KFxuXHRjb2xvcjogQ29sb3IgfCBDb2xvclN0cmluZyxcblx0Ym94TnVtYmVyOiBudW1iZXJcbik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yOiBDb2xvciA9IGNvcmUuaXNDb2xvcihjb2xvcilcblx0XHRcdD8gY29yZS5jbG9uZShjb2xvcilcblx0XHRcdDogY29yZS5jb2xvclN0cmluZ1RvQ29sb3IoY29sb3IpO1xuXG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nKTtcblxuXHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXRleHQtb3V0cHV0LWJveC0ke2JveE51bWJlcn1gXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JUZXh0T3V0cHV0Qm94KSByZXR1cm47XG5cblx0XHRjb25zdCBzdHJpbmdpZmllZENvbG9yID0gY29yZS5nZXRDU1NDb2xvclN0cmluZyhjbG9uZWRDb2xvcik7XG5cblx0XHRjb25zb2xlLmxvZyhgQWRkaW5nIENTUy1mb3JtYXR0ZWQgY29sb3IgdG8gRE9NICR7c3RyaW5naWZpZWRDb2xvcn1gKTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveC52YWx1ZSA9IHN0cmluZ2lmaWVkQ29sb3I7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCBjb2xvci5mb3JtYXQpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBwb3B1bGF0ZSBjb2xvciB0ZXh0IG91dHB1dCBib3g6JywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBwYWxldHRlID0geyBjcmVhdGVPYmplY3QsIHBvcHVsYXRlT3V0cHV0Qm94IH07XG4iXX0=