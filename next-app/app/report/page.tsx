"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysis } from '@/context/AnalysisContext';
import { ReportDashboard } from '@/components/ReportDashboard';
import { DocumentReviewView } from '@/components/DocumentReviewView';
import { InputArea } from '@/components/InputArea';

export default function ReportPage() {
    const router = useRouter();
    const { analysisResult, setAnalysisResult } = useAnalysis();

    useEffect(() => {
        if (!analysisResult) {
            router.replace('/');
        }
    }, [analysisResult, router]);

    if (!analysisResult) return null;

    const isDocument = !analysisResult.sourceImage;

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0c]">
            <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-white/5 bg-[#0a0a0c]/60 backdrop-blur-xl sticky top-0 z-40">
                <div className="flex items-center gap-3 text-white font-semibold cursor-pointer" onClick={() => router.push('/')}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="text-sm md:text-base font-['DM_Sans']">Voltar</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 border border-white/10 shadow-lg shadow-blue-500/20"></div>
            </header>

            <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
                {!isDocument ? (
                    <ReportDashboard result={analysisResult} sourceImage={analysisResult.sourceImage} sourceText={analysisResult.sourceText} />
                ) : (
                    <div className="pb-40">
                        <DocumentReviewView result={analysisResult} sourceText={analysisResult.sourceText} />

                        {/* Fixed Chat Input Area for Documents (Visual Only for now as chat history implementation is complex) */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 z-50 pointer-events-none">
                            <div className="max-w-4xl mx-auto pointer-events-auto">
                                <div className="bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/95 to-transparent absolute inset-x-0 bottom-0 h-56 -z-10" />
                                {/* Placeholder Input - functionality to be wired up for chat mode */}
                                <div className="opacity-50 pointer-events-none">
                                    {/* We reuse InputArea but disable it or just show as placeholder since chat mode needs more state */}
                                    <div className="w-full max-w-4xl mx-auto rounded-2xl p-[1px] shadow-2xl overflow-hidden border border-white/5 bg-[#0f0f11] p-4 text-center text-slate-500 text-sm">
                                        Chat mode coming soon...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
