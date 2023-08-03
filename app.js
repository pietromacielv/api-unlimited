import { Bard } from "googlebard";
import express from "express";
import shortid from "shortid";

const app = express();
const port = 3000;

app.use(express.json());

// Get the Cyclic URL from the environment variable
const cyclicUrl = process.env.CYCLIC_URL || `http://localhost:${port}`;

// Create a variable to store the short URLs in Cyclic
let urlMap = {};

let cookies = `__Secure-1PSID=ZQiDSsmclc_zVdhzglByPlYfoskiQnRBm4cKMq86T_bOeQFTAv8d6DPqAt6KW5Ld4YOROA.`;

const bot = new Bard(cookies);

app.post("/ai/reset", async (req, res) => {
  try {
    const { conversationId } = req.body;
    bot.resetConversation(conversationId);
    return res.status(200).json({
      achieved: "Chat deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/ai", async (req, res) => {
  const { content, conversationId } = req.body;

  if (!content) {
    return res.status(400).json({
      error: "Content parameter is missing.",
    });
  }

  try {
    const response = await bot.ask(content, conversationId);
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
