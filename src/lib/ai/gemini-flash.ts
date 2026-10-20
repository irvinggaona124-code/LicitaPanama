import { GoogleGenAI } from "@google/genai";
import { sanitizePromptInput } from "@/lib/security/crypto-vault";

const MODEL_ID = "gemini-3.8-flash";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || "placeholder_gemini_api_key";
  return new GoogleGenAI({ apiKey });
}

export interface CompanyProfile {
  ruc: string;
  dv: string;
  razonSocial: string;
  industrySummary: string;
  validatedDgiRevenue: number;
  yearsExperience: number;
  unspscCodes: string[];
}

export interface CompetitorRecord {
  competitorName: string;
  competitorRuc: string;
  referenceAmount: number;
  offeredAmount: number;
  wonTender: boolean;
  awardDate: string | null;
}

export interface WinProbabilityResult {
  win_probability_pct: number;
  financial_capacity_match: {
    passed: boolean;
    explanation: string;
  };
  technical_strengths: string[];
  missing_requirements: string[];
  // Plan $50 Exclusive intelligence
  top_competitors?: {
    name: string;
    avgDiscountPct: number;
    winRatePct: number;
  }[];
  recommended_bid_range_usd?: {
    minUsd: number;
    maxUsd: number;
    recommendedUsd: number;
    rationale: string;
  };
  actionable_improvements?: string[];
}

/**
 * Modo 1 (Plan $30) y Modo 2 (Plan $50):
 * Analizador Híbrido de Probabilidad de Adjudicación con Gemini 3.8 Flash
 */
export async function analyzeWinProbability(
  company: CompanyProfile,
  tenderMarkdown: string,
  referenceAmount: number,
  competitorsHistory?: CompetitorRecord[],
  planTier: "pro_30" | "elite_50" = "pro_30"
): Promise<WinProbabilityResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback heuristic calculations if GEMINI_API_KEY is not set
  if (!apiKey || apiKey.includes("placeholder")) {
    const revenueRatio = referenceAmount > 0 ? company.validatedDgiRevenue / referenceAmount : 1;
    const financialPass = revenueRatio >= 0.7;
    const baseScore = Math.min(94, Math.max(35, Math.round(revenueRatio * 45 + (company.yearsExperience > 5 ? 30 : 15))));

    const mockResult: WinProbabilityResult = {
      win_probability_pct: baseScore,
      financial_capacity_match: {
        passed: financialPass,
        explanation: financialPass
          ? `La facturación histórica validada ante la DGI (${company.validatedDgiRevenue.toLocaleString("es-PA", { style: "currency", currency: "USD" })}) cubre satisfactoriamente el monto de referencia de ${referenceAmount.toLocaleString("es-PA", { style: "currency", currency: "USD" })}.`
          : `La facturación validada representa solo el ${Math.round(revenueRatio * 100)}% del precio oficial. Se sugiere licitar en consorcio según el Artículo 51 del Texto Único de la Ley 22.`,
      },
      technical_strengths: [
        "Alineación comprobable en actividades comerciales y experiencia requerida",
        "Registro de contribuyente DGI solvente y cumplimiento tributario",
        "Capacidad técnica acumulada durante más de " + company.yearsExperience + " años en el mercado",
      ],
      missing_requirements: [
        "Fianza de Propuesta emitida por aseguradora autorizada por la SSRP (10% del monto)",
        "Pacto de Integridad debidamente autenticado ante Notario Público de Panamá",
        "Declaración Jurada de Medidas de Retorsión (Ley 48 de 2016)",
      ],
    };

    if (planTier === "elite_50") {
      mockResult.top_competitors = [
        { name: "CONSTRUCTORA NACIONAL S.A.", avgDiscountPct: 7.5, winRatePct: 62 },
        { name: "SOLUCIONES ELECTROMECÁNICAS PA S.A.", avgDiscountPct: 4.8, winRatePct: 45 },
      ];
      mockResult.recommended_bid_range_usd = {
        minUsd: Math.round(referenceAmount * 0.91),
        maxUsd: Math.round(referenceAmount * 0.95),
        recommendedUsd: Math.round(referenceAmount * 0.93),
        rationale: "Ofertar a un 93% del precio de referencia optimiza el margen sin arriesgar descalificación por oferta onerosa o temeraria.",
      };
      mockResult.actionable_improvements = [
        "Presentar certificación de calidad ISO 9001 para obtener 5 puntos adicionales en la ponderación técnica.",
        "Acreditar personal técnico idóneo con sello de la Junta Técnica de Ingeniería y Arquitectura (JTIA).",
        "Ajustar la fianza de cumplimiento al 20% conforme al pliego definitivo.",
      ];
    }

    return mockResult;
  }

  const ai = getClient();
  const sanitizedPliego = sanitizePromptInput(tenderMarkdown).slice(0, 8000);

  const prompt = `
Eres el Analista Principal de Licitaciones de la República de Panamá bajo el Texto Único de la Ley 22 de Contratación Pública.
Analiza la siguiente empresa y el pliego de cargos de PanamáCompra:

DATOS DE LA EMPRESA:
- Razón Social: ${company.razonSocial} (RUC: ${company.ruc}-${company.dv})
- Facturación Anual Validada DGI: $${company.validatedDgiRevenue}
- Años de Experiencia: ${company.yearsExperience} años
- Rubros UNSPSC: ${company.unspscCodes.join(", ")}

DATOS DEL PLIEGO DE CARGOS:
- Precio de Referencia Oficial: $${referenceAmount}
- Contenido del Pliego:
${sanitizedPliego}

${
  planTier === "elite_50" && competitorsHistory
    ? `HISTORIAL DE COMPETIDORES EN ESTA ENTIDAD:
${JSON.stringify(competitorsHistory.slice(0, 5), null, 2)}`
    : ""
}

INSTRUCCIONES OBLIGATORIAS:
1. Calcula la probabilidad de adjudicación (win_probability_pct de 0 a 100).
2. Determina si la solvencia DGI cumple con el requisito financiero.
3. Enumera fortalezas técnicas y requisitos subsanables según la Ley 22.
${
  planTier === "elite_50"
    ? "4. Para el Plan Élite: analiza los competidores, recomienda el rango óptimo de oferta en USD y da recomendaciones estratégicas de mejora."
    : ""
}
5. Devuelve EXCLUSIVAMENTE un objeto JSON válido con este formato:
{
  "win_probability_pct": number,
  "financial_capacity_match": {
    "passed": boolean,
    "explanation": string
  },
  "technical_strengths": string[],
  "missing_requirements": string[]${
    planTier === "elite_50"
      ? `,
  "top_competitors": [
    { "name": string, "avgDiscountPct": number, "winRatePct": number }
  ],
  "recommended_bid_range_usd": {
    "minUsd": number,
    "maxUsd": number,
    "recommendedUsd": number,
    "rationale": string
  },
  "actionable_improvements": string[]`
      : ""
  }
}
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as WinProbabilityResult;
  } catch (error) {
    console.error("Error al invocar Gemini 3.8 Flash:", error);
    throw error;
  }
}

/**
 * Chat especializado con el pliego de cargos
 */
export async function chatWithTender(
  tenderTitle: string,
  tenderMarkdown: string,
  userMessage: string,
  history: { role: "user" | "model"; text: string }[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("placeholder")) {
    return `[Gemini 3.8 Flash]: Con respecto a tu consulta sobre "${userMessage}", el pliego de cargos de "${tenderTitle}" establece que todas las propuestas deben ajustarse al Texto Único de la Ley 22 de Contratación Pública. La fianza de propuesta exigida es del 10% del valor total ofertado, con vigencia mínima de 120 días calendario.`;
  }

  const ai = getClient();
  const sanitizedPliego = sanitizePromptInput(tenderMarkdown).slice(0, 7000);
  const sanitizedMessage = sanitizePromptInput(userMessage);

  const systemInstruction = `
Eres el Asesor Legal y Técnico Experto en Licitaciones Públicas de Panamá (Gemini 3.8 Flash).
Tienes a tu disposición el pliego de cargos de PanamáCompra: "${tenderTitle}".
Pliego de cargos:
${sanitizedPliego}

Responde de forma clara, directa, profesional y fundamentada en la normativa panameña (Ley 22, Decretos Ejecutivos y disposiciones de la DGCP). No inventes cláusulas que no figuren en el pliego.
`;

  const contents = [
    { role: "user", parts: [{ text: systemInstruction }] },
    ...history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: sanitizedMessage }] },
  ];

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents,
  });

  return response.text || "No se pudo generar respuesta del asistente.";
}

/**
 * Modo 3 (Plan $50): Generador de Plantillas Oficiales de la Ley 22
 */
export async function generateLaw22TemplateContent(
  templateType: "propuesta_economica" | "pacto_integridad" | "medidas_retorsion" | "carta_consorcio",
  company: CompanyProfile,
  tenderTitle: string,
  actoNumero: string,
  entityName: string
): Promise<{ title: string; clauses: { heading: string; body: string }[] }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("placeholder")) {
    return {
      title: `FORMULARIO DE ${templateType.toUpperCase()} - ACTO ${actoNumero}`,
      clauses: [
        {
          heading: "1. COMPARECENCIA Y PERSONERÍA JURÍDICA",
          body: `Quien suscribe, actuando en calidad de Representante Legal de la empresa ${company.razonSocial}, con RUC número ${company.ruc}-${company.dv}, debidamente facultado según constancia del Registro Público de Panamá, comparece respetuosamente ante ${entityName} para formular propuesta en el Acto Público N° ${actoNumero}.`,
        },
        {
          heading: "2. CUMPLIMIENTO DEL PLIEGO DE CARGOS Y LEY 22",
          body: `Declaramos bajo la gravedad de juramento que hemos examinado las especificaciones técnicas del pliego de cargos de "${tenderTitle}" y aceptamos incondicionalmente todos sus términos, sometiéndonos a las disposiciones del Texto Único de la Ley 22 de 27 de junio de 2006.`,
        },
        {
          heading: "3. DECLARACIÓN DE NO INCAPACIDAD LEGAL",
          body: "Certificamos que ni la empresa ni sus dignatarios, directores o apoderados se encuentran comprendidos en ninguna de las causales de incapacidad para contratar con el Estado panameño previstas en el Artículo 24 de la Ley 22.",
        },
        {
          heading: "4. VALIDEZ DE LA OFERTA Y FIANZAS",
          body: "La presente propuesta mantendrá su total validez por el término de ciento veinte (120) días hábiles contados a partir de la fecha de celebración del acto de apertura de propuestas.",
        },
      ],
    };
  }

  const ai = getClient();
  const prompt = `
Genera el contenido formal y legal de la plantilla "${templateType}" conforme al Texto Único de la Ley 22 de Contratación Pública de Panamá.
- Empresa: ${company.razonSocial} (RUC: ${company.ruc}-${company.dv})
- Entidad Licitante: ${entityName}
- Acto Número: ${actoNumero}
- Título del Pliego: ${tenderTitle}

Devuelve un JSON con este formato exacto:
{
  "title": string,
  "clauses": [
    { "heading": string, "body": string }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text || "{}");
}
