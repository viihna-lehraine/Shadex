// File: src/data/defaults/colors/colors.js
import { brand } from '../../common/core/base.js';
export const colors = {
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
    cssColorStrings: {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGEvZGVmYXVsdHMvY29sb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJDQUEyQztBQUczQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbEQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFzQjtJQUN4QyxJQUFJLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUixJQUFJLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLEdBQUcsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNLEVBQUUsTUFBTTthQUNkO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7b0JBQzlCLEtBQUssRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztvQkFDakMsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxZQUFZ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Q0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLENBQUM7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsU0FBUyxFQUFFLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLENBQUM7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsS0FBSyxFQUFFLENBQUM7b0JBQ1IsS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sQ0FBQyxFQUFFLENBQUM7b0JBQ0osQ0FBQyxFQUFFLENBQUM7b0JBQ0osQ0FBQyxFQUFFLENBQUM7b0JBQ0osS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEVBQUUsRUFBRTtnQkFDSCxLQUFLLEVBQUU7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsU0FBUyxFQUFFLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLENBQUM7b0JBQ04sS0FBSyxFQUFFLENBQUM7b0JBQ1IsSUFBSSxFQUFFLENBQUM7b0JBQ1AsS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtZQUNELEVBQUUsRUFBRTtnQkFDSCxLQUFLLEVBQUU7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsS0FBSyxFQUFFLENBQUM7b0JBQ1IsS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWjtZQUNELEdBQUcsRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ04sQ0FBQyxFQUFFLENBQUM7b0JBQ0osQ0FBQyxFQUFFLENBQUM7b0JBQ0osQ0FBQyxFQUFFLENBQUM7b0JBQ0osS0FBSyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYjtTQUNEO0tBQ0Q7SUFDRCxlQUFlLEVBQUU7UUFDaEIsSUFBSSxFQUFFLHlCQUF5QjtRQUMvQixHQUFHLEVBQUUsV0FBVztRQUNoQixHQUFHLEVBQUUsbUJBQW1CO1FBQ3hCLEdBQUcsRUFBRSxtQkFBbUI7UUFDeEIsR0FBRyxFQUFFLGlCQUFpQjtRQUN0QixHQUFHLEVBQUUsaUJBQWlCO1FBQ3RCLEVBQUUsRUFBRSxlQUFlO1FBQ25CLEVBQUUsRUFBRSxlQUFlO1FBQ25CLEdBQUcsRUFBRSxpQkFBaUI7S0FDdEI7SUFDRCxPQUFPLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDTCxLQUFLLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxNQUFNO1NBQ2Q7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLFNBQVM7Z0JBQ2QsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsUUFBUSxFQUFFLEdBQUc7YUFDYjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsU0FBUyxFQUFFLEdBQUc7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxFQUFFLEVBQUU7WUFDSCxLQUFLLEVBQUU7Z0JBQ04sVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsU0FBUyxFQUFFLEdBQUc7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxJQUFJO1NBQ1o7UUFDRCxFQUFFLEVBQUU7WUFDSCxLQUFLLEVBQUU7Z0JBQ04sVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxJQUFJO1NBQ1o7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7S0FDRDtDQUNRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZGF0YS9kZWZhdWx0cy9jb2xvcnMvY29sb3JzLmpzXG5cbmltcG9ydCB7IERlZmF1bHRDb2xvcnNEYXRhIH0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgYnJhbmQgfSBmcm9tICcuLi8uLi9jb21tb24vY29yZS9iYXNlLmpzJztcblxuZXhwb3J0IGNvbnN0IGNvbG9yczogRGVmYXVsdENvbG9yc0RhdGEgPSB7XG5cdGJhc2U6IHtcblx0XHRicmFuZGVkOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9LFxuXHRcdFx0aGV4OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMCcpLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudCgnRkYnKSxcblx0XHRcdFx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH0sXG5cdFx0XHRoc2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0sXG5cdFx0XHRoc3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fSxcblx0XHRcdGxhYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woMCksXG5cdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fSxcblx0XHRcdHJnYjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSxcblx0XHRcdHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9LFxuXHRcdFx0c3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fSxcblx0XHRcdHh5ejoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goMCksXG5cdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWSgwKSxcblx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dW5icmFuZGVkOiB7XG5cdFx0XHRjbXlrOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogMCxcblx0XHRcdFx0XHRtYWdlbnRhOiAwLFxuXHRcdFx0XHRcdHllbGxvdzogMCxcblx0XHRcdFx0XHRrZXk6IDAsXG5cdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH0sXG5cdFx0XHRoZXg6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6ICcjMDAwMDAwRkYnLFxuXHRcdFx0XHRcdGFscGhhOiAnRkYnLFxuXHRcdFx0XHRcdG51bUFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH0sXG5cdFx0XHRoc2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IDAsXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHRsaWdodG5lc3M6IDAsXG5cdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSxcblx0XHRcdGhzdjoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogMCxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdH0sXG5cdFx0XHRsYWI6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiAwLFxuXHRcdFx0XHRcdGE6IDAsXG5cdFx0XHRcdFx0YjogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9LFxuXHRcdFx0c2w6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdH0sXG5cdFx0XHRyZ2I6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IDAsXG5cdFx0XHRcdFx0Z3JlZW46IDAsXG5cdFx0XHRcdFx0Ymx1ZTogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9LFxuXHRcdFx0c3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fSxcblx0XHRcdHh5ejoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IDAsXG5cdFx0XHRcdFx0eTogMCxcblx0XHRcdFx0XHR6OiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGNzc0NvbG9yU3RyaW5nczoge1xuXHRcdGNteWs6ICdjbXlrKDAlLCAwJSwgMCUsIDAlLCAxKScsXG5cdFx0aGV4OiAnIzAwMDAwMEZGJyxcblx0XHRoc2w6ICdoc2woMCwgMCUsIDAlLCAxKScsXG5cdFx0aHN2OiAnaHN2KDAsIDAlLCAwJSwgMSknLFxuXHRcdGxhYjogJ2xhYigwLCAwLCAwLCAxKScsXG5cdFx0cmdiOiAncmdiKDAsIDAsIDAsIDEpJyxcblx0XHRzbDogJ3NsKDAlLCAwJSwgMSknLFxuXHRcdHN2OiAnc3YoMCUsIDAlLCAxKScsXG5cdFx0eHl6OiAneHl6KDAsIDAsIDAsIDEpJ1xuXHR9LFxuXHRzdHJpbmdzOiB7XG5cdFx0Y215azoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0Y3lhbjogJzAnLFxuXHRcdFx0XHRtYWdlbnRhOiAnMCcsXG5cdFx0XHRcdHllbGxvdzogJzAnLFxuXHRcdFx0XHRrZXk6ICcwJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0fSxcblx0XHRoZXg6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogJyMwMDAwMDAnLFxuXHRcdFx0XHRhbHBoYTogJ0ZGJyxcblx0XHRcdFx0bnVtQWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHR9LFxuXHRcdGhzbDoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiAnMCcsXG5cdFx0XHRcdHNhdHVyYXRpb246ICcwJyxcblx0XHRcdFx0bGlnaHRuZXNzOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fSxcblx0XHRoc3Y6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogJzAnLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiAnMCcsXG5cdFx0XHRcdHZhbHVlOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0fSxcblx0XHRsYWI6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGw6ICcwJyxcblx0XHRcdFx0YTogJzAnLFxuXHRcdFx0XHRiOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0fSxcblx0XHRyZ2I6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogJzAnLFxuXHRcdFx0XHRncmVlbjogJzAnLFxuXHRcdFx0XHRibHVlOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fSxcblx0XHRzbDoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogJzAnLFxuXHRcdFx0XHRsaWdodG5lc3M6ICcwJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3NsJ1xuXHRcdH0sXG5cdFx0c3Y6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246ICcwJyxcblx0XHRcdFx0dmFsdWU6ICcwJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdH0sXG5cdFx0eHl6OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHR4OiAnMCcsXG5cdFx0XHRcdHk6ICcwJyxcblx0XHRcdFx0ejogJzAnLFxuXHRcdFx0XHRhbHBoYTogJzEnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdH1cblx0fVxufSBhcyBjb25zdDtcbiJdfQ==