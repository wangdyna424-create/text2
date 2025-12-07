import React from 'react';

const ChipBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      
      {/* Radial Gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_90%)]"></div>

      {/* Decorative Circuit Lines (SVG) */}
      <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
             <path d="M100 0 V100 H200" fill="none" stroke="#22d3ee" strokeWidth="2" />
             <path d="M0 100 H100 V200" fill="none" stroke="#22d3ee" strokeWidth="2" />
             <circle cx="100" cy="100" r="4" fill="#22d3ee" />
             <rect x="40" y="40" width="20" height="20" fill="none" stroke="#22d3ee" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
      
      {/* Moving Particles (Simulated Logic Gates) */}
      <div className="absolute top-1/4 left-10 w-2 h-32 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-20 w-32 h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30 animate-pulse"></div>
    </div>
  );
};

export default ChipBackground;