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
                    key: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: brand.asHexSet('#000000'),
                    alpha: brand.asHexComponent('FF'),
                    numAlpha: brand.asAlphaRange(1)
                },
                format: 'hex'
            },
            hsl: {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsl'
            },
            hsv: {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsv'
            },
            lab: {
                value: {
                    l: brand.asLAB_L(0),
                    a: brand.asLAB_A(0),
                    b: brand.asLAB_B(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'lab'
            },
            rgb: {
                value: {
                    red: brand.asByteRange(0),
                    green: brand.asByteRange(0),
                    blue: brand.asByteRange(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'rgb'
            },
            sl: {
                value: {
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sl'
            },
            sv: {
                value: {
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sv'
            },
            xyz: {
                value: {
                    x: brand.asXYZ_X(0),
                    y: brand.asXYZ_Y(0),
                    z: brand.asXYZ_Z(0),
                    alpha: brand.asAlphaRange(1)
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
                    key: 0,
                    alpha: 1
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: '#000000FF',
                    alpha: 'FF',
                    numAlpha: 1
                },
                format: 'hex'
            },
            hsl: {
                value: {
                    hue: 0,
                    saturation: 0,
                    lightness: 0,
                    alpha: 1
                },
                format: 'hsl'
            },
            hsv: {
                value: {
                    hue: 0,
                    saturation: 0,
                    value: 0,
                    alpha: 1
                },
                format: 'hsv'
            },
            lab: {
                value: {
                    l: 0,
                    a: 0,
                    b: 0,
                    alpha: 1
                },
                format: 'lab'
            },
            sl: {
                value: {
                    saturation: 0,
                    lightness: 0,
                    alpha: 1
                },
                format: 'sl'
            },
            rgb: {
                value: {
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 1
                },
                format: 'rgb'
            },
            sv: {
                value: {
                    saturation: 0,
                    value: 0,
                    alpha: 1
                },
                format: 'sv'
            },
            xyz: {
                value: {
                    x: 0,
                    y: 0,
                    z: 0,
                    alpha: 1
                },
                format: 'xyz'
            }
        }
    },
    css: {
        cmyk: 'cmyk(0%, 0%, 0%, 0%, 1)',
        hex: '#000000FF',
        hsl: 'hsl(0, 0%, 0%, 1)',
        hsv: 'hsv(0, 0%, 0%, 1)',
        lab: 'lab(0, 0, 0, 1)',
        rgb: 'rgb(0, 0, 0, 1)',
        sl: 'sl(0%, 0%, 1)',
        sv: 'sv(0%, 0%, 1)',
        xyz: 'xyz(0, 0, 0, 1)'
    },
    strings: {
        cmyk: {
            value: {
                cyan: '0',
                magenta: '0',
                yellow: '0',
                key: '0',
                alpha: '1'
            },
            format: 'cmyk'
        },
        hex: {
            value: {
                hex: '#000000',
                alpha: 'FF',
                numAlpha: '1'
            },
            format: 'hex'
        },
        hsl: {
            value: {
                hue: '0',
                saturation: '0',
                lightness: '0',
                alpha: '1'
            },
            format: 'hsl'
        },
        hsv: {
            value: {
                hue: '0',
                saturation: '0',
                value: '0',
                alpha: '1'
            },
            format: 'hsv'
        },
        lab: {
            value: {
                l: '0',
                a: '0',
                b: '0',
                alpha: '1'
            },
            format: 'lab'
        },
        rgb: {
            value: {
                red: '0',
                green: '0',
                blue: '0',
                alpha: '1'
            },
            format: 'rgb'
        },
        sl: {
            value: {
                saturation: '0',
                lightness: '0',
                alpha: '1'
            },
            format: 'sl'
        },
        sv: {
            value: {
                saturation: '0',
                value: '0',
                alpha: '1'
            },
            format: 'sv'
        },
        xyz: {
            value: {
                x: '0',
                y: '0',
                z: '0',
                alpha: '1'
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
            cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
            hex: { hex: '#000000FF', alpha: 'FF', numAlpha: 1 },
            hsl: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
            hsv: { hue: 0, saturation: 0, value: 0, alpha: 1 },
            lab: { l: 0, a: 0, b: 0, alpha: 1 },
            rgb: { red: 0, green: 0, blue: 0, alpha: 1 },
            xyz: { x: 0, y: 0, z: 0, alpha: 1 }
        },
        stringProps: {
            cmyk: {
                cyan: '0%',
                magenta: '0%',
                yellow: '0%',
                key: '0%',
                alpha: '1'
            },
            hex: { hex: '#000000FF', alpha: 'FF', numAlpha: '1' },
            hsl: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
            hsv: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
            lab: { l: '0', a: '0', b: '0', alpha: '1' },
            rgb: { red: '0', green: '0', blue: '0', alpha: '1' },
            xyz: { x: '0', y: '0', z: '0', alpha: '1' }
        },
        css: {
            cmyk: 'cmyk(0%, 0%, 0%, 100%, 1)',
            hex: '#000000FF',
            hsl: 'hsl(0, 0%, 0%, 0)',
            hsv: 'hsv(0, 0%, 0%, 0)',
            lab: 'lab(0, 0, 0, 0)',
            rgb: 'rgb(0, 0, 0, 1)',
            xyz: 'xyz(0, 0, 0, 0)'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGF0YS9kZWZhdWx0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5QkFBeUI7QUFTekIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTFDLE1BQU0sTUFBTSxHQUFtQztJQUM5QyxJQUFJLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUixJQUFJLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLEdBQUcsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNLEVBQUUsTUFBTTthQUNkO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7b0JBQzlCLEtBQUssRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztvQkFDakMsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29C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YUFDYjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLENBQUM7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsU0FBUyxFQUFFLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLENBQUM7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsS0FBSyxFQUFFLENBQUM7b0JBQ1IsS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sQ0FBQyxFQUFFLENBQUM7b0JBQ0osQ0FBQyxFQUFFLENBQUM7b0JBQ0osQ0FBQyxFQUFFLENBQUM7b0JBQ0osS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEVBQUUsRUFBRTtnQkFDSCxLQUFLLEVBQUU7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsU0FBUyxFQUFFLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLENBQUM7b0JBQ04sS0FBSyxFQUFFLENBQUM7b0JBQ1IsSUFBSSxFQUFFLENBQUM7b0JBQ1AsS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEVBQUUsRUFBRTtnQkFDSCxLQUFLLEVBQUU7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsS0FBSyxFQUFFLENBQUM7b0JBQ1IsS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sQ0FBQyxFQUFFLENBQUM7b0JB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LEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO1NBQzNDO1FBQ0QsR0FBRyxFQUFFO1lBQ0osSUFBSSxFQUFFLDJCQUEyQjtZQUNqQyxHQUFHLEVBQUUsV0FBVztZQUNoQixHQUFHLEVBQUUsbUJBQW1CO1lBQ3hCLEdBQUcsRUFBRSxtQkFBbUI7WUFDeEIsR0FBRyxFQUFFLGlCQUFpQjtZQUN0QixHQUFHLEVBQUUsaUJBQWlCO1lBQ3RCLEdBQUcsRUFBRSxpQkFBaUI7U0FDdEI7S0FDRDtDQUNELENBQUM7QUFFRixNQUFNLGVBQWUsR0FBMkI7SUFDL0MsT0FBTyxFQUFFLENBQUM7SUFDVixPQUFPLEVBQUUsYUFBYTtDQUN0QixDQUFDO0FBRUYsTUFBTSxPQUFPLEdBQW9DO0lBQ2hELFNBQVMsRUFBRTtRQUNWLElBQUksRUFBRSxhQUFhO1FBQ25CLElBQUksRUFBRSxhQUFhO1FBQ25CLE1BQU0sRUFBRSxlQUFlO0tBQ3ZCO0NBQ1EsQ0FBQztBQUVYLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBeUI7SUFDaEQsTUFBTTtJQUNOLEdBQUc7SUFDSCxPQUFPO0NBQ0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGRhdGEvZGVmYXVsdHMuanNcblxuaW1wb3J0IHtcblx0RGVmYXVsdERhdGFJbnRlcmZhY2UsXG5cdE11dGF0aW9uTG9nLFxuXHRVbmJyYW5kZWRQYWxldHRlLFxuXHRVbmJyYW5kZWRQYWxldHRlSXRlbSxcblx0VW5icmFuZGVkU3RvcmVkUGFsZXR0ZVxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBicmFuZCB9IGZyb20gJy4uL2NvbW1vbi9jb3JlLmpzJztcblxuY29uc3QgY29sb3JzOiBEZWZhdWx0RGF0YUludGVyZmFjZVsnY29sb3JzJ10gPSB7XG5cdGJhc2U6IHtcblx0XHRicmFuZGVkOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9LFxuXHRcdFx0aGV4OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMCcpLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudCgnRkYnKSxcblx0XHRcdFx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH0sXG5cdFx0XHRoc2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0sXG5cdFx0XHRoc3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fSxcblx0XHRcdGxhYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woMCksXG5cdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fSxcblx0XHRcdHJnYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSxcblx0XHRcdHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9LFxuXHRcdFx0c3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fSxcblx0XHRcdHh5ejoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goMCksXG5cdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWSgwKSxcblx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dW5icmFuZGVkOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogMCxcblx0XHRcdFx0XHRtYWdlbnRhOiAwLFxuXHRcdFx0XHRcdHllbGxvdzogMCxcblx0XHRcdFx0XHRrZXk6IDAsXG5cdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH0sXG5cdFx0XHRoZXg6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6ICcjMDAwMDAwRkYnLFxuXHRcdFx0XHRcdGFscGhhOiAnRkYnLFxuXHRcdFx0XHRcdG51bUFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH0sXG5cdFx0XHRoc2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IDAsXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHRsaWdodG5lc3M6IDAsXG5cdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSxcblx0XHRcdGhzdjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogMCxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdH0sXG5cdFx0XHRsYWI6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiAwLFxuXHRcdFx0XHRcdGE6IDAsXG5cdFx0XHRcdFx0YjogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9LFxuXHRcdFx0c2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdH0sXG5cdFx0XHRyZ2I6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IDAsXG5cdFx0XHRcdFx0Z3JlZW46IDAsXG5cdFx0XHRcdFx0Ymx1ZTogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9LFxuXHRcdFx0c3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fSxcblx0XHRcdHh5ejoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IDAsXG5cdFx0XHRcdFx0eTogMCxcblx0XHRcdFx0XHR6OiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGNzczoge1xuXHRcdGNteWs6ICdjbXlrKDAlLCAwJSwgMCUsIDAlLCAxKScsXG5cdFx0aGV4OiAnIzAwMDAwMEZGJyxcblx0XHRoc2w6ICdoc2woMCwgMCUsIDAlLCAxKScsXG5cdFx0aHN2OiAnaHN2KDAsIDAlLCAwJSwgMSknLFxuXHRcdGxhYjogJ2xhYigwLCAwLCAwLCAxKScsXG5cdFx0cmdiOiAncmdiKDAsIDAsIDAsIDEpJyxcblx0XHRzbDogJ3NsKDAlLCAwJSwgMSknLFxuXHRcdHN2OiAnc3YoMCUsIDAlLCAxKScsXG5cdFx0eHl6OiAneHl6KDAsIDAsIDAsIDEpJ1xuXHR9LFxuXHRzdHJpbmdzOiB7XG5cdFx0Y215azoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0Y3lhbjogJzAnLFxuXHRcdFx0XHRtYWdlbnRhOiAnMCcsXG5cdFx0XHRcdHllbGxvdzogJzAnLFxuXHRcdFx0XHRrZXk6ICcwJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0fSxcblx0XHRoZXg6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogJyMwMDAwMDAnLFxuXHRcdFx0XHRhbHBoYTogJ0ZGJyxcblx0XHRcdFx0bnVtQWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHR9LFxuXHRcdGhzbDoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiAnMCcsXG5cdFx0XHRcdHNhdHVyYXRpb246ICcwJyxcblx0XHRcdFx0bGlnaHRuZXNzOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fSxcblx0XHRoc3Y6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogJzAnLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiAnMCcsXG5cdFx0XHRcdHZhbHVlOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0fSxcblx0XHRsYWI6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGw6ICcwJyxcblx0XHRcdFx0YTogJzAnLFxuXHRcdFx0XHRiOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0fSxcblx0XHRyZ2I6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogJzAnLFxuXHRcdFx0XHRncmVlbjogJzAnLFxuXHRcdFx0XHRibHVlOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fSxcblx0XHRzbDoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogJzAnLFxuXHRcdFx0XHRsaWdodG5lc3M6ICcwJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3NsJ1xuXHRcdH0sXG5cdFx0c3Y6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246ICcwJyxcblx0XHRcdFx0dmFsdWU6ICcwJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdH0sXG5cdFx0eHl6OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHR4OiAnMCcsXG5cdFx0XHRcdHk6ICcwJyxcblx0XHRcdFx0ejogJzAnLFxuXHRcdFx0XHRhbHBoYTogJzEnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdH1cblx0fVxufTtcblxuY29uc3QgbXV0YXRpb246IE11dGF0aW9uTG9nID0ge1xuXHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0a2V5OiAnZGVmYXVsdF9rZXknLFxuXHRhY3Rpb246ICd1cGRhdGUnIGFzICd1cGRhdGUnLFxuXHRuZXdWYWx1ZTogeyB2YWx1ZTogJ25ld192YWx1ZScgfSxcblx0b2xkVmFsdWU6IHsgdmFsdWU6ICdvbGRfdmFsdWUnIH0sXG5cdG9yaWdpbjogJ0RFRkFVTFQnXG59O1xuXG5jb25zdCBpZGI6IERlZmF1bHREYXRhSW50ZXJmYWNlWydpZGInXSA9IHtcblx0bXV0YXRpb25cbn07XG5cbmNvbnN0IHVuYnJhbmRlZERhdGE6IFVuYnJhbmRlZFBhbGV0dGUgPSB7XG5cdGlkOiBgbnVsbC1wYWxldHRlLSR7RGF0ZS5ub3coKX1gLFxuXHRpdGVtczogW10sXG5cdG1ldGFkYXRhOiB7XG5cdFx0Y3VzdG9tQ29sb3I6IGZhbHNlLFxuXHRcdGZsYWdzOiB7XG5cdFx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGZhbHNlLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGZhbHNlXG5cdFx0fSxcblx0XHRuYW1lOiAnVU5CUkFOREVEIERFRkFVTFQgUEFMRVRURScsXG5cdFx0c3dhdGNoZXM6IDEsXG5cdFx0dHlwZTogJz8/PycsXG5cdFx0dGltZXN0YW1wOiAnPz8/J1xuXHR9XG59O1xuXG5jb25zdCB1bmJyYW5kZWRJdGVtOiBVbmJyYW5kZWRQYWxldHRlSXRlbSA9IHtcblx0Y29sb3JzOiB7XG5cdFx0bWFpbjoge1xuXHRcdFx0Y215azogeyBjeWFuOiAwLCBtYWdlbnRhOiAwLCB5ZWxsb3c6IDAsIGtleTogMCwgYWxwaGE6IDEgfSxcblx0XHRcdGhleDogeyBoZXg6ICcjMDAwMDAwRkYnLCBhbHBoYTogJ0ZGJywgbnVtQWxwaGE6IDEgfSxcblx0XHRcdGhzbDogeyBodWU6IDAsIHNhdHVyYXRpb246IDAsIGxpZ2h0bmVzczogMCwgYWxwaGE6IDEgfSxcblx0XHRcdGhzdjogeyBodWU6IDAsIHNhdHVyYXRpb246IDAsIHZhbHVlOiAwLCBhbHBoYTogMSB9LFxuXHRcdFx0bGFiOiB7IGw6IDAsIGE6IDAsIGI6IDAsIGFscGhhOiAxIH0sXG5cdFx0XHRyZ2I6IHsgcmVkOiAwLCBncmVlbjogMCwgYmx1ZTogMCwgYWxwaGE6IDEgfSxcblx0XHRcdHh5ejogeyB4OiAwLCB5OiAwLCB6OiAwLCBhbHBoYTogMSB9XG5cdFx0fSxcblx0XHRzdHJpbmdQcm9wczoge1xuXHRcdFx0Y215azoge1xuXHRcdFx0XHRjeWFuOiAnMCUnLFxuXHRcdFx0XHRtYWdlbnRhOiAnMCUnLFxuXHRcdFx0XHR5ZWxsb3c6ICcwJScsXG5cdFx0XHRcdGtleTogJzAlJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGhleDogeyBoZXg6ICcjMDAwMDAwRkYnLCBhbHBoYTogJ0ZGJywgbnVtQWxwaGE6ICcxJyB9LFxuXHRcdFx0aHNsOiB7IGh1ZTogJzAnLCBzYXR1cmF0aW9uOiAnMCUnLCBsaWdodG5lc3M6ICcwJScsIGFscGhhOiAnMScgfSxcblx0XHRcdGhzdjogeyBodWU6ICcwJywgc2F0dXJhdGlvbjogJzAlJywgdmFsdWU6ICcwJScsIGFscGhhOiAnMScgfSxcblx0XHRcdGxhYjogeyBsOiAnMCcsIGE6ICcwJywgYjogJzAnLCBhbHBoYTogJzEnIH0sXG5cdFx0XHRyZ2I6IHsgcmVkOiAnMCcsIGdyZWVuOiAnMCcsIGJsdWU6ICcwJywgYWxwaGE6ICcxJyB9LFxuXHRcdFx0eHl6OiB7IHg6ICcwJywgeTogJzAnLCB6OiAnMCcsIGFscGhhOiAnMScgfVxuXHRcdH0sXG5cdFx0Y3NzOiB7XG5cdFx0XHRjbXlrOiAnY215aygwJSwgMCUsIDAlLCAxMDAlLCAxKScsXG5cdFx0XHRoZXg6ICcjMDAwMDAwRkYnLFxuXHRcdFx0aHNsOiAnaHNsKDAsIDAlLCAwJSwgMCknLFxuXHRcdFx0aHN2OiAnaHN2KDAsIDAlLCAwJSwgMCknLFxuXHRcdFx0bGFiOiAnbGFiKDAsIDAsIDAsIDApJyxcblx0XHRcdHJnYjogJ3JnYigwLCAwLCAwLCAxKScsXG5cdFx0XHR4eXo6ICd4eXooMCwgMCwgMCwgMCknXG5cdFx0fVxuXHR9XG59O1xuXG5jb25zdCB1bmJyYW5kZWRTdG9yZWQ6IFVuYnJhbmRlZFN0b3JlZFBhbGV0dGUgPSB7XG5cdHRhYmxlSUQ6IDEsXG5cdHBhbGV0dGU6IHVuYnJhbmRlZERhdGFcbn07XG5cbmNvbnN0IHBhbGV0dGU6IERlZmF1bHREYXRhSW50ZXJmYWNlWydwYWxldHRlJ10gPSB7XG5cdHVuYnJhbmRlZDoge1xuXHRcdGRhdGE6IHVuYnJhbmRlZERhdGEsXG5cdFx0aXRlbTogdW5icmFuZGVkSXRlbSxcblx0XHRzdG9yZWQ6IHVuYnJhbmRlZFN0b3JlZFxuXHR9XG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdERhdGE6IERlZmF1bHREYXRhSW50ZXJmYWNlID0ge1xuXHRjb2xvcnMsXG5cdGlkYixcblx0cGFsZXR0ZVxufSBhcyBjb25zdDtcbiJdfQ==