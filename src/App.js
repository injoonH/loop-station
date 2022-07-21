import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';
import './App.css';

const App = () => {
    const preload = (p5) => {};

    const setup = (p5, parentRef) => {
        p5.createCanvas(400, 400).parent(parentRef);
    };

    const draw = (p5) => {
        p5.background(50);
    };

    return (
        <div>
            <Sketch preload={preload} setup={setup} draw={draw} />
        </div>
    );
};

export default App;
