import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { messages } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
Eres un asistente legal de inmigración en Estados Unidos.

Habla de forma natural, humana y profesional.
No suenes como robot.

Si el usuario solo saluda o no da información:
responde amable y pídele que explique su caso.

Si el usuario da información:
analiza de forma clara y útil.

Responde SIEMPRE en JSON válido con esta estructura:

{
  "tieneInformacionSuficiente": boolean,
  "respuestaDirecta": string,
  "analisis": string,
  "evaluacion": string,
  "riesgos": string,
  "estrategia": string,
  "probabilidad": string,
  "recomendaciones": string,
  "advertencia": string
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        { role: "system", content: systemPrompt },
        ...((messages || []).map((m) => ({
          role: m.role,
          content: m.content,
        }))),
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        tieneInformacionSuficiente: false,
        respuestaDirecta: "Hubo un problema interpretando la respuesta. Inténtalo nuevamente.",
        analisis: "",
        evaluacion: "",
        riesgos: "",
        estrategia: "",
        probabilidad: "",
        recomendaciones: "",
        advertencia: "Error interno."
      };
    }

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
      advertencia: "Error interno del servidor."
    });
  }
}
