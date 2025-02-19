// File: common/services/helpers.ts

// File: common/utils/getCallerInfo.ts

export const getCallerInfo = (): string => {
	const stack = new Error().stack;

	if (stack) {
		const stackLines = stack.split('\n');
		for (const line of stackLines) {
			if (
				!line.includes('AppLogger') &&
				!line.includes('ErrorHandler') &&
				!line.includes('createServices') &&
				line.includes('at ')
			) {
				const match =
					line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
					line.match(/at\s+(.*):(\d+):(\d+)/);

				if (match) {
					return match[1]
						? `${match[1]} (${match[2]}:${match[3]})`
						: `${match[2]}:${match[3]}`;
				}
			}
		}
	}

	return 'UNKNOWN CALLER';
};
