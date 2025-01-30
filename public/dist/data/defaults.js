// File: data/defaults.js
import { brand } from '../common/core.js';
const colors = {
    base: {
        branded: {
            cmyk: {
                value: {
                    cyan: brand.asPercentile(0),
                    magenta: brand.asPercentile(0),
                    yellow: brand.asPercentile(0),
                    key: brand.asPercentile(0)
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: brand.asHexSet('#000000')
                },
                format: 'hex'
            },
            hsl: {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0)
                },
                format: 'hsl'
            },
            hsv: {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0)
                },
                format: 'hsv'
            },
            lab: {
                value: {
                    l: brand.asLAB_L(0),
                    a: brand.asLAB_A(0),
                    b: brand.asLAB_B(0)
                },
                format: 'lab'
            },
            rgb: {
                value: {
                    red: brand.asByteRange(0),
                    green: brand.asByteRange(0),
                    blue: brand.asByteRange(0)
                },
                format: 'rgb'
            },
            sl: {
                value: {
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0)
                },
                format: 'sl'
            },
            sv: {
                value: {
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0)
                },
                format: 'sv'
            },
            xyz: {
                value: {
                    x: brand.asXYZ_X(0),
                    y: brand.asXYZ_Y(0),
                    z: brand.asXYZ_Z(0)
                },
                format: 'xyz'
            }
        },
        unbranded: {
            cmyk: {
                value: {
                    cyan: 0,
                    magenta: 0,
                    yellow: 0,
                    key: 0
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: '#000000FF'
                },
                format: 'hex'
            },
            hsl: {
                value: {
                    hue: 0,
                    saturation: 0,
                    lightness: 0
                },
                format: 'hsl'
            },
            hsv: {
                value: {
                    hue: 0,
                    saturation: 0,
                    value: 0
                },
                format: 'hsv'
            },
            lab: {
                value: {
                    l: 0,
                    a: 0,
                    b: 0
                },
                format: 'lab'
            },
            sl: {
                value: {
                    saturation: 0,
                    lightness: 0
                },
                format: 'sl'
            },
            rgb: {
                value: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                format: 'rgb'
            },
            sv: {
                value: {
                    saturation: 0,
                    value: 0
                },
                format: 'sv'
            },
            xyz: {
                value: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                format: 'xyz'
            }
        }
    },
    css: {
        cmyk: 'cmyk(0%, 0%, 0%, 0%)',
        hex: '#000000',
        hsl: 'hsl(0, 0%, 0%)',
        hsv: 'hsv(0, 0%, 0%)',
        lab: 'lab(0, 0, 0)',
        rgb: 'rgb(0, 0, 0)',
        sl: 'sl(0%, 0%)',
        sv: 'sv(0%, 0%)',
        xyz: 'xyz(0, 0, 0)'
    },
    strings: {
        cmyk: {
            value: {
                cyan: '0',
                magenta: '0',
                yellow: '0',
                key: '0'
            },
            format: 'cmyk'
        },
        hex: {
            value: {
                hex: '#000000'
            },
            format: 'hex'
        },
        hsl: {
            value: {
                hue: '0',
                saturation: '0',
                lightness: '0'
            },
            format: 'hsl'
        },
        hsv: {
            value: {
                hue: '0',
                saturation: '0',
                value: '0'
            },
            format: 'hsv'
        },
        lab: {
            value: {
                l: '0',
                a: '0',
                b: '0'
            },
            format: 'lab'
        },
        rgb: {
            value: {
                red: '0',
                green: '0',
                blue: '0'
            },
            format: 'rgb'
        },
        sl: {
            value: {
                saturation: '0',
                lightness: '0'
            },
            format: 'sl'
        },
        sv: {
            value: {
                saturation: '0',
                value: '0'
            },
            format: 'sv'
        },
        xyz: {
            value: {
                x: '0',
                y: '0',
                z: '0'
            },
            format: 'xyz'
        }
    }
};
const mutation = {
    timestamp: new Date().toISOString(),
    key: 'default_key',
    action: 'update',
    newValue: { value: 'new_value' },
    oldValue: { value: 'old_value' },
    origin: 'DEFAULT'
};
const idb = {
    mutation
};
const unbrandedData = {
    id: `null-palette-${Date.now()}`,
    items: [],
    metadata: {
        customColor: false,
        flags: {
            enableAlpha: false,
            limitDarkness: false,
            limitGrayness: false,
            limitLightness: false
        },
        name: 'UNBRANDED DEFAULT PALETTE',
        swatches: 1,
        type: '???',
        timestamp: '???'
    }
};
const unbrandedItem = {
    colors: {
        main: {
            cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
            hex: { hex: '#000000' },
            hsl: { hue: 0, saturation: 0, lightness: 0 },
            hsv: { hue: 0, saturation: 0, value: 0 },
            lab: { l: 0, a: 0, b: 0 },
            rgb: { red: 0, green: 0, blue: 0 },
            xyz: { x: 0, y: 0, z: 0 }
        },
        stringProps: {
            cmyk: {
                cyan: '0%',
                magenta: '0%',
                yellow: '0%',
                key: '0%'
            },
            hex: { hex: '#000000FF' },
            hsl: { hue: '0', saturation: '0%', lightness: '0%' },
            hsv: { hue: '0', saturation: '0%', value: '0%' },
            lab: { l: '0', a: '0', b: '0' },
            rgb: { red: '0', green: '0', blue: '0' },
            xyz: { x: '0', y: '0', z: '0' }
        },
        css: {
            cmyk: 'cmyk(0%, 0%, 0%, 100%)',
            hex: '#000000',
            hsl: 'hsl(0, 0%, 0%)',
            hsv: 'hsv(0, 0%, 0%)',
            lab: 'lab(0, 0, 0)',
            rgb: 'rgb(0, 0, 0)',
            xyz: 'xyz(0, 0, 0)'
        }
    }
};
const unbrandedStored = {
    tableID: 1,
    palette: unbrandedData
};
const palette = {
    unbranded: {
        data: unbrandedData,
        item: unbrandedItem,
        stored: unbrandedStored
    }
};
export const defaultData = {
    colors,
    idb,
    palette
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGF0YS9kZWZhdWx0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5QkFBeUI7QUFTekIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTFDLE1BQU0sTUFBTSxHQUFtQztJQUM5QyxJQUFJLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUixJQUFJLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLEdBQUcsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDMUI7Z0JBQ0QsTUFBTSxFQUFFLE1BQU07YUFDZDtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO2lCQUM5QjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUNoQztnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxD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QUUsQ0FBQztJQUNWLE9BQU8sRUFBRSxhQUFhO0NBQ3RCLENBQUM7QUFFRixNQUFNLE9BQU8sR0FBb0M7SUFDaEQsU0FBUyxFQUFFO1FBQ1YsSUFBSSxFQUFFLGFBQWE7UUFDbkIsSUFBSSxFQUFFLGFBQWE7UUFDbkIsTUFBTSxFQUFFLGVBQWU7S0FDdkI7Q0FDUSxDQUFDO0FBRVgsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUF5QjtJQUNoRCxNQUFNO0lBQ04sR0FBRztJQUNILE9BQU87Q0FDRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogZGF0YS9kZWZhdWx0cy5qc1xuXG5pbXBvcnQge1xuXHREZWZhdWx0RGF0YUludGVyZmFjZSxcblx0TXV0YXRpb25Mb2csXG5cdFVuYnJhbmRlZFBhbGV0dGUsXG5cdFVuYnJhbmRlZFBhbGV0dGVJdGVtLFxuXHRVbmJyYW5kZWRTdG9yZWRQYWxldHRlXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGJyYW5kIH0gZnJvbSAnLi4vY29tbW9uL2NvcmUuanMnO1xuXG5jb25zdCBjb2xvcnM6IERlZmF1bHREYXRhSW50ZXJmYWNlWydjb2xvcnMnXSA9IHtcblx0YmFzZToge1xuXHRcdGJyYW5kZWQ6IHtcblx0XHRcdGNteWs6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRjeWFuOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9LFxuXHRcdFx0aGV4OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMCcpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH0sXG5cdFx0XHRoc2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9LFxuXHRcdFx0aHN2OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9LFxuXHRcdFx0bGFiOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTCgwKSxcblx0XHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKDApLFxuXHRcdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoMClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fSxcblx0XHRcdHJnYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH0sXG5cdFx0XHRzbDoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdH0sXG5cdFx0XHRzdjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fSxcblx0XHRcdHh5ejoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goMCksXG5cdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWSgwKSxcblx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH1cblx0XHR9LFxuXHRcdHVuYnJhbmRlZDoge1xuXHRcdFx0Y215azoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGN5YW46IDAsXG5cdFx0XHRcdFx0bWFnZW50YTogMCxcblx0XHRcdFx0XHR5ZWxsb3c6IDAsXG5cdFx0XHRcdFx0a2V5OiAwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9LFxuXHRcdFx0aGV4OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiAnIzAwMDAwMEZGJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9LFxuXHRcdFx0aHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiAwLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IDAsXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiAwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0sXG5cdFx0XHRoc3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IDAsXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHR2YWx1ZTogMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9LFxuXHRcdFx0bGFiOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0bDogMCxcblx0XHRcdFx0XHRhOiAwLFxuXHRcdFx0XHRcdGI6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fSxcblx0XHRcdHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHRsaWdodG5lc3M6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9LFxuXHRcdFx0cmdiOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiAwLFxuXHRcdFx0XHRcdGdyZWVuOiAwLFxuXHRcdFx0XHRcdGJsdWU6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSxcblx0XHRcdHN2OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHR2YWx1ZTogMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH0sXG5cdFx0XHR4eXo6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHR4OiAwLFxuXHRcdFx0XHRcdHk6IDAsXG5cdFx0XHRcdFx0ejogMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjc3M6IHtcblx0XHRjbXlrOiAnY215aygwJSwgMCUsIDAlLCAwJSknLFxuXHRcdGhleDogJyMwMDAwMDAnLFxuXHRcdGhzbDogJ2hzbCgwLCAwJSwgMCUpJyxcblx0XHRoc3Y6ICdoc3YoMCwgMCUsIDAlKScsXG5cdFx0bGFiOiAnbGFiKDAsIDAsIDApJyxcblx0XHRyZ2I6ICdyZ2IoMCwgMCwgMCknLFxuXHRcdHNsOiAnc2woMCUsIDAlKScsXG5cdFx0c3Y6ICdzdigwJSwgMCUpJyxcblx0XHR4eXo6ICd4eXooMCwgMCwgMCknXG5cdH0sXG5cdHN0cmluZ3M6IHtcblx0XHRjbXlrOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRjeWFuOiAnMCcsXG5cdFx0XHRcdG1hZ2VudGE6ICcwJyxcblx0XHRcdFx0eWVsbG93OiAnMCcsXG5cdFx0XHRcdGtleTogJzAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHR9LFxuXHRcdGhleDoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aGV4OiAnIzAwMDAwMCdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0fSxcblx0XHRoc2w6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogJzAnLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiAnMCcsXG5cdFx0XHRcdGxpZ2h0bmVzczogJzAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH0sXG5cdFx0aHN2OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6ICcwJyxcblx0XHRcdFx0c2F0dXJhdGlvbjogJzAnLFxuXHRcdFx0XHR2YWx1ZTogJzAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH0sXG5cdFx0bGFiOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiAnMCcsXG5cdFx0XHRcdGE6ICcwJyxcblx0XHRcdFx0YjogJzAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdH0sXG5cdFx0cmdiOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6ICcwJyxcblx0XHRcdFx0Z3JlZW46ICcwJyxcblx0XHRcdFx0Ymx1ZTogJzAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0sXG5cdFx0c2w6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246ICcwJyxcblx0XHRcdFx0bGlnaHRuZXNzOiAnMCdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHR9LFxuXHRcdHN2OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiAnMCcsXG5cdFx0XHRcdHZhbHVlOiAnMCdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzdidcblx0XHR9LFxuXHRcdHh5ejoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDogJzAnLFxuXHRcdFx0XHR5OiAnMCcsXG5cdFx0XHRcdHo6ICcwJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9XG5cdH1cbn07XG5cbmNvbnN0IG11dGF0aW9uOiBNdXRhdGlvbkxvZyA9IHtcblx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdGtleTogJ2RlZmF1bHRfa2V5Jyxcblx0YWN0aW9uOiAndXBkYXRlJyBhcyAndXBkYXRlJyxcblx0bmV3VmFsdWU6IHsgdmFsdWU6ICduZXdfdmFsdWUnIH0sXG5cdG9sZFZhbHVlOiB7IHZhbHVlOiAnb2xkX3ZhbHVlJyB9LFxuXHRvcmlnaW46ICdERUZBVUxUJ1xufTtcblxuY29uc3QgaWRiOiBEZWZhdWx0RGF0YUludGVyZmFjZVsnaWRiJ10gPSB7XG5cdG11dGF0aW9uXG59O1xuXG5jb25zdCB1bmJyYW5kZWREYXRhOiBVbmJyYW5kZWRQYWxldHRlID0ge1xuXHRpZDogYG51bGwtcGFsZXR0ZS0ke0RhdGUubm93KCl9YCxcblx0aXRlbXM6IFtdLFxuXHRtZXRhZGF0YToge1xuXHRcdGN1c3RvbUNvbG9yOiBmYWxzZSxcblx0XHRmbGFnczoge1xuXHRcdFx0ZW5hYmxlQWxwaGE6IGZhbHNlLFxuXHRcdFx0bGltaXREYXJrbmVzczogZmFsc2UsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBmYWxzZVxuXHRcdH0sXG5cdFx0bmFtZTogJ1VOQlJBTkRFRCBERUZBVUxUIFBBTEVUVEUnLFxuXHRcdHN3YXRjaGVzOiAxLFxuXHRcdHR5cGU6ICc/Pz8nLFxuXHRcdHRpbWVzdGFtcDogJz8/Pydcblx0fVxufTtcblxuY29uc3QgdW5icmFuZGVkSXRlbTogVW5icmFuZGVkUGFsZXR0ZUl0ZW0gPSB7XG5cdGNvbG9yczoge1xuXHRcdG1haW46IHtcblx0XHRcdGNteWs6IHsgY3lhbjogMCwgbWFnZW50YTogMCwgeWVsbG93OiAwLCBrZXk6IDAgfSxcblx0XHRcdGhleDogeyBoZXg6ICcjMDAwMDAwJyB9LFxuXHRcdFx0aHNsOiB7IGh1ZTogMCwgc2F0dXJhdGlvbjogMCwgbGlnaHRuZXNzOiAwIH0sXG5cdFx0XHRoc3Y6IHsgaHVlOiAwLCBzYXR1cmF0aW9uOiAwLCB2YWx1ZTogMCB9LFxuXHRcdFx0bGFiOiB7IGw6IDAsIGE6IDAsIGI6IDAgfSxcblx0XHRcdHJnYjogeyByZWQ6IDAsIGdyZWVuOiAwLCBibHVlOiAwIH0sXG5cdFx0XHR4eXo6IHsgeDogMCwgeTogMCwgejogMCB9XG5cdFx0fSxcblx0XHRzdHJpbmdQcm9wczoge1xuXHRcdFx0Y215azoge1xuXHRcdFx0XHRjeWFuOiAnMCUnLFxuXHRcdFx0XHRtYWdlbnRhOiAnMCUnLFxuXHRcdFx0XHR5ZWxsb3c6ICcwJScsXG5cdFx0XHRcdGtleTogJzAlJ1xuXHRcdFx0fSxcblx0XHRcdGhleDogeyBoZXg6ICcjMDAwMDAwRkYnIH0sXG5cdFx0XHRoc2w6IHsgaHVlOiAnMCcsIHNhdHVyYXRpb246ICcwJScsIGxpZ2h0bmVzczogJzAlJyB9LFxuXHRcdFx0aHN2OiB7IGh1ZTogJzAnLCBzYXR1cmF0aW9uOiAnMCUnLCB2YWx1ZTogJzAlJyB9LFxuXHRcdFx0bGFiOiB7IGw6ICcwJywgYTogJzAnLCBiOiAnMCcgfSxcblx0XHRcdHJnYjogeyByZWQ6ICcwJywgZ3JlZW46ICcwJywgYmx1ZTogJzAnIH0sXG5cdFx0XHR4eXo6IHsgeDogJzAnLCB5OiAnMCcsIHo6ICcwJyB9XG5cdFx0fSxcblx0XHRjc3M6IHtcblx0XHRcdGNteWs6ICdjbXlrKDAlLCAwJSwgMCUsIDEwMCUpJyxcblx0XHRcdGhleDogJyMwMDAwMDAnLFxuXHRcdFx0aHNsOiAnaHNsKDAsIDAlLCAwJSknLFxuXHRcdFx0aHN2OiAnaHN2KDAsIDAlLCAwJSknLFxuXHRcdFx0bGFiOiAnbGFiKDAsIDAsIDApJyxcblx0XHRcdHJnYjogJ3JnYigwLCAwLCAwKScsXG5cdFx0XHR4eXo6ICd4eXooMCwgMCwgMCknXG5cdFx0fVxuXHR9XG59O1xuXG5jb25zdCB1bmJyYW5kZWRTdG9yZWQ6IFVuYnJhbmRlZFN0b3JlZFBhbGV0dGUgPSB7XG5cdHRhYmxlSUQ6IDEsXG5cdHBhbGV0dGU6IHVuYnJhbmRlZERhdGFcbn07XG5cbmNvbnN0IHBhbGV0dGU6IERlZmF1bHREYXRhSW50ZXJmYWNlWydwYWxldHRlJ10gPSB7XG5cdHVuYnJhbmRlZDoge1xuXHRcdGRhdGE6IHVuYnJhbmRlZERhdGEsXG5cdFx0aXRlbTogdW5icmFuZGVkSXRlbSxcblx0XHRzdG9yZWQ6IHVuYnJhbmRlZFN0b3JlZFxuXHR9XG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdERhdGE6IERlZmF1bHREYXRhSW50ZXJmYWNlID0ge1xuXHRjb2xvcnMsXG5cdGlkYixcblx0cGFsZXR0ZVxufSBhcyBjb25zdDtcbiJdfQ==