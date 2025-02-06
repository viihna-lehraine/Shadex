// File: app/ui/services/event/subServices/Button.js

import {
	AppUtilsInterface,
	DOMDataInterface
} from '../../../../../types/index.js';
import { appUtils } from '../../../../appUtils.js';
import { domData } from '../../../../../data/dom.js';

export class ButtonEventSubService {
	private static instance: ButtonEventSubService | null = null;

	private appUtils: AppUtilsInterface;

	private btnIds: DOMDataInterface['ids']['static']['btns'];

	constructor() {
		this.appUtils = appUtils;

		this.btnIds = domData.ids.static.btns;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new ButtonEventSubService();
		}
		return this.instance;
	}

	public initialize({
		onDesaturate,
		onExport,
		onGenerate
	}: {
		onDesaturate: (selectedColor: number) => void;
		onExport: (format: string) => void;
		onGenerate: (options: object) => void;
	}): void {
		document
			.getElementById(this.btnIds.desaturate)
			?.addEventListener('click', e => {
				e.preventDefault();

				const selectedColor = 0;

				this.appUtils.log(
					'debug',
					'Desaturate button clicked',
					'ButtonEventService.initialize()',
					5
				);

				onDesaturate(selectedColor);
			});

		document
			.getElementById(this.btnIds.export)
			?.addEventListener('click', e => {
				e.preventDefault();

				const format =
					document.getElementById('export-format')?.value || 'json';

				this.appUtils.log(
					'debug',
					`Export button clicked: format = ${format}`,
					'ButtonEventService.initialize()',
					5
				);

				onExport(format);
			});

		document
			.getElementById(this.btnIds.generate)
			?.addEventListener('click', e => {
				e.preventDefault();

				const paletteOptions = {};

				this.appUtils.log(
					'debug',
					'Generate button clicked',
					'ButtonEventService.initialize()',
					5
				);

				onGenerate(paletteOptions);
			});
	}
}
