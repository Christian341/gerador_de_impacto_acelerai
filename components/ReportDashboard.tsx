
import React from 'react';
import { AnalysisResult } from '../types';
import { HeatmapView } from './HeatmapView';

interface ReportDashboardProps {
  result: AnalysisResult;
  sourceImage?: string;
  sourceText?: string;
}

const getSentimentEmoji = (s: string = '') => {
  const lower = s.toLowerCase();
  if (lower.includes('positive') || lower.includes('excelente')) return '🤩';
  if (lower.includes('negative') || lower.includes('critico')) return '😡';
  return '😐';
};

const getSentimentLabel = (s: string = '') => {
  const lower = s.toLowerCase();
  if (lower.includes('positive')) return 'OTIMISTA';
  if (lower.includes('negative') || lower.includes('critico')) return 'CRÍTICO';
  return 'CAUTELOSO';
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-500';
};

const getProgressBarColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
};

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ result, sourceImage, sourceText }) => {
  const isDocument = !sourceImage;
  const heatmap = result.simulated_heatmap || { focal_point_1: 'N/A', focal_point_2: 'N/A', ignored_area: 'Não identificado' };
  const tips = Array.isArray(result.actionable_tips) ? result.actionable_tips : [];
  const personas = result.persona_impact || [];

  const size = 110;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, result.overall_score)) / 100) * circumference;

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-['Poppins']">
      
      {/* HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <div className="md:col-span-8 glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 md:gap-10 border-white/5 relative overflow-hidden">
          <div className="relative flex-shrink-0 flex items-center justify-center w-[120px] h-[120px]">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-white/5" />
              <circle
                cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
                strokeDasharray={circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
                className={`${getScoreColor(result.overall_score)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl md:text-4xl font-black ${getScoreColor(result.overall_score)} leading-none font-['DM_Sans']`}>{result.overall_score}</span>
              <span className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 font-['DM_Sans']">Impacto</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 md:space-y-3 text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight font-['DM_Sans']">
              {isDocument ? 'Auditoria de Documento' : 'Auditoria de Criativo'}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md">
              Análise profunda de aderência para sua base de clientes mapeada.
            </p>
          </div>
        </div>
        <div className="md:col-span-4 glass-panel p-6 md:p-8 rounded-2xl flex flex-row md:flex-col items-center justify-center text-center border-white/5 gap-4">
          <div className="text-4xl md:text-6xl drop-shadow-lg">{getSentimentEmoji(result.sentiment)}</div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-none font-['DM_Sans']">Tom de Voz</h3>
            <p className="text-[8px] md:text-[10px] text-slate-500 mt-1 md:mt-2 uppercase tracking-[0.3em] font-black font-['DM_Sans']">{getSentimentLabel(result.sentiment)}</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className={`grid grid-cols-1 ${isDocument ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6 md:gap-8`}>
        <div className={isDocument ? 'w-full' : 'lg:col-span-5'}>
          {isDocument ? (
            <div className="glass-panel p-6 md:p-10 rounded-3xl border-white/5 bg-[#0f0f11] shadow-inner relative overflow-hidden">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-3 font-['DM_Sans']">
                <span className="w-6 md:w-8 h-[2px] bg-blue-500"></span>Conteúdo Analisado
              </h3>
              <div className="prose prose-invert max-w-none">
                <div className="space-y-4 text-slate-300 font-serif italic text-lg leading-relaxed border-l-2 border-blue-500/30 pl-6 py-2">
                  {sourceText ? sourceText.split('\n').map((line, i) => (
                    <p key={i} className={i === 0 ? "text-white font-bold not-italic" : ""}>{line}</p>
                  )) : 'Nenhum texto disponível.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:sticky lg:top-24 space-y-6">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-3 font-['DM_Sans']">
                <span className="w-6 md:w-8 h-[2px] bg-blue-500"></span>Atenção IA Visual
              </h3>
              <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black">
                <HeatmapView image={sourceImage!} focalPoints={heatmap} />
              </div>
            </div>
          )}
        </div>

        <div className={isDocument ? 'w-full grid grid-cols-1 lg:grid-cols-2 gap-8' : 'lg:col-span-7 space-y-8'}>
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-3 font-['DM_Sans']">
              <span className="w-6 md:w-8 h-[2px] bg-purple-500"></span>Veredito do Conselho
            </h3>
            <div className="grid gap-4">
              {result.agents_feedback?.map((agent, idx) => (
                <div key={idx} className="glass-panel p-5 md:p-6 rounded-xl border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-base font-black text-white font-['DM_Sans']">{agent.agent_name}</h4>
                    <span className={`text-lg font-black ${getScoreColor(agent.score)}`}>{agent.score}%</span>
                  </div>
                  <p className="text-slate-400 text-xs italic">"{agent.verdict}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="glass-panel p-6 md:p-8 rounded-3xl border-blue-500/10 shadow-2xl bg-[#0f0f11]">
              <h3 className="text-lg font-black text-white mb-6 font-['DM_Sans']">Impacto em Clientes Mapeados</h3>
              <div className="flex justify-around items-end h-32 gap-3">
                {personas.length > 0 ? personas.map((p, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="w-full bg-white/5 rounded-t-lg relative overflow-hidden h-full">
                      <div 
                        className={`absolute bottom-0 left-0 right-0 ${p.impact_score > 70 ? 'bg-emerald-500/50' : p.impact_score > 40 ? 'bg-amber-500/50' : 'bg-rose-500/50'} transition-all duration-1000`} 
                        style={{ height: `${p.impact_score}%` }}
                      ></div>
                    </div>
                    <span className="text-[7px] md:text-[8px] text-slate-500 font-bold uppercase text-center leading-tight h-8 flex items-center">{p.persona_name}</span>
                    <span className="text-[9px] font-black text-white">{p.impact_score}%</span>
                  </div>
                )) : (
                  <div className="w-full flex items-center justify-center text-slate-600 italic text-xs">Aguardando dados...</div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 font-['DM_Sans']">Diretrizes de Otimização</h4>
                <div className="grid gap-3">
                  {tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 text-[10px] font-black">{idx + 1}</div>
                      <p className="text-slate-300 text-xs leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
