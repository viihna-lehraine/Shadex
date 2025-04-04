// File: src/scripts/config/partials/regex.ts

import { RegexConfig } from '../../types/index.js';

const number = '\\d+';
const decimal = '[\\d.]+';
const percent = '%?';
const optionalAlpha = '(?:,\\s*([\\d.]+))?';

const colorFunc = (name: string, args: string[]): RegExp => {
	return new RegExp(
		`${name}\\(${args.join(',\\s*')}${optionalAlpha}\\)`,
		'i'
	);
};

export const regex: Readonly<RegexConfig> = {
	brand: { hex: /^#[0-9A-Fa-f]{8}$/ },
	colors: {
		cmyk: colorFunc('cmyk', [
			number + percent,
			number + percent,
			number + percent,
			number + percent
		]),
		hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
		hsl: colorFunc('hsl', [decimal, decimal + percent, decimal + percent]),
		rgb: colorFunc('rgb', [decimal, decimal, decimal])
	},
	css: {
		cmyk: colorFunc('cmyk', [
			number + percent,
			number + percent,
			number + percent,
			number + percent
		]),
		hsl: colorFunc('hsl', [number, number + percent, number + percent]),
		rgb: colorFunc('rgb', [number, number, number])
	},
	dom: {
		hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/i,
		hsl: colorFunc('hsl', [number, decimal + percent, decimal + percent]),
		rgb: colorFunc('rgb', [number, number, number])
	},
	stackTrace: {
		anon: /at\s+(.*?):(\d+):(\d+)/,
		chrome: /at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/,
		electron: /at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/,
		fallback: /(.*?):(\d+):(\d+)/,
		firefox: /(.*?)@(.*?):(\d+):(\d+)/,
		node: /at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/,
		safari: /(.*?)@(.*?):(\d+):(\d+)/,
		workers: /at\s+(.*?):(\d+):(\d+)/
	},
	userInput: {
		hex: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i,
		hsl: colorFunc('hsl', [number, number + percent, number + percent]),
		rgb: colorFunc('rgb', [number, number, number])
	},
	validation: {
		hex: /^#[0-9A-Fa-f]{6}$/,
		hexComponent: /^#[0-9a-fA-F]{2}$/
	}
};
