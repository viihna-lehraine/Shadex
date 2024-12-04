// File: src/config/idb/schemas/colors.ts

import { z } from 'zod';
import { ColorValueSchema } from './index';

const CMYK = z.object({
	value: ColorValueSchema.CMYKValue,
	format: z.literal('cmyk')
});

const Hex = z.object({
	value: ColorValueSchema.HexValue,
	format: z.literal('hex')
});

const HSL = z.object({
	value: ColorValueSchema.HSLValue,
	format: z.literal('hsl')
});

const HSV = z.object({
	value: ColorValueSchema.HSVValue,
	format: z.literal('hsv')
});

const LAB = z.object({
	value: ColorValueSchema.LABValue,
	format: z.literal('lab')
});

const RGB = z.object({
	value: ColorValueSchema.RGBValue,
	format: z.literal('rgb')
});

const SL = z.object({
	value: ColorValueSchema.SLValue,
	format: z.literal('sl')
});

const SV = z.object({
	value: ColorValueSchema.SVValue,
	format: z.literal('sv')
});

const XYZ = z.object({
	value: ColorValueSchema.XYZValue,
	format: z.literal('xyz')
});

export const ColorSchema = z.union([
	CMYK,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SL,
	SV,
	XYZ
]);
