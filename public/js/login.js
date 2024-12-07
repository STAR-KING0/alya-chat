const socket = io();

const loginForm = document.getElementById("login-form");
const nicknameInput = document.getElementById("nickname-input");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickname = nicknameInput.value.trim();

    socket.emit("set nickname", nickname, (response) => {
        if (response.success) {
            // Redirect to chat.html
            window.location.href = "chat.html";
        } else {
            errorMessage.textContent = response.message;
        }
    });
});