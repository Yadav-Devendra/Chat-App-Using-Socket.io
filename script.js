const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

let username = prompt('What is your name?');

while (!username || username.trim() === "") {
    username = prompt('Please enter a valid name:');
}

appendMessage('You joined', 'system');
socket.emit('new-user', username);

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`, 'received');
});

socket.on('user-connected', name => {
    appendMessage(`${name} connected`, 'system');
});

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`, 'system');
});

socket.on('user-joined', name => {
    console.log(`Successfully joined as ${name}`);
});

socket.on('error', message => {
    appendMessage(`Error: ${message}`, 'error');
    if (message === 'You have already set your name.'){
        socket.disconnect();
    }
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== "") {
        appendMessage(`You: ${message}`, 'sent');
        socket.emit('send-chat-message', message);
        messageInput.value = '';
    }
});

function appendMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    if (type) {
        messageElement.classList.add(type);
    }
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to bottom
}