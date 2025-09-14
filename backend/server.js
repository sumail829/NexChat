import express from "express";
import http from "http";
import { Server } from "socket.io";
import pool from "./db/db.js";  // 👈 import your database connection

const app = express();
const server = http.createServer(app);

// setup socket.io
const io = new Server(server, {
  cors: {
    origin: "*",  // later restrict to frontend URL
  },
});

// Middleware
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("🚀 Chat App Backend is running!");
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("📩 Message received:", data);

    // (Later) Save message to Postgres using pool.query()
    // pool.query("INSERT INTO messages (sender, text) VALUES ($1, $2)", [data.sender, data.text]);

    // broadcast message to everyone
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
