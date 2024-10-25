import { convert } from './conversion-index.js';
import { paletteHelpers } from '../helpers/palette.js';
import { core } from '../utils/core.js';
import { defaults } from '../utils/defaults.js';
function cmykToLAB(cmyk) {
    try {
        if (!paletteHelpers.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.defaultLAB());
        }
        const rgb = convert.cmykToRGB(core.clone(cmyk));
        const xyz = convert.rgbToXYZ(rgb);
        return xyzToLAB(xyz);
    }
    catch (error) {
        console.error(`cmykToLab() error: ${error}`);
        return core.clone(defaults.defaultLAB());
    }
}
function hexToLAB(hex) {
    try {
        if (!paletteHelpers.validateColorValues(hex)) {
            console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.defaultLAB());
        }
        const rgb = convert.hexToRGB(core.clone(hex));
        const xyz = convert.rgbToXYZ(rgb);
        return xyzToLAB(xyz);
    }
    catch (error) {
        console.error(`hexToLAB() error: ${error}`);
        return core.clone(defaults.defaultLAB());
    }
}
function hslToLAB(hsl) {
    try {
        if (!paletteHelpers.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.defaultLAB());
        }
        const rgb = convert.hslToRGB(core.clone(hsl));
        const xyz = convert.rgbToXYZ(rgb);
        return xyzToLAB(xyz);
    }
    catch (error) {
        console.error(`hslToLab() error: ${error}`);
        return core.clone(defaults.defaultLAB());
    }
}
function hsvToLAB(hsv) {
    try {
        if (!paletteHelpers.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.defaultLAB());
        }
        const rgb = convert.hsvToRGB(core.clone(hsv));
        const xyz = convert.rgbToXYZ(rgb);
        return xyzToLAB(xyz);
    }
    catch (error) {
        console.error(`hsvToLab() error: ${error}`);
        return core.clone(defaults.defaultLAB());
    }
}
function rgbToLAB(rgb) {
    try {
        if (!paletteHelpers.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.defaultLAB());
        }
        const xyz = convert.rgbToXYZ(core.clone(rgb));
        return xyzToLAB(xyz);
    }
    catch (error) {
        console.error(`rgbToLab() error: ${error}`);
        return defaults.defaultLAB();
    }
}
function xyzToLAB(xyz) {
    try {
        if (!paletteHelpers.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.defaultLAB());
        }
        const clonedXYZ = core.clone(xyz);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        clonedXYZ.value.x = clonedXYZ.value.x / refX;
        clonedXYZ.value.y = clonedXYZ.value.y / refY;
        clonedXYZ.value.z = clonedXYZ.value.z / refZ;
        clonedXYZ.value.x =
            clonedXYZ.value.x > 0.008856
                ? Math.pow(clonedXYZ.value.x, 1 / 3)
                : 7.787 * clonedXYZ.value.x + 16 / 116;
        clonedXYZ.value.y =
            clonedXYZ.value.y > 0.008856
                ? Math.pow(clonedXYZ.value.y, 1 / 3)
                : 7.787 * clonedXYZ.value.y + 16 / 116;
        clonedXYZ.value.z =
            clonedXYZ.value.z > 0.008856
                ? Math.pow(clonedXYZ.value.z, 1 / 3)
                : 7.787 * clonedXYZ.value.z + 16 / 116;
        const l = parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2));
        const a = parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2));
        const b = parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2));
        return { value: { l, a, b }, format: 'lab' };
    }
    catch (error) {
        console.error(`xyzToLab() error: ${error}`);
        return core.clone(defaults.defaultLAB());
    }
}
export const toLAB = {
    cmykToLAB,
    hexToLAB,
    hslToLAB,
    hsvToLAB,
    rgbToLAB,
    xyzToLAB
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9MQUIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29sb3ItY29udmVyc2lvbi90b0xBQi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDN0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3BELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTdDLFNBQVMsU0FBUyxDQUFDLElBQWdCO0lBQ2xDLElBQUksQ0FBQztRQUNKLElBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMvQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNCQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUU1RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbEMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLFFBQVEs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VUFBVSxDQUFDLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FDbkIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUMxRCxDQUFDO1FBQ0YsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUNuQixDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQzFELENBQUM7UUFFRixPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU1QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQW9CO0lBQ3JDLFNBQVM7SUFDVCxRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb252ZXJ0IH0gZnJvbSAnLi9jb252ZXJzaW9uLWluZGV4JztcbmltcG9ydCB7IHBhbGV0dGVIZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9wYWxldHRlJztcbmltcG9ydCAqIGFzIGZuT2JqZWN0cyBmcm9tICcuLi9pbmRleC9mbi1vYmplY3RzJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IGNvcmUgfSBmcm9tICcuLi91dGlscy9jb3JlJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vdXRpbHMvZGVmYXVsdHMnO1xuXG5mdW5jdGlvbiBjbXlrVG9MQUIoY215azogdHlwZXMuQ01ZSyk6IHR5cGVzLkxBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNteWspKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdExBQigpKTtcblx0XHR9XG5cblx0XHRjb25zdCByZ2IgPSBjb252ZXJ0LmNteWtUb1JHQihjb3JlLmNsb25lKGNteWspKTtcblx0XHRjb25zdCB4eXogPSBjb252ZXJ0LnJnYlRvWFlaKHJnYik7XG5cblx0XHRyZXR1cm4geHl6VG9MQUIoeHl6KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBjbXlrVG9MYWIoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRMQUIoKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9MQUIoaGV4OiB0eXBlcy5IZXgpOiB0eXBlcy5MQUIge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhoZXgpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRMQUIoKSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmdiID0gY29udmVydC5oZXhUb1JHQihjb3JlLmNsb25lKGhleCkpO1xuXHRcdGNvbnN0IHh5eiA9IGNvbnZlcnQucmdiVG9YWVoocmdiKTtcblxuXHRcdHJldHVybiB4eXpUb0xBQih4eXopO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhleFRvTEFCKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0TEFCKCkpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvTEFCKGhzbDogdHlwZXMuSFNMKTogdHlwZXMuTEFCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXBhbGV0dGVIZWxwZXJzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5kZWZhdWx0TEFCKCkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJnYiA9IGNvbnZlcnQuaHNsVG9SR0IoY29yZS5jbG9uZShoc2wpKTtcblx0XHRjb25zdCB4eXogPSBjb252ZXJ0LnJnYlRvWFlaKHJnYik7XG5cblx0XHRyZXR1cm4geHl6VG9MQUIoeHl6KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoc2xUb0xhYigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdExBQigpKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc3ZUb0xBQihoc3Y6IHR5cGVzLkhTVik6IHR5cGVzLkxBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzdikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNWIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHN2KX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdExBQigpKTtcblx0XHR9XG5cblx0XHRjb25zdCByZ2IgPSBjb252ZXJ0LmhzdlRvUkdCKGNvcmUuY2xvbmUoaHN2KSk7XG5cdFx0Y29uc3QgeHl6ID0gY29udmVydC5yZ2JUb1hZWihyZ2IpO1xuXG5cdFx0cmV0dXJuIHh5elRvTEFCKHh5eik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgaHN2VG9MYWIoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRMQUIoKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9MQUIocmdiOiB0eXBlcy5SR0IpOiB0eXBlcy5MQUIge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRMQUIoKSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeHl6ID0gY29udmVydC5yZ2JUb1hZWihjb3JlLmNsb25lKHJnYikpO1xuXG5cdFx0cmV0dXJuIHh5elRvTEFCKHh5eik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcmdiVG9MYWIoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0cy5kZWZhdWx0TEFCKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9MQUIoeHl6OiB0eXBlcy5YWVopOiB0eXBlcy5MQUIge1xuXHR0cnkge1xuXHRcdGlmICghcGFsZXR0ZUhlbHBlcnMudmFsaWRhdGVDb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRMQUIoKSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkWFlaID0gY29yZS5jbG9uZSh4eXopO1xuXG5cdFx0Y29uc3QgcmVmWCA9IDk1LjA0Nyxcblx0XHRcdHJlZlkgPSAxMDAuMCxcblx0XHRcdHJlZlogPSAxMDguODgzO1xuXG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnggPSBjbG9uZWRYWVoudmFsdWUueCAvIHJlZlg7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPSBjbG9uZWRYWVoudmFsdWUueSAvIHJlZlk7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnogPSBjbG9uZWRYWVoudmFsdWUueiAvIHJlZlo7XG5cblx0XHRjbG9uZWRYWVoudmFsdWUueCA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gTWF0aC5wb3coY2xvbmVkWFlaLnZhbHVlLngsIDEgLyAzKVxuXHRcdFx0XHQ6IDcuNzg3ICogY2xvbmVkWFlaLnZhbHVlLnggKyAxNiAvIDExNjtcblx0XHRjbG9uZWRYWVoudmFsdWUueSA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueSA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gTWF0aC5wb3coY2xvbmVkWFlaLnZhbHVlLnksIDEgLyAzKVxuXHRcdFx0XHQ6IDcuNzg3ICogY2xvbmVkWFlaLnZhbHVlLnkgKyAxNiAvIDExNjtcblx0XHRjbG9uZWRYWVoudmFsdWUueiA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueiA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gTWF0aC5wb3coY2xvbmVkWFlaLnZhbHVlLnosIDEgLyAzKVxuXHRcdFx0XHQ6IDcuNzg3ICogY2xvbmVkWFlaLnZhbHVlLnogKyAxNiAvIDExNjtcblxuXHRcdGNvbnN0IGwgPSBwYXJzZUZsb2F0KCgxMTYgKiBjbG9uZWRYWVoudmFsdWUueSAtIDE2KS50b0ZpeGVkKDIpKTtcblx0XHRjb25zdCBhID0gcGFyc2VGbG9hdChcblx0XHRcdCg1MDAgKiAoY2xvbmVkWFlaLnZhbHVlLnggLSBjbG9uZWRYWVoudmFsdWUueSkpLnRvRml4ZWQoMilcblx0XHQpO1xuXHRcdGNvbnN0IGIgPSBwYXJzZUZsb2F0KFxuXHRcdFx0KDIwMCAqIChjbG9uZWRYWVoudmFsdWUueSAtIGNsb25lZFhZWi52YWx1ZS56KSkudG9GaXhlZCgyKVxuXHRcdCk7XG5cblx0XHRyZXR1cm4geyB2YWx1ZTogeyBsLCBhLCBiIH0sIGZvcm1hdDogJ2xhYicgfTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGB4eXpUb0xhYigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuZGVmYXVsdExBQigpKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgdG9MQUI6IGZuT2JqZWN0cy5Ub0xBQiA9IHtcblx0Y215a1RvTEFCLFxuXHRoZXhUb0xBQixcblx0aHNsVG9MQUIsXG5cdGhzdlRvTEFCLFxuXHRyZ2JUb0xBQixcblx0eHl6VG9MQUJcbn07XG4iXX0=