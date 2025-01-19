// File: src/config/regex.ts
export const regex = {
    colors: {
        cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
    },
    file: {
        palette: {
            css: {
                header: /\/\* CSS Palette File ID:\s*(.+?)\s*\*\//,
                class: /\.color-(\d+)/,
                colorProperty: /(\w+-color):\s*(.+);/,
                settings: {
                    enableAlpha: /\/\* EnableAlpha Value: (\w+) \*\//i,
                    limitDarkness: /\/\* LimitDarkness Value: (\w+) \*\//i,
                    limitGrayness: /\/\* LimitGrayness Value: (\w+) \*\//i,
                    limitLightness: /\/\* LimitLightness Value: (\w+) \*\//i
                }
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29uZmlnL3JlZ2V4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRCQUE0QjtBQUk1QixNQUFNLENBQUMsTUFBTSxLQUFLLEdBQXlCO0lBQzFDLE1BQU0sRUFBRTtRQUNQLElBQUksRUFBRSxvRUFBb0U7UUFDMUUsR0FBRyxFQUFFLG9DQUFvQztRQUN6QyxHQUFHLEVBQUUsK0RBQStEO1FBQ3BFLEdBQUcsRUFBRSwrREFBK0Q7UUFDcEUsR0FBRyxFQUFFLDJEQUEyRDtRQUNoRSxHQUFHLEVBQUUsMkRBQTJEO1FBQ2hFLEdBQUcsRUFBRSwyREFBMkQ7S0FDaEU7SUFDRCxJQUFJLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUixHQUFHLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLDBDQUEwQztnQkFDbEQsS0FBSyxFQUFFLGVBQWU7Z0JBQ3RCLGFBQWEsRUFBRSxzQkFBc0I7Z0JBQ3JDLFFBQVEsRUFBRTtvQkFDVCxXQUFXLEVBQUUscUNBQXFDO29CQUNsRCxhQUFhLEVBQUUsdUNBQXVDO29CQUN0RCxhQUFhLEVBQUUsdUNBQXVDO29CQUN0RCxjQUFjLEVBQUUsd0NBQXdDO2lCQUN4RDthQUNEO1NBQ0Q7S0FDRDtDQUNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29uZmlnL3JlZ2V4LnRzXG5cbmltcG9ydCB7IENvbmZpZ1JlZ2V4SW50ZXJmYWNlIH0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuXG5leHBvcnQgY29uc3QgcmVnZXg6IENvbmZpZ1JlZ2V4SW50ZXJmYWNlID0ge1xuXHRjb2xvcnM6IHtcblx0XHRjbXlrOiAvY215a1xcKChcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQrKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGhleDogL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezh9KSQvLFxuXHRcdGhzbDogL2hzbFxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspJT8sXFxzKihbXFxkLl0rKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGhzdjogL2hzdlxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspJT8sXFxzKihbXFxkLl0rKSU/KD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdGxhYjogL2xhYlxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspLFxccyooW1xcZC5dKykoPzosXFxzKihbXFxkLl0rKSk/XFwpL2ksXG5cdFx0cmdiOiAvcmdiXFwoKFtcXGQuXSspLFxccyooW1xcZC5dKyksXFxzKihbXFxkLl0rKSg/OixcXHMqKFtcXGQuXSspKT9cXCkvaSxcblx0XHR4eXo6IC94eXpcXCgoW1xcZC5dKyksXFxzKihbXFxkLl0rKSxcXHMqKFtcXGQuXSspKD86LFxccyooW1xcZC5dKykpP1xcKS9pXG5cdH0sXG5cdGZpbGU6IHtcblx0XHRwYWxldHRlOiB7XG5cdFx0XHRjc3M6IHtcblx0XHRcdFx0aGVhZGVyOiAvXFwvXFwqIENTUyBQYWxldHRlIEZpbGUgSUQ6XFxzKiguKz8pXFxzKlxcKlxcLy8sXG5cdFx0XHRcdGNsYXNzOiAvXFwuY29sb3ItKFxcZCspLyxcblx0XHRcdFx0Y29sb3JQcm9wZXJ0eTogLyhcXHcrLWNvbG9yKTpcXHMqKC4rKTsvLFxuXHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdGVuYWJsZUFscGhhOiAvXFwvXFwqIEVuYWJsZUFscGhhIFZhbHVlOiAoXFx3KykgXFwqXFwvL2ksXG5cdFx0XHRcdFx0bGltaXREYXJrbmVzczogL1xcL1xcKiBMaW1pdERhcmtuZXNzIFZhbHVlOiAoXFx3KykgXFwqXFwvL2ksXG5cdFx0XHRcdFx0bGltaXRHcmF5bmVzczogL1xcL1xcKiBMaW1pdEdyYXluZXNzIFZhbHVlOiAoXFx3KykgXFwqXFwvL2ksXG5cdFx0XHRcdFx0bGltaXRMaWdodG5lc3M6IC9cXC9cXCogTGltaXRMaWdodG5lc3MgVmFsdWU6IChcXHcrKSBcXCpcXC8vaVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuIl19