import React from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '../lib/content';
import { Power, ArrowRight } from 'lucide-react';

const FinalCTA = () => {

  const handleWhatsApp = (plan: string) => {
    const message = `Hi, I am interested in the ${plan} plan.`;
    const url = `https://wa.me/${CONTENT.brand.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="min-h-full flex flex-col items-center justify-center relative overflow-hidden py-20">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_#050505_100%)] z-0" />
        
        {/* Moving Gradient blobs */}
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 90, 0] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-zyxo-green/10 via-transparent to-zyxo-blue/10 rounded-full blur-[100px] pointer-events-none z-0"
        />

        <div className="container relative z-10 max-w-2xl text-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                {/* Pulsing Icon */}
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-zyxo-green blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative p-6 rounded-full bg-[#0a0a0a] border border-zyxo-green/30 text-white shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                        <Power size={48} className="text-zyxo-green" />
                    </div>
                </div>

                <h2 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                    {CONTENT.finalCta.title}
                </h2>
                <p className="text-gray-400 mb-12 text-lg max-w-lg mx-auto leading-relaxed">
                    {CONTENT.finalCta.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button 
                        onClick={() => handleWhatsApp("Starter")}
                        className="group px-8 py-5 border border-white/10 bg-white/5 backdrop-blur-sm text-white font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer z-50 pointer-events-auto"
                    >
                        {CONTENT.finalCta.ctaPrimary}
                    </button>
                    
                    <button 
                        onClick={() => handleWhatsApp("Business")}
                        className="group relative px-10 py-5 bg-zyxo-green text-black font-mono font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.6)] flex items-center justify-center gap-3 cursor-pointer z-50 pointer-events-auto"
                    >
                        <span className="relative z-10">{CONTENT.finalCta.ctaSecondary}</span>
                        <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        
                        {/* Diagonal shine wipe */}
                        <div className="absolute inset-0 bg-white/40 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 z-0" />
                    </button>
                </div>
            </motion.div>
        </div>
    </section>
  );
};

export default FinalCTA;