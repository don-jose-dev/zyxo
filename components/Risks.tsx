import React from 'react';
import { CONTENT } from '../lib/content';
import { AlertTriangle } from 'lucide-react';

const Risks: React.FC = () => {
  return (
    <aside 
      className="py-12 px-6 bg-[#050505] border-t border-white/10"
      aria-labelledby="risks-title"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-[#0a0a0a] border border-white/10 rounded p-6 font-mono text-xs">
          <div 
            id="risks-title"
            className="flex items-center gap-2 mb-4 text-yellow-500 uppercase tracking-widest border-b border-white/5 pb-2"
          >
            <AlertTriangle size={14} aria-hidden="true" />
            <span>{CONTENT.risks.title}</span>
          </div>
          
          <ul 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            aria-label="Important details"
          >
            {CONTENT.risks.items.map((item, index) => (
              <li key={index} className="flex gap-3 items-start text-gray-500">
                <span className="text-white/20" aria-hidden="true">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Risks;
