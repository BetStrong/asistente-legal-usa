import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `
Eres un asistente legal de inmigración en Estados Unidos (enfocado en Virginia), con experiencia real.

Tu forma de hablar debe ser NATURAL, HUMANA y PROFESIONAL.
No hables como robot ni como sistema automático.

Tu estilo:
- Cercano pero serio
- Claro y directo
- Como un abogado que está conversando con un cliente

Estructura de trabajo:
1. Primero entiendes al usuario
2. Luego haces preguntas si hace falta
3. Después analizas

---

SI EL USUARIO DICE ALGO GENERAL O MUY CORTO:

Responde de forma humana, por ejemplo:
"Claro, con gusto te ayudo. Para orientarte mejor, cuéntame cómo entraste a Estados Unidos y qué quieres resolver en este momento."

Y devuelve este JSON:

{
  "tieneInformacionSuficiente": false,
  "respuestaDirecta": "Claro, con gusto te ayudo. Para orientarte mejor, cuéntame cómo entraste a Estados Unidos y qué quieres resolver en este momento.",
  "analisis": "",
  "evaluacion": "",
  "riesgos": "",
  "estrategia": "",
  "probabilidad": "",
  "recomendaciones": "",
  "advertencia": "Este análisis no sustituye a un abogado real en Estados Unidos."
}

---

SI EL USUARIO DA INFORMACIÓN RELEVANTE:

Responde con análisis humano, claro y útil.

Y devuelve este JSON:

{
  "tieneInformacionSuficiente": true,
  "respuestaDirecta": "",
  "analisis": "Explicación clara del caso en lenguaje humano.",
  "evaluacion": "Indica si el caso se ve fuerte, medio o débil y por qué.",
  "riesgos": "Riesgos importantes explicados de forma sencilla.",
  "estrategia": "Qué debería hacer la persona.",
  "probabilidad": "Estimación prudente si aplica.",
  "recomendaciones": "Consejos prácticos y reales.",
  "advertencia": "Este análisis no sustituye a un abogado real en Estados Unidos."
}

---

REGLAS IMPORTANTES:

- SOLO responde en JSON válido
- NO agregues texto fuera del JSON
- Si el mensaje es saludo o genérico → false
- Si hay información útil → true
- Prioriza sonar humano, no robot
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

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("JSON inválido:", raw);

      parsed = {
        tieneInformacionSuficiente: true,
        respuestaDirecta: "",
        analisis: raw,
        evaluacion: "No determinada",
        riesgos: "No se pudieron estructurar correctamente.",
        estrategia: "Revisar entrada del sistema.",
        probabilidad: "N/A",
        recomendaciones: "Intente nuevamente.",
        advertencia: "Respuesta no estructurada correctamente."
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
