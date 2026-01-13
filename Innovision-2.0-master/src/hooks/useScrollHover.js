import { useEffect, useRef } from 'react';

/**
 * Custom hook to auto-trigger hover effects on mobile when scrolling
 * Adds 'auto-hover' class to elements when they're in viewport
 */
export const useScrollHover = (selector, options = {}) => {
    const observerRef = useRef(null);

    useEffect(() => {
        // Only run on mobile devices
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return;

        const elements = document.querySelectorAll(selector);

        const observerOptions = {
            threshold: options.threshold || 0.3,
            rootMargin: options.rootMargin || '0px'
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('auto-hover');
                } else if (options.removeOnExit) {
                    entry.target.classList.remove('auto-hover');
                }
            });
        }, observerOptions);

        elements.forEach(el => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [selector, options.threshold, options.rootMargin, options.removeOnExit]);
};

export default useScrollHover;
