import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const aiRoutes = express.Router();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

const chat = model.startChat();

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
    const text = response.text();
    res.json({ text });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      error: "Error generating AI response",
    });
  }
});

aiRoutes.get("/ai/reset", async (req, res) => {
  try {
    new Bard(process.env.COOKIE_KEY);
    return res.status(200).json({
      success: "Resetado com sucesso.",
    });
  } catch (error) {
    console.error("Error resetting AI:", error);
    return res.status(500).json({
      error: "Error resetting AI",
    });
  }
});

export default aiRoutes;
