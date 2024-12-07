const socket = io();

const messagesDiv = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

// Listen for messages from the server
socket.on("chat message", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
});

// Handle form submission
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = messageInput.value;
    socket.emit("chat message", msg); // Send message to server
    messageInput.value = ""; // Clear input
});