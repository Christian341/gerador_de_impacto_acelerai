import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { z } from "zod";

// Zod Schema for Validation
const AnalyzeSchema = z.object({
    text: z.string().optional(),
    image: z.string().optional(), // Base64
}).refine((data) => data.text || data.image, {
    message: "Pelo menos texto ou imagem deve ser fornecido.",
});

// System Prompt (Shared)
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

---

## 4. IA VISUAL (HEATMAP)
Ao analisar imagens, identifique os dois pontos de maior atenção (Focal Points).
Para cada ponto, forneça:
1. Uma etiqueta curta (label).
2. Coordenadas aproximadas (x, y) em porcentagem (0-100) relativas ao topo-esquerda da imagem.

Saída: JSON estritamente conforme o esquema.`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate Input
        const parsed = AnalyzeSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Input inválido", details: parsed.error.issues }, { status: 400 });
        }

        const { text, image } = parsed.data;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Configuração de API Key ausente no servidor." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        analysis_id: { type: SchemaType.STRING },
                        overall_score: { type: SchemaType.INTEGER },
                        sentiment: { type: SchemaType.STRING },
                        simulated_heatmap: {
                            type: SchemaType.OBJECT,
                            properties: {
                                focal_point_1: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        label: { type: SchemaType.STRING },
                                        x: { type: SchemaType.NUMBER },
                                        y: { type: SchemaType.NUMBER }
                                    },
                                    required: ["label", "x", "y"]
                                },
                                focal_point_2: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        label: { type: SchemaType.STRING },
                                        x: { type: SchemaType.NUMBER },
                                        y: { type: SchemaType.NUMBER }
                                    },
                                    required: ["label", "x", "y"]
                                },
                                ignored_area: { type: SchemaType.STRING }
                            },
                            required: ["focal_point_1", "focal_point_2", "ignored_area"]
                        },
                        agents_feedback: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    agent_name: { type: SchemaType.STRING },
                                    verdict: { type: SchemaType.STRING },
                                    score: { type: SchemaType.INTEGER },
                                    objection_type: { type: SchemaType.STRING }
                                }
                            }
                        },
                        persona_impact: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    persona_name: { type: SchemaType.STRING },
                                    impact_score: { type: SchemaType.INTEGER }
                                }
                            }
                        },
                        actionable_tips: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING }
                        }
                    },
                    required: ["analysis_id", "overall_score", "sentiment", "agents_feedback", "persona_impact", "actionable_tips", "simulated_heatmap"]
                }
            }
        });

        // Helper to construct prompt parts
        const buildParts = (useImage: boolean) => {
            const parts: any[] = [];
            if (text) parts.push({ text });
            if (image && useImage) {
                const base64Data = image.split(',')[1] || image;
                parts.push({
                    inlineData: {
                        mimeType: "image/png",
                        data: base64Data
                    }
                });
            }
            return parts;
        };

        // Execution Logic with Retry and Fallback
        const attemptGeneration = async (retryCount = 0): Promise<any> => {
            const useImage = !!image;
            try {
                const parts = buildParts(useImage);
                const result = await model.generateContent(parts);
                const response = await result.response;
                return JSON.parse(response.text());
            } catch (error: any) {
                console.warn(`⚠️ Gemini Attempt ${retryCount + 1} failed:`, error.message);

                const isQuotaError = error.status === 429 || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
                const isRetryable = isQuotaError || error.status === 503 || error.status === 500 || error.message?.includes('timeout') || error.message?.includes('network');

                // Max retries: 3
                if (retryCount < 3 && isRetryable) {
                    let delay = Math.pow(2, retryCount) * 2000; // Exponential backoff: 2s, 4s, 8s

                    // If API provides a retry delay, use it
                    if (error.details && Array.isArray(error.details)) {
                        const retryInfo = error.details.find((d: any) => d['@type']?.includes('RetryInfo') && d.retryDelay);
                        if (retryInfo?.retryDelay) {
                            const match = retryInfo.retryDelay.match(/^(\d+)(s|ms)$/);
                            if (match) {
                                const value = parseInt(match[1]);
                                const unit = match[2];
                                delay = unit === 's' ? value * 1000 : value;
                            }
                        }
                    }

                    console.log(`⏳ Retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    return attemptGeneration(retryCount + 1);
                }

                // Fallback Strategy (Image Failure -> Text Only)
                if (useImage && text && retryCount >= 1) { // Only fallback after at least one retry failed
                    console.warn("Falling back to text-only mode due to persistent image processing issues.");
                    try {
                        const textParts = buildParts(false);
                        const result = await model.generateContent(textParts);
                        const response = await result.response;
                        return {
                            ...JSON.parse(response.text()),
                            warning: "A análise visual falhou (Erro/Segurança). Resultados baseados apenas em texto."
                        };
                    } catch (fallbackError) {
                        throw fallbackError;
                    }
                }

                throw error;
            }
        };

        const finalResult = await attemptGeneration();
        return NextResponse.json(finalResult);

    } catch (error: any) {
        console.error("❌ API Error:", error);

        const isQuota = error.status === 429 || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
        const isDev = process.env.NODE_ENV === 'development';

        return NextResponse.json({
            error: isQuota ? "Limite de requisições excedido. Por favor, tente novamente em alguns instantes." : "Erro interno no processamento de IA.",
            ...(isDev && {
                details: error.message,
                stack: error.stack
            })
        }, { status: error.status || 500 });
    }
}
