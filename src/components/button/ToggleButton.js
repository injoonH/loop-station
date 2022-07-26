import "./ToggleButton.css";

const ToggleButton = ({
	state,
	setState,
	trueComp,
	falseComp,
	trueCb,
	falseCb,
	saveAmpToFiles,
}) => {
	return (
		<div
			className="toggle-btn"
			onClick={() => {
				if (state === true) {
					trueCb();
					saveAmpToFiles();
				} else {
					falseCb();
				}
				setState((curr) => !curr);
				console.log(state);
			}}
		>
			{state ? trueComp : falseComp}
		</div>
	);
};

export default ToggleButton;
