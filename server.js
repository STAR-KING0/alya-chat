const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve all files from the public folder

const nicknames = new Set(); // To store unique nicknames

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
            callback({ success: true });
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
            io.emit("user left", `${userNickname} has left the chat.`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});