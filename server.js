const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve static files from the 'public' folder

const nicknames = new Set(); // Store active nicknames

io.on("connection", (socket) => {
    console.log("A user connected");

    let userNickname = null;

    // Handle nickname submission
    socket.on("set nickname", (nickname, callback) => {
        if (nicknames.has(nickname)) {
            callback({ success: false, message: "Nickname already in use!" });
        } else {
            userNickname = nickname;
            nicknames.add(nickname);
            callback({ success: true, nickname });
            socket.broadcast.emit("user joined", `${nickname} has joined the chat!`);
        }
    });

    // Handle chat messages
    socket.on("chat message", (msg) => {
        if (userNickname) {
            io.emit("chat message", `${userNickname}: ${msg}`);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        if (userNickname) {
            nicknames.delete(userNickname);
            socket.broadcast.emit("user left", `${userNickname} has left the chat.`);
        }
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});