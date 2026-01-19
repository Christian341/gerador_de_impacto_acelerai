"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputArea } from '@/components/InputArea';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { FloatingMenu } from '@/components/FloatingMenu';
import { useAnalysis } from '@/context/AnalysisContext';
import { AnalysisResult } from '@/types';

// Real API call
const analyzeWithAPI = async (text: string, image?: string): Promise<AnalysisResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, image }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Falha na análise');
  }

  return response.json();
};

export default function Home() {
  const router = useRouter();
  const { setAnalysisResult, addToHistory } = useAnalysis();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const suggestionPills = [
    "Faça a medição de impacto desse criativo",
    "Analise o risco de compliance deste contrato",
    "Sugira melhorias no design da landing page",
    "Avalie a clareza deste documento de vendas"
  ];

  const handleAnalyze = async () => {
    if (isAnalyzing || (!inputText && !selectedImage && !fileName)) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const textToAnalyze = inputText || (fileName ? `Arquivo: ${fileName}` : undefined);
      if (!textToAnalyze && !selectedImage) {
        setIsAnalyzing(false); // Reset antes de retornar
        return;
      }

      console.log('🚀 Iniciando análise...', { hasText: !!textToAnalyze, hasImage: !!selectedImage });

      const result = await analyzeWithAPI(textToAnalyze || '', selectedImage);

      console.log('✅ Análise concluída:', result);

      const resultWithMetadata: AnalysisResult = {
        ...result,
        timestamp: Date.now(),
        sourceText: textToAnalyze || "N/A",
        sourceImage: selectedImage
      };

      setAnalysisResult(resultWithMetadata);
      addToHistory(resultWithMetadata);
      router.push('/report');

    } catch (e: any) {
      console.error('❌ Erro na análise:', e);
      alert(`Erro na análise: ${e.message || "Erro desconhecido"}`);
    } finally {
      // SEMPRE reseta o loading state, sem condições
      setIsAnalyzing(false);
      console.log('🏁 handleAnalyze finalizado');
    }
  };

  const insertSuggestion = (text: string) => setInputText(text);

  if (isAnalyzing) {
    return <ProcessingStatus />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-white/5 bg-[#0a0a0c]/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3 text-white font-semibold">
          <span className="text-sm md:text-base font-['DM_Sans']">Aceleraí Impact</span>
          <span className="text-[10px] text-slate-500 tracking-widest uppercase font-['DM_Sans']">Simulator</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 border border-white/10 shadow-lg shadow-blue-500/20"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 max-w-4xl mx-auto py-8 w-full">
        <h2 className="text-2xl md:text-4xl font-black text-white mb-8 text-center font-['DM_Sans'] tracking-tight">Auditoria de Ativos</h2>

        <InputArea
          inputText={inputText}
          setInputText={setInputText}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          fileName={fileName}
          setFileName={setFileName}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
        />

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {suggestionPills.map((tip, idx) => (
            <button key={idx} onClick={() => insertSuggestion(tip)} className="px-4 py-2 bg-[#0f0f11]/60 border border-white/5 rounded-full text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all font-['Poppins']">{tip}</button>
          ))}
        </div>
      </main>
      <FloatingMenu />
    </div>
  );
}
