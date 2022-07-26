import { useRef, useState, useEffect } from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
	BsFillPauseFill,
	BsFillPlayFill,
	BsCheckLg,
	BsPenFill,
} from "react-icons/bs";
import "react-circular-progressbar/dist/styles.css";
import "./AudioEntry.css";

const AudioEntry = ({ audioFile }) => {
	let canvas;
	let ctx;
	const canvasRef = useRef();

	useEffect(() => {
		canvas = canvasRef.current;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		ctx = canvas.getContext("2d");
		window.requestAnimationFrame(draw);
	});

	const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
		src: audioFile,
		autoplay: false,
		loop: true,
	});
	const { percentComplete } = useAudioPosition({
		highRefreshRate: true,
	});

	const [name, setName] = useState("Audio");
	const [isEditingName, setIsEditingName] = useState(false);

	const toggleIsEditingName = () => setIsEditingName((curr) => !curr);

	const draw = () => {
		ctx.fillStyle = "rgb(10,10,10)";
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.lineWidth = 2;
		// console.log(percentComplete);
		ctx.beginPath();
		ctx.moveTo((canvas.width / 100) * percentComplete, 0);
		ctx.lineTo((canvas.width / 100) * percentComplete, canvas.height);
		ctx.stroke();
		ctx.closePath();
		window.requestAnimationFrame(draw);
	};

	if (!(ready || loading)) return <div>No audio to play</div>;
	// if (loading) return <div>Loading audio</div>;
	return (
		<section className="audio-entry">
			<div className="progress-container">
				<CircularProgressbar
					value={percentComplete}
					strokeWidth={24}
					styles={buildStyles({
						pathColor: "#9e80ea",
						trailColor: "#ddd",
						pathTransition:
							percentComplete === 0
								? "none"
								: "stroke-dashoffset 0.5s ease 0s",
					})}
				/>
			</div>
			<div className="name-container">
				<input
					type="text"
					className="name"
					value={name}
					onChange={(event) => setName(event.target.value)}
					onKeyDown={(event) => {
						if (event.code === "Enter") toggleIsEditingName();
					}}
					disabled={!isEditingName}
				/>
				{isEditingName ? (
					<BsCheckLg
						className="name-edit-btn"
						onClick={toggleIsEditingName}
						size={20}
					/>
				) : (
					<BsPenFill
						className="name-edit-btn"
						onClick={toggleIsEditingName}
						size={20}
					/>
				)}
			</div>
			{playing ? (
				<BsFillPauseFill
					className="play-pause-btn"
					onClick={togglePlayPause}
					size={35}
				/>
			) : (
				<BsFillPlayFill
					className="play-pause-btn"
					onClick={togglePlayPause}
					size={35}
				/>
			)}
			<canvas ref={canvasRef} width={600} height={50}></canvas>
		</section>
	);
};

export default AudioEntry;
