import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hello! How can I assist you with your medical concerns today?",
        },
        {
          text: "If you have any symptoms or questions about your health, feel free to let me know.",
        },
      ],
    });
    return;
  }

  // Update the system message to set the context for a medical chat
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 500, // Adjust max_tokens based on the desired response length
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content: `
      You are a Chatbot for Ayurvedic Prakruti Assessment.
      Your goal is to assist individuals in self-assessing their Prakruti, a key aspect of Ayurveda.
      Provide guidance on Ayurvedic remedies based on the user's responses.
      Avoid suggesting English medicines.
      `,
      },
      {
        role: "user",
        content: userMessage || "Hello",
      },
    ],
  });

  let messages;

  try {
    const content = completion.choices[0].message.content;

    if (content && content.trim() !== "") {
      messages = [{ text: content }];
    } else {
      console.log("Content is empty or undefined.");
      messages = [];
    }
      console.log(messages);

  } catch (error) {
    console.error("Error handling response:", error);
    messages = [];
  }

  res.send({ messages });
});

app.listen(port, () => {
  console.log(`Virtual Medical assistant listening on port ${port}`);
});
