const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('send-text');
const messageContainer = document.querySelector(".history");
const userList = document.getElementById("user-list");

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position =='left'){ 
        audio.play();
    }
}

// Function to append user in Active user list
const activeUser = userName=>{
    const newUserElement = document.createElement('li');
    messageElement.innerText = userName;
    userList.append(newUserElement);
}

// Funtion to remove user from Active user list after user leaves

// Ask new user for his/her name and let the server know
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);
socket.on('new-user-joined', userName=>{
    activeUser(userName)
});

// If a new user joins, receive his/her name from the server
socket.on('user-joined', userName =>{
    append(`${userName} joined the chat`, 'message-right')
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'message-left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', userName =>{
    append(`${userName} left the chat`, 'message-right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'message-right');
    socket.emit('send', message);
    messageInput.value = ''
})