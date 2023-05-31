const socket = io()

socket.emit('message','mensaje desde le front end')
socket.on('evento_server',data=>{
  console.log(data)
})