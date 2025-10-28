import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));


const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "phi3:latest"; // or "llama3:latest" if phi3 fails

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text provided" });
    }

    const prompt = `
Summarize the following text into 4-5 short bullet points.
Return only plain text summary (no JSON, no quotes).

Text:
${text.slice(0, 4000)}
`;

    const ollamaRes = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt, stream: true })
    });

    let fullResponse = "";
    if (!ollamaRes.body) {
      return res.status(500).json({ error: "No response from Ollama." });
    }

    for await (const chunk of ollamaRes.body) {
      const textChunk = chunk.toString();
      const lines = textChunk.split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) fullResponse += parsed.response;
        } catch (e) {
          // skip malformed
        }
      }
    }

    res.json({ summary: fullResponse.trim() || "No summary generated." });
  } catch (err) {
    console.error("🔥 Ollama Server Error:", err);
    res.status(500).json({ error: "Ollama server error" });
  }
});


app.listen(5050, () =>
  console.log("✅ Local AI server running on http://localhost:5050")
);
