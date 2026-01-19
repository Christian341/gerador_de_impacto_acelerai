"use client";

import React from 'react';
import { AnalysisProvider } from '@/context/AnalysisContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AnalysisProvider>
            {children}
        </AnalysisProvider>
    );
}
