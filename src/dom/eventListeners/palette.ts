// File: dom/eventListeners/palette.js

import { createLogger } from '../../logger/factory.js';
import { domData } from '../../data/dom.js';
import { modeData as mode } from '../../data/mode.js';
import { parse as parseDom } from '../parse.js';

const domClasses = domData.classes;
const logMode = mode.logging;

const thisModule = 'dom/eventListeners/groups/palette.js';

const logger = await createLogger();

function initLiveColorRender(): void {
	document.querySelectorAll(domClasses.colorInput).forEach(input => {
		input.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const parsedColor = parseDom.colorInput(target);

			if (parsedColor) {
				if (!mode.quiet && logMode.debug && logMode.verbosity > 1) {
					logger.debug(
						`Parsed color: ${JSON.stringify(parsedColor)}`,
						`${thisModule}`
					);
				}

				const swatch = target
					.closest(domClasses.colorStripe)
					?.querySelector(
						domClasses.colorSwatch
					) as HTMLElement | null;

				if (swatch) {
					swatch.style.backgroundColor =
						parsedColor.format === 'hex'
							? parsedColor.value.hex
							: parsedColor.format === 'rgb'
								? `rgb(${parsedColor.value.red}, ${parsedColor.value.green}, ${parsedColor.value.blue})`
								: `hsl(${parsedColor.value.hue}, ${parsedColor.value.saturation}%, ${parsedColor.value.lightness}%)`;
				}
			} else {
				if (!mode.quiet && logMode.warn) {
					logger.warn(
						`Invalid color input: ${target.value}`,
						`${thisModule}`
					);
				}
			}
		});
	});
}

export const paletteListeners = {
	initialize: {
		liveColorRender: initLiveColorRender
	}
};
