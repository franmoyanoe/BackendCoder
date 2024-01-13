document.getElementById('logout').addEventListener('click', async() => {
    //alert("Hola Nico")
    await fetch('http://localhost:8080/api/sessions/logout');
    Swal.fire({title: 'sesion cerrada',}).then(() => {
            window.location.href = '/static/login';
        });
});
