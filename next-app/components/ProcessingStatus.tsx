"use client";

import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
    "Consultando Phil (Trust)...",
    "Analisando Paleta de Cores...",
    "Dra. Camila está avaliando...",
    "Calculando Impacto Emocional...",
    "Verificando Compliance...",
    "Gerando Heatmap de Atenção...",
    "Sintetizando Veredito..."
];

export const ProcessingStatus = () => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="relative mb-8">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse" />
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white font-['DM_Sans'] tracking-tight mb-2">
                Analisando Ativo
            </h3>

            <div className="h-8 overflow-hidden relative w-full flex justify-center">
                <p key={msgIndex} className="text-slate-400 text-sm md:text-base font-medium animate-in slide-in-from-bottom-2 fade-in duration-500 absolute">
                    {LOADING_MESSAGES[msgIndex]}
                </p>
            </div>
        </div>
    );
};
