import React, { useState, useEffect } from 'react';
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

    // Handle hash navigation after component mounts
    useEffect(() => {
        const handleHashNavigation = () => {
            const hash = window.location.hash;
            if (hash) {
                // Wait for the page to fully render and Lenis to initialize
                const scrollToElement = () => {
                    const element = document.querySelector(hash);
                    if (element) {
                        if (window.lenis) {
                            // Use Lenis scrollTo for smooth scrolling
                            window.lenis.scrollTo(element, {
                                duration: 1.5,
                                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                                offset: -80 // Account for navbar height
                            });
                        } else {
                            // Fallback to native scrolling if Lenis is not available
                            const elementTop = element.offsetTop - 80; // Account for navbar
                            window.scrollTo({
                                top: elementTop,
                                behavior: 'smooth'
                            });
                        }
                    }
                };

                // Try multiple times to ensure Lenis is ready
                let attempts = 0;
                const maxAttempts = 10;
                const tryScroll = () => {
                    attempts++;
                    if (window.lenis || attempts >= maxAttempts) {
                        scrollToElement();
                    } else {
                        setTimeout(tryScroll, 100);
                    }
                };

                setTimeout(tryScroll, 200);
            }
        };

        // Handle hash navigation when component mounts
        if (!loading) {
            handleHashNavigation();
        }

        // Handle hash changes
        window.addEventListener('hashchange', handleHashNavigation);
        
        return () => {
            window.removeEventListener('hashchange', handleHashNavigation);
        };
    }, [loading]);

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
