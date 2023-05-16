import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TrafficCam from './components/TrafficCam';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TrafficCam />} />
            </Routes>
        </Router>
    );
}

export default App;