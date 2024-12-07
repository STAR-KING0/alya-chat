const socket = io();

const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");

// Listen for messages from the server
socket.on("chat message", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Listen for user join/leave notifications
socket.on("user left", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.color = "red";
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Send chat messages
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (msg) {
        socket.emit("chat message", msg);
        messageInput.value = "";
    }
});