import { useRef, useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { BsFillStopFill, BsFillRecordFill } from "react-icons/bs";
import ToggleButton from "./button/ToggleButton";
import "./AudioRecorder.css";

const AudioRecorder = ({ soundFiles, setSoundFiles }) => {
	let canvas, ctx;
	let analyser;
	let bufferLength;
	let ampAvg = 0;
	let ampArray = [];
	let stageWidth, stageHeight, pixelRatio;

	const streamData = useRef();
	const canvasRef = useRef();
	const [isRecording, setIsRecording] = useState(false);
	const {
		status,
		startRecording,
		stopRecording,
		mediaBlobUrl,
		previewAudioStream,
	} = useReactMediaRecorder({ audio: true, askPermissionOnMount: true });

	useEffect(() => {
		canvas = canvasRef.current;
		ctx = canvas.getContext("2d");

		pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
		resize();

		getStreamData();

		window.addEventListener("resize", resize, false);
		window.requestAnimationFrame(draw);
	});

	const resize = () => {
		stageWidth = document.body.clientWidth;
		stageHeight = document.body.clientHeight;
		canvas.width = stageWidth * pixelRatio;
		canvas.height = (stageWidth / 12) * pixelRatio;
		// ctx.scale(pixelRatio, pixelRatio);
	};

	const getStreamData = () => {
		if (previewAudioStream === null) return;
		const audioCtx = new (window.AudioContext ||
			window.webkitAudioContext)();
		analyser = audioCtx.createAnalyser();

		const source = audioCtx.createMediaStreamSource(previewAudioStream);
		source.connect(analyser);
		bufferLength = analyser.frequencyBinCount;
		streamData.current = new Uint8Array(bufferLength);
		analyser.getByteTimeDomainData(streamData.current);
	};

	const draw = () => {
		ctx.fillStyle = "rgb(10,10,10)";
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		if (analyser && isRecording) {
			analyser.getByteTimeDomainData(streamData.current);
			ctx.lineWidth = 0.5;
			let amp = 0;
			let move = 0;
			for (let i = 0; i < bufferLength; i++) {
				if (amp < streamData.current[i]) {
					amp = streamData.current[i];
				}
			}
			if (isRecording) {
				ampAvg += amp;
				ampArray.push(ampAvg);
				ampAvg = 0;
			}

			for (let i = 0; i < ampArray.length; i++) {
				ctx.beginPath();
				ctx.moveTo(
					canvas.width / 2 - i - move,
					canvas.height / 2 +
						(ampArray[ampArray.length - 1 - i] - 125) *
							(canvas.height / (150 * 2))
				);
				ctx.lineTo(
					canvas.width / 2 - i - move,
					canvas.height / 2 -
						(ampArray[ampArray.length - 1 - i] - 125) *
							(canvas.height / (150 * 2))
				);
				ctx.stroke();
				ctx.closePath();
				move += 1;
			}
		}
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgb(255,0,0)";
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		ctx.stroke();
		ctx.closePath();
		window.requestAnimationFrame(draw);
	};

	const saveAmpToFiles = () => {
		console.log("Save");
		setSoundFiles((cur) => [...cur, ampArray]);
		ampArray = [];
	};

	return (
		<div className="audio-recorder-container">
			<audio src={mediaBlobUrl}>
				Your browser does not support the <code>audio</code> element.
			</audio>
			<canvas ref={canvasRef}></canvas>
			<div>
				{/* recording start-stop button */}
				<ToggleButton
					state={isRecording}
					setState={setIsRecording}
					trueComp={<BsFillStopFill style={{ color: "#bdc3c7" }} />}
					falseComp={
						<BsFillRecordFill style={{ color: "#f22b2b" }} />
					}
					trueCb={stopRecording}
					falseCb={startRecording}
					saveAmpToFiles={saveAmpToFiles}
				/>
			</div>
		</div>
	);
};

export default AudioRecorder;
