import { useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { BsFillStopFill, BsFillRecordFill } from 'react-icons/bs';
import ToggleButton from './button/ToggleButton';
import './AudioRecorder.css';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        previewAudioStream,
    } = useReactMediaRecorder({ audio: true, askPermissionOnMount: true });
    const streamData = useRef();

    const getStreamData = () => {
        if (previewAudioStream === null) return;
        console.log(previewAudioStream);

        const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();

        const analyser = audioCtx.createAnalyser();

        const source = audioCtx.createMediaStreamSource(previewAudioStream);
        source.connect(analyser);

        streamData.current = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(streamData.current);

        console.log(streamData.current);
    };

    return (
        <div>
            <h1>{status}</h1>
            {/* recording start-stop button */}
            <ToggleButton
                state={isRecording}
                setState={setIsRecording}
                trueComp={<BsFillStopFill style={{ color: '#bdc3c7' }} />}
                falseComp={<BsFillRecordFill style={{ color: '#f22b2b' }} />}
                trueCb={stopRecording}
                falseCb={startRecording}
            />
            <audio src={mediaBlobUrl} autoPlay loop>
                Your browser does not support the <code>audio</code> element.
            </audio>
        </div>
    );
};

export default AudioRecorder;
