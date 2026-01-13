import React, { useState } from 'react';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Events from './Events';
import Contact from './Contact';
import Footer from './Footer';
import Preloader from './Preloader';
import ScrollProgress from './ScrollProgress';
import FloatingActions from './FloatingActions';

const LandingPage = () => {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && <Preloader onComplete={() => setLoading(false)} />}
            <SmoothScroll>
                <ScrollProgress />
                <FloatingActions />
                <CustomCursor />
                <Navbar />
                <main className="relative w-full overflow-hidden bg-void-black text-white selection:bg-neon-purple selection:text-white">
                    <Hero />
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
