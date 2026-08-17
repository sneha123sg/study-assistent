import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studyRouter from "./routes/study.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "StudyFlow API is running 🚀",
  });
});

app.use("/api/study", studyRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});