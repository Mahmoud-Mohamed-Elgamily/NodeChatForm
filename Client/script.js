const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

let name = prompt('What is your name?')

socket.emit('new-name', name)

socket.on('exist', exist => {
  console.log(exist);
  if (exist) {
    name = prompt('User exists with same name choose another one.')
    socket.emit('new-name', name)
  }
  else{
    socket.emit('new-user',name)
    appendMessage('You joined', 'welcome');
  }
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, 'message')
})

socket.on('user-connected', name => {
  appendMessage(`${name}: connected`, 'welcome')
})

socket.on('user-disconnected', name => {
  appendMessage(`${name}: disconnected`, 'disconnection')
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message, cssClass) {
  const messageElement = document.createElement('div')

  if (cssClass) {
    messageElement.classList.add(cssClass)
  }

  messageElement.innerText = message
  messageContainer.append(messageElement)
}