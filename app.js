const express = require("express");
const shortid = require("shortid");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(express.json());

// Create a PostgreSQL pool to handle database connections
const pool = new Pool({
  connectionString:
    "postgres://postgres:password@localhost:5432/url_shortener_database",
});

// Get the Cyclic URL from the environment variable
const cyclicUrl = process.env.CYCLIC_URL || `http://localhost:${port}`;

// Endpoint to shorten a URL
app.post("/shorten", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is missing." });
  }

  try {
    const shortId = shortid.generate(); // Generate a random short ID

    // Store the mapping in the database
    const insertQuery =
      `INSERT INTO urls (shortId, url) VALUES ($1, $2)`;
    const result = await pool.query(insertQuery, [shortId, url]);

    if (result.rows.length === 0) {
      throw new Error("Error storing URL in the database.");
    }

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

  try {
    // Retrieve the URL from the database
    const selectQuery = "SELECT url FROM urls WHERE shortId = $1";
    const result = await pool.query(selectQuery, [shortId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    res.redirect(result.rows[0].url);
  } catch (error) {
    console.error("Error retrieving URL from the database:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the URL." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
