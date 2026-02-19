import React, { useState, useEffect, useRef } from 'react';

const Lazy3DWrapper = ({ children, placeholder }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Delay loading the heavy JS even if visible, to prioritize LCP
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                // Use requestIdleCallback if available for even better performance
                if ('requestIdleCallback' in window) {
                    window.requestIdleCallback(() => setIsLoaded(true));
                } else {
                    setIsLoaded(true);
                }
            }, 1500); // 1.5s delay to let main thread settle
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {placeholder || null}
                </div>
            )}
            {isLoaded && children}
        </div>
    );
};

export default Lazy3DWrapper;
