
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_PROMPT = `# SYSTEM PROMPT: ACELERAÍ IMPACT SIMULATOR ENGINE (v2.0)

**ROLE:**
Você é o **Motor de Inteligência de Auditoria Criativa e Documental do Aceleraí**. Sua função é orquestrar um painel de "Agentes Sintéticos" para auditar materiais de marketing e prever o impacto em personas reais.

---

## 2. A BANCADA DE AGENTES
Analise o input sob a ótica estrita destas personas:
- Phil (Trust), Dra. Camila (Brand), Toninho (Clarity), Juliana (Compliance), Klebão (Urgency).

---

## 3. PERSONAS MAPEADAS (TARGET)
Você deve calcular o impacto (0-100) para estas 5 categorias de clientes:
1. "Impulsivos de Mobile"
2. "Buscadores de Autoridade"
3. "Analíticos/Céticos"
4. "Fãs de Estética/Design"
5. "Consumidores de Massa"

Saída: JSON estritamente conforme o esquema.`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeCreative = async (input: string, base64Image?: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found. Ensure VITE_GEMINI_API_KEY is set in .env.local");
    throw new Error("API Key configuration error");
  }

  const ai = new GoogleGenAI({ apiKey });

  const contents: any[] = [{ text: input }];
  if (base64Image) {
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Image.split(',')[1] || base64Image
      }
    });
  }

  let attempt = 0;
  const maxRetries = 4;

  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: { parts: contents },
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis_id: { type: Type.STRING },
              overall_score: { type: Type.INTEGER },
              sentiment: { type: Type.STRING },
              simulated_heatmap: {
                type: Type.OBJECT,
                properties: {
                  focal_point_1: { type: Type.STRING },
                  focal_point_2: { type: Type.STRING },
                  ignored_area: { type: Type.STRING }
                }
              },
              agents_feedback: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    agent_name: { type: Type.STRING },
                    verdict: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    objection_type: { type: Type.STRING }
                  }
                }
              },
              persona_impact: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    persona_name: { type: Type.STRING },
                    impact_score: { type: Type.INTEGER }
                  }
                },
                description: "Mapeie o impacto para 5 personas: Impulsivos, Autoridade, Analíticos, Estéticos e Massa."
              },
              actionable_tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["analysis_id", "overall_score", "sentiment", "agents_feedback", "persona_impact", "actionable_tips"]
          }
        }
      });

      const textResult = response.text || '{}';
      try {
        const parsed = JSON.parse(textResult);
        return parsed as AnalysisResult;
      } catch (e) {
        throw new Error("Resposta inválida do motor de IA (JSON Parse Error).");
      }

    } catch (error: any) {
      console.log(`🔄 Gemini API Attempt ${attempt + 1}/${maxRetries} - Retrying...`, error.message || error);

      // Check if error is retryable
      const isRetryable =
        error.status === 429 ||
        error.status === 503 ||
        (error.message && (error.message.includes('Resource has been exhausted') || error.message.includes('Quota exceeded')));

      if (isRetryable && attempt < maxRetries - 1) {
        // Try to parse retryDelay from error details
        let delay = 0;

        // Check for retryDelay in error.details (Gemini API format)
        if (error.details && Array.isArray(error.details)) {
          const retryInfo = error.details.find((d: any) =>
            d['@type']?.includes('RetryInfo') && d.retryDelay
          );

          if (retryInfo && retryInfo.retryDelay) {
            // Parse delay like "33s" or "500ms"
            const match = retryInfo.retryDelay.match(/^(\d+)(s|ms)$/);
            if (match) {
              const value = parseInt(match[1]);
              const unit = match[2];
              delay = unit === 's' ? value * 1000 : value;
              console.log(`📡 API requested retry delay: ${retryInfo.retryDelay} (${delay}ms)`);
            }
          }
        }

        // Fallback to progressive backoff if no retryDelay specified
        if (delay === 0) {
          const backoffDelays = [2000, 5000, 15000, 35000];
          delay = backoffDelays[attempt] || 35000;
        }

        console.log(`⏳ Retrying in ${(delay / 1000).toFixed(1)}s... (Attempt ${attempt + 2}/${maxRetries})`);
        await sleep(delay);
        attempt++;
      } else {
        // Final error after all retries
        const userMessage = error.status === 429
          ? 'Serviço temporariamente sobrecarregado. Por favor, aguarde 1 minuto e tente novamente.'
          : `Falha na análise após ${attempt + 1} tentativas. ${error.message}`;

        throw new Error(userMessage);
      }
    }
  }

  throw new Error("Erro desconhecido na análise.");
};
