document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const authContainer = document.getElementById('auth-container');
    const chatContainer = document.getElementById('chat-container');

    const registerForm = document.getElementById('register');
    const loginForm = document.getElementById('login');

    const createChannelButton = document.getElementById('create-channel');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                alert('Registration successful');
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                authContainer.style.display = 'none';
                chatContainer.style.display = 'block';
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    createChannelButton.addEventListener('click', () => {

        const channelName = document.getElementById('channel-name').value;

        if (channelName) {
            socket.emit('create channel', channelName);
        }
    });

    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value;
        const channel = document.getElementById('channel-list').querySelector('li.selected')?.textContent;
        if (message && channel) {
            socket.emit('chat message', { channel, message });
            messageInput.value = '';
        }
    });

    socket.on('chat message', (message) => {
        const messagesList = document.getElementById('messages');
        const li = document.createElement('li');
        li.textContent = message;
        messagesList.appendChild(li);
    });

    socket.on('channel created', (channelName) => {
        const channelList = document.getElementById('channel-list');
        const li = document.createElement('li');
        li.textContent = channelName;
        li.addEventListener('click', () => {
            document.querySelectorAll('#channel-list li').forEach(item => item.classList.remove('selected'));
            li.classList.add('selected');
        });
        channelList.appendChild(li);
    });
});