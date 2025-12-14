import React from 'react';

export const Logo = ({ size = 32, className = "" }: { size?: number, className?: string }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
        >
            <defs>
                <linearGradient id="vortexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" /> {/* Cyan */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
                </linearGradient>
            </defs>
            
            {/* Constructing the Vortex: Multiple layers of spiraling arcs */}
            {[...Array(12)].map((_, i) => {
                const rotation = i * 30;
                return (
                    <g key={`outer-${i}`} transform={`rotate(${rotation} 50 50)`}>
                        {/* Outer swept lines */}
                        <path 
                            d="M50 10 C 60 10, 75 30, 65 55" 
                            stroke="url(#vortexGrad)" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            className="opacity-90"
                        />
                         {/* Connection dots */}
                        <circle cx="50" cy="6" r="1.5" fill="#00f0ff" />
                        
                        {/* Inner detail lines */}
                        <path 
                            d="M50 25 C 55 25, 60 40, 52 50" 
                            stroke="#8b5cf6" 
                            strokeWidth="1" 
                            strokeLinecap="round" 
                            className="opacity-60"
                        />
                         {/* Inner small dots */}
                        <circle cx="52" cy="50" r="1" fill="#ccff00" className="opacity-80" />
                    </g>
                )
            })}

            {/* Inner Ring to form the "Eye" */}
             {[...Array(8)].map((_, i) => {
                const rotation = i * 45 + 15;
                return (
                    <g key={`inner-${i}`} transform={`rotate(${rotation} 50 50)`}>
                        <path 
                            d="M50 35 Q 56 40 55 50" 
                            stroke="#00f0ff" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            className="opacity-40"
                        />
                    </g>
                )
            })}
        </svg>
    </div>
  );
};

export default Logo;