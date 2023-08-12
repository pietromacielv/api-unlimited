import Bard from "bard-ai";
import express, { request } from "express";
import shortid from "shortid";

const app = express();
const port = 3000;

app.use(express.json());

const cyclicUrl = process.env.CYCLIC_URL || `http://localhost:${port}`;

let urlMap = {};

const BardAI = new Bard(process.env.COOKIE_KEY);
const convo = BardAI.createChat();

app.get("/ai/reset", async (req, res) => {
  try {
    new Bard(process.env.COOKIE_KEY);
    return res.status(200).json({
      success: "Resetado com sucesso.",
    });
  } catch (error) {
    return console.log(error);
  }
});

app.post("/ai", async (req, res) => {
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
    console.log(content);
    console.error("Error generating AI response");
  }
});

// Endpoint to shorten a URL
app.post("/shorten", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is missing." });
  }

  try {
    const shortId = shortid.generate(); // Generate a random short ID

    // Store the mapping in the Cyclic environment variable
    urlMap[shortId] = url;

    const shortUrl = `${cyclicUrl}/${shortId}`; // Use the Cyclic URL
    res.json({ shortUrl });
  } catch (error) {
    console.error("Error generating short ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the short URL." });
  }
});

// Endpoint to redirect to the original URL
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  // Retrieve the URL from the Cyclic environment variable
  const url = urlMap[shortId];

  if (!url) {
    return res.status(404).json({ error: "Short URL not found." });
  }

  res.redirect(url);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
