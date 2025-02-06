// File: app/ui/services/io/subServices/IOFile.js

import { domUtils } from '../../../domUtils.js';

export class IOFileSubService {
	private static instance: IOFileSubService | null = null;

	private constructor() {}

	public static getInstance(): IOFileSubService {
		if (!this.instance) {
			this.instance = new IOFileSubService();
		}

		return this.instance;
	}

	public async readFile(file: File): Promise<string> {
		return domUtils.readFile(file);
	}

	public async saveFile(
		data: string,
		filename: string,
		format: 'css' | 'json' | 'xml'
	): Promise<void> {
		const mimeType = {
			css: 'text/css',
			json: 'application/json',
			xml: 'application/xml'
		}[format];

		domUtils.downloadFile(data, filename, mimeType);
	}

	public detectFileType(data: string): 'css' | 'json' | 'xml' {
		if (data.trim().startsWith('{')) return 'json';
		if (data.trim().startsWith('<')) return 'xml';

		return 'css';
	}
}
