// File: data/defaults.js
import { brand } from '../common/core.js';
const brandedData = {
    id: `null-palette-${Date.now()}`,
    items: [],
    metadata: {
        flags: {
            limitDark: false,
            limitGray: false,
            limitLight: false
        },
        name: 'BRANDED DEFAULT PALETTE',
        swatches: 1,
        type: '???',
        timestamp: '???'
    }
};
const brandedItem = {
    colors: {
        main: {
            cmyk: {
                cyan: brand.asPercentile(0),
                magenta: brand.asPercentile(0),
                yellow: brand.asPercentile(0),
                key: brand.asPercentile(0)
            },
            hex: { hex: brand.asHexSet('#000000') },
            hsl: {
                hue: brand.asRadial(0),
                saturation: brand.asPercentile(0),
                lightness: brand.asPercentile(0)
            },
            hsv: {
                hue: brand.asRadial(0),
                saturation: brand.asPercentile(0),
                value: brand.asPercentile(0)
            },
            lab: {
                l: brand.asLAB_L(0),
                a: brand.asLAB_A(0),
                b: brand.asLAB_B(0)
            },
            rgb: {
                red: brand.asByteRange(0),
                green: brand.asByteRange(0),
                blue: brand.asByteRange(0)
            },
            xyz: {
                x: brand.asXYZ_X(0),
                y: brand.asXYZ_Y(0),
                z: brand.asXYZ_Z(0)
            }
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
const brandedStoredPalette = {
    tableID: 1,
    palette: brandedData
};
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
const paletteOptions = {
    flags: {
        limitDark: false,
        limitGray: false,
        limitLight: false
    },
    swatches: 6,
    type: 1
};
const unbrandedData = {
    id: `null-branded-palette-${Date.now()}`,
    items: [],
    metadata: {
        flags: {
            limitDark: false,
            limitGray: false,
            limitLight: false
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
const unbrandedStoredPalette = {
    tableID: 1,
    palette: unbrandedData
};
const palette = {
    branded: {
        data: brandedData,
        item: brandedItem,
        stored: brandedStoredPalette
    },
    unbranded: {
        data: unbrandedData,
        item: unbrandedItem,
        stored: unbrandedStoredPalette
    }
};
export const defaultData = {
    colors,
    idb,
    palette,
    paletteOptions
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGF0YS9kZWZhdWx0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5QkFBeUI7QUFhekIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTFDLE1BQU0sV0FBVyxHQUFZO0lBQzVCLEVBQUUsRUFBRSxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2hDLEtBQUssRUFBRSxFQUFFO0lBQ1QsUUFBUSxFQUFFO1FBQ1QsS0FBSyxFQUFFO1lBQ04sU0FBUyxFQUFFLEtBQUs7WUFDaEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsVUFBVSxFQUFFLEtBQUs7U0FDakI7UUFDRCxJQUFJLEVBQUUseUJBQXlCO1FBQy9CLFFBQVEsRUFBRSxDQUFDO1FBQ1gsSUFBSSxFQUFFLEtBQUs7UUFDWCxTQUFTLEVBQUUsS0FBSztLQUNoQjtDQUNELENBQUM7QUFFRixNQUFNLFdBQVcsR0FBZ0I7SUFDaEMsTUFBTSxFQUFFO1FBQ1AsSUFBSSxFQUFFO1lBQ0wsSUFBSSxFQUFFO2dCQUNMLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLEdBQUcsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzthQUMxQjtZQUNELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3ZDLEdBQUcsRUFBRTtnQkFDSixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDakMs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c0NvbnRlbnQiOlsiLy8gRmlsZTogZGF0YS9kZWZhdWx0cy5qc1xuXG5pbXBvcnQge1xuXHREZWZhdWx0RGF0YUludGVyZmFjZSxcblx0TXV0YXRpb25Mb2csXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVJdGVtLFxuXHRQYWxldHRlT3B0aW9ucyxcblx0U3RvcmVkUGFsZXR0ZSxcblx0VW5icmFuZGVkUGFsZXR0ZSxcblx0VW5icmFuZGVkUGFsZXR0ZUl0ZW0sXG5cdFVuYnJhbmRlZFN0b3JlZFBhbGV0dGVcbn0gZnJvbSAnLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgYnJhbmQgfSBmcm9tICcuLi9jb21tb24vY29yZS5qcyc7XG5cbmNvbnN0IGJyYW5kZWREYXRhOiBQYWxldHRlID0ge1xuXHRpZDogYG51bGwtcGFsZXR0ZS0ke0RhdGUubm93KCl9YCxcblx0aXRlbXM6IFtdLFxuXHRtZXRhZGF0YToge1xuXHRcdGZsYWdzOiB7XG5cdFx0XHRsaW1pdERhcms6IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5OiBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHQ6IGZhbHNlXG5cdFx0fSxcblx0XHRuYW1lOiAnQlJBTkRFRCBERUZBVUxUIFBBTEVUVEUnLFxuXHRcdHN3YXRjaGVzOiAxLFxuXHRcdHR5cGU6ICc/Pz8nLFxuXHRcdHRpbWVzdGFtcDogJz8/Pydcblx0fVxufTtcblxuY29uc3QgYnJhbmRlZEl0ZW06IFBhbGV0dGVJdGVtID0ge1xuXHRjb2xvcnM6IHtcblx0XHRtYWluOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0a2V5OiBicmFuZC5hc1BlcmNlbnRpbGUoMClcblx0XHRcdH0sXG5cdFx0XHRoZXg6IHsgaGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMCcpIH0sXG5cdFx0XHRoc2w6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0fSxcblx0XHRcdGhzdjoge1xuXHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMClcblx0XHRcdH0sXG5cdFx0XHRsYWI6IHtcblx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTCgwKSxcblx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQigwKVxuXHRcdFx0fSxcblx0XHRcdHJnYjoge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKDApXG5cdFx0XHR9LFxuXHRcdFx0eHl6OiB7XG5cdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goMCksXG5cdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koMCksXG5cdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooMClcblx0XHRcdH1cblx0XHR9LFxuXHRcdHN0cmluZ1Byb3BzOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdGN5YW46ICcwJScsXG5cdFx0XHRcdG1hZ2VudGE6ICcwJScsXG5cdFx0XHRcdHllbGxvdzogJzAlJyxcblx0XHRcdFx0a2V5OiAnMCUnXG5cdFx0XHR9LFxuXHRcdFx0aGV4OiB7IGhleDogJyMwMDAwMDBGRicgfSxcblx0XHRcdGhzbDogeyBodWU6ICcwJywgc2F0dXJhdGlvbjogJzAlJywgbGlnaHRuZXNzOiAnMCUnIH0sXG5cdFx0XHRoc3Y6IHsgaHVlOiAnMCcsIHNhdHVyYXRpb246ICcwJScsIHZhbHVlOiAnMCUnIH0sXG5cdFx0XHRsYWI6IHsgbDogJzAnLCBhOiAnMCcsIGI6ICcwJyB9LFxuXHRcdFx0cmdiOiB7IHJlZDogJzAnLCBncmVlbjogJzAnLCBibHVlOiAnMCcgfSxcblx0XHRcdHh5ejogeyB4OiAnMCcsIHk6ICcwJywgejogJzAnIH1cblx0XHR9LFxuXHRcdGNzczoge1xuXHRcdFx0Y215azogJ2NteWsoMCUsIDAlLCAwJSwgMTAwJSknLFxuXHRcdFx0aGV4OiAnIzAwMDAwMCcsXG5cdFx0XHRoc2w6ICdoc2woMCwgMCUsIDAlKScsXG5cdFx0XHRoc3Y6ICdoc3YoMCwgMCUsIDAlKScsXG5cdFx0XHRsYWI6ICdsYWIoMCwgMCwgMCknLFxuXHRcdFx0cmdiOiAncmdiKDAsIDAsIDApJyxcblx0XHRcdHh5ejogJ3h5eigwLCAwLCAwKSdcblx0XHR9XG5cdH1cbn07XG5cbmNvbnN0IGJyYW5kZWRTdG9yZWRQYWxldHRlOiBTdG9yZWRQYWxldHRlID0ge1xuXHR0YWJsZUlEOiAxLFxuXHRwYWxldHRlOiBicmFuZGVkRGF0YVxufTtcblxuY29uc3QgY29sb3JzOiBEZWZhdWx0RGF0YUludGVyZmFjZVsnY29sb3JzJ10gPSB7XG5cdGJhc2U6IHtcblx0XHRicmFuZGVkOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0fSxcblx0XHRcdGhleDoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoJyMwMDAwMDAnKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9LFxuXHRcdFx0aHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSxcblx0XHRcdGhzdjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fSxcblx0XHRcdGxhYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woMCksXG5cdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH0sXG5cdFx0XHRyZ2I6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9LFxuXHRcdFx0c2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9LFxuXHRcdFx0c3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH0sXG5cdFx0XHR4eXo6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKDApLFxuXHRcdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koMCksXG5cdFx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWigwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR1bmJyYW5kZWQ6IHtcblx0XHRcdGNteWs6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRjeWFuOiAwLFxuXHRcdFx0XHRcdG1hZ2VudGE6IDAsXG5cdFx0XHRcdFx0eWVsbG93OiAwLFxuXHRcdFx0XHRcdGtleTogMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0fSxcblx0XHRcdGhleDoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogJyMwMDAwMDBGRidcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0fSxcblx0XHRcdGhzbDoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogMCxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9LFxuXHRcdFx0aHN2OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiAwLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IDAsXG5cdFx0XHRcdFx0dmFsdWU6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fSxcblx0XHRcdGxhYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IDAsXG5cdFx0XHRcdFx0YTogMCxcblx0XHRcdFx0XHRiOiAwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH0sXG5cdFx0XHRzbDoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IDAsXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiAwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3NsJ1xuXHRcdFx0fSxcblx0XHRcdHJnYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogMCxcblx0XHRcdFx0XHRncmVlbjogMCxcblx0XHRcdFx0XHRibHVlOiAwXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH0sXG5cdFx0XHRzdjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IDAsXG5cdFx0XHRcdFx0dmFsdWU6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc3YnXG5cdFx0XHR9LFxuXHRcdFx0eHl6OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0eDogMCxcblx0XHRcdFx0XHR5OiAwLFxuXHRcdFx0XHRcdHo6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Y3NzOiB7XG5cdFx0Y215azogJ2NteWsoMCUsIDAlLCAwJSwgMCUpJyxcblx0XHRoZXg6ICcjMDAwMDAwJyxcblx0XHRoc2w6ICdoc2woMCwgMCUsIDAlKScsXG5cdFx0aHN2OiAnaHN2KDAsIDAlLCAwJSknLFxuXHRcdGxhYjogJ2xhYigwLCAwLCAwKScsXG5cdFx0cmdiOiAncmdiKDAsIDAsIDApJyxcblx0XHRzbDogJ3NsKDAlLCAwJSknLFxuXHRcdHN2OiAnc3YoMCUsIDAlKScsXG5cdFx0eHl6OiAneHl6KDAsIDAsIDApJ1xuXHR9LFxuXHRzdHJpbmdzOiB7XG5cdFx0Y215azoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0Y3lhbjogJzAnLFxuXHRcdFx0XHRtYWdlbnRhOiAnMCcsXG5cdFx0XHRcdHllbGxvdzogJzAnLFxuXHRcdFx0XHRrZXk6ICcwJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0fSxcblx0XHRoZXg6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogJyMwMDAwMDAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdH0sXG5cdFx0aHNsOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6ICcwJyxcblx0XHRcdFx0c2F0dXJhdGlvbjogJzAnLFxuXHRcdFx0XHRsaWdodG5lc3M6ICcwJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9LFxuXHRcdGhzdjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiAnMCcsXG5cdFx0XHRcdHNhdHVyYXRpb246ICcwJyxcblx0XHRcdFx0dmFsdWU6ICcwJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9LFxuXHRcdGxhYjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0bDogJzAnLFxuXHRcdFx0XHRhOiAnMCcsXG5cdFx0XHRcdGI6ICcwJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHR9LFxuXHRcdHJnYjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiAnMCcsXG5cdFx0XHRcdGdyZWVuOiAnMCcsXG5cdFx0XHRcdGJsdWU6ICcwJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9LFxuXHRcdHNsOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiAnMCcsXG5cdFx0XHRcdGxpZ2h0bmVzczogJzAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0fSxcblx0XHRzdjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogJzAnLFxuXHRcdFx0XHR2YWx1ZTogJzAnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc3YnXG5cdFx0fSxcblx0XHR4eXo6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6ICcwJyxcblx0XHRcdFx0eTogJzAnLFxuXHRcdFx0XHR6OiAnMCdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fVxuXHR9XG59O1xuXG5jb25zdCBtdXRhdGlvbjogTXV0YXRpb25Mb2cgPSB7XG5cdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRrZXk6ICdkZWZhdWx0X2tleScsXG5cdGFjdGlvbjogJ3VwZGF0ZScgYXMgJ3VwZGF0ZScsXG5cdG5ld1ZhbHVlOiB7IHZhbHVlOiAnbmV3X3ZhbHVlJyB9LFxuXHRvbGRWYWx1ZTogeyB2YWx1ZTogJ29sZF92YWx1ZScgfSxcblx0b3JpZ2luOiAnREVGQVVMVCdcbn07XG5cbmNvbnN0IGlkYjogRGVmYXVsdERhdGFJbnRlcmZhY2VbJ2lkYiddID0ge1xuXHRtdXRhdGlvblxufTtcblxuY29uc3QgcGFsZXR0ZU9wdGlvbnM6IFBhbGV0dGVPcHRpb25zID0ge1xuXHRmbGFnczoge1xuXHRcdGxpbWl0RGFyazogZmFsc2UsXG5cdFx0bGltaXRHcmF5OiBmYWxzZSxcblx0XHRsaW1pdExpZ2h0OiBmYWxzZVxuXHR9LFxuXHRzd2F0Y2hlczogNixcblx0dHlwZTogMVxufTtcblxuY29uc3QgdW5icmFuZGVkRGF0YTogVW5icmFuZGVkUGFsZXR0ZSA9IHtcblx0aWQ6IGBudWxsLWJyYW5kZWQtcGFsZXR0ZS0ke0RhdGUubm93KCl9YCxcblx0aXRlbXM6IFtdLFxuXHRtZXRhZGF0YToge1xuXHRcdGZsYWdzOiB7XG5cdFx0XHRsaW1pdERhcms6IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5OiBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHQ6IGZhbHNlXG5cdFx0fSxcblx0XHRuYW1lOiAnVU5CUkFOREVEIERFRkFVTFQgUEFMRVRURScsXG5cdFx0c3dhdGNoZXM6IDEsXG5cdFx0dHlwZTogJz8/PycsXG5cdFx0dGltZXN0YW1wOiAnPz8/J1xuXHR9XG59O1xuXG5jb25zdCB1bmJyYW5kZWRJdGVtOiBVbmJyYW5kZWRQYWxldHRlSXRlbSA9IHtcblx0Y29sb3JzOiB7XG5cdFx0bWFpbjoge1xuXHRcdFx0Y215azogeyBjeWFuOiAwLCBtYWdlbnRhOiAwLCB5ZWxsb3c6IDAsIGtleTogMCB9LFxuXHRcdFx0aGV4OiB7IGhleDogJyMwMDAwMDAnIH0sXG5cdFx0XHRoc2w6IHsgaHVlOiAwLCBzYXR1cmF0aW9uOiAwLCBsaWdodG5lc3M6IDAgfSxcblx0XHRcdGhzdjogeyBodWU6IDAsIHNhdHVyYXRpb246IDAsIHZhbHVlOiAwIH0sXG5cdFx0XHRsYWI6IHsgbDogMCwgYTogMCwgYjogMCB9LFxuXHRcdFx0cmdiOiB7IHJlZDogMCwgZ3JlZW46IDAsIGJsdWU6IDAgfSxcblx0XHRcdHh5ejogeyB4OiAwLCB5OiAwLCB6OiAwIH1cblx0XHR9LFxuXHRcdHN0cmluZ1Byb3BzOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdGN5YW46ICcwJScsXG5cdFx0XHRcdG1hZ2VudGE6ICcwJScsXG5cdFx0XHRcdHllbGxvdzogJzAlJyxcblx0XHRcdFx0a2V5OiAnMCUnXG5cdFx0XHR9LFxuXHRcdFx0aGV4OiB7IGhleDogJyMwMDAwMDBGRicgfSxcblx0XHRcdGhzbDogeyBodWU6ICcwJywgc2F0dXJhdGlvbjogJzAlJywgbGlnaHRuZXNzOiAnMCUnIH0sXG5cdFx0XHRoc3Y6IHsgaHVlOiAnMCcsIHNhdHVyYXRpb246ICcwJScsIHZhbHVlOiAnMCUnIH0sXG5cdFx0XHRsYWI6IHsgbDogJzAnLCBhOiAnMCcsIGI6ICcwJyB9LFxuXHRcdFx0cmdiOiB7IHJlZDogJzAnLCBncmVlbjogJzAnLCBibHVlOiAnMCcgfSxcblx0XHRcdHh5ejogeyB4OiAnMCcsIHk6ICcwJywgejogJzAnIH1cblx0XHR9LFxuXHRcdGNzczoge1xuXHRcdFx0Y215azogJ2NteWsoMCUsIDAlLCAwJSwgMTAwJSknLFxuXHRcdFx0aGV4OiAnIzAwMDAwMCcsXG5cdFx0XHRoc2w6ICdoc2woMCwgMCUsIDAlKScsXG5cdFx0XHRoc3Y6ICdoc3YoMCwgMCUsIDAlKScsXG5cdFx0XHRsYWI6ICdsYWIoMCwgMCwgMCknLFxuXHRcdFx0cmdiOiAncmdiKDAsIDAsIDApJyxcblx0XHRcdHh5ejogJ3h5eigwLCAwLCAwKSdcblx0XHR9XG5cdH1cbn07XG5cbmNvbnN0IHVuYnJhbmRlZFN0b3JlZFBhbGV0dGU6IFVuYnJhbmRlZFN0b3JlZFBhbGV0dGUgPSB7XG5cdHRhYmxlSUQ6IDEsXG5cdHBhbGV0dGU6IHVuYnJhbmRlZERhdGFcbn07XG5cbmNvbnN0IHBhbGV0dGU6IERlZmF1bHREYXRhSW50ZXJmYWNlWydwYWxldHRlJ10gPSB7XG5cdGJyYW5kZWQ6IHtcblx0XHRkYXRhOiBicmFuZGVkRGF0YSxcblx0XHRpdGVtOiBicmFuZGVkSXRlbSxcblx0XHRzdG9yZWQ6IGJyYW5kZWRTdG9yZWRQYWxldHRlXG5cdH0sXG5cdHVuYnJhbmRlZDoge1xuXHRcdGRhdGE6IHVuYnJhbmRlZERhdGEsXG5cdFx0aXRlbTogdW5icmFuZGVkSXRlbSxcblx0XHRzdG9yZWQ6IHVuYnJhbmRlZFN0b3JlZFBhbGV0dGVcblx0fVxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHREYXRhOiBEZWZhdWx0RGF0YUludGVyZmFjZSA9IHtcblx0Y29sb3JzLFxuXHRpZGIsXG5cdHBhbGV0dGUsXG5cdHBhbGV0dGVPcHRpb25zXG59IGFzIGNvbnN0O1xuIl19