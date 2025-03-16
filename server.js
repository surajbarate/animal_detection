import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Configure Multer for Video Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads/");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});
const upload = multer({ storage });

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is Running on Port 5001");
});

// ✅ Path to Python & YOLO Script
const pythonPath = path.join(__dirname, "aiml", ".venv", "Scripts", "python.exe");
const scriptPath = path.join(__dirname, "aiml", "Yolo-Webcam.py");

// ✅ Upload API Route
app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "❌ No file uploaded" });
  }

  const videoPath = path.join(__dirname, "uploads", req.file.filename);

  console.log("📁 Uploaded File Path:", videoPath);

  if (!fs.existsSync(videoPath)) {
    console.error("❌ Video file not found:", videoPath);
    return res.status(500).json({ message: "❌ Video file not found", path: videoPath });
  }

  try {
    // ✅ Set video path in Python script before streaming
    const response = await fetch(`http://127.0.0.1:5000/set_video/${encodeURIComponent(videoPath)}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Error setting video path");

    console.log("✅ Video path set in Python script");

    // ✅ Return success message
    res.json({ message: "✅ Video uploaded & set for processing", filename: req.file.filename });

  } catch (error) {
    console.error("❌ Error setting video path in Python:", error);
    res.status(500).json({ message: "❌ Error setting video path", error: error.message });
  }
});

// ✅ Stream Video Route
app.get("/video_feed", (req, res) => {
  res.redirect("http://127.0.0.1:5001/video_feed");
});

// ✅ Start Express Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
