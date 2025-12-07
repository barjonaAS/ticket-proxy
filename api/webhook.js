export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Leemos el cuerpo del request recibido por ChatGPT
    const body = await req.text();

    // Reenviamos los datos a tu webhook ngrok
    const response = await fetch(
      "https://454fe5557c44.ngrok-free.app/webhook-test/2f375735-440f-425d-ba8c-f330b1d5c45e",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );

    // Respondemos lo que devuelva n8n (si querés lo podés ocultar)
    const result = await response.text();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error forwarding webhook" });
  }
}
