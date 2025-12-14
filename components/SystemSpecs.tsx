import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTENT } from '../lib/content';
import { Bot, MapPin, FileText, Sparkles, Plus } from 'lucide-react';

const iconMap: Record<string, any> = {
  Bot,
  MapPin,
  FileText,
  Sparkles
};

const SystemSpecs = () => {
  return (
    <section className="min-h-full flex flex-col justify-center px-6 relative py-20">
        {/* Background texture */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
        
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-12 pl-6 border-l-2 border-zyxo-blue">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {CONTENT.systemSpecs.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono text-sm uppercase tracking-wider"
          >
            {CONTENT.systemSpecs.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTENT.systemSpecs.modules.map((module, index) => (
            <SpecCard key={index} module={module} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const SpecCard = ({ module, index }: { module: any; index: number }) => {
  const Icon = iconMap[module.icon];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group h-64 bg-[#0a0a0a] overflow-hidden p-8 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
        {/* Animated Border */}
        <div className="absolute inset-0 border border-white/5 z-20 transition-colors duration-300 group-hover:border-transparent"></div>
        
        {/* Drawing Border Effect on Hover */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <rect 
                x="1" y="1" width="99%" height="99%" 
                fill="none" 
                stroke="#00f0ff" 
                strokeWidth="1" 
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className="group-hover:animate-[drawBorder_1s_forwards_ease-out]"
            />
        </svg>

        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

      <div className="absolute top-0 right-0 p-4 z-20">
        <div className="text-[10px] font-mono text-gray-600 group-hover:text-zyxo-blue transition-colors duration-300">
            ID: MOD_0{index + 1}
        </div>
      </div>

      <div className="relative z-10">
        <div className={`p-3 w-fit mb-4 rounded bg-white/5 border border-white/10 group-hover:bg-zyxo-blue/10 group-hover:border-zyxo-blue/50 group-hover:text-zyxo-blue transition-all duration-300 ${isHovered ? 'text-zyxo-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'text-gray-400'}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-zyxo-blue transition-colors">{module.title}</h3>
      </div>

      <div className="relative h-20 z-10">
        <AnimatePresence mode="wait">
          {!isHovered ? (
             <motion.div
                key="placeholder"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-end"
             >
                <div className="flex items-center text-xs text-gray-500 uppercase tracking-widest gap-2">
                    <Plus size={12} className="text-zyxo-blue" />
                    <span>Access Data</span>
                    <div className="w-12 h-px bg-white/10" />
                </div>
             </motion.div>
          ) : (
            <motion.div
                key="desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
            >
                <p className="text-sm text-gray-300 font-mono leading-relaxed border-l-2 border-zyxo-blue pl-3">
                    {module.desc}
                </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SystemSpecs;