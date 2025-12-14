import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import SystemSpecs from './components/SystemSpecs';
import Pricing from './components/Pricing';
import Comparison from './components/Comparison';
import FinalCTA from './components/FinalCTA';
import Logo from './components/Logo';
import ErrorBoundary from './components/ErrorBoundary';
import ChatWidget from './components/ChatWidget';
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
          // Scrolling down, but not at bottom yet (use 5px buffer for better mobile support)
          if (deltaY > 0 && scrollTop + clientHeight < scrollHeight - 5) return;
          // Scrolling up, but not at top yet
          if (deltaY < 0 && scrollTop > 5) return;
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
    let touchStartTime = 0;
    let touchMoved = false;
    let lastTouchY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return; // Only handle single touch
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      touchStartTime = Date.now();
      touchMoved = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = Math.abs(currentY - touchStartY);
      
      // Mark that touch has moved
      if (deltaY > 10) {
        touchMoved = true;
      }

      // Check if user is scrolling within a section
      const currentSection = containerRef.current?.querySelector('.section-content') as HTMLElement;
      if (currentSection) {
        const { scrollTop, scrollHeight, clientHeight } = currentSection;
        const hasScrollableContent = scrollHeight > clientHeight;
        
        if (hasScrollableContent) {
          const isScrollingDown = currentY < lastTouchY && scrollTop < scrollHeight - clientHeight - 5;
          const isScrollingUp = currentY > lastTouchY && scrollTop > 5;
          
          // If section is scrollable and user is scrolling within it, prevent navigation
          if (isScrollingDown || isScrollingUp) {
            return;
          }
        }
      }
      
      lastTouchY = currentY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling || !touchMoved) return;
      if (e.changedTouches.length !== 1) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const deltaY = touchStartY - touchEndY;
      const touchDuration = touchEndTime - touchStartTime;
      
      // Calculate velocity (pixels per ms)
      const velocity = Math.abs(deltaY) / Math.max(touchDuration, 1);
      
      // Detect Android (typically has lower velocity threshold needs)
      const isAndroid = /Android/i.test(navigator.userAgent);
      // Android swipes are typically faster, iOS needs more deliberate swipes
      const minVelocity = isAndroid ? 0.15 : 0.2;
      const minVelocityForScrollable = isAndroid ? 0.25 : 0.3;

      const currentSection = containerRef.current?.querySelector('.section-content') as HTMLElement;
      if (currentSection) {
        const { scrollTop, scrollHeight, clientHeight } = currentSection;
        const hasScrollableContent = scrollHeight > clientHeight;
        
        if (hasScrollableContent) {
          // More strict check: must be at top/bottom AND have sufficient swipe
          const atTop = scrollTop <= 5;
          const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
          
          if (!atTop && !atBottom) return; // Not at edges, so user was scrolling within section
          
          // At edge, but still check if swipe is intentional
          if (Math.abs(deltaY) < ANIMATION.TOUCH_THRESHOLD || velocity < minVelocityForScrollable) return;
        } else {
          // No scrollable content, require stronger swipe gesture
          if (Math.abs(deltaY) < ANIMATION.TOUCH_THRESHOLD || velocity < minVelocity) return;
        }
      }

      // Only navigate if swipe is significant and fast enough
      if (Math.abs(deltaY) > ANIMATION.TOUCH_THRESHOLD && velocity > minVelocity) {
        if (deltaY > 0) {
          scrollToSection(activeIndex + 1);
        } else {
          scrollToSection(activeIndex - 1);
        }
      }
      
      // Reset touch state
      touchMoved = false;
      touchStartY = 0;
      touchStartTime = 0;
    };

    const handleTouchCancel = () => {
      // Reset touch state on cancel (e.g., iOS gestures)
      touchMoved = false;
      touchStartY = 0;
      touchStartTime = 0;
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
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
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
        <header className="fixed top-6 left-6 md:top-8 md:left-8 z-[100]">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group" 
            onClick={() => scrollToSection(0)}
            onKeyDown={(e) => e.key === 'Enter' && scrollToSection(0)}
            role="button"
            tabIndex={0}
            aria-label="ZYXO - Go to homepage"
          >
            <Logo size={24} className="md:w-8 md:h-8" />
            <span className="font-bold text-sm md:text-lg tracking-[0.15em] md:tracking-[0.2em] text-white group-hover:text-zyxo-blue transition-colors">
              ZYXO
            </span>
          </div>
        </header>

        {/* Pagination Indicators - Desktop */}
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

        {/* Mobile Navigation Dots - Bottom */}
        <nav 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 sm:hidden"
          aria-label="Section navigation"
          role="navigation"
        >
          {SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(idx)}
              aria-label={`Go to ${SECTION_NAMES[idx]} section`}
              aria-current={activeIndex === idx ? 'true' : undefined}
              className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zyxo-green focus:ring-offset-2 focus:ring-offset-[#050505] ${
                activeIndex === idx 
                  ? 'w-8 h-2 bg-zyxo-green shadow-[0_0_8px_rgba(204,255,0,0.5)]' 
                  : 'w-2 h-2 bg-white/20 active:bg-white/40'
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
              style={{ 
                WebkitOverflowScrolling: 'touch', 
                touchAction: 'pan-y',
                overscrollBehavior: 'contain' // Prevent Android Chrome overscroll bounce
              }}
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
        
        {/* AI Chat Widget */}
        <ChatWidget />
      </main>
    </ErrorBoundary>
  );
}
