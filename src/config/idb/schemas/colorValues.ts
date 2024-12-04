// File: src/config/idb/schemas/colorValues.ts

import { z } from 'zod';

const CMYKValue = z.object({
	cyan: z.number().min(0).max(100),
	magenta: z.number().min(0).max(100),
	yellow: z.number().min(0).max(100),
	black: z.number().min(0).max(100),
	alpha: z.number().min(0).max(1)
});

const HexValue = z.object({
	hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
	alpha: z.string().regex(/^#[0-9A-Fa-f]{2}$/),
	numAlpha: z.number().min(0).max(1)
});

const HSLValue = z.object({
	hue: z.number().min(0).max(360),
	saturation: z.number().min(0).max(100),
	lightness: z.number().min(0).max(100),
	alpha: z.number().min(0).max(1)
});

const HSVValue = z.object({
	hue: z.number().min(0).max(360),
	saturation: z.number().min(0).max(100),
	value: z.number().min(0).max(100),
	alpha: z.number().min(0).max(1)
});

const LABValue = z.object({
	l: z.number().min(0).max(100),
	a: z.number().min(-128).max(127),
	b: z.number().min(-128).max(127),
	alpha: z.number().min(0).max(1)
});

const RGBValue = z.object({
	red: z.number().min(0).max(255),
	green: z.number().min(0).max(255),
	blue: z.number().min(0).max(255),
	alpha: z.number().min(0).max(1)
});

const SLValue = z.object({
	saturation: z.number().min(0).max(100),
	lightness: z.number().min(0).max(100),
	alpha: z.number().min(0).max(1)
});

const SVValue = z.object({
	saturation: z.number().min(0).max(100),
	value: z.number().min(0).max(100),
	alpha: z.number().min(0).max(1)
});

const XYZValue = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number(),
	alpha: z.number().min(0).max(1)
});

export const ColorValueSchema = z.union([
	CMYKValue,
	HexValue,
	HSLValue,
	HSVValue,
	LABValue,
	RGBValue,
	SLValue,
	SVValue,
	XYZValue
]);
