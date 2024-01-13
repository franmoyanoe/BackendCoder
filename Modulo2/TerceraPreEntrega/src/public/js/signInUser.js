/*
const socket = io();

const form = document.getElementById('signIn')

form.addEventListener('submit', e => {
	e.preventDefault();
	const dataForm = new FormData(e.target);
	const user = Object.fromEntries(dataForm);
	socket.emit('signInUser', user);
    //e.target.reset()
});
socket.on('usuarioCreado', (mensaje) => {
    Swal.fire(
        mensaje
    ).then(() => {
    window.location.href = '/static/login';
    })
})

socket.on('existeUsuario', (mensaje) => {
    Swal.fire(
        mensaje
    )
})
*/