import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import SchedulePage from './pages/SchedulePage';
import SponsorsPage from './pages/SponsorsPage';
import BGMIRegistration from './pages/BGMIRegistration';
import FreeFireRegistration from './pages/FreeFireRegistration';
import TechTriathlonRegistration from './pages/TechTriathlonRegistration';
import FashionFlexRegistration from './pages/FashionFlexRegistration';
import HackastraRegistration from './pages/HackastraRegistration';
import FunFusionRegistration from './pages/FunFusionRegistration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/register/bgmi" element={<BGMIRegistration />} />
        <Route path="/register/freefire" element={<FreeFireRegistration />} />
        <Route path="/register/tech-triathlon" element={<TechTriathlonRegistration />} />
        <Route path="/register/fashion-flex" element={<FashionFlexRegistration />} />
        <Route path="/register/hackastra" element={<HackastraRegistration />} />
        <Route path="/register/fun-fusion" element={<FunFusionRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
