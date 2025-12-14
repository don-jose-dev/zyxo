import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import SystemSpecs from './components/SystemSpecs';
import Pricing from './components/Pricing';
import Comparison from './components/Comparison';
import FinalCTA from './components/FinalCTA';
import Logo from './components/Logo';
import { CONTENT } from './lib/content';

const SECTIONS = [
  { id: 'hero', component: Hero },
  { id: 'specs', component: SystemSpecs },
  { id: 'pricing', component: Pricing },
  { id: 'comparison', component: Comparison },
  { id: 'final', component: FinalCTA },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((index: number) => {
    if (index >= 0 && index < SECTIONS.length) {
      setIsScrolling(true);
      setActiveIndex(index);
      setTimeout(() => setIsScrolling(false), 1000); // Cooldown matches animation duration
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      // Check if the current section has internal scrolling
      const currentSection = containerRef.current?.querySelector('.section-content');
      if (currentSection) {
        const { scrollTop, scrollHeight, clientHeight } = currentSection;
        
        // If content overflows
        if (scrollHeight > clientHeight) {
          // Scrolling down, but not at bottom yet
          if (e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 1) return;
          // Scrolling up, but not at top yet
          if (e.deltaY < 0 && scrollTop > 1) return;
        }
      }

      if (e.deltaY > 50) {
        scrollToSection(activeIndex + 1);
      } else if (e.deltaY < -50) {
        scrollToSection(activeIndex - 1);
      }
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

        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0) scrollToSection(activeIndex + 1);
            else scrollToSection(activeIndex - 1);
        }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeIndex, isScrolling, scrollToSection]);

  const CurrentComponent = SECTIONS[activeIndex].component;

  return (
    <main className="h-screen w-screen bg-[#050505] text-white relative overflow-hidden font-mono">
      
      {/* Absolute Logo */}
      <div className="absolute top-8 left-8 z-50 mix-blend-difference">
         <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => scrollToSection(0)}
         >
            <Logo size={28} />
            <span className="font-bold text-lg tracking-[0.2em] text-white hidden md:block group-hover:text-zyxo-blue transition-colors">ZYXO</span>
         </div>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {SECTIONS.map((_, idx) => (
            <button
                key={idx}
                onClick={() => scrollToSection(idx)}
                className={`w-1 transition-all duration-300 rounded-full ${activeIndex === idx ? 'h-6 bg-zyxo-green shadow-[0_0_8px_rgba(204,255,0,0.5)]' : 'h-1 bg-white/10 hover:bg-white/30'}`}
            />
        ))}
      </div>

      {/* Main Content Area */}
      <div ref={containerRef} className="w-full h-full relative">
         {/* Background Grid - Global */}
         <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />

         <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full section-content overflow-y-auto overflow-x-hidden"
            >
                {/* Pass navigation capability to components if needed */}
                <CurrentComponent onNavigate={(targetIndex: number) => scrollToSection(targetIndex)} />
            </motion.div>
         </AnimatePresence>
         
         {/* Footer / Status Bar - Absolute Bottom Right */}
         <div className="absolute bottom-6 right-6 text-[10px] text-gray-700 font-mono tracking-widest hidden md:block pointer-events-none z-40 uppercase">
             {CONTENT.brand.contact.website} // © 2025
         </div>
      </div>
    </main>
  );
}