
import React from 'react';
import { AnalysisResult } from '../types';

interface DocumentReviewViewProps {
  result: AnalysisResult | null;
  sourceText?: string;
  isLoading?: boolean;
}

export const DocumentReviewView: React.FC<DocumentReviewViewProps> = ({ result, sourceText, isLoading }) => {
  const personas = result?.persona_impact || [];

  return (
    <div className="max-w-4xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Poppins'] pb-12">
      
      {/* User Message - Alinhado à DIREITA (Padrão Chat) */}
      <div className="flex justify-end pr-0">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl rounded-tr-none max-w-[85%] text-slate-300 text-sm md:text-base leading-relaxed relative">
          <span className="text-[10px] font-black text-blue-400 uppercase block mb-1 text-right">VOCÊ</span>
          {sourceText || "Analise o material enviado."}
        </div>
      </div>

      {/* AI Message / Interaction - Alinhado à ESQUERDA */}
      <div className="flex gap-4 md:gap-5 items-start">
        {/* Avatar da IA */}
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-white/10">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 19.74h20L12 2zm0 3.54l7.42 13.2H4.58L12 5.54z"/></svg>
        </div>
        
        <div className="flex-1 space-y-8">
          {isLoading ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-slate-500 text-sm italic font-medium">O Conselho Sintético está processando sua solicitação...</p>
            </div>
          ) : result && result.analysis_id ? (
            <div className="animate-in fade-in duration-1000">
              <div className="prose prose-invert max-w-none mb-8">
                <h2 className="text-xl md:text-2xl font-black text-white font-['DM_Sans'] mb-4 flex items-center gap-3">
                  Relatório de Auditoria
                </h2>
                <p className="text-slate-400 text-sm md:text-base">
                  Identifiquei pontos críticos e oportunidades de otimização no material fornecido. A pontuação de aderência estratégica é de <span className="text-blue-400 font-black px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">{result.overall_score}/100</span>.
                </p>
              </div>

              {/* Agents Feedback Card */}
              <div className="glass-panel rounded-2xl border-white/10 overflow-hidden bg-[#0f0f11]/40 shadow-2xl mb-8">
                <div className="bg-white/5 px-6 py-4 border-b border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-['DM_Sans']">Vereditos do Conselho Sintético</span>
                </div>
                
                <div className="divide-y divide-white/5">
                  {result.agents_feedback?.map((agent, idx) => (
                    <div key={idx} className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-white/[0.02] transition-all">
                      <div className="md:w-40 flex-shrink-0">
                        <h4 className="text-sm font-black text-white font-['DM_Sans'] leading-tight">{agent.agent_name}</h4>
                        <span className="text-[9px] text-blue-500/70 uppercase font-black tracking-widest">{agent.objection_type}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-slate-300 italic leading-relaxed">"{agent.verdict}"</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-white tabular-nums">{agent.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Persona Chart */}
              <div className="glass-panel rounded-2xl border-white/10 p-6 md:p-8 bg-[#0f0f11] mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/30" />
                <h3 className="text-xs font-black text-white mb-8 uppercase tracking-widest text-center">Projeção de Impacto por Segmento</h3>
                <div className="flex items-end h-44 gap-3 md:gap-6 max-w-3xl mx-auto">
                  {personas.map((p, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                      <div className="w-full bg-white/5 rounded-lg relative overflow-hidden h-full">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-600/60 transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.2)] rounded-t-sm" 
                          style={{ height: `${p.impact_score}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-black text-white leading-none">{p.impact_score}%</span>
                        <p className="text-[7px] text-slate-500 font-bold uppercase mt-1 leading-none tracking-tighter">{p.persona_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="grid gap-3">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 ml-1">Diretrizes Práticas</h4>
                {result.actionable_tips.map((tip, idx) => (
                  <div key={idx} className="group flex items-start gap-4 p-4 bg-[#0f0f11]/60 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all">
                    <div className="w-6 h-6 rounded-md bg-blue-600/10 border border-blue-600/30 flex items-center justify-center flex-shrink-0 text-blue-400 font-black text-xs">{idx + 1}</div>
                    <p className="text-slate-300 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
