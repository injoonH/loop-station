import Sketch from "react-p5";
import "p5/lib/addons/p5.sound";
import "./App.css";

const App = () => {
	let pixelRatio;
	var stageWidth;
	var stageHeight;

	const preload = (p5) => {};

	const setup = (p5, parentRef) => {
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(
			parentRef
		);
		pixelRatio = p5.pixelDensity();
		windowResized(p5);
	};

	const windowResized = (p5) => {
		stageWidth = window.innerWidth * pixelRatio;
		stageHeight = window.innerHeight * pixelRatio;
		p5.resizeCanvas(stageWidth, stageHeight);
		p5.scale(pixelRatio, pixelRatio);
	};

	const draw = (p5) => {
		p5.background(0);
	};

	return (
		<div>
			<Sketch
				preload={preload}
				setup={setup}
				draw={draw}
				windowResized={windowResized}
			/>
		</div>
	);
};

export default App;
