import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Record from './components/Record';
import Store from './components/Store';
import ResponsiveAppBar from './components/ResponsiveAppBar';

import './App.css';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <ResponsiveAppBar/>
                <Routes>
                    {/* <Route path="/" element={<Record />}/> */}
                    <Route path="/record" element={<Record />}/>
                    <Route path="/store" element={<Store />}/>
                    <Route path="/signin" element={<SignIn />}/>
                    <Route path="/signup" element={<SignUp />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
