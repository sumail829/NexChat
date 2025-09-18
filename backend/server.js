import express from "express";
import http from "http";
import { Server } from "socket.io";
import pool from "./db/db.js";  // 👈 import your database connection
import userRoutes from "./routes/userRoutes.js"
import conversationRoutes from "./routes/conversationRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cors from "cors"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",  // later restrict to frontend URL
  },
});

app.use(cors());

// Middleware
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("🚀 Chat App Backend is running!");
});

app.use("/api",userRoutes);
app.use("/api",conversationRoutes);
app.use("/api",messageRoutes);

// Socket.io logic

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Send message only to that room
  socket.on("sendMessage", (msg) => {
    const room = `conversation_${msg.conversationId}`;
    io.to(room).emit("receiveMessage", msg);
    console.log("Message sent to room:", room, msg);
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
