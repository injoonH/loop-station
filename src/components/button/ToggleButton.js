import "./ToggleButton.css";

const ToggleButton = ({
	state,
	setState,
	trueComp,
	falseComp,
	trueCb,
	falseCb,
	getStreamData,
}) => {
	return (
		<div
			className="toggle-btn"
			onClick={() => {
				if (state === true) {
					trueCb();
				} else {
					falseCb();
				}
				setState((curr) => !curr);
			}}
		>
			{state ? trueComp : falseComp}
		</div>
	);
};

export default ToggleButton;
