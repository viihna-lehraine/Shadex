import { genAllColorValues } from '../color-conversion/conversion.js';
import { dom } from '../dom/dom-main.js';
import { random } from '../utils/color-randomizer.js';
export function genSplitComplementaryHues(baseHue) {
    try {
        const modifier = Math.floor(Math.random() * 11) + 20;
        return [
            (baseHue + 180 + modifier) % 360,
            (baseHue + 180 - modifier + 360) % 360
        ];
    }
    catch (error) {
        console.error(`Error generating split complementary hues: ${error}`);
        return [];
    }
}
export function genSplitComplementaryPalette(numBoxes, customColor = null, initialColorSpace = 'hex') {
    try {
        if (numBoxes < 3) {
            window.alert('To generate a split complementary palette, please select at least 3 swatches.');
            return [];
        }
        const colors = [];
        let baseColor;
        // retrieve base color, either from input or randomly generated
        baseColor = customColor ?? random.randomColor(initialColorSpace);
        const baseColorValues = genAllColorValues(baseColor);
        const baseHSL = baseColorValues.hsl;
        if (!baseHSL) {
            throw new Error('Base HSL color is required for this palette.');
        }
        colors.push(baseHSL);
        // generate split complementary hues
        const splitHues = genSplitComplementaryHues(baseHSL.value.hue);
        // generate the complementary colors and push them to the palette
        splitHues.forEach(hue => {
            const sl = random.randomSL();
            const complementaryColor = genAllColorValues({
                value: { hue, ...sl.value },
                format: 'hsl'
            }).hsl;
            if (complementaryColor) {
                colors.push(complementaryColor);
            }
        });
        // generate additional colors if needed to match `numBoxes`
        while (colors.length < numBoxes) {
            const randomIndex = Math.floor(Math.random() * 2) + 1;
            const baseHue = splitHues[randomIndex - 1];
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
        // update the DOM with the generated colors
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
        console.error('Error generating split complementary palette:', error);
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQtY29tcGxlbWVudGFyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlLWdlbi9zcGxpdC1jb21wbGVtZW50YXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbkQsTUFBTSxVQUFVLHlCQUF5QixDQUFDLE9BQWU7SUFDeEQsSUFBSSxDQUFDO1FBQ0osTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXJELE9BQU87WUFDTixDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUNoQyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7U0FDdEMsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsOENBQThDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckUsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sVUFBVSw0QkFBNEIsQ0FDM0MsUUFBZ0IsRUFDaEIsY0FBa0MsSUFBSSxFQUN0QyxvQkFBc0MsS0FBSztJQUUzQyxJQUFJLENBQUM7UUFDSixJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsS0FBSyxDQUNYLCtFQUErRSxDQUMvRSxDQUFDO1lBQ0YsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQWtCLEVBQUUsQ0FB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Q0FBQyxLQUFLLENBQUMsK0NBQStDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbkFsbENvbG9yVmFsdWVzIH0gZnJvbSAnLi4vY29sb3ItY29udmVyc2lvbi9jb252ZXJzaW9uJztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4uL2RvbS9kb20tbWFpbic7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuLi9pbmRleC90eXBlcyc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdlblNwbGl0Q29tcGxlbWVudGFyeUh1ZXMoYmFzZUh1ZTogbnVtYmVyKTogbnVtYmVyW10ge1xuXHR0cnkge1xuXHRcdGNvbnN0IG1vZGlmaWVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTEpICsgMjA7XG5cblx0XHRyZXR1cm4gW1xuXHRcdFx0KGJhc2VIdWUgKyAxODAgKyBtb2RpZmllcikgJSAzNjAsXG5cdFx0XHQoYmFzZUh1ZSArIDE4MCAtIG1vZGlmaWVyICsgMzYwKSAlIDM2MFxuXHRcdF07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgZ2VuZXJhdGluZyBzcGxpdCBjb21wbGVtZW50YXJ5IGh1ZXM6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5TcGxpdENvbXBsZW1lbnRhcnlQYWxldHRlKFxuXHRudW1Cb3hlczogbnVtYmVyLFxuXHRjdXN0b21Db2xvcjogdHlwZXMuQ29sb3IgfCBudWxsID0gbnVsbCxcblx0aW5pdGlhbENvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UgPSAnaGV4J1xuKTogdHlwZXMuQ29sb3JbXSB7XG5cdHRyeSB7XG5cdFx0aWYgKG51bUJveGVzIDwgMykge1xuXHRcdFx0d2luZG93LmFsZXJ0KFxuXHRcdFx0XHQnVG8gZ2VuZXJhdGUgYSBzcGxpdCBjb21wbGVtZW50YXJ5IHBhbGV0dGUsIHBsZWFzZSBzZWxlY3QgYXQgbGVhc3QgMyBzd2F0Y2hlcy4nXG5cdFx0XHQpO1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9yczogdHlwZXMuQ29sb3JbXSA9IFtdO1xuXHRcdGxldCBiYXNlQ29sb3I6IHR5cGVzLkNvbG9yO1xuXG5cdFx0Ly8gcmV0cmlldmUgYmFzZSBjb2xvciwgZWl0aGVyIGZyb20gaW5wdXQgb3IgcmFuZG9tbHkgZ2VuZXJhdGVkXG5cdFx0YmFzZUNvbG9yID0gY3VzdG9tQ29sb3IgPz8gcmFuZG9tLnJhbmRvbUNvbG9yKGluaXRpYWxDb2xvclNwYWNlKTtcblxuXHRcdGNvbnN0IGJhc2VDb2xvclZhbHVlcyA9IGdlbkFsbENvbG9yVmFsdWVzKGJhc2VDb2xvcik7XG5cdFx0Y29uc3QgYmFzZUhTTCA9IGJhc2VDb2xvclZhbHVlcy5oc2wgYXMgdHlwZXMuSFNMO1xuXG5cdFx0aWYgKCFiYXNlSFNMKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Jhc2UgSFNMIGNvbG9yIGlzIHJlcXVpcmVkIGZvciB0aGlzIHBhbGV0dGUuJyk7XG5cdFx0fVxuXG5cdFx0Y29sb3JzLnB1c2goYmFzZUhTTCk7XG5cblx0XHQvLyBnZW5lcmF0ZSBzcGxpdCBjb21wbGVtZW50YXJ5IGh1ZXNcblx0XHRjb25zdCBzcGxpdEh1ZXMgPSBnZW5TcGxpdENvbXBsZW1lbnRhcnlIdWVzKGJhc2VIU0wudmFsdWUuaHVlKTtcblxuXHRcdC8vIGdlbmVyYXRlIHRoZSBjb21wbGVtZW50YXJ5IGNvbG9ycyBhbmQgcHVzaCB0aGVtIHRvIHRoZSBwYWxldHRlXG5cdFx0c3BsaXRIdWVzLmZvckVhY2goaHVlID0+IHtcblx0XHRcdGNvbnN0IHNsID0gcmFuZG9tLnJhbmRvbVNMKCk7XG5cdFx0XHRjb25zdCBjb21wbGVtZW50YXJ5Q29sb3IgPSBnZW5BbGxDb2xvclZhbHVlcyh7XG5cdFx0XHRcdHZhbHVlOiB7IGh1ZSwgLi4uc2wudmFsdWUgfSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkuaHNsO1xuXG5cdFx0XHRpZiAoY29tcGxlbWVudGFyeUNvbG9yKSB7XG5cdFx0XHRcdGNvbG9ycy5wdXNoKGNvbXBsZW1lbnRhcnlDb2xvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBnZW5lcmF0ZSBhZGRpdGlvbmFsIGNvbG9ycyBpZiBuZWVkZWQgdG8gbWF0Y2ggYG51bUJveGVzYFxuXHRcdHdoaWxlIChjb2xvcnMubGVuZ3RoIDwgbnVtQm94ZXMpIHtcblx0XHRcdGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xuXHRcdFx0Y29uc3QgYmFzZUh1ZSA9IHNwbGl0SHVlc1tyYW5kb21JbmRleCAtIDFdO1xuXHRcdFx0Y29uc3QgaHVlID1cblx0XHRcdFx0KGJhc2VIdWUgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMSkgLSA1ICsgMzYwKSAlIDM2MDtcblx0XHRcdGNvbnN0IHNsID0gcmFuZG9tLnJhbmRvbVNMKCk7XG5cblx0XHRcdGNvbnN0IGFkZGl0aW9uYWxDb2xvciA9IGdlbkFsbENvbG9yVmFsdWVzKHtcblx0XHRcdFx0dmFsdWU6IHsgaHVlLCAuLi5zbC52YWx1ZSB9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9KS5oc2w7XG5cblx0XHRcdGlmIChhZGRpdGlvbmFsQ29sb3IpIHtcblx0XHRcdFx0Y29sb3JzLnB1c2goYWRkaXRpb25hbENvbG9yKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdGhlIERPTSB3aXRoIHRoZSBnZW5lcmF0ZWQgY29sb3JzXG5cdFx0Y29sb3JzLmZvckVhY2goKGNvbG9yLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29sb3ItYm94LSR7aW5kZXggKyAxfWApO1xuXG5cdFx0XHRpZiAoY29sb3JCb3gpIHtcblx0XHRcdFx0Y29uc3QgaGV4Q29sb3IgPSBnZW5BbGxDb2xvclZhbHVlcyhjb2xvcikuaGV4IGFzIHR5cGVzLkhleDtcblx0XHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4Q29sb3IudmFsdWUuaGV4O1xuXG5cdFx0XHRcdGRvbS5wb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveChjb2xvciwgaW5kZXggKyAxKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBjb2xvcnM7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRXJyb3IgZ2VuZXJhdGluZyBzcGxpdCBjb21wbGVtZW50YXJ5IHBhbGV0dGU6JywgZXJyb3IpO1xuXHRcdHJldHVybiBbXTtcblx0fVxufVxuIl19