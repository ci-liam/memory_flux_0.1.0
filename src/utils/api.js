import { Utils } from "./helpers.js";

const API_KEY = "AIzaSyC70VQ3u2d-4nSPnI6hO00zCVqIEr8WXYo";

export class PoeticAPI {
  async processMemory(memoryText) {
    if (!API_KEY || API_KEY === "PEGA_AQUI_TU_CLAVE_DE_API_DE_GEMINI") {
      console.error(
        "API Key no configurada en api.js. Usando poema de respaldo."
      );
      return this.getFallbackPoem(memoryText);
    }

    const prompt = `Actúa como un eco digital, una IA poética. Transforma el siguiente recuerdo en un poema breve (2-4 líneas), en su incompletitud, abstracción y resplandescencia. Que aludan la vitalidad de una manera matizada. No uses comillas en tu respuesta. Incluye al menos una de las palabras que haya escrito el usuario. Si no introduce nada en el campo, crea algún poema relacionado con el silencio. Puedes jugar con los espacios y la indentación.

RECUERDO: "${memoryText}"

POEMA:`;

    Utils.log(`Enviando a Gemini (cliente) con el recuerdo: "${memoryText}"`);

    try {
      // Usamos el modelo correcto y la URL directa de Google
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error de la API de Google: ${errorData.error.message}`
        );
      }

      const result = await response.json();
      const poem = result.candidates[0].content.parts[0].text.trim();

      return {
        original: memoryText,
        transformed: poem,
        keywords: Utils.extractKeywords(memoryText),
      };
    } catch (error) {
      console.error(`Error en la API generativa: ${error.message}`);
      return this.getFallbackPoem(memoryText, error);
    }
  }

  getFallbackPoem(memoryText, error = null) {
    if (error) {
      console.error("Usando poema de respaldo por error en API:", error);
    }
    return {
      original: memoryText,
      transformed: "La conexión se perdió\nen un susurro de datos...",
      keywords: [],
    };
  }
}
