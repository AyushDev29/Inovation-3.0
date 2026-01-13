import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
            });
        };

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);

        // Add event listeners to clickable elements
        const clickables = document.querySelectorAll('a, button, .clickable');
        clickables.forEach((el) => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        // Observer for dynamic elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const newClickables = document.querySelectorAll('a, button, .clickable');
                newClickables.forEach((el) => {
                    el.removeEventListener('mouseenter', handleHoverStart);
                    el.removeEventListener('mouseleave', handleHoverEnd);
                    el.addEventListener('mouseenter', handleHoverStart);
                    el.addEventListener('mouseleave', handleHoverEnd);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            clickables.forEach((el) => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (isHovering) {
            gsap.to(cursor, { scale: 0.5, duration: 0.2 });
            gsap.to(follower, { scale: 3, opacity: 0.5, backgroundColor: '#a855f7', duration: 0.2 });
        } else {
            gsap.to(cursor, { scale: 1, duration: 0.2 });
            gsap.to(follower, { scale: 1, opacity: 1, backgroundColor: 'transparent', duration: 0.2 });
        }
    }, [isHovering]);

    return (
        <>
            <div
                ref={cursorRef}
                className="hidden md:block fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
            />
            <div
                ref={followerRef}
                className="hidden md:block fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-colors"
            />
        </>
    );
};

export default CustomCursor;
