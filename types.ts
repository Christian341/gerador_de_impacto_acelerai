
export interface AgentFeedback {
  agent_name: string;
  verdict: string;
  score: number;
  objection_type: 'Trust' | 'Clarity' | 'Compliance' | 'Design';
}

export interface PersonaImpact {
  persona_name: string;
  impact_score: number;
}

export interface AnalysisResult {
  analysis_id: string;
  overall_score: number;
  sentiment: 'positive' | 'neutral_positive' | 'neutral' | 'negative';
  simulated_heatmap: {
    focal_point_1: { label: string; x: number; y: number };
    focal_point_2: { label: string; x: number; y: number };
    ignored_area: string;
  };
  agents_feedback: AgentFeedback[];
  persona_impact: PersonaImpact[];
  actionable_tips: string[];
  timestamp?: number;
  sourceText?: string;
  sourceImage?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  isProcessing?: boolean;
}
