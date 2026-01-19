import React from 'react';

interface HeatmapViewProps {
    image: string;
    focalPoints: {
        focal_point_1: { label: string; x: number; y: number };
        focal_point_2: { label: string; x: number; y: number };
    };
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ image, focalPoints }) => {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 group bg-black/40">
            <img src={image} alt="Creative" className="w-full h-auto" />

            {/* Overlay simulation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-red-500/30 to-yellow-500/20 mix-blend-overlay opacity-60 animate-pulse pointer-events-none" />

            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20 z-10">
                <span className="text-red-400 mr-2">●</span> Heatmap de Atenção
            </div>

            {/* Focal Point 1 */}
            <div
                className="absolute pointer-events-none transition-all duration-1000 ease-out"
                style={{
                    top: `${focalPoints.focal_point_1.y}%`,
                    left: `${focalPoints.focal_point_1.x}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className="w-16 h-16 rounded-full bg-red-500/40 blur-xl animate-ping" />
                <div className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md absolute -top-4 -left-4 whitespace-nowrap shadow-xl border border-white/20 backdrop-blur-sm">
                    {focalPoints.focal_point_1.label}
                </div>
            </div>

            {/* Focal Point 2 */}
            <div
                className="absolute pointer-events-none transition-all duration-1000 ease-out"
                style={{
                    top: `${focalPoints.focal_point_2.y}%`,
                    left: `${focalPoints.focal_point_2.x}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className="w-14 h-14 rounded-full bg-orange-500/30 blur-xl animate-pulse" />
                <div className="bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md absolute -top-4 -left-4 whitespace-nowrap shadow-xl border border-white/20 backdrop-blur-sm">
                    {focalPoints.focal_point_2.label}
                </div>
            </div>
        </div>
    );
};
