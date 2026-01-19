import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import SchedulePage from './pages/SchedulePage';
import SponsorsPage from './pages/SponsorsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
