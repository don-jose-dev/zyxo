import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { CONTENT } from '../lib/content';
import { Terminal, MoveRight } from 'lucide-react';

const CYBER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

interface ScrambleTextProps {
  text: string;
  delay?: number;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState(text.replace(/./g, ' '));
  const [started, setStarted] = useState(false);
  
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay * 1000);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let iteration = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    interval = setInterval(() => {
      setDisplayText(
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
        }).join("")
      );
      if (iteration >= text.length) {
        if (interval) clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, started]);

  return <span aria-hidden="true">{displayText}</span>;
};

interface HeroProps {
  onNavigate?: (idx: number) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x * 50);
    mouseY.set(y * 50);
  };

  const xSpring = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const ySpring = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const parts = CONTENT.hero.headline.split('.');
  const line1 = parts[0].trim() + ".";
  const line2 = parts[1] ? parts[1].trim() : "";

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-full flex flex-col items-center justify-center overflow-hidden py-20"
      aria-labelledby="hero-headline"
    >
      
      {/* Interactive Ambient Glow */}
      <motion.div 
        style={{ x: xSpring, y: ySpring }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zyxo-green/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" 
        aria-hidden="true"
      />
      
      {/* Secondary Glow */}
      <motion.div 
        style={{ x: useTransform(xSpring, (val) => val * -0.5), y: useTransform(ySpring, (val) => val * -0.5) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zyxo-blue/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" 
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl flex flex-col items-center justify-center">
        {/* Top Bracket Decoration */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-zyxo-green to-transparent mb-8"
          aria-hidden="true"
        />

        <div className="inline-block mb-8 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
          <span className="text-xs font-mono text-zyxo-green tracking-[0.2em] uppercase flex items-center gap-3">
            <span 
              className="w-1.5 h-1.5 bg-zyxo-green rounded-full animate-pulse shadow-[0_0_10px_#ccff00]"
              aria-hidden="true"
            />
            Enterprise Grade
          </span>
        </div>

        <h1 
          id="hero-headline"
          className="text-4xl md:text-7xl font-bold mb-8 leading-tight text-center max-w-4xl mx-auto tracking-tight"
        >
          <span className="block text-white mb-2 md:mb-4">
            <ScrambleText text={line1} delay={0.2} />
            <span className="sr-only">{line1}</span>
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zyxo-green to-zyxo-blue pb-2">
            <ScrambleText text={line2} delay={1.5} />
            <span className="sr-only">{line2}</span>
          </span>
        </h1>

        <motion.p 
          className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl mb-12 leading-relaxed text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          {CONTENT.hero.subhead}
        </motion.p>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2.4 }}
        >
          <button 
            onClick={() => onNavigate && onNavigate(2)} // Navigate to Pricing (index 2)
            className="group relative px-10 py-5 bg-transparent overflow-hidden border border-zyxo-green/50 text-zyxo-green font-bold uppercase tracking-widest hover:bg-zyxo-green hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.1)] hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] cursor-pointer z-50 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-zyxo-green focus:ring-offset-2 focus:ring-offset-[#050505]"
            aria-label="View pricing plans"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Terminal className="w-5 h-5" aria-hidden="true" />
              {CONTENT.hero.cta}
              <MoveRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
            <div 
              className="absolute inset-0 bg-zyxo-green/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" 
              aria-hidden="true"
            />
          </button>
        </motion.div>

        {/* Bottom Bracket Decoration */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-zyxo-blue to-transparent mt-12"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default Hero;
