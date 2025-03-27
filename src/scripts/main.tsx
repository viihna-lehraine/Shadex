// File: src/scripts/main.tsx

import ReactDOM from 'react-dom/client';
import App from './react/App.js';
import { bootstrap } from './app/bootstrap.js';
import { registerDependencies } from './app/registry.js';
import { DependencyProvider } from './react/context/DependencyContext.jsx';
import { generatePaletteFnGroup } from './palette/partials/types.js';
import { generateHuesFnGroup } from './palette/partials/hues.js';
import { StorageManager } from './core/services/storage/StorageManager.js';
import { config } from './config/index.js';

async function initializeApp() {
	const { helpers, services } = await bootstrap();
	const { log } = services;

	// Global error handlers
	log.info('Registering global error handlers...', 'STARTUP');
	window.onerror = function (message, source, lineno, colno, error) {
		log.info(
			`Unhandled error: ${message} at ${source}:${lineno}:${colno}`,
			'GLOBAL ERROR HANDLER'
		);
		if (error && error.stack) {
			log.info(`Stack trace:\n${error.stack}`, 'GLOBAL ERROR HANDLER');
		}
		return false;
	};
	window.addEventListener('unhandledrejection', event => {
		log.info(
			`Unhandled promise rejection: ${event.reason}`,
			'GLOBAL ERROR HANDLER'
		);
	});

	log.info('Registering dependencies.', 'STARTUP');
	const deps = await registerDependencies(helpers, services);

	if (config.mode.exposeClasses) {
		window.storageManager = await StorageManager.getInstance(services);
	}

	log.info('Bootstrapping complete. Rendering React App.', 'STARTUP');

	const root = ReactDOM.createRoot(document.getElementById('app')!);
	root.render(
		<DependencyProvider
			value={{
				...deps,
				generatePaletteFns: generatePaletteFnGroup,
				generateHuesFns: generateHuesFnGroup
			}}
		>
			<App />
		</DependencyProvider>
	);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	initializeApp();
}
