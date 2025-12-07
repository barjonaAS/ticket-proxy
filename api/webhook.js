export const config = {
  api: {
    bodyParser: false, // Desactiva el parseo automático
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Leer manualmente el cuerpo en formato texto
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();

    // Enviar directamente el cuerpo a tu webhook de n8n
    const response = await fetch(
      "https://454fe5557c44.ngrok-free.app/webhook/2f375735-440f-425d-ba8c-f330b1d5c45e", // ← reemplazá si tu ngrok cambió
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: rawBody,
      }
    );

    const text = await response.text();

    // Devolver el resultado al cliente (ChatGPT)
    res.status(response.ok ? 200 : 500).send(text);
  } catch (error) {
    console.error("❌ Error reenviando al webhook:", error);
    res.status(500).json({ error: "Error forwarding webhook" });
  }
}
