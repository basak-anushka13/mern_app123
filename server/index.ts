import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin } from "./routes/auth";
import { getAgents, createAgent } from "./routes/agents";
import { uploadMiddleware, handleUpload, getLists } from "./routes/upload";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);

  // Agent management routes
  app.get("/api/agents", getAgents);
  app.post("/api/agents", createAgent);

  // File upload and distribution routes
  app.post("/api/upload", uploadMiddleware, handleUpload);
  app.get("/api/lists", getLists);

  return app;
}
