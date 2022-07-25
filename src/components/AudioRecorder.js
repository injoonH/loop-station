import { useRef, useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { BsFillStopFill, BsFillRecordFill } from "react-icons/bs";
import ToggleButton from "./button/ToggleButton";
import "./AudioRecorder.css";

const AudioRecorder = () => {
	let canvas;
	let ctx;
	let analyser;
	let bufferLength;
	const streamData = useRef();
	const canvasRef = useRef();
	const [isRecording, setIsRecording] = useState(false);
	const {
		status,
		startRecording,
		stopRecording,
		mediaBlobUrl,
		previewAudioStream,
		customMediaStream,
	} = useReactMediaRecorder({ audio: true, askPermissionOnMount: true });

	useEffect(() => {
		canvas = canvasRef.current;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		ctx = canvas.getContext("2d");
		window.requestAnimationFrame(draw);
		getStreamData();
	});

	const getStreamData = () => {
		if (previewAudioStream === null) return;
		console.log(previewAudioStream);
		const audioCtx = new (window.AudioContext ||
			window.webkitAudioContext)();
		analyser = audioCtx.createAnalyser();

		const source = audioCtx.createMediaStreamSource(previewAudioStream);
		source.connect(analyser);
		bufferLength = analyser.frequencyBinCount;
		streamData.current = new Uint8Array(bufferLength);
		console.log(streamData.current);
		analyser.getByteTimeDomainData(streamData.current);
		console.log(streamData.current);
	};

	const draw = () => {
		if (analyser) {
			analyser.getByteTimeDomainData(streamData.current);
		}
		let rms = 0;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.lineWidth = 2;
		ctx.fillStyle = "rgb(100,100,100)";
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.beginPath();
		let sliceWidth = canvas.width / bufferLength;
		let x = 0;
		for (let i = 0; i < bufferLength; i++) {
			rms += streamData.current[i] * streamData.current[i];
			rms /= bufferLength;
			rms = rms;
			let v = streamData.current[i] / 128.0;
			let y = rms + canvas.height / 2;

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}

			x += sliceWidth;
		}
		ctx.stroke();
		ctx.closePath();
		window.requestAnimationFrame(draw);
	};

	return (
		<div>
			<h1>{status}</h1>
			{/* recording start-stop button */}
			<ToggleButton
				state={isRecording}
				setState={setIsRecording}
				trueComp={<BsFillStopFill style={{ color: "#bdc3c7" }} />}
				falseComp={<BsFillRecordFill style={{ color: "#f22b2b" }} />}
				trueCb={stopRecording}
				falseCb={startRecording}
				getStreamData={getStreamData}
			/>
			<audio src={mediaBlobUrl} autoPlay loop>
				Your browser does not support the <code>audio</code> element.
			</audio>
			<canvas ref={canvasRef} width={window.innerWidth}></canvas>
		</div>
	);
};

export default AudioRecorder;
