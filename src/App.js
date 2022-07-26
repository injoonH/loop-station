import "./App.css";
import AudioEntry from "./components/AudioEntry";
import { AudioPlayerProvider } from "react-use-audio-player";
import AudioRecorder from "./components/AudioRecorder";
import { useState } from "react";

const App = () => {
	const [soundFiles, setSoundFiles] = useState([]);
	const urls = [
		"http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3",
		"http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg",
		"http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg",
	];
	return (
		<div className="audio-container">
			<div>
				{urls.map((url) => (
					<AudioPlayerProvider
						className={"audio-player-provider"}
						key={url}
					>
						<AudioEntry audioFile={url} />
					</AudioPlayerProvider>
				))}
			</div>
			<AudioRecorder
				soundFiles={soundFiles}
				setSoundFiles={setSoundFiles}
			/>
		</div>
	);
};

export default App;
