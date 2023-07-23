const express = require("express");
const shortid = require("shortid");
const cache = require("memory-cache");

const app = express();
const port = 5000;
a
app.use(express.json());

// Endpoint to shorten a URL
app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is missing." });
  }

  try {
    const shortId = shortid.generate(); // Generate a random short ID
    const urlMapping = { shortId, url }; // URL mapping object
    cache.put(shortId, urlMapping); // Store the mapping in the cache

    const shortUrl = `http://localhost:${port}/${shortId}`;
    res.json({ shortUrl });
  } catch (error) {
    console.error("Error generating short ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the short URL." });
  }
});

// Endpoint to redirect to the original URL
app.get("/:shortId", (req, res) => {
  const { shortId } = req.params;
  const urlMapping = cache.get(shortId);

  if (!urlMapping) {
    return res.status(404).json({ error: "Short URL not found." });
  }

  res.redirect(urlMapping.url);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
