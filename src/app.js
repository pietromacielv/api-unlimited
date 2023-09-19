import express from "express";
import aiRoutes from "./routes/ai.routes.js";
import shortenUrlRoutes from "./routes/shortenUrl.routes.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/", aiRoutes);
app.use("/api/ai/", aiRoutes);
app.use("/api/", shortenUrlRoutes)
app.use("/api/shorten/", shortenUrlRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
