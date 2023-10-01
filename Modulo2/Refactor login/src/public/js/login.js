document.getElementById('signIn').addEventListener('click', async() => {
    Swal.fire({title: 'Crear Usuario'}).then(() => {
            window.location.href = '/static/signInUser';
        });
});