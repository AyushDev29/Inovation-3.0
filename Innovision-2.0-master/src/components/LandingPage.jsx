import React, { useState } from 'react';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import Navbar from './Navbar';
import Hero from './Hero';
import SponsorsIntro from './SponsorsIntro';
import About from './About';
import Events from './Events';
import Contact from './Contact';
import Footer from './Footer';
import Preloader from './Preloader';
import ScrollProgress from './ScrollProgress';
import FloatingActions from './FloatingActions';

const LandingPage = () => {
    // Check if preloader has already been shown in this session
    const [loading, setLoading] = useState(() => {
        const hasSeenPreloader = sessionStorage.getItem('preloaderShown');
        return !hasSeenPreloader; // Show preloader only if not shown before
    });

    const handlePreloaderComplete = () => {
        setLoading(false);
        sessionStorage.setItem('preloaderShown', 'true'); // Mark as shown
    };

    return (
        <>
            {loading && <Preloader onComplete={handlePreloaderComplete} />}
            <SmoothScroll>
                <ScrollProgress />
                <FloatingActions />
                <CustomCursor />
                <Navbar />
                <main className="relative w-full overflow-hidden bg-void-black text-white selection:bg-neon-purple selection:text-white">
                    <Hero />
                    <SponsorsIntro />
                    <Events />
                    <About />
                    <Contact />
                    <Footer />
                </main>
            </SmoothScroll>
        </>
    );
};

export default LandingPage;
