import express from "express";
import shortid from "shortid";

const shortenUrlRoutes = express.Router();
const cyclicUrl = process.env.CYCLIC_URL || "3000";

let urlMap = {};

shortenUrlRoutes.post("/shorten", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is missing." });
  }

  try {
    const shortId = shortid.generate(); // Generate a random short ID
    urlMap[shortId] = url;
    const shortUrl = `${cyclicUrl}/api/${shortId}`; // Use the Cyclic URL
    res.json({ shortUrl });
  } catch (error) {
    console.error("Error generating short ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the short URL." });
  }
});

shortenUrlRoutes.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const url = urlMap[shortId];
  if (!url) {
    return res.status(404).json({ error: "Short URL not found." });
  }
  res.redirect(url);
});

export default shortenUrlRoutes;
