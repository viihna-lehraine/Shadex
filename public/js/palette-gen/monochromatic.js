import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { random } from '../utils/color-randomizer.js';
export function genMonochromaticPalette(numBoxes, customColor = null, initialColorSpace = 'hex') {
    try {
        if (numBoxes < 2) {
            window.alert('To generate a monochromatic palette, please select a number of swatches greater than 1');
            return [];
        }
        const colors = [];
        const baseColorValues = genAllColorValues(customColor ?? random.randomColor(initialColorSpace));
        const baseHSL = baseColorValues.hsl;
        if (!baseHSL) {
            throw new Error('Base HSL value is required for a monochromatic palette.');
        }
        colors.push(baseHSL);
        for (let i = 1; i < numBoxes; i++) {
            const { value: { saturation, lightness } } = random.randomSL();
            const monoColorValues = genAllColorValues({
                value: {
                    hue: baseHSL.value.hue,
                    saturation,
                    lightness
                },
                format: 'hsl'
            });
            const monoHSL = monoColorValues.hsl;
            colors.push(monoHSL);
            // update the DOM with generated colors
            const colorBox = document.getElementById(`color-box-${i + 1}`);
            if (colorBox) {
                const hexColor = monoColorValues.hex;
                colorBox.style.backgroundColor = hexColor.value.hex;
                dom.populateColorTextOutputBox(monoHSL, i + 1);
            }
        }
        return colors;
    }
    catch (error) {
        console.error(`Error generating monochromatic palette: ${error}`);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ub2Nocm9tYXRpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlLWdlbi9tb25vY2hyb21hdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbkQsTUFBTSxVQUFVLHVCQUF1QixDQUN0QyxRQUFnQixFQUNoQixjQUFrQyxJQUFJLEVBQ3RDLG9CQUFzQyxLQUFLO0lBRTNDLElBQUksQ0FBQztRQUNKLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQ1gsd0ZBQXdGLENBQ3hGLENBQUM7WUFDRixPQUFPLEVBQUUsQ0FBQztRQUNYLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBa0IsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sZUFBZSxHQUFHLGlCQUFpQixDQUN4QyxXQUFXLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUNwRCxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQWdCLENBQUM7UUFFakQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDZCx5REFBeUQsQ0FDekQsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNuQyxNQUFNLEVBQ0wsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUNoQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUV0QixNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztnQkFDekMsS0FBSyxFQUFFO29CQUNOLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUc7b0JBQ3RCLFVBQVU7b0JBQ1YsU0FBUztpQkFDVDtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxHQUFnQixDQUFDO1lBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckIsdUNBQXVDO1lBQ3ZDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvRCxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNkLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxHQUFnQixDQUFDO2dCQUNsRCxRQUFRLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFFcEQsR0FBRyxDQUFDLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNGLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEUsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbkFsbENvbG9yVmFsdWVzIH0gZnJvbSAnLi4vY29sb3ItY29udmVyc2lvbi9jb252ZXJzaW9uJztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4uL2RvbS9kb20tbWFpbic7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuLi9pbmRleC90eXBlcyc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbk1vbm9jaHJvbWF0aWNQYWxldHRlKFxuXHRudW1Cb3hlczogbnVtYmVyLFxuXHRjdXN0b21Db2xvcjogdHlwZXMuQ29sb3IgfCBudWxsID0gbnVsbCxcblx0aW5pdGlhbENvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UgPSAnaGV4J1xuKTogdHlwZXMuQ29sb3JbXSB7XG5cdHRyeSB7XG5cdFx0aWYgKG51bUJveGVzIDwgMikge1xuXHRcdFx0d2luZG93LmFsZXJ0KFxuXHRcdFx0XHQnVG8gZ2VuZXJhdGUgYSBtb25vY2hyb21hdGljIHBhbGV0dGUsIHBsZWFzZSBzZWxlY3QgYSBudW1iZXIgb2Ygc3dhdGNoZXMgZ3JlYXRlciB0aGFuIDEnXG5cdFx0XHQpO1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9yczogdHlwZXMuQ29sb3JbXSA9IFtdO1xuXHRcdGNvbnN0IGJhc2VDb2xvclZhbHVlcyA9IGdlbkFsbENvbG9yVmFsdWVzKFxuXHRcdFx0Y3VzdG9tQ29sb3IgPz8gcmFuZG9tLnJhbmRvbUNvbG9yKGluaXRpYWxDb2xvclNwYWNlKVxuXHRcdCk7XG5cdFx0Y29uc3QgYmFzZUhTTCA9IGJhc2VDb2xvclZhbHVlcy5oc2wgYXMgdHlwZXMuSFNMO1xuXG5cdFx0aWYgKCFiYXNlSFNMKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCdCYXNlIEhTTCB2YWx1ZSBpcyByZXF1aXJlZCBmb3IgYSBtb25vY2hyb21hdGljIHBhbGV0dGUuJ1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb2xvcnMucHVzaChiYXNlSFNMKTtcblxuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgbnVtQm94ZXM7IGkrKykge1xuXHRcdFx0Y29uc3Qge1xuXHRcdFx0XHR2YWx1ZTogeyBzYXR1cmF0aW9uLCBsaWdodG5lc3MgfVxuXHRcdFx0fSA9IHJhbmRvbS5yYW5kb21TTCgpO1xuXG5cdFx0XHRjb25zdCBtb25vQ29sb3JWYWx1ZXMgPSBnZW5BbGxDb2xvclZhbHVlcyh7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBiYXNlSFNMLnZhbHVlLmh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uLFxuXHRcdFx0XHRcdGxpZ2h0bmVzc1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9KTtcblxuXHRcdFx0Y29uc3QgbW9ub0hTTCA9IG1vbm9Db2xvclZhbHVlcy5oc2wgYXMgdHlwZXMuSFNMO1xuXHRcdFx0Y29sb3JzLnB1c2gobW9ub0hTTCk7XG5cblx0XHRcdC8vIHVwZGF0ZSB0aGUgRE9NIHdpdGggZ2VuZXJhdGVkIGNvbG9yc1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29sb3ItYm94LSR7aSArIDF9YCk7XG5cdFx0XHRpZiAoY29sb3JCb3gpIHtcblx0XHRcdFx0Y29uc3QgaGV4Q29sb3IgPSBtb25vQ29sb3JWYWx1ZXMuaGV4IGFzIHR5cGVzLkhleDtcblx0XHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4Q29sb3IudmFsdWUuaGV4O1xuXG5cdFx0XHRcdGRvbS5wb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveChtb25vSFNMLCBpICsgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbG9ycztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBnZW5lcmF0aW5nIG1vbm9jaHJvbWF0aWMgcGFsZXR0ZTogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gW107XG5cdH1cbn1cbiJdfQ==