// File: app/ui/services/event/Event.js

import {
	AppUtilsInterface,
	EventService_ClassInterface
} from '../../../../types/index.js';
import { ButtonEventSubService as ButtonSubService } from './subServices/Button.js';
import { DragAndDropEventSubService as DragAndDropSubService } from './subServices/DragAndDrop.js';
import { PaletteEventSubService as PaletteSubService } from './subServices/Palette.js';
import { TooltipEventSubService as TooltipSubService } from './subServices/Tooltip.js';
import { WindowEventSubService as WindowSubService } from './subServices/Window.js';
import { appUtils } from '../../../appUtils.js';

export class EventService implements EventService_ClassInterface {
	private static instance: EventService | null = null;

	private appUtils: AppUtilsInterface;

	constructor(
		private buttonSubService: ButtonSubService,
		private dragAndDropSubService: DragAndDropSubService,
		private paletteSubService: PaletteSubService,
		private tooltipSubService: TooltipSubService,
		private windowSubService: WindowSubService
	) {
		this.appUtils = appUtils;
	}

	public static async getInstance() {
		if (!this.instance) {
			const buttonSubService = await ButtonSubService.getInstance();
			const dragAndDropSubService =
				await DragAndDropSubService.getInstance();
			const paletteSubService = await PaletteSubService.getInstance();
			const tooltipSubService = await TooltipSubService.getInstance();
			const windowSubService = await WindowSubService.getInstance();

			this.instance = new EventService(
				buttonSubService,
				dragAndDropSubService,
				paletteSubService,
				tooltipSubService,
				windowSubService
			);
		}

		return this.instance;
	}

	public async initialize() {
		this.buttonSubService.initialize({
			onDesaturate: (selectedColor: number) => {
				console.log(`Desaturate Color: ${selectedColor}`);
			},
			onExport: (format: string) => {
				console.log(`Exporting in format: ${format}`);
			},
			onGenerate: (options: object) => {
				this.appUtils.log(
					'debug',
					`Generating palette with options:, ${options}`,
					'EventService.initialize()',
					3
				);
			}
		});
		this.dragAndDropSubService.initialize();
		this.paletteSubService.initialize();
		this.tooltipSubService.initialize();
		this.windowSubService.initialize();
	}

	public saturateColor(): void {
		this.paletteSubService.saturateColor();
	}

	public showToast(message: string): void {
		this.tooltipSubService.showToast(message);
	}

	public showTooltip(tooltipElement: HTMLElement): void {
		this.tooltipSubService.showTooltip(tooltipElement);
	}
}
