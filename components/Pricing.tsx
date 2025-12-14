import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { CONTENT } from '../lib/content';
import type { Package } from '../lib/types';
import { Check, Clock, ArrowRight } from 'lucide-react';
import Risks from './Risks';

interface PricingProps {
  onNavigate?: (idx: number) => void;
}

const Pricing: React.FC<PricingProps> = () => {
  return (
    <section 
      className="min-h-full w-full flex flex-col items-center py-20 px-6 relative"
      aria-labelledby="pricing-title"
    >
      {/* Background Gradients */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-zyxo-blue/5 rounded-full blur-[100px] pointer-events-none fixed" 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-zyxo-green/5 rounded-full blur-[100px] pointer-events-none fixed" 
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col h-full justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12 pt-10 md:pt-0"
        >
          <h2 id="pricing-title" className="text-2xl md:text-4xl font-bold text-white mb-2">
            {CONTENT.pricing.title}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            {CONTENT.pricing.subtitle}
          </p>
        </motion.div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start mb-12"
          role="list"
          aria-label="Pricing plans"
        >
          {CONTENT.pricing.packages.map((pkg, index) => (
            <SpotlightCard key={index} pkg={pkg} index={index} />
          ))}
        </div>
        
        {/* Embed Risks component at the bottom */}
        <div className="pb-8">
          <Risks />
        </div>
      </div>
    </section>
  );
};

interface SpotlightCardProps {
  pkg: Package;
  index: number;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ pkg, index }) => {
  const isHighlight = pkg.highlight;
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    position.x.set(e.clientX - rect.left);
    position.y.set(e.clientY - rect.top);
  };

  const borderHighlight = isHighlight ? 'rgba(204, 255, 0, 0.5)' : 'rgba(0, 240, 255, 0.5)';

  const handleWhatsApp = () => {
    const message = `Hi, I am interested in the ${pkg.name} plan.`;
    const url = `https://wa.me/${CONTENT.brand.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const timePercentage = pkg.timeline.includes('7') ? 50 : 100;

  return (
    <motion.article 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative rounded-xl bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden group"
      role="listitem"
      aria-label={`${pkg.name} plan - ${pkg.currency}${pkg.price} ${pkg.suffix}`}
    >
      {/* Spotlight Effect Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
            600px circle at ${position.x}px ${position.y}px,
            ${borderHighlight},
            transparent 40%
            )
          `,
        }}
        aria-hidden="true"
      />
      
      {/* Inner Content Container */}
      <div className="relative h-full bg-[#0a0a0a] p-6 rounded-xl m-[1px] flex flex-col">
        {isHighlight && (
          <div 
            className="absolute top-0 right-0 bg-zyxo-green text-black text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-xl shadow-[0_0_15px_#ccff00]"
            aria-label="Recommended plan"
          >
            Recommended
          </div>
        )}

        <div className="mb-4 relative z-10">
          <h3 className={`text-lg font-mono mb-1 flex items-center gap-2 ${isHighlight ? 'text-zyxo-green' : 'text-zyxo-blue'}`}>
            {pkg.name} 
            {isHighlight && <span className="w-2 h-2 bg-zyxo-green rounded-full animate-ping" aria-hidden="true" />}
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl md:text-4xl font-bold text-white tracking-tighter">
              {pkg.currency}{pkg.price}
            </span>
            <span className="text-gray-500 mb-1 text-xs font-mono">{pkg.suffix}</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed min-h-[40px]">{pkg.desc}</p>
        </div>

        <ul className="space-y-2 mb-6 flex-grow relative z-10" aria-label={`${pkg.name} plan features`}>
          {pkg.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2">
              <div 
                className={`mt-1 p-0.5 rounded-full ${isHighlight ? 'bg-zyxo-green/20 text-zyxo-green' : 'bg-zyxo-blue/20 text-zyxo-blue'}`}
                aria-hidden="true"
              >
                <Check size={8} />
              </div>
              <span className="text-gray-300 text-xs">{feat}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4 border-t border-white/10 relative z-10">
          <div className="mb-4">
            <div className="flex justify-between text-[10px] uppercase text-gray-500 mb-1">
              <span className="flex items-center gap-1">
                <Clock size={10} aria-hidden="true" /> Timeline
              </span>
              <span className="text-white font-mono">{pkg.timeline}</span>
            </div>
            <div 
              className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5"
              role="progressbar"
              aria-valuenow={timePercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Timeline: ${pkg.timeline}`}
            >
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${timePercentage}%` }}
                className={`h-full ${isHighlight ? 'bg-zyxo-green shadow-[0_0_10px_#ccff00]' : 'bg-zyxo-blue shadow-[0_0_10px_#00f0ff]'}`}
              />
            </div>
          </div>
          
          <button 
            onClick={handleWhatsApp}
            className={`group w-full py-3 font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
              isHighlight 
                ? 'bg-zyxo-green text-black hover:bg-white focus:ring-zyxo-green' 
                : 'bg-transparent border border-zyxo-blue text-zyxo-blue hover:bg-zyxo-blue hover:text-black focus:ring-zyxo-blue'
            }`}
            aria-label={`Select ${pkg.name} plan - Opens WhatsApp`}
          >
            <span className="relative z-10">Select {pkg.name}</span>
            <ArrowRight size={14} className="relative z-10 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            <div 
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 z-0" 
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default Pricing;
