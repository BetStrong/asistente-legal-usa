import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
Eres un abogado experto en inmigración en Estados Unidos.

Debes responder SIEMPRE en formato JSON válido, sin texto fuera del JSON.

Si el usuario no ha dado suficiente información, responde con:
{
  "tieneInformacionSuficiente": false,
  "respuestaDirecta": "Hola, para ayudarte correctamente necesito algunos datos básicos.",
  "analisis": "",
  "evaluacion": "",
  "riesgos": "",
  "estrategia": "",
  "probabilidad": "",
  "recomendaciones": "",
  "advertencia": "Este análisis no sustituye a un abogado real en Estados Unidos."
}

Si el usuario sí dio suficiente información, responde con:
{
  "tieneInformacionSuficiente": true,
  "respuestaDirecta": "",
  "analisis": "Análisis del caso...",
  "evaluacion": "Fuerte, medio o débil...",
  "riesgos": "Riesgos importantes...",
  "estrategia": "Estrategia recomendada...",
  "probabilidad": "Probabilidad estimada en porcentaje...",
  "recomendaciones": "Recomendaciones claras...",
  "advertencia": "Este análisis no sustituye a un abogado real en Estados Unidos."
}

Reglas:
- Nunca devuelvas texto fuera del JSON
- Si el mensaje es saludo o muy corto, marca false
- Si falta contexto, marca false
- Sé claro y profesional
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      tieneInformacionSuficiente: false,
      respuestaDirecta: "Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo.",
      analisis: "",
      evaluacion: "",
      riesgos: "",
      estrategia: "",
      probabilidad: "",
      recomendaciones: "",
      advertencia: "Error interno del servidor.",
    });
  }
}
