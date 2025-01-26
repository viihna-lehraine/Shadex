// File: src/dom/fileUtils.ts

import { DOM_FunctionsMasterInterface } from '../types/index.js';

function download(data: string, filename: string, type: string): void {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
}

function readFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);

		reader.readAsText(file);
	});
}

export const fileUtils: DOM_FunctionsMasterInterface['fileUtils'] = {
	download,
	readFile
};
