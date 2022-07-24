import { useState } from 'react';
import { useAudioPlayer, useAudioPosition } from 'react-use-audio-player';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
    BsFillPauseFill,
    BsFillPlayFill,
    BsCheckLg,
    BsPenFill,
} from 'react-icons/bs';
import 'react-circular-progressbar/dist/styles.css';
import './AudioEntry.css';

const AudioEntry = ({ audioFile }) => {
    const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
        src: audioFile,
        autoplay: false,
        loop: true,
    });
    const { percentComplete } = useAudioPosition({
        highRefreshRate: true,
    });

    const [name, setName] = useState('Audio');
    const [isEditingName, setIsEditingName] = useState(false);

    const toggleIsEditingName = () => setIsEditingName((curr) => !curr);

    if (!(ready || loading)) return <div>No audio to play</div>;
    if (loading) return <div>Loading audio</div>;

    return (
        <section className="audio-entry">
            <div className="progress-container">
                <CircularProgressbar
                    value={percentComplete}
                    strokeWidth={24}
                    styles={buildStyles({
                        pathColor: '#9e80ea',
                        trailColor: '#ddd',
                        pathTransition:
                            percentComplete === 0
                                ? 'none'
                                : 'stroke-dashoffset 0.5s ease 0s',
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
                        if (event.code === 'Enter') toggleIsEditingName();
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
        </section>
    );
};

export default AudioEntry;
