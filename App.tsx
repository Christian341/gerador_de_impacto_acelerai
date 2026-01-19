import React, { useState, useRef, useEffect } from 'react';
import { analyzeCreative } from './services/geminiService';
import { AnalysisResult } from './types';
import { ReportDashboard } from './components/ReportDashboard';
import { DocumentReviewView } from './components/DocumentReviewView';
import { FloatingMenu } from './components/FloatingMenu';

type AppTab = 'new' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('new');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastInputData, setLastInputData] = useState({ text: '', image: '' as string | undefined });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestionPills = [
    "Faça a medição de impacto desse criativo",
    "Analise o risco de compliance deste contrato",
    "Sugira melhorias no design da landing page",
    "Avalie a clareza deste documento de vendas"
  ];

  useEffect(() => {
    const bgHome = document.getElementById('bg-home');
    const bgReport = document.getElementById('bg-report');

    if (analysisResult && analysisResult.analysis_id) {
      if (bgHome) { bgHome.style.opacity = '0'; bgHome.style.visibility = 'hidden'; }
      if (bgReport) { bgReport.style.opacity = '1'; bgReport.style.visibility = 'visible'; }
    } else {
      if (bgHome) { bgHome.style.opacity = '1'; bgHome.style.visibility = 'visible'; }
      if (bgReport) { bgReport.style.opacity = '0'; bgReport.style.visibility = 'hidden'; }
    }
  }, [analysisResult]);

  useEffect(() => {
    const saved = localStorage.getItem('acelerai_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error("Erro no histórico"); }
    }
  }, []);

  const saveToHistory = (result: AnalysisResult) => {
    // Remove images from ALL history items to save localStorage space
    const updatedHistory = [result, ...history].map((item, index) => {
      // Keep image ONLY for the current result (index 0), remove from older items
      if (index > 0) {
        return { ...item, sourceImage: undefined };
      }
      return item;
    }).slice(0, 15);

    setHistory(updatedHistory);

    // Try to save to localStorage, but don't show error if quota exceeded
    try {
      localStorage.setItem('acelerai_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('📦 localStorage quota exceeded, history not saved');
      // Silently fail - app continues to work normally
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => setSelectedImage(event.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setSelectedImage(undefined);
      }
    }
  };

  const processAnalysis = async () => {
    // Se já estiver analisando, ignora novos cliques para evitar concorrência
    if (isAnalyzing || (!inputText && !selectedImage && !fileName)) return;

    const isImg = !!selectedImage;
    const currentInputText = inputText;
    const currentSelectedImage = selectedImage;
    const currentFileName = fileName;

    // Atualiza o estado visual do que o usuário enviou
    setLastInputData({
      text: currentInputText || (currentFileName ? `Arquivo: ${currentFileName}` : ''),
      image: currentSelectedImage
    });

    // Limpa os campos IMEDIATAMENTE após o envio para o usuário sentir que a mensagem foi "enviada"
    setInputText('');
    setFileName(null);
    setSelectedImage(undefined);
    setIsAnalyzing(true);

    // Se for imagem, reseta o resultado anterior para mostrar o loading de tela cheia
    if (isImg) {
      setAnalysisResult(null);
    }

    try {
      const result = await analyzeCreative(currentInputText || `Análise do arquivo: ${currentFileName}`, currentSelectedImage);
      const resultWithMetadata: AnalysisResult = {
        ...result,
        timestamp: Date.now(),
        sourceText: currentInputText || `Documento: ${currentFileName}`,
        sourceImage: currentSelectedImage
      };
      setAnalysisResult(resultWithMetadata);
      saveToHistory(resultWithMetadata);
    } catch (error: any) {
      console.error('❌ Erro na análise:', error);

      // Show user-friendly error message
      const errorMessage = error?.message || "Erro desconhecido ao processar análise.";
      alert(errorMessage);

    } finally {
      // SEMPRE reseta o loading state
      setIsAnalyzing(false);
      console.log('🏁 processAnalysis finalizado');
    }
  };

  const insertSuggestion = (text: string) => setInputText(text);

  const InputArea = ({ isChat = false }) => (
    <div className={`w-full ${isChat ? 'max-w-4xl mx-auto' : 'chat-container-border'} rounded-2xl p-[1px] shadow-2xl overflow-hidden`}>
      <div className="bg-[#0f0f11] rounded-2xl flex flex-col h-full border border-white/5">
        <div className="p-3 md:p-5 pb-1 flex flex-col flex-grow">
          {selectedImage && (
            <div className="mb-3 relative inline-flex self-start">
              <img src={selectedImage} className="max-h-20 rounded-lg border border-white/10" alt="Preview" />
              <button onClick={() => setSelectedImage(undefined)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full hover:scale-110 transition-transform"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg></button>
            </div>
          )}
          {fileName && !selectedImage && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 self-start">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="text-[9px] text-white font-bold truncate max-w-[120px]">{fileName}</span>
              <button onClick={() => setFileName(null)} className="text-slate-500 hover:text-white transition-colors"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg></button>
            </div>
          )}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                processAnalysis();
              }
            }}
            placeholder={isChat ? "Enviar uma nova mensagem..." : "Cole o briefing ou envie um documento..."}
            className="w-full bg-transparent border-none outline-none text-slate-100 min-h-[50px] md:min-h-[70px] resize-none placeholder:text-slate-700 text-sm md:text-base font-['Poppins']"
          />
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-white transition-all"><svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
          <button
            onClick={processAnalysis}
            disabled={isAnalyzing || (!inputText && !selectedImage && !fileName)}
            className="w-9 h-9 md:w-11 md:h-11 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            )}
          </button>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf,text/plain" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-transparent font-['Poppins']">
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-white/5 bg-[#0a0a0c]/60 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3 text-white font-semibold">
            <span className="text-sm md:text-base font-['DM_Sans']">Christian Oliveira</span>
            <span className="text-[10px] text-slate-500 tracking-widest uppercase font-['DM_Sans']">Premium</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 border border-white/10 shadow-lg shadow-blue-500/20"></div>
        </header>

        <main className={`flex-1 relative z-10 ${analysisResult && !lastInputData.image ? 'pb-56' : 'pb-24'} md:pb-6`}>
          {activeTab === 'history' ? (
            <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in">
              <h2 className="text-xl font-black text-white mb-8 font-['DM_Sans']">Histórico de Auditorias</h2>
              <div className="grid gap-3">
                {history.map((item) => (
                  <div key={item.analysis_id} onClick={() => { setAnalysisResult(item); setLastInputData({ text: item.sourceText || '', image: item.sourceImage }); setActiveTab('new'); }} className="glass-panel p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                      {item.sourceImage ? <img src={item.sourceImage} className="w-full h-full object-cover" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    </div>
                    <div className="flex-1 text-white font-bold truncate text-sm">{item.sourceText || "Análise de Documento"}</div>
                    <div className="text-xl font-black text-emerald-400 font-['DM_Sans']">{item.overall_score}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : !analysisResult && !isAnalyzing ? (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 md:px-6 max-w-4xl mx-auto py-8">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-8 text-center font-['DM_Sans'] tracking-tight">Auditoria de Ativos</h2>
              <InputArea />
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {suggestionPills.map((tip, idx) => (
                  <button key={idx} onClick={() => insertSuggestion(tip)} className="px-4 py-2 bg-[#0f0f11]/60 border border-white/5 rounded-full text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all font-['Poppins']">{tip}</button>
                ))}
              </div>
            </div>
          ) : isAnalyzing && lastInputData.image ? (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-xl font-bold text-white font-['DM_Sans'] tracking-tight">Analisando Criativo Visual...</p>
            </div>
          ) : (
            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
              <div className="max-w-4xl mx-auto mb-8 flex justify-start">
                <button onClick={() => { setAnalysisResult(null); setIsAnalyzing(false); }} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-xs transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  VOLTAR
                </button>
              </div>

              {lastInputData.image ? (
                <ReportDashboard result={analysisResult!} sourceImage={lastInputData.image} sourceText={lastInputData.text} />
              ) : (
                <div className="pb-40">
                  <DocumentReviewView result={analysisResult!} sourceText={lastInputData.text} isLoading={isAnalyzing} />

                  {/* Fixed Chat Input Area for Documents */}
                  <div className="fixed bottom-0 left-0 md:left-0 right-0 p-4 md:p-8 z-50 pointer-events-none">
                    <div className="max-w-4xl mx-auto pointer-events-auto">
                      <div className="bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/95 to-transparent absolute inset-x-0 bottom-0 h-56 -z-10" />
                      <InputArea isChat={true} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <FloatingMenu />
      </div>
    </div>
  );
};

export default App;
