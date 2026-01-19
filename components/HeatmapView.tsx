
import React from 'react';

interface HeatmapViewProps {
  image: string;
  focalPoints: {
    focal_point_1: string;
    focal_point_2: string;
  };
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ image, focalPoints }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
      <img src={image} alt="Creative" className="w-full h-auto" />
      
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-red-500/40 to-yellow-500/20 mix-blend-overlay opacity-80 animate-pulse" />
      
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">
        <span className="text-red-400 mr-2">●</span> Heatmap de Atenção
      </div>

      <div className="absolute top-[25%] left-[30%] pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-red-500/40 blur-xl animate-ping" />
        <div className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md absolute -top-4 -left-4 whitespace-nowrap shadow-xl">
          {focalPoints.focal_point_1}
        </div>
      </div>

      <div className="absolute bottom-[35%] right-[25%] pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-orange-500/30 blur-xl animate-pulse" />
        <div className="bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md absolute -top-4 -left-4 whitespace-nowrap shadow-xl">
          {focalPoints.focal_point_2}
        </div>
      </div>
    </div>
  );
};
