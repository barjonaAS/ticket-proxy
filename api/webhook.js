export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Tu base de URL ngrok o dominio público
  const BASE_URL = "https://454fe5557c44.ngrok-free.app";
  // IDs de webhook
  const WEBHOOK_PROD = "2f375735-440f-425d-ba8c-f330b1d5c45e";
  const WEBHOOK_TEST = "2f375735-440f-425d-ba8c-f330b1d5c45e";

  try {
    // Leer body crudo (necesario en Vercel)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString();

    // 1️⃣ Intentar enviar al endpoint de producción
    let response = await fetch(`${BASE_URL}/webhook/${WEBHOOK_PROD}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawBody,
    });

    // 2️⃣ Si no responde (por ejemplo, 404), probar con el de test
    if (!response.ok) {
      console.warn("⚠️ Producción no respondió, probando webhook-test...");
      response = await fetch(`${BASE_URL}/webhook-test/${WEBHOOK_TEST}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: rawBody,
      });
    }

    const text = await response.text();
    res.status(response.ok ? 200 : 500).send(text);
  } catch (error) {
    console.error("❌ Error reenviando:", error);
    res.status(500).json({ error: "Error forwarding webhook" });
  }
}
