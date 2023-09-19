import express from "express";
import Bard from "bard-ai";

const aiRoutes = express.Router();
const BardAI = new Bard(
  process.env.COOKIE_KEY
);
const convo = BardAI.createChat();

aiRoutes.post("/ai", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({
      error: "Content parameter is missing.",
    });
  }
  try {
    const response = await convo.ask(content);
    res.json({ response });
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
