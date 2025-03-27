// File: src/scripts/react/components/buttons/GenerateButton.tsx

type GenerateButtonProps = {
	onGenerate: () => void;
};

const GenerateButton: React.FC<GenerateButtonProps> = ({ onGenerate }) => {
	return (
		<button id="generate-btn" onClick={onGenerate}>
			Generate 🎲
		</button>
	);
};

export default GenerateButton;
