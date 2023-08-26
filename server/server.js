const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("videoFrames", (frames) => {
    // Process frames using your image processing logic
    const processedFrames = frames.map((frame) => {
      // Apply your image processing logic here
      // Return the processed frames
    });

    // Emit the processed frames back to the client
    socket.emit("processedFrame", processedFrames);
  });

  socket.on("videoFrame", (data) => {
    console.log("data received...");
    console.log(data);
    socket.emit("processedImage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
