export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Leer el cuerpo correctamente (Vercel usa bodyParser automático)
    const body = req.body;

    // Reenviar la solicitud a tu endpoint de n8n/ngrok
    const response = await fetch(
      "https://454fe5557c44.ngrok-free.app:5678/webhook/2f375735-440f-425d-ba8c-f330b1d5c45e",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    // Devuelve la respuesta de n8n
    res.status(200).send(text);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error forwarding webhook" });
  }
}
