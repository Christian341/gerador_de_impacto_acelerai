
import React from 'react';
import { Home, History, PlusCircle, Settings, FileText } from 'lucide-react';

export function FloatingMenu() {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-1 p-1.5 bg-[#0f0f11]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50">

                <MenuItem icon={<Home size={20} />} label="Início" active />
                <MenuItem icon={<History size={20} />} label="Histórico" />

                <div className="mx-1">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        <PlusCircle size={22} />
                    </button>
                </div>

                <MenuItem icon={<FileText size={20} />} label="Relatórios" />
                <MenuItem icon={<Settings size={20} />} label="Config" />

            </div>
        </div>
    );
}

function MenuItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button
            className={`
        relative group flex items-center justify-center w-10 h-10 rounded-full transition-all
        ${active ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}
      `}
            title={label}
        >
            {icon}
            {active && (
                <span className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full"></span>
            )}

            {/* Tooltip */}
            <span className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 text-[10px] rounded text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                {label}
            </span>
        </button>
    );
}
