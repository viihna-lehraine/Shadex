// File: core/utils/dom/partials/parse.ts
import { regex } from '../../../../config/index.js';
export function domParsingUtilitiesFactory(brand, services) {
    const { errors, log } = services;
    function parseCheckbox(id) {
        return errors.handleSync(() => {
            const checkbox = document.getElementById(id);
            return checkbox ? checkbox.checked : undefined;
        }, 'Error occurred while parsing checkbox.');
    }
    function parseColorInput(input) {
        return errors.handleSync(() => {
            const colorStr = input.value.trim().toLowerCase();
            const hexMatch = colorStr.match(regex.dom.hex);
            const hslMatch = colorStr.match(regex.dom.hsl);
            const rgbMatch = colorStr.match(regex.dom.rgb);
            if (hexMatch) {
                let hex = hexMatch[1];
                if (hex.length === 3) {
                    hex = hex
                        .split('')
                        .map(c => c + c)
                        .join('');
                }
                return {
                    format: 'hex',
                    value: { hex: brand.asHexSet(`#${hex}`) }
                };
            }
            if (hslMatch) {
                return {
                    format: 'hsl',
                    value: {
                        hue: brand.asRadial(parseInt(hslMatch[1], 10)),
                        saturation: brand.asPercentile(parseFloat(hslMatch[2])),
                        lightness: brand.asPercentile(parseFloat(hslMatch[3]))
                    }
                };
            }
            if (rgbMatch) {
                return {
                    format: 'rgb',
                    value: {
                        red: brand.asByteRange(parseInt(rgbMatch[1], 10)),
                        green: brand.asByteRange(parseInt(rgbMatch[2], 10)),
                        blue: brand.asByteRange(parseInt(rgbMatch[3], 10))
                    }
                };
            }
            // handle named colors
            const testElement = document.createElement('div');
            testElement.style.color = colorStr;
            if (testElement.style.color !== '') {
                const ctx = document.createElement('canvas').getContext('2d');
                if (ctx) {
                    ctx.fillStyle = colorStr;
                    const rgb = ctx.fillStyle.match(/\d+/g)?.map(Number);
                    if (rgb && rgb.length === 3) {
                        return {
                            format: 'rgb',
                            value: {
                                red: brand.asByteRange(rgb[0]),
                                green: brand.asByteRange(rgb[1]),
                                blue: brand.asByteRange(rgb[2])
                            }
                        };
                    }
                }
            }
            log.info(`Invalid color input: ${colorStr}`, `parseColorInput`);
            return null;
        }, 'Error occurred while parsing color input.');
    }
    function parseDropdownSelection(id, validOptions) {
        return errors.handleSync(() => {
            const dropdown = document.getElementById(id);
            if (!dropdown)
                return;
            const selectedValue = dropdown.value;
            if (!validOptions.includes(selectedValue)) {
                return validOptions.includes(selectedValue)
                    ? selectedValue
                    : undefined;
            }
            return;
        }, 'Error occurred while parsing dropdown selection.');
    }
    function parseNumberInput(input, min, max) {
        return errors.handleSync(() => {
            const value = parseFloat(input.value.trim());
            if (isNaN(value))
                return null;
            if (min !== undefined && value < min)
                return min;
            if (max !== undefined && value > max)
                return max;
            return value;
        }, 'Error occurred while parsing number input.');
    }
    function parseTextInput(input, regex) {
        return errors.handleSync(() => {
            const text = input.value.trim();
            if (regex && !regex.test(text)) {
                return null;
            }
            return text || null;
        }, 'Error occurred while parsing text input.');
    }
    const domParsingUtilities = {
        parseCheckbox,
        parseColorInput,
        parseDropdownSelection,
        parseNumberInput,
        parseTextInput
    };
    return errors.handleSync(() => domParsingUtilities, 'Error occurred while creating DOM parsing utilities group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29yZS91dGlscy9wYXJ0aWFscy9kb20vcGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEseUNBQXlDO0FBVXpDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVwRCxNQUFNLFVBQVUsMEJBQTBCLENBQ3pDLEtBQXdCLEVBQ3hCLFFBQWtCO0lBRWxCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBRWpDLFNBQVMsYUFBYSxDQUFDLEVBQVU7UUFDaEMsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM3QixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUN2QyxFQUFFLENBQ3lCLENBQUM7WUFFN0IsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNoRCxDQUFDLEVBQUUsd0NBQXdDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsU0FBUyxlQUFlLENBQUMsS0FBdUI7UUFDL0MsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM3QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lB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SSxLQUFLLEdBQUcsR0FBRztnQkFBRSxPQUFPLEdBQUcsQ0FBQztZQUVqRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUMsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxTQUFTLGNBQWMsQ0FDdEIsS0FBdUIsRUFDdkIsS0FBYztRQUVkLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVoQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDaEMsT0FBTyxJQUFJLENBQUM7WUFDYixDQUFDO1lBRUQsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDO1FBQ3JCLENBQUMsRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLG1CQUFtQixHQUF3QjtRQUNoRCxhQUFhO1FBQ2IsZUFBZTtRQUNmLHNCQUFzQjtRQUN0QixnQkFBZ0I7UUFDaEIsY0FBYztLQUNkLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQ3ZCLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixFQUN6Qiw0REFBNEQsQ0FDNUQsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb3JlL3V0aWxzL2RvbS9wYXJ0aWFscy9wYXJzZS50c1xuXG5pbXBvcnQge1xuXHRCcmFuZGluZ1V0aWxpdGllcyxcblx0RE9NUGFyc2luZ1V0aWxpdGllcyxcblx0SGV4LFxuXHRIU0wsXG5cdFJHQixcblx0U2VydmljZXNcbn0gZnJvbSAnLi4vLi4vLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgcmVnZXggfSBmcm9tICcuLi8uLi8uLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZG9tUGFyc2luZ1V0aWxpdGllc0ZhY3RvcnkoXG5cdGJyYW5kOiBCcmFuZGluZ1V0aWxpdGllcyxcblx0c2VydmljZXM6IFNlcnZpY2VzXG4pOiBET01QYXJzaW5nVXRpbGl0aWVzIHtcblx0Y29uc3QgeyBlcnJvcnMsIGxvZyB9ID0gc2VydmljZXM7XG5cblx0ZnVuY3Rpb24gcGFyc2VDaGVja2JveChpZDogc3RyaW5nKTogYm9vbGVhbiB8IHZvaWQge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRpZFxuXHRcdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0cmV0dXJuIGNoZWNrYm94ID8gY2hlY2tib3guY2hlY2tlZCA6IHVuZGVmaW5lZDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgcGFyc2luZyBjaGVja2JveC4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBhcnNlQ29sb3JJbnB1dChpbnB1dDogSFRNTElucHV0RWxlbWVudCk6IEhleCB8IEhTTCB8IFJHQiB8IG51bGwge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjb2xvclN0ciA9IGlucHV0LnZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0Y29uc3QgaGV4TWF0Y2ggPSBjb2xvclN0ci5tYXRjaChyZWdleC5kb20uaGV4KTtcblx0XHRcdGNvbnN0IGhzbE1hdGNoID0gY29sb3JTdHIubWF0Y2gocmVnZXguZG9tLmhzbCk7XG5cdFx0XHRjb25zdCByZ2JNYXRjaCA9IGNvbG9yU3RyLm1hdGNoKHJlZ2V4LmRvbS5yZ2IpO1xuXG5cdFx0XHRpZiAoaGV4TWF0Y2gpIHtcblx0XHRcdFx0bGV0IGhleCA9IGhleE1hdGNoWzFdO1xuXHRcdFx0XHRpZiAoaGV4Lmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRcdGhleCA9IGhleFxuXHRcdFx0XHRcdFx0LnNwbGl0KCcnKVxuXHRcdFx0XHRcdFx0Lm1hcChjID0+IGMgKyBjKVxuXHRcdFx0XHRcdFx0LmpvaW4oJycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4Jyxcblx0XHRcdFx0XHR2YWx1ZTogeyBoZXg6IGJyYW5kLmFzSGV4U2V0KGAjJHtoZXh9YCkgfVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaHNsTWF0Y2gpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnLFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKHBhcnNlSW50KGhzbE1hdGNoWzFdLCAxMCkpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHNsTWF0Y2hbMl0pKSxcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHNsTWF0Y2hbM10pKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJnYk1hdGNoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAncmdiJyxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShwYXJzZUludChyZ2JNYXRjaFsxXSwgMTApKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShwYXJzZUludChyZ2JNYXRjaFsyXSwgMTApKSxcblx0XHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlSW50KHJnYk1hdGNoWzNdLCAxMCkpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBoYW5kbGUgbmFtZWQgY29sb3JzXG5cdFx0XHRjb25zdCB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0dGVzdEVsZW1lbnQuc3R5bGUuY29sb3IgPSBjb2xvclN0cjtcblxuXHRcdFx0aWYgKHRlc3RFbGVtZW50LnN0eWxlLmNvbG9yICE9PSAnJykge1xuXHRcdFx0XHRjb25zdCBjdHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0XHRcdGlmIChjdHgpIHtcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gY29sb3JTdHI7XG5cblx0XHRcdFx0XHRjb25zdCByZ2IgPSBjdHguZmlsbFN0eWxlLm1hdGNoKC9cXGQrL2cpPy5tYXAoTnVtYmVyKTtcblxuXHRcdFx0XHRcdGlmIChyZ2IgJiYgcmdiLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAncmdiJyxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKHJnYlswXSksXG5cdFx0XHRcdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKHJnYlsxXSksXG5cdFx0XHRcdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UocmdiWzJdKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRsb2cuaW5mbyhgSW52YWxpZCBjb2xvciBpbnB1dDogJHtjb2xvclN0cn1gLCBgcGFyc2VDb2xvcklucHV0YCk7XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBwYXJzaW5nIGNvbG9yIGlucHV0LicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFyc2VEcm9wZG93blNlbGVjdGlvbihcblx0XHRpZDogc3RyaW5nLFxuXHRcdHZhbGlkT3B0aW9uczogc3RyaW5nW11cblx0KTogc3RyaW5nIHwgdm9pZCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGRyb3Bkb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGlkXG5cdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0aWYgKCFkcm9wZG93bikgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCBzZWxlY3RlZFZhbHVlID0gZHJvcGRvd24udmFsdWU7XG5cblx0XHRcdGlmICghdmFsaWRPcHRpb25zLmluY2x1ZGVzKHNlbGVjdGVkVmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiB2YWxpZE9wdGlvbnMuaW5jbHVkZXMoc2VsZWN0ZWRWYWx1ZSlcblx0XHRcdFx0XHQ/IHNlbGVjdGVkVmFsdWVcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBwYXJzaW5nIGRyb3Bkb3duIHNlbGVjdGlvbi4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBhcnNlTnVtYmVySW5wdXQoXG5cdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQsXG5cdFx0bWluPzogbnVtYmVyLFxuXHRcdG1heD86IG51bWJlclxuXHQpOiBudW1iZXIgfCBudWxsIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGlucHV0LnZhbHVlLnRyaW0oKSk7XG5cblx0XHRcdGlmIChpc05hTih2YWx1ZSkpIHJldHVybiBudWxsO1xuXG5cdFx0XHRpZiAobWluICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgPCBtaW4pIHJldHVybiBtaW47XG5cdFx0XHRpZiAobWF4ICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgPiBtYXgpIHJldHVybiBtYXg7XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgcGFyc2luZyBudW1iZXIgaW5wdXQuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBwYXJzZVRleHRJbnB1dChcblx0XHRpbnB1dDogSFRNTElucHV0RWxlbWVudCxcblx0XHRyZWdleD86IFJlZ0V4cFxuXHQpOiBzdHJpbmcgfCBudWxsIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgdGV4dCA9IGlucHV0LnZhbHVlLnRyaW0oKTtcblxuXHRcdFx0aWYgKHJlZ2V4ICYmICFyZWdleC50ZXN0KHRleHQpKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGV4dCB8fCBudWxsO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBwYXJzaW5nIHRleHQgaW5wdXQuJyk7XG5cdH1cblxuXHRjb25zdCBkb21QYXJzaW5nVXRpbGl0aWVzOiBET01QYXJzaW5nVXRpbGl0aWVzID0ge1xuXHRcdHBhcnNlQ2hlY2tib3gsXG5cdFx0cGFyc2VDb2xvcklucHV0LFxuXHRcdHBhcnNlRHJvcGRvd25TZWxlY3Rpb24sXG5cdFx0cGFyc2VOdW1iZXJJbnB1dCxcblx0XHRwYXJzZVRleHRJbnB1dFxuXHR9O1xuXG5cdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYyhcblx0XHQoKSA9PiBkb21QYXJzaW5nVXRpbGl0aWVzLFxuXHRcdCdFcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBET00gcGFyc2luZyB1dGlsaXRpZXMgZ3JvdXAuJ1xuXHQpO1xufVxuIl19