import React from 'react';

import { useState } from 'react'

import AudioEntry from './AudioEntry';
import { AudioPlayerProvider } from 'react-use-audio-player';
import AudioRecorder from './AudioRecorder';

import audioContext, { AudioProvider } from './AudioProvider';

// import ResponsiveAppBar from './ResponsiveAppBar';

const Record = () => {
    const [soundFiles, setSoundFiles] = useState([]);
    // const urls = [
    //     'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
    //     'http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg',
    //     'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg',

    // ];
    return (
        <div className='audio-container'>

            <AudioProvider>

                <PlayerComponent/>

                <AudioRecorder
                    soundFiles={soundFiles}
                    setSoundFiles={setSoundFiles}
                    />

            </AudioProvider>
        </div>
    );
};

const PlayerComponent = () => {
    const [urls, setUrls] = React.useContext(audioContext)

    return (
        <div>
            {/* {console.log(urls)} */}
            {urls.map((url) => (
                <AudioPlayerProvider
                    className={'audio-player-provider'}
                    key={url}
                >
                    <AudioEntry audioFile={url} />
                </AudioPlayerProvider>
            ))}
        </div>
    )
}

export default Record;