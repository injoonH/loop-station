import './App.css';
import AudioEntry from './components/AudioEntry';
import { AudioPlayerProvider } from 'react-use-audio-player';
import AudioRecorder from './components/AudioRecorder';

const App = () => {
    const urls = [
        'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
        'http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg',
        'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg',
    ];
    return (
        <div>
            <AudioRecorder />
            {urls.map((url) => (
                <AudioPlayerProvider key={url}>
                    <AudioEntry audioFile={url} />
                </AudioPlayerProvider>
            ))}
        </div>
    );
};

export default App;
