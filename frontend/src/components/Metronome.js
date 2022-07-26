import { useRef, useState } from 'react';

const click1 = new Audio(
    '//daveceddia.com/freebies/react-metronome/click1.wav'
);
const click2 = new Audio(
    '//daveceddia.com/freebies/react-metronome/click2.wav'
);

const Metronome = ({ beatsPerMeasure }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(100);
    const timer = useRef(null);
    const count = useRef(0);

    const playClick = () => {
        if (count.current === 0) click2.play();
        else click1.play();
        count.current = (count.current + 1) % beatsPerMeasure;
    };

    const updateBpm = (event) => {
        const newBpm = event.target.value;
        if (isPlaying) {
            clearInterval(timer.current);
            timer.current = setInterval(playClick, 60_000 / newBpm);
            count.current = 0;
        }
        setBpm(newBpm);
    };

    const togglePlay = () => {
        if (isPlaying) clearInterval(timer.current);
        else {
            timer.current = setInterval(playClick, 60_000 / bpm);
            count.current = 0;
            playClick();
        }
        setIsPlaying((curr) => !curr);
    };

    return (
        <section>
            <span>{bpm}</span>
            <input
                type="range"
                min={60}
                max={240}
                value={bpm}
                onChange={updateBpm}
            ></input>
            <button onClick={togglePlay}>{isPlaying ? 'Stop' : 'Start'}</button>
        </section>
    );
};

export default Metronome;
