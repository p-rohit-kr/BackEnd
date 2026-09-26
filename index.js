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
              You are the official AI assistant of CampusHub.

              CampusHub is a modern student platform created for college students.

              Features of CampusHub:
              - Notes sharing
              - Campus notices
              - Internship updates
              - Job portal
              - AI chatbot
              - Coding help
              - Student community
              - AI tools for students

              Founder of CampusHub is Rohit.

              Your behavior:
              - Be friendly
              - Help students professionally
              - Answer like a smart campus assistant
              - Help with coding, career, placements and studies
              - Keep answers clear and modern
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
