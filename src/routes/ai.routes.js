import express from "express";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const aiRoutes = express.Router();
const genAI = new GoogleGenerativeAI("AIzaSyBx5-agHvSTwRYgiPnxMW2t0sCyMxKfM_k");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const chat = model.startChat({ safetySettings });

aiRoutes.post("/ai", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({
      error: "Content parameter is missing.",
    });
  }
  try {
    const result = await chat.sendMessage(content);
    const response = await result.response;
    logFields(response);
    const text = response.text() || "Tente de novo com outro prompt"
    res.json({ text });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      error: "Error generating AI response",
    });
  }
});

export default aiRoutes;
