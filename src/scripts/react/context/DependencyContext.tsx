// src/scripts/context/DependencyContext.tsx

import React, { createContext, useContext } from 'react';
import type {
	AppDependencies,
	GeneratePaletteFnGroup,
	GenerateHuesFnGroup
} from '../../types/index.js';

interface DependencyContextValue extends AppDependencies {
	generatePaletteFns: GeneratePaletteFnGroup;
	generateHuesFns: GenerateHuesFnGroup;
}

const DependencyContext = createContext<DependencyContextValue | null>(null);

export const useDependencies = () => {
	const context = useContext(DependencyContext);
	if (!context) throw new Error('useDependencies must be inside Provider');
	return context;
};

export const DependencyProvider: React.FC<{
	children: React.ReactNode;
	value: DependencyContextValue;
}> = ({ children, value }) => (
	<DependencyContext.Provider value={value}>
		{children}
	</DependencyContext.Provider>
);
