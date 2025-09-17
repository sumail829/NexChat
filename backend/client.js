import { io } from "socket.io-client";

// connect to your backend server
const socket = io("http://localhost:5000");

// when connected
socket.on("connect", () => {
  console.log("✅ Connected to server with id:", socket.id);

  // join conversation room (example conversationId = 1)
  socket.emit("joinConversation", 1);

  // send a test message after joining
  setTimeout(() => {
    socket.emit("sendMessage", {
      text: "Hello from test client 🚀",
      senderId: 192, // replace with a real userId from your DB
      conversationId: 1,
    });
  }, 1000);
});

// listen for new messages
socket.on("receiveMessage", (msg) => {
  console.log("📩 New message received:", msg);
});

// handle disconnect
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
