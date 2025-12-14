import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import SystemSpecs from './components/SystemSpecs';
import Pricing from './components/Pricing';
import Comparison from './components/Comparison';
import FinalCTA from './components/FinalCTA';
import Logo from './components/Logo';
import ErrorBoundary from './components/ErrorBoundary';
import { CONTENT } from './lib/content';
import { throttle, ANIMATION, SECTION_NAMES } from './lib/utils';

const SECTIONS = [
  { id: 'hero', component: Hero },
  { id: 'specs', component: SystemSpecs },
  { id: 'pricing', component: Pricing },
  { id: 'comparison', component: Comparison },
  { id: 'final', component: FinalCTA },
];

// Check if user prefers reduced motion
const prefersReducedMotion = () => 
  typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const scrollToSection = useCallback((index: number) => {
    if (index >= 0 && index < SECTIONS.length) {
      setIsScrolling(true);
      setActiveIndex(index);
      
      // Announce section change to screen readers
      const announcement = document.getElementById('section-announcement');
      if (announcement) {
        announcement.textContent = `Navigated to ${SECTION_NAMES[index]} section`;
      }
      
      setTimeout(() => setIsScrolling(false), ANIMATION.SECTION_TRANSITION);
    }
  }, []);

  // Throttled scroll handler for better performance
  const handleScroll = useMemo(() => {
    return throttle((deltaY: number) => {
      if (isScrolling) return;

      // Check if the current section has internal scrolling
      const currentSection = containerRef.current?.querySelector('.section-content');
      if (currentSection) {
        const { scrollTop, scrollHeight, clientHeight } = currentSection;
        
        // If content overflows
        if (scrollHeight > clientHeight) {
          // Scrolling down, but not at bottom yet
          if (deltaY > 0 && scrollTop + clientHeight < scrollHeight - 1) return;
          // Scrolling up, but not at top yet
          if (deltaY < 0 && scrollTop > 1) return;
        }
      }

      if (deltaY > ANIMATION.SCROLL_THRESHOLD) {
        scrollToSection(activeIndex + 1);
      } else if (deltaY < -ANIMATION.SCROLL_THRESHOLD) {
        scrollToSection(activeIndex - 1);
      }
    }, ANIMATION.SCROLL_THROTTLE);
  }, [activeIndex, isScrolling, scrollToSection]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      handleScroll(e.deltaY);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      const currentSection = containerRef.current?.querySelector('.section-content');
      if (currentSection) {
        const { scrollTop, scrollHeight, clientHeight } = currentSection;
        if (scrollHeight > clientHeight) {
          if (deltaY > 0 && scrollTop + clientHeight < scrollHeight - 1) return;
          if (deltaY < 0 && scrollTop > 1) return;
        }
      }

      if (Math.abs(deltaY) > ANIMATION.TOUCH_THRESHOLD) {
        if (deltaY > 0) scrollToSection(activeIndex + 1);
        else scrollToSection(activeIndex - 1);
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          scrollToSection(activeIndex + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(activeIndex - 1);
          break;
        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToSection(SECTIONS.length - 1);
          break;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, isScrolling, scrollToSection, handleScroll]);

  const CurrentComponent = SECTIONS[activeIndex].component;

  // Animation variants based on reduced motion preference
  const pageVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -100, scale: 0.95 },
      };

  return (
    <ErrorBoundary>
      <main 
        className="h-screen w-screen bg-[#050505] text-white relative overflow-hidden font-mono"
        role="main"
        aria-label="ZYXO Digital Solutions"
      >
        {/* Screen reader announcements */}
        <div 
          id="section-announcement" 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        />
        
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-zyxo-green focus:text-black focus:font-bold"
        >
          Skip to main content
        </a>
        
        {/* Absolute Logo */}
        <header className="fixed top-6 left-6 md:top-8 md:left-8 z-[100] mix-blend-difference">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => scrollToSection(0)}
            onKeyDown={(e) => e.key === 'Enter' && scrollToSection(0)}
            role="button"
            tabIndex={0}
            aria-label="ZYXO - Go to homepage"
          >
            <Logo size={24} className="md:w-8 md:h-8" />
            <span className="font-bold text-sm md:text-lg tracking-[0.2em] text-white hidden md:block group-hover:text-zyxo-blue transition-colors">
              ZYXO
            </span>
          </div>
        </header>

        {/* Pagination Indicators */}
        <nav 
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 md:gap-4 hidden sm:flex"
          aria-label="Section navigation"
          role="navigation"
        >
          {SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(idx)}
              aria-label={`Go to ${SECTION_NAMES[idx]} section`}
              aria-current={activeIndex === idx ? 'true' : undefined}
              className={`w-1 transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zyxo-green focus:ring-offset-2 focus:ring-offset-[#050505] ${
                activeIndex === idx 
                  ? 'h-6 bg-zyxo-green shadow-[0_0_8px_rgba(204,255,0,0.5)]' 
                  : 'h-1 bg-white/10 hover:bg-white/30'
              }`}
            />
          ))}
        </nav>

        {/* Main Content Area */}
        <div ref={containerRef} className="w-full h-full relative" id="main-content">
          {/* Background Grid - Global */}
          <div 
            className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-[0.05] pointer-events-none" 
            aria-hidden="true"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIndex}
              initial={pageVariants.initial}
              animate={pageVariants.animate}
              exit={pageVariants.exit}
              transition={reducedMotion ? { duration: 0.1 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full section-content overflow-y-auto overflow-x-hidden"
              role="region"
              aria-label={SECTION_NAMES[activeIndex]}
            >
              {/* Pass navigation capability to components if needed */}
              <CurrentComponent onNavigate={(targetIndex: number) => scrollToSection(targetIndex)} />
            </motion.div>
          </AnimatePresence>
          
          {/* Footer / Status Bar - Absolute Bottom Right */}
          <footer 
            className="absolute bottom-6 right-6 text-[10px] text-gray-700 font-mono tracking-widest hidden md:block pointer-events-none z-40 uppercase"
            aria-hidden="true"
          >
            {CONTENT.brand.contact.website} // © 2025
          </footer>
        </div>
      </main>
    </ErrorBoundary>
  );
}
