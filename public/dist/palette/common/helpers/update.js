// File: palette/common/helpers/update.js
import { coreUtils, utils } from '../../../common/index.js';
async function colorBox(color, index) {
    const colorBox = document.getElementById(`color-box-${index + 1}`);
    if (colorBox) {
        const colorValues = utils.conversion.genAllColorValues(color);
        const selectedColor = colorValues;
        if (selectedColor) {
            const hslColor = colorValues.hsl;
            const hslCSSString = await coreUtils.convert.colorToCSSColorString(hslColor);
            colorBox.style.backgroundColor = hslCSSString;
            utils.palette.populateOutputBox(selectedColor, index + 1);
        }
    }
}
export const update = { colorBox };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL2hlbHBlcnMvdXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlDQUF5QztBQUd6QyxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTVELEtBQUssVUFBVSxRQUFRLENBQUMsS0FBVSxFQUFFLEtBQWE7SUFDaEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRW5FLElBQUksUUFBUSxFQUFFLENBQUM7UUFDZCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELE1BQU0sYUFBYSxHQUFHLFdBQW9CLENBQUM7UUFFM0MsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNuQixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBVSxDQUFDO1lBQ3hDLE1BQU0sWUFBWSxHQUNqQixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFekQsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDO1lBRTlDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzRCxDQUFDO0lBQ0YsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxRQUFRLEVBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHBhbGV0dGUvY29tbW9uL2hlbHBlcnMvdXBkYXRlLmpzXG5cbmltcG9ydCB7IENvbG9yLCBIU0wgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlVXRpbHMsIHV0aWxzIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2luZGV4LmpzJztcblxuYXN5bmMgZnVuY3Rpb24gY29sb3JCb3goY29sb3I6IEhTTCwgaW5kZXg6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuXHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjb2xvci1ib3gtJHtpbmRleCArIDF9YCk7XG5cblx0aWYgKGNvbG9yQm94KSB7XG5cdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSB1dGlscy5jb252ZXJzaW9uLmdlbkFsbENvbG9yVmFsdWVzKGNvbG9yKTtcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yID0gY29sb3JWYWx1ZXMgYXMgQ29sb3I7XG5cblx0XHRpZiAoc2VsZWN0ZWRDb2xvcikge1xuXHRcdFx0Y29uc3QgaHNsQ29sb3IgPSBjb2xvclZhbHVlcy5oc2wgYXMgSFNMO1xuXHRcdFx0Y29uc3QgaHNsQ1NTU3RyaW5nID1cblx0XHRcdFx0YXdhaXQgY29yZVV0aWxzLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nKGhzbENvbG9yKTtcblxuXHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaHNsQ1NTU3RyaW5nO1xuXG5cdFx0XHR1dGlscy5wYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KHNlbGVjdGVkQ29sb3IsIGluZGV4ICsgMSk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGUgPSB7IGNvbG9yQm94IH0gYXMgY29uc3Q7XG4iXX0=