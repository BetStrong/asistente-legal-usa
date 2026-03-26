let chatHistory = [];

export async function analyzeCase(message: string) {
  // agregar mensaje del usuario al historial
  chatHistory.push({
    role: "user",
    content: message,
  });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: chatHistory,
    }),
  });

  const data = await res.json();

  // guardar respuesta del asistente también
  if (data?.respuestaDirecta) {
    chatHistory.push({
      role: "assistant",
      content: data.respuestaDirecta,
    });
  } else if (data?.analisis) {
    chatHistory.push({
      role: "assistant",
      content: data.analisis,
    });
  }

  return data;
}
