// File: src/data/config.js
const DEFAULT_KEYS = {
    APP_SETTINGS: 'appSettings',
    CUSTOM_COLOR: 'customColor'
};
const DEFAULT_SETTINGS = {
    colorSpace: 'hsl',
    lastTableID: 0,
    theme: 'light',
    loggingEnabled: true
};
const STORE_NAMES = {
    APP_SETTINGS: 'appSettings',
    CUSTOM_COLOR: 'customColor',
    MUTATIONS: 'mutations',
    PALLETES: 'palettes',
    SETTINGS: 'settings',
    TABLES: 'tables'
};
const db = { DEFAULT_KEYS, DEFAULT_SETTINGS, STORE_NAMES };
const regex = {
    colors: {
        cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
    },
    dom: {
        hex: /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i,
        hsl: /^hsl\(\s*(\d+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/,
        rgb: /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/
    },
    file: {
        palette: {
            css: {
                color: /\.color-\d+\s*{\s*([\s\S]*?)\s*}/i,
                metadata: /\.palette\s*{\s*([\s\S]*?)\s*}/i
            }
        }
    }
};
export const configData = { db, regex };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RhdGEvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJCQUEyQjtBQUkzQixNQUFNLFlBQVksR0FBRztJQUNwQixZQUFZLEVBQUUsYUFBYTtJQUMzQixZQUFZLEVBQUUsYUFBYTtDQUMzQixDQUFDO0FBRUYsTUFBTSxnQkFBZ0IsR0FBRztJQUN4QixVQUFVLEVBQUUsS0FBbUI7SUFDL0IsV0FBVyxFQUFFLENBQUM7SUFDZCxLQUFLLEVBQUUsT0FBMkI7SUFDbEMsY0FBYyxFQUFFLElBQUk7Q0FDcEIsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHO0lBQ25CLFlBQVksRUFBRSxhQUFhO0lBQzNCLFlBQVksRUFBRSxhQUFhO0lBQzNCLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLE1BQU0sRUFBRSxRQUFRO0NBQ2hCLENBQUM7QUFFRixNQUFNLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsQ0FBQztBQUUzRCxNQUFNLEtBQUssR0FBaUM7SUFDM0MsTUFBTSxFQUFFO1FBQ1AsSUFBSSxFQUFFLG9FQUFvRTtRQUMxRSxHQUFHLEVBQUUsb0NBQW9DO1FBQ3pDLEdBQUcsRUFBRSwrREFBK0Q7UUFDcEUsR0FBRyxFQUFFLCtEQUErRDtRQUNwRSxHQUFHLEVBQUUsMkRBQTJEO1FBQ2hFLEdBQUcsRUFBRSwyREFBMkQ7UUFDaEUsR0FBRyxFQUFFLDJEQUEyRDtLQUNoRTtJQUNELEdBQUcsRUFBRTtRQUNKLEdBQUcsRUFBRSxnQ0FBZ0M7UUFDckMsR0FBRyxFQUFFLGdEQUFnRDtRQUNyRCxHQUFHLEVBQUUsd0NBQXdDO0tBQzdDO0lBQ0QsSUFBSSxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1IsR0FBRyxFQUFFO2dCQUNKLEtBQUssRUFBRSxtQ0FBbUM7Z0JBQzFDLFFBQVEsRUFBRSxpQ0FBaUM7YUFDM0M7U0FDRDtLQUNEO0NBQ0QsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBd0IsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZGF0YS9jb25maWcuanNcblxuaW1wb3J0IHsgQ29uZmlnRGF0YUludGVyZmFjZSwgQ29sb3JTcGFjZSB9IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcblxuY29uc3QgREVGQVVMVF9LRVlTID0ge1xuXHRBUFBfU0VUVElOR1M6ICdhcHBTZXR0aW5ncycsXG5cdENVU1RPTV9DT0xPUjogJ2N1c3RvbUNvbG9yJ1xufTtcblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUyA9IHtcblx0Y29sb3JTcGFjZTogJ2hzbCcgYXMgQ29sb3JTcGFjZSxcblx0bGFzdFRhYmxlSUQ6IDAsXG5cdHRoZW1lOiAnbGlnaHQnIGFzICdsaWdodCcgfCAnZGFyaycsXG5cdGxvZ2dpbmdFbmFibGVkOiB0cnVlXG59O1xuXG5jb25zdCBTVE9SRV9OQU1FUyA9IHtcblx0QVBQX1NFVFRJTkdTOiAnYXBwU2V0dGluZ3MnLFxuXHRDVVNUT01fQ09MT1I6ICdjdXN0b21Db2xvcicsXG5cdE1VVEFUSU9OUzogJ211dGF0aW9ucycsXG5cdFBBTExFVEVTOiAncGFsZXR0ZXMnLFxuXHRTRVRUSU5HUzogJ3NldHRpbmdzJyxcblx0VEFCTEVTOiAndGFibGVzJ1xufTtcblxuY29uc3QgZGIgPSB7IERFRkFVTFRfS0VZUywgREVGQVVMVF9TRVRUSU5HUywgU1RPUkVfTkFNRVMgfTtcblxuY29uc3QgcmVnZXg6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ3JlZ2V4J10gPSB7XG5cdGNvbG9yczoge1xuXHRcdGNteWs6IC9jbXlrXFwoKFxcZCspJT8sXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8oPzosXFxzKihbXFxkLl0rKSk/XFwpL2ksXG5cdFx0aGV4OiAvXiMoW0EtRmEtZjAtOV17Nn18W0EtRmEtZjAtOV17OH0pJC8sXG5cdFx0aHNsOiAvaHNsXFwoKFtcXGQuXSspLFxccyooW1xcZC5dKyklPyxcXHMqKFtcXGQuXSspJT8oPzosXFxzKihbXFxkLl0rKSk/XFwpL2ksXG5cdFx0aHN2OiAvaHN2XFwoKFtcXGQuXSspLFxccyooW1xcZC5dKyklPyxcXHMqKFtcXGQuXSspJT8oPzosXFxzKihbXFxkLl0rKSk/XFwpL2ksXG5cdFx0bGFiOiAvbGFiXFwoKFtcXGQuXSspLFxccyooW1xcZC5dKyksXFxzKihbXFxkLl0rKSg/OixcXHMqKFtcXGQuXSspKT9cXCkvaSxcblx0XHRyZ2I6IC9yZ2JcXCgoW1xcZC5dKyksXFxzKihbXFxkLl0rKSxcXHMqKFtcXGQuXSspKD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdHh5ejogL3h5elxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspLFxccyooW1xcZC5dKykoPzosXFxzKihbXFxkLl0rKSk/XFwpL2lcblx0fSxcblx0ZG9tOiB7XG5cdFx0aGV4OiAvXiM/KFswLTlhLWZdezN9fFswLTlhLWZdezZ9KSQvaSxcblx0XHRoc2w6IC9eaHNsXFwoXFxzKihcXGQrKSxcXHMqKFtcXGQuXSspJSxcXHMqKFtcXGQuXSspJVxccypcXCkkLyxcblx0XHRyZ2I6IC9ecmdiXFwoXFxzKihcXGQrKSxcXHMqKFxcZCspLFxccyooXFxkKylcXHMqXFwpJC9cblx0fSxcblx0ZmlsZToge1xuXHRcdHBhbGV0dGU6IHtcblx0XHRcdGNzczoge1xuXHRcdFx0XHRjb2xvcjogL1xcLmNvbG9yLVxcZCtcXHMqe1xccyooW1xcc1xcU10qPylcXHMqfS9pLFxuXHRcdFx0XHRtZXRhZGF0YTogL1xcLnBhbGV0dGVcXHMqe1xccyooW1xcc1xcU10qPylcXHMqfS9pXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgY29uZmlnRGF0YTogQ29uZmlnRGF0YUludGVyZmFjZSA9IHsgZGIsIHJlZ2V4IH0gYXMgY29uc3Q7XG4iXX0=