const socket = io('http://localhost:3000');

const joinButton = document.getElementById('join-button');
const usernameInput = document.getElementById('username-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages');
const usernameSection = document.getElementById('username-section');

let username = '';

// User joins the chat
joinButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit('join', username);
    usernameSection.style.display = 'none';
    messageForm.style.display = 'flex';
    addNotification(`You joined the chat`);
  }
});

// Send a message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    const messageData = { username, message };
    socket.emit('send-message', messageData);
    addMessage(messageData, true); // Display locally
    messageInput.value = '';
  }
});

// Receive messages
socket.on('receive-message', (data) => {
  if (data.username !== username) { // Ignore your own messages
    addMessage(data, false);
  }
});

// Notification when user joins
socket.on('user-joined', (user) => {
  addNotification(`${user} joined the chat`);
});

// Add a message to the chat
function addMessage(data, isMe) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isMe ? 'my-message' : 'other-message');
  messageElement.textContent = `${isMe ? 'You' : data.username}: ${data.message}`;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add a notification to the chat
function addNotification(text) {
  const notificationElement = document.createElement('div');
  notificationElement.classList.add('notification');
  notificationElement.textContent = text;
  messagesContainer.appendChild(notificationElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

 