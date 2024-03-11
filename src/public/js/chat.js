const socket = io();

document.addEventListener('DOMContentLoaded', function() {
    const usernameEl = document.getElementById("username").innerText;
    const emailEl = document.getElementById("email").innerText;
    const roleEl = document.getElementById("role").innerText;
    const sendMessageButton = document.getElementById("sendMessage");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const chatContainer = document.getElementById("chat");

    socket.emit("newUser", usernameEl);

    socket.on("chat", (messages) => {
        let chatContent = "";
        messages.forEach(msg => {
            chatContent += `        
            <article class="message is-link">
                <div class="message-header">
                    <h3>${msg.username} dice:</h3>
                </div>
                <div class="message-body">
                    <p>${msg.message}</p>
                </div>
            </article>
            `;
        });
        chatContainer.innerHTML = chatContent;
    });

    chatForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (roleEl !== "user") {
            Toastify({
                text: "Solo los usuarios pueden mandar mensajes",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                },
            }).showToast();
            return; 
        }
        if (messageInput.value.trim()) {
            socket.emit("message", {
                username: usernameEl, 
                email: emailEl, 
                message: messageInput.value.trim()
            });
            messageInput.value = '';
        }
    });
});

