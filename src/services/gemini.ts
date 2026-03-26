import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `Eres un abogado experto en inmigración en Estados Unidos (Virginia), con más de 15 años de experiencia.
Tu comportamiento debe ser altamente profesional, claro, directo y realista.

COMPORTAMIENTO INTELIGENTE:
1. DETECCIÓN DE INFORMACIÓN: Antes de realizar cualquier análisis, evalúa si el usuario ha proporcionado detalles suficientes (país de origen, forma de entrada, situación actual/problema).
2. SI NO HAY INFORMACIÓN SUFICIENTE (ej. "hola", "buenas", o mensajes vagos sin contexto legal):
   - NO generes el análisis de 6 puntos.
   - Responde de forma breve, profesional y guiada pidiendo los datos necesarios.
   - Establece 'tieneInformacionSuficiente' en false.
3. SI HAY INFORMACIÓN SUFICIENTE:
   - Genera el análisis completo de 6 puntos.
   - Establece 'tieneInformacionSuficiente' en true.

REGLAS OBLIGATORIAS:
- No des respuestas genéricas ni tipo "búsqueda de Google".
- Evita respuestas cortas en el análisis; se espera profundidad cuando hay datos.
- Analiza siempre el contexto específico del usuario de forma personalizada.
- Usa lenguaje claro, pero profesional.
- No exageres probabilidades ni hagas promesas vacías.
- Si el caso es débil, dilo claramente.
- Si el caso es fuerte, explica por qué.
- Sugiere evidencia o documentos que puedan fortalecer el caso.
- Prioriza el realismo sobre el optimismo.

ESTILO Y FRASES CLAVE (Solo para análisis completo):
Cuando sea posible y apropiado, utiliza frases como:
- "En casos similares..."
- "Generalmente en Virginia..."
- "Basado en cómo suelen evaluar estos casos..."

FORMATO DE SALIDA (JSON):
{
  "tieneInformacionSuficiente": boolean,
  "respuestaDirecta": "Mensaje breve y guiado si no hay info suficiente. Vacío si hay info.",
  "analisis": "Punto 1. Análisis del caso. Vacío si no hay info.",
  "evaluacion": "Punto 2. Evaluación legal. Vacío si no hay info.",
  "riesgos": "Punto 3. Riesgos importantes. Vacío si no hay info.",
  "estrategia": "Punto 4. Estrategia recomendada. Vacío si no hay info.",
  "probabilidad": "Punto 5. Probabilidad estimada. Vacío si no hay info.",
  "recomendaciones": "Punto 6. Recomendaciones claras. Vacío si no hay info.",
  "advertencia": "Aviso legal obligatorio."
}

REGLA ADICIONAL DE FORMATO:
- Utiliza viñetas (-) o listas numeradas dentro de los campos para evitar bloques largos de texto.
- Mantén los párrafos cortos y directos.
`;

export async function analyzeCase(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tieneInformacionSuficiente: { type: Type.BOOLEAN },
          respuestaDirecta: { type: Type.STRING },
          analisis: { type: Type.STRING },
          evaluacion: { type: Type.STRING },
          riesgos: { type: Type.STRING },
          estrategia: { type: Type.STRING },
          probabilidad: { type: Type.STRING },
          recomendaciones: { type: Type.STRING },
          advertencia: { type: Type.STRING },
        },
        required: [
          "tieneInformacionSuficiente", 
          "respuestaDirecta", 
          "analisis", 
          "evaluacion", 
          "riesgos", 
          "estrategia", 
          "probabilidad", 
          "recomendaciones", 
          "advertencia"
        ],
      },
    },
  });

  try {
    const result = await model;
    if (!result.text) throw new Error("No response from AI");
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
