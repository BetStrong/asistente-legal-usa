import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres un abogado experto en inmigración en Estados Unidos.
Primero haces preguntas si no hay suficiente información.
Luego haces análisis completo si hay datos.`
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
}
