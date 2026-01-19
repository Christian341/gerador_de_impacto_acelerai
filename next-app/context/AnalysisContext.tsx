"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult } from '@/types';

interface AnalysisContextType {
    analysisResult: AnalysisResult | null;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    history: AnalysisResult[];
    setHistory: (history: AnalysisResult[]) => void;
    addToHistory: (result: AnalysisResult) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [history, setHistory] = useState<AnalysisResult[]>([]);

    const addToHistory = (result: AnalysisResult) => {
        setHistory((prev) => {
            const updated = [result, ...prev].slice(0, 15);
            // In a real app, we might persist to localStorage here or let a useEffect handle it
            if (typeof window !== 'undefined') {
                localStorage.setItem('acelerai_history', JSON.stringify(updated));
            }
            return updated;
        });
    };

    // Load history from local storage on mount
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('acelerai_history');
            if (saved) {
                try {
                    setHistory(JSON.parse(saved));
                } catch (e) {
                    console.error("Error loading history", e);
                }
            }
        }
    }, []);

    return (
        <AnalysisContext.Provider value={{ analysisResult, setAnalysisResult, history, setHistory, addToHistory }}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
};
