const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('send-text');
const messageContainer = document.querySelector(".history");
var userList = document.getElementById("user-list");

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if (position == 'left') {
        audio.play();
    }
}

// Function to append/remove user in Active user list
const activeUser = userArray => {
    userList.innerHTML='';
    for( let i = 0; i<userArray.length; i++ ){
        const newUserElement = document.createElement('li');
        newUserElement.appendChild(document.createTextNode(userArray[i]));
        userList.appendChild(newUserElement);
    }
}

// Ask new user for his/her name and let the server know
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', userName => {
    append(`${userName} joined the chat`, 'message-right')
})

socket.on('user-list', userArray => { 
    console.log(userArray)
    activeUser(userArray) 
})

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'message-left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', userName => {
    append(`${userName} left the chat`, 'message-right');
})

socket.on('user-left', userList=>{
    console.log(userList);
    activeUser(userList);
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'message-right');
    socket.emit('send', message);
    messageInput.value = ''
})