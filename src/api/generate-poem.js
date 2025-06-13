import fetch from "node-fetch";

export default async function handler(req, res) {
  // 1. Leer el recuerdo del usuario desde la petición que nos envía el navegador.
  const { memory } = req.body;

  // 2. Leer la API Key de forma segura desde los "Secrets" del entorno.
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        "La API Key de Gemini no está configurada en los Secrets del entorno.",
    });
  }

  if (!memory) {
    return res
      .status(400)
      .json({ error: "No se proporcionó ninguna memoria." });
  }

  // 3. Preparar el prompt y la configuración para Gemini.
  const prompt = `Eres un poeta digital que explora la memoria y el olvido. Tu estilo es breve, abstracto y melancólico. Transforma el siguiente recuerdo en un poema de 2 a 3 líneas cortas. No uses comillas en tu respuesta.

RECUERDO DEL USUARIO: "${memory}"

POEMA:`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
    },
  };

  try {
    // 4. Hacer la llamada segura desde el servidor a la API de Gemini.
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      throw new Error(data.error?.message || "Error en la API de Gemini");
    }

    // 5. Devolver la respuesta del poema al navegador.
    const poem = data.candidates[0].content.parts[0].text.trim();
    res.status(200).json({ poem });
  } catch (error) {
    console.error("Error en la función del servidor:", error);
    res.status(500).json({ error: error.message });
  }
}
