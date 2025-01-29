// File: palette/common/superUtils/create.js
import { coreConversionUtils, coreUtils, utils } from '../../../common/index.js';
import { helpers as paletteHelpers } from '../helpers/index.js';
const limits = paletteHelpers.limits;
const update = paletteHelpers.update;
const hslTo = coreConversionUtils.hslTo;
function baseColor(customColor, enableAlpha) {
    const color = coreUtils.base.clone(customColor ?? utils.random.hsl(enableAlpha));
    return color;
}
async function paletteItem(color, enableAlpha) {
    const clonedColor = coreUtils.base.clone(color);
    clonedColor.value.alpha = enableAlpha
        ? coreUtils.brand.asAlphaRange(Math.random())
        : coreUtils.brand.asAlphaRange(1);
    return {
        colors: {
            main: {
                cmyk: hslTo(clonedColor, 'cmyk').value,
                hex: hslTo(clonedColor, 'hex').value,
                hsl: clonedColor.value,
                hsv: hslTo(clonedColor, 'hsv').value,
                lab: hslTo(clonedColor, 'lab').value,
                rgb: hslTo(clonedColor, 'rgb').value,
                xyz: hslTo(clonedColor, 'xyz').value
            },
            stringProps: {
                cmyk: utils.color.colorToColorString(hslTo(clonedColor, 'cmyk')).value,
                hex: utils.color.colorToColorString(hslTo(clonedColor, 'hex')).value,
                hsl: utils.color.colorToColorString(clonedColor).value,
                hsv: utils.color.colorToColorString(hslTo(clonedColor, 'hsv')).value,
                lab: utils.color.colorToColorString(hslTo(clonedColor, 'lab')).value,
                rgb: utils.color.colorToColorString(hslTo(clonedColor, 'rgb')).value,
                xyz: utils.color.colorToColorString(hslTo(clonedColor, 'xyz')).value
            },
            css: {
                cmyk: await coreUtils.convert.colorToCSSColorString(hslTo(clonedColor, 'cmyk')),
                hex: await coreUtils.convert.colorToCSSColorString(hslTo(clonedColor, 'hex')),
                hsl: await coreUtils.convert.colorToCSSColorString(clonedColor),
                hsv: await coreUtils.convert.colorToCSSColorString(hslTo(clonedColor, 'hsv')),
                lab: await coreUtils.convert.colorToCSSColorString(hslTo(clonedColor, 'lab')),
                rgb: await coreUtils.convert.colorToCSSColorString(hslTo(clonedColor, 'rgb')),
                xyz: await coreUtils.convert.colorToCSSColorString(hslTo(clonedColor, 'xyz'))
            }
        }
    };
}
async function paletteItemArray(baseColor, hues, enableAlpha, limitDark, limitGray, limitLight) {
    const paletteItems = [
        await paletteItem(baseColor, enableAlpha)
    ];
    for (const [i, hue] of hues.entries()) {
        let newColor = null;
        do {
            const sl = utils.random.sl(enableAlpha);
            newColor = utils.conversion.genAllColorValues({
                value: {
                    hue: coreUtils.brand.asRadial(hue),
                    ...sl.value
                },
                format: 'hsl'
            }).hsl;
        } while (newColor &&
            ((limitGray && limits.isTooGray(newColor)) ||
                (limitDark && limits.isTooDark(newColor)) ||
                (limitLight && limits.isTooLight(newColor))));
        if (newColor) {
            const newPaletteItem = await paletteItem(newColor, enableAlpha);
            paletteItems.push(newPaletteItem);
            update.colorBox(newColor, i + 1);
        }
    }
    return paletteItems;
}
export const create = {
    baseColor,
    paletteItem,
    paletteItemArray
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL3N1cGVyVXRpbHMvY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQW9CNUMsT0FBTyxFQUNOLG1CQUFtQixFQUNuQixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUFFLE9BQU8sSUFBSSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVoRSxNQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO0FBQ3JDLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUM7QUFFckMsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDO0FBRXhDLFNBQVMsU0FBUyxDQUFDLFdBQXVCLEVBQUUsV0FBb0I7SUFDL0QsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQ2pDLFdBQVcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FDNUMsQ0FBQztJQUVGLE9BQU8sS0FBWSxDQUFDO0FBQ3JCLENBQUM7QUFFRCxLQUFLLFVBQVUsV0FBVyxDQUN6QixLQUFVLEVBQ1YsV0FBb0I7SUFFcEIsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFRLENBQUM7SUFFdkQsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsV0FBVztRQUNwQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuQyxPQUFPO1FBQ04sTUFBTSxFQUFFO1lBQ1AsSUFBSSxFQUFF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QU0sTUFBTSxHQUFHO0lBQ3JCLFNBQVM7SUFDVCxXQUFXO0lBQ1gsZ0JBQWdCO0NBQ1AsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHBhbGV0dGUvY29tbW9uL3N1cGVyVXRpbHMvY3JlYXRlLmpzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENNWUtfU3RyaW5nUHJvcHMsXG5cdEhleCxcblx0SGV4X1N0cmluZ1Byb3BzLFxuXHRIU0wsXG5cdEhTTF9TdHJpbmdQcm9wcyxcblx0SFNWLFxuXHRIU1ZfU3RyaW5nUHJvcHMsXG5cdExBQixcblx0TEFCX1N0cmluZ1Byb3BzLFxuXHRQYWxldHRlSXRlbSxcblx0UkdCLFxuXHRSR0JfU3RyaW5nUHJvcHMsXG5cdFNMLFxuXHRYWVosXG5cdFhZWl9TdHJpbmdQcm9wc1xufSBmcm9tICcuLi8uLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQge1xuXHRjb3JlQ29udmVyc2lvblV0aWxzLFxuXHRjb3JlVXRpbHMsXG5cdHV0aWxzXG59IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBoZWxwZXJzIGFzIHBhbGV0dGVIZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9pbmRleC5qcyc7XG5cbmNvbnN0IGxpbWl0cyA9IHBhbGV0dGVIZWxwZXJzLmxpbWl0cztcbmNvbnN0IHVwZGF0ZSA9IHBhbGV0dGVIZWxwZXJzLnVwZGF0ZTtcblxuY29uc3QgaHNsVG8gPSBjb3JlQ29udmVyc2lvblV0aWxzLmhzbFRvO1xuXG5mdW5jdGlvbiBiYXNlQ29sb3IoY3VzdG9tQ29sb3I6IEhTTCB8IG51bGwsIGVuYWJsZUFscGhhOiBib29sZWFuKTogSFNMIHtcblx0Y29uc3QgY29sb3IgPSBjb3JlVXRpbHMuYmFzZS5jbG9uZShcblx0XHRjdXN0b21Db2xvciA/PyB1dGlscy5yYW5kb20uaHNsKGVuYWJsZUFscGhhKVxuXHQpO1xuXG5cdHJldHVybiBjb2xvciBhcyBIU0w7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhbGV0dGVJdGVtKFxuXHRjb2xvcjogSFNMLFxuXHRlbmFibGVBbHBoYTogYm9vbGVhblxuKTogUHJvbWlzZTxQYWxldHRlSXRlbT4ge1xuXHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmVVdGlscy5iYXNlLmNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0Y2xvbmVkQ29sb3IudmFsdWUuYWxwaGEgPSBlbmFibGVBbHBoYVxuXHRcdD8gY29yZVV0aWxzLmJyYW5kLmFzQWxwaGFSYW5nZShNYXRoLnJhbmRvbSgpKVxuXHRcdDogY29yZVV0aWxzLmJyYW5kLmFzQWxwaGFSYW5nZSgxKTtcblxuXHRyZXR1cm4ge1xuXHRcdGNvbG9yczoge1xuXHRcdFx0bWFpbjoge1xuXHRcdFx0XHRjbXlrOiAoaHNsVG8oY2xvbmVkQ29sb3IsICdjbXlrJykgYXMgQ01ZSykudmFsdWUsXG5cdFx0XHRcdGhleDogKGhzbFRvKGNsb25lZENvbG9yLCAnaGV4JykgYXMgSGV4KS52YWx1ZSxcblx0XHRcdFx0aHNsOiBjbG9uZWRDb2xvci52YWx1ZSxcblx0XHRcdFx0aHN2OiAoaHNsVG8oY2xvbmVkQ29sb3IsICdoc3YnKSBhcyBIU1YpLnZhbHVlLFxuXHRcdFx0XHRsYWI6IChoc2xUbyhjbG9uZWRDb2xvciwgJ2xhYicpIGFzIExBQikudmFsdWUsXG5cdFx0XHRcdHJnYjogKGhzbFRvKGNsb25lZENvbG9yLCAncmdiJykgYXMgUkdCKS52YWx1ZSxcblx0XHRcdFx0eHl6OiAoaHNsVG8oY2xvbmVkQ29sb3IsICd4eXonKSBhcyBYWVopLnZhbHVlXG5cdFx0XHR9LFxuXHRcdFx0c3RyaW5nUHJvcHM6IHtcblx0XHRcdFx0Y215azogKFxuXHRcdFx0XHRcdHV0aWxzLmNvbG9yLmNvbG9yVG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdGhzbFRvKGNsb25lZENvbG9yLCAnY215aycpXG5cdFx0XHRcdFx0KSBhcyBDTVlLX1N0cmluZ1Byb3BzXG5cdFx0XHRcdCkudmFsdWUsXG5cdFx0XHRcdGhleDogKFxuXHRcdFx0XHRcdHV0aWxzLmNvbG9yLmNvbG9yVG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdGhzbFRvKGNsb25lZENvbG9yLCAnaGV4Jylcblx0XHRcdFx0XHQpIGFzIEhleF9TdHJpbmdQcm9wc1xuXHRcdFx0XHQpLnZhbHVlLFxuXHRcdFx0XHRoc2w6IChcblx0XHRcdFx0XHR1dGlscy5jb2xvci5jb2xvclRvQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvclxuXHRcdFx0XHRcdCkgYXMgSFNMX1N0cmluZ1Byb3BzXG5cdFx0XHRcdCkudmFsdWUsXG5cdFx0XHRcdGhzdjogKFxuXHRcdFx0XHRcdHV0aWxzLmNvbG9yLmNvbG9yVG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdGhzbFRvKGNsb25lZENvbG9yLCAnaHN2Jylcblx0XHRcdFx0XHQpIGFzIEhTVl9TdHJpbmdQcm9wc1xuXHRcdFx0XHQpLnZhbHVlLFxuXHRcdFx0XHRsYWI6IChcblx0XHRcdFx0XHR1dGlscy5jb2xvci5jb2xvclRvQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRoc2xUbyhjbG9uZWRDb2xvciwgJ2xhYicpXG5cdFx0XHRcdFx0KSBhcyBMQUJfU3RyaW5nUHJvcHNcblx0XHRcdFx0KS52YWx1ZSxcblx0XHRcdFx0cmdiOiAoXG5cdFx0XHRcdFx0dXRpbHMuY29sb3IuY29sb3JUb0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0aHNsVG8oY2xvbmVkQ29sb3IsICdyZ2InKVxuXHRcdFx0XHRcdCkgYXMgUkdCX1N0cmluZ1Byb3BzXG5cdFx0XHRcdCkudmFsdWUsXG5cdFx0XHRcdHh5ejogKFxuXHRcdFx0XHRcdHV0aWxzLmNvbG9yLmNvbG9yVG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdGhzbFRvKGNsb25lZENvbG9yLCAneHl6Jylcblx0XHRcdFx0XHQpIGFzIFhZWl9TdHJpbmdQcm9wc1xuXHRcdFx0XHQpLnZhbHVlXG5cdFx0XHR9LFxuXHRcdFx0Y3NzOiB7XG5cdFx0XHRcdGNteWs6IGF3YWl0IGNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRoc2xUbyhjbG9uZWRDb2xvciwgJ2NteWsnKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRoZXg6IGF3YWl0IGNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRoc2xUbyhjbG9uZWRDb2xvciwgJ2hleCcpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGhzbDogYXdhaXQgY29yZVV0aWxzLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKSxcblx0XHRcdFx0aHN2OiBhd2FpdCBjb3JlVXRpbHMuY29udmVydC5jb2xvclRvQ1NTQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0aHNsVG8oY2xvbmVkQ29sb3IsICdoc3YnKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRsYWI6IGF3YWl0IGNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRoc2xUbyhjbG9uZWRDb2xvciwgJ2xhYicpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHJnYjogYXdhaXQgY29yZVV0aWxzLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdGhzbFRvKGNsb25lZENvbG9yLCAncmdiJylcblx0XHRcdFx0KSxcblx0XHRcdFx0eHl6OiBhd2FpdCBjb3JlVXRpbHMuY29udmVydC5jb2xvclRvQ1NTQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0aHNsVG8oY2xvbmVkQ29sb3IsICd4eXonKVxuXHRcdFx0XHQpXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBwYWxldHRlSXRlbUFycmF5KFxuXHRiYXNlQ29sb3I6IEhTTCxcblx0aHVlczogbnVtYmVyW10sXG5cdGVuYWJsZUFscGhhOiBib29sZWFuLFxuXHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdGxpbWl0R3JheTogYm9vbGVhbixcblx0bGltaXRMaWdodDogYm9vbGVhblxuKTogUHJvbWlzZTxQYWxldHRlSXRlbVtdPiB7XG5cdGNvbnN0IHBhbGV0dGVJdGVtczogUGFsZXR0ZUl0ZW1bXSA9IFtcblx0XHRhd2FpdCBwYWxldHRlSXRlbShiYXNlQ29sb3IsIGVuYWJsZUFscGhhKVxuXHRdO1xuXG5cdGZvciAoY29uc3QgW2ksIGh1ZV0gb2YgaHVlcy5lbnRyaWVzKCkpIHtcblx0XHRsZXQgbmV3Q29sb3I6IEhTTCB8IG51bGwgPSBudWxsO1xuXG5cdFx0ZG8ge1xuXHRcdFx0Y29uc3Qgc2wgPSB1dGlscy5yYW5kb20uc2woZW5hYmxlQWxwaGEpIGFzIFNMO1xuXG5cdFx0XHRuZXdDb2xvciA9IHV0aWxzLmNvbnZlcnNpb24uZ2VuQWxsQ29sb3JWYWx1ZXMoe1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogY29yZVV0aWxzLmJyYW5kLmFzUmFkaWFsKGh1ZSksXG5cdFx0XHRcdFx0Li4uc2wudmFsdWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkuaHNsIGFzIEhTTDtcblx0XHR9IHdoaWxlIChcblx0XHRcdG5ld0NvbG9yICYmXG5cdFx0XHQoKGxpbWl0R3JheSAmJiBsaW1pdHMuaXNUb29HcmF5KG5ld0NvbG9yKSkgfHxcblx0XHRcdFx0KGxpbWl0RGFyayAmJiBsaW1pdHMuaXNUb29EYXJrKG5ld0NvbG9yKSkgfHxcblx0XHRcdFx0KGxpbWl0TGlnaHQgJiYgbGltaXRzLmlzVG9vTGlnaHQobmV3Q29sb3IpKSlcblx0XHQpO1xuXG5cdFx0aWYgKG5ld0NvbG9yKSB7XG5cdFx0XHRjb25zdCBuZXdQYWxldHRlSXRlbSA9IGF3YWl0IHBhbGV0dGVJdGVtKG5ld0NvbG9yLCBlbmFibGVBbHBoYSk7XG5cblx0XHRcdHBhbGV0dGVJdGVtcy5wdXNoKG5ld1BhbGV0dGVJdGVtKTtcblxuXHRcdFx0dXBkYXRlLmNvbG9yQm94KG5ld0NvbG9yLCBpICsgMSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHBhbGV0dGVJdGVtcztcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IHtcblx0YmFzZUNvbG9yLFxuXHRwYWxldHRlSXRlbSxcblx0cGFsZXR0ZUl0ZW1BcnJheVxufSBhcyBjb25zdDtcbiJdfQ==