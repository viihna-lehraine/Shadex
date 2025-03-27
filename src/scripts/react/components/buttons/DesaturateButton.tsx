// File: src/scripts/react/components/buttons/DesaturateButton.tsx

import React from 'react';

type DesaturateButtonProps = {
	onDesaturate: () => void;
};

const DesaturateButton: React.FC<DesaturateButtonProps> = ({
	onDesaturate
}) => {
	return <button onClick={onDesaturate}>Desaturate</button>;
};

export default DesaturateButton;
