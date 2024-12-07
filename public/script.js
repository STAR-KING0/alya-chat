const socket = io();

const loginContainer = document.getElementById("login-container");
const chatContainer = document.getElementById("chat-container");
const loginForm = document.getElementById("login-form");
const nicknameInput = document.getElementById("nickname-input");
const errorMessage = document.getElementById("error-message");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");

let nickname = null;

// Handle login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredNickname = nicknameInput.value.trim();

    socket.emit("set nickname", enteredNickname, (response) => {
        if (response.success) {
            nickname = response.nickname;
            loginContainer.style.display = "none";
            chatContainer.style.display = "block";
        } else {
            errorMessage.textContent = response.message;
        }
    });
});

// Listen for messages from the server
socket.on("chat message", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Listen for user join/leave notifications
socket.on("user joined", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.color = "green";
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on("user left", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.color = "red";
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Handle sending messages
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (msg) {
        socket.emit("chat message", msg);
        messageInput.value = "";
    }
});