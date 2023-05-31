const socket = io()
const messageContainer = document.getElementById('messages_container')
const chatBox = document.getElementById('chatbox')
let user;

Swal.fire({
  title: "Identificate",
  input:"text",
  text: 'Ingresa tu nombre de usuario',
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre para comenzar a escribir en el chat"

  },
  allowOutsideClick : false
}).then(res=>{
  user = res.value
  console.log("user", user)
})


chatBox.addEventListener("keyup", (evt) => {
  if(evt.key==='Enter'){
    if(chatBox.value.trim().length>0){
      socket.emit('message',{user, message: chatBox.value  })
    }
  }
})

socket.on('messagesLogs', (data) => {
  let log = document.getElementById("messagesLogs")
  console.log(data)
  let messages = ''
  data.forEach(message => {
      messages += `${message.user} dice: ${message.message}</br>`
  });
  log.innerHTML = messages
})
