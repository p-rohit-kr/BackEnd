import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://api.groq.com/openai/v1",
});

app.get("/", (req, res) => {
  res.send("Groq Backend Running...");
});

app.post("/api/chat", async (req, res) => {

  try {

    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    const completion =
      await openai.chat.completions.create({

        model: "openai/gpt-oss-20b",

        messages: [

          // SYSTEM PROMPT
          {
            role: "system",

            content: `
                  ROLE:
                You are the official CampusHub AI assistant.
                
                GOAL:
                Help students use CampusHub.
                
                KNOWLEDGE:
                CampusHub provides notes, internships and notices.

                FOUNDER:
                rohit , created CampusHub to help students access notes, internships, and notices easily.
                
                RULES:
                - Be concise.
                - Use simple English.
                - Don't invent information.
                - If information is unavailable, say so.
                
                OUTPUT:
                Give the answer in 2-4 sentences.
            `,
          },

          // USER MESSAGE
          {
            role: "user",
            content: userMessage,
          },

        ],

      });

    const reply =
      completion.choices[0].message.content;

    res.json({
      reply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: error.message,
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
