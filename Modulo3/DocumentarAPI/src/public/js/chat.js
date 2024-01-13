const socket = io();

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')

let email;

Swal.fire({
	title: 'Identificación de usuario',
	text: 'Ingrese su email',
	input: 'text',

	inputValidator: valor => {
		return !valor && 'Ingresar un email válido';
	},
	allowOutsideClick: false,
}).then(resultado => {
	email = resultado.value;
});

botonChat.addEventListener('click', () => {
	if (valInput.value.trim().length > 0) {
		socket.emit('mensaje', {
			email: email,
			message: valInput.value,
		});
		valInput.value = '';
	}
});

socket.on('mensajes', arrayMensajes => {
	parrafosMensajes.innerHTML = ''; 
	arrayMensajes.forEach(msj => {
		const { email, message } = msj;
		parrafosMensajes.innerHTML += `<p>${email} escribió: </p> <p>${message}</p>`;
	});
});
