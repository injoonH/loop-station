import React from 'react';

import { useState } from 'react'

import AudioEntry from './AudioEntry';
import { AudioPlayerProvider } from 'react-use-audio-player';
import AudioRecorder from './AudioRecorder';
;

// import ResponsiveAppBar from './ResponsiveAppBar';

const Record = () => {
    const [soundFiles, setSoundFiles] = useState([]);
    const urls = [
        'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
        'http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg',
        'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg',
    ];
    return (
        <div className='audio-container'>
            <div>
                {urls.map((url) => (
                    <AudioPlayerProvider
                        className={'audio-player-provider'}
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

export default Record;