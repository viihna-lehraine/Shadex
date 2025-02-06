// File: app/ui/services/Validation.js

import {
	AppUtilsInterface,
	ValidationService_ClassInterface
} from '../../../types/index.js';
import { appUtils } from '../../appUtils.js';
import { domData } from '../../../data/dom.js';

export class ValidationService implements ValidationService_ClassInterface {
	private static instance: ValidationService | null = null;

	private appUtils: AppUtilsInterface;

	constructor() {
		this.appUtils = appUtils;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new ValidationService();
		}

		return this.instance;
	}

	public validateStaticElements(): void {
		const missingElements: string[] = [];
		const allIDs: string[] = Object.values(domData.ids.static).flatMap(
			category => Object.values(category)
		);

		allIDs.forEach((id: string) => {
			const element = document.getElementById(id);
			if (!element) {
				this.appUtils.log(
					'error',
					`Element with ID "${id}" not found`,
					'ValidationService.validateStaticElements()',
					2
				);
				missingElements.push(id);
			}
		});

		if (missingElements.length) {
			this.appUtils.log(
				'warn',
				`Missing elements: ${missingElements.join(', ')}`,
				'ValidationService.validateStaticElements()',
				2
			);
		} else {
			this.appUtils.log(
				'debug',
				'All required DOM elements are present.',
				'ValidationService.validateStaticElements()',
				3
			);
		}
	}
}
