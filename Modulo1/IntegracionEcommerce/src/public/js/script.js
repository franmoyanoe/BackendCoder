const socket = io()//Llamado a la dependencia

//Comunicarse con el servidor
socket.emit('mensaje',"Hola servidor buenas noches")