import { colorUtils } from './color-utils.js';
import { commonUtils } from './common-utils.js';
import { core } from './core-utils.js';
import { notification } from '../helpers/notification.js';
function createPaletteObject(type, items, baseColor, numBoxes, paletteID, enableAlpha, limitBright, limitDark, limitGray) {
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
function populateColorTextOutputBox(color, boxNumber) {
    try {
        const clonedColor = colorUtils.isColor(color)
            ? core.clone(color)
            : colorUtils.colorStringToColor(color);
        if (!commonUtils.validateColorValues(clonedColor)) {
            console.error('Invalid color values.');
            notification.showToast('Invalid color values.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = colorUtils.getCSSColorString(clonedColor);
        console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        console.error('Failed to populate color text output box:', error);
        return;
    }
}
export const paletteUtils = {
    createPaletteObject,
    populateColorTextOutputBox
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9wYWxldHRlLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFJcEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXZELFNBQVMsbUJBQW1CLENBQzNCLElBQVksRUFDWixLQUE0QixFQUM1QixTQUFxQixFQUNyQixRQUFnQixFQUNoQixTQUFpQixFQUNqQixXQUFvQixFQUNwQixXQUFvQixFQUNwQixTQUFrQixFQUNsQixTQUFrQjtJQUVsQixPQUFPO1FBQ04sRUFBRSxFQUFFLEdBQUcsSUFBSSxJQUFJLFNBQVMsRUFBRTtRQUMxQixLQUFLO1FBQ0wsS0FBSyxFQUFFO1lBQ04sV0FBVyxFQUFFLFdBQVc7WUFDeEIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLFdBQVc7U0FDdkI7UUFDRCxRQUFRLEVBQUU7WUFDVCxRQUFRO1lBQ1IsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFO2dCQUNaLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxFQUFFO2FBQ3ZDO1NBQ0Q7S0FDRCxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsMEJBQTBCLENBQ2xDLEtBQXdDLEVBQ3hDLFNBQWlCO0lBRWpCLElBQUksQ0FBQztRQUNKLE1BQU0sV0FBVyxHQUFpQixVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUMxRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDbkIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7WUFDbkQsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRXZDLFlBQVksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUVoRCxPQUFPO1FBQ1IsQ0FBQztRQUVELE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDakQseUJBQXlCLFNBQVMsRUFBRSxDQUNULENBQUM7UUFFN0IsSUFBSSxDQUFDLGtCQUFrQjtZQUFFLE9BQU87UUFFaEMsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLGtCQUFrQixDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztRQUM1QyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxFLE9BQU87SUFDUixDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBMkI7SUFDbkQsbUJBQW1CO0lBQ25CLDBCQUEwQjtDQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29sb3JVdGlscyB9IGZyb20gJy4vY29sb3ItdXRpbHMnO1xuaW1wb3J0IHsgY29tbW9uVXRpbHMgfSBmcm9tICcuL2NvbW1vbi11dGlscyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi9jb3JlLXV0aWxzJztcbmltcG9ydCAqIGFzIGNvbG9ycyBmcm9tICcuLi9pbmRleC9jb2xvcnMnO1xuaW1wb3J0ICogYXMgZm5PYmplY3RzIGZyb20gJy4uL2luZGV4L2ZuLW9iamVjdHMnO1xuaW1wb3J0ICogYXMgcGFsZXR0ZSBmcm9tICcuLi9pbmRleC9wYWxldHRlJztcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL2hlbHBlcnMvbm90aWZpY2F0aW9uJztcblxuZnVuY3Rpb24gY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0dHlwZTogc3RyaW5nLFxuXHRpdGVtczogcGFsZXR0ZS5QYWxldHRlSXRlbVtdLFxuXHRiYXNlQ29sb3I6IGNvbG9ycy5IU0wsXG5cdG51bUJveGVzOiBudW1iZXIsXG5cdHBhbGV0dGVJRDogbnVtYmVyLFxuXHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0bGltaXRCcmlnaHQ6IGJvb2xlYW4sXG5cdGxpbWl0RGFyazogYm9vbGVhbixcblx0bGltaXRHcmF5OiBib29sZWFuXG4pOiBwYWxldHRlLlBhbGV0dGUge1xuXHRyZXR1cm4ge1xuXHRcdGlkOiBgJHt0eXBlfV8ke3BhbGV0dGVJRH1gLFxuXHRcdGl0ZW1zLFxuXHRcdGZsYWdzOiB7XG5cdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcms6IGxpbWl0RGFyayxcblx0XHRcdGxpbWl0R3JheTogbGltaXRHcmF5LFxuXHRcdFx0bGltaXRMaWdodDogbGltaXRCcmlnaHRcblx0XHR9LFxuXHRcdG1ldGFkYXRhOiB7XG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdHBhbGV0dGVUeXBlOiB0eXBlLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IHtcblx0XHRcdFx0aHNsQ29sb3I6IGJhc2VDb2xvcixcblx0XHRcdFx0Y29udmVydGVkQ29sb3JzOiBpdGVtc1swXT8uY29sb3JzIHx8IHt9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveChcblx0Y29sb3I6IGNvbG9ycy5Db2xvciB8IGNvbG9ycy5Db2xvclN0cmluZyxcblx0Ym94TnVtYmVyOiBudW1iZXJcbik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yOiBjb2xvcnMuQ29sb3IgPSBjb2xvclV0aWxzLmlzQ29sb3IoY29sb3IpXG5cdFx0XHQ/IGNvcmUuY2xvbmUoY29sb3IpXG5cdFx0XHQ6IGNvbG9yVXRpbHMuY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yKTtcblxuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhjbG9uZWRDb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdWVzLicpO1xuXG5cdFx0XHRub3RpZmljYXRpb24uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXRleHQtb3V0cHV0LWJveC0ke2JveE51bWJlcn1gXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JUZXh0T3V0cHV0Qm94KSByZXR1cm47XG5cblx0XHRjb25zdCBzdHJpbmdpZmllZENvbG9yID0gY29sb3JVdGlscy5nZXRDU1NDb2xvclN0cmluZyhjbG9uZWRDb2xvcik7XG5cblx0XHRjb25zb2xlLmxvZyhgQWRkaW5nIENTUy1mb3JtYXR0ZWQgY29sb3IgdG8gRE9NICR7c3RyaW5naWZpZWRDb2xvcn1gKTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveC52YWx1ZSA9IHN0cmluZ2lmaWVkQ29sb3I7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCBjb2xvci5mb3JtYXQpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBwb3B1bGF0ZSBjb2xvciB0ZXh0IG91dHB1dCBib3g6JywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBwYWxldHRlVXRpbHM6IGZuT2JqZWN0cy5QYWxldHRlVXRpbHMgPSB7XG5cdGNyZWF0ZVBhbGV0dGVPYmplY3QsXG5cdHBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94XG59O1xuIl19