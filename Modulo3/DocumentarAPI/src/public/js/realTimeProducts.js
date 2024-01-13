const socket = io()


const form = document.getElementById('formProduct')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //El formulario que disparo el evento
    const prod = Object.fromEntries(datForm) //Dado un objeto iterable, te devuelvo sus datos en un objeto simple
    socket.emit('nuevoProducto', prod)
    socket.on('mensajeProductoCreado', (mensaje) => {
        Swal.fire(
            mensaje
        )
    })
    e.target.reset()
})  


const productsDivMongo = document.getElementById("productsDiv");

socket.on("envioProductos", (products) => {

    productsDivMongo.innerHTML = "";

    products.forEach((prod) => {

      productsDivMongo.innerHTML += `

          <div class="product-container shadow">

            <p>Title: ${prod.title}</p>

            <p>Description: ${prod.description}</p>

            <p>Price: ${prod.price}</p>

            <p>Thumbnail: ${prod.thumbnail}</p>

            <p>Category: ${prod.category}</p>

            <p>Status: ${prod.status}</p>

            <p>Code: ${prod.code}</p>

            <p>Stock: ${prod.stock}</p>

            <p>pid: ${prod.pid}</p>

          </div>

          `;

    });

  });
document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = deleteidinput.value;
    socket.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  });







//fileSytem
/*
const form = document.getElementById('formProduct')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //El formulario que disparo el evento
    const prod = Object.fromEntries(datForm) //Dado un objeto iterable, te devuelvo sus datos en un objeto simple
    socket.emit('nuevoProducto', prod)
    socket.on('mensajeProductoCreado', (mensaje) => {
        Swal.fire(
            mensaje
        )
    })
    e.target.reset()
})  


const productsDiv = document.getElementById("productsDiv");

socket.on("productosActualizados", (products) => {

    productsDiv.innerHTML = "";

    products.forEach((prod) => {

      productsDiv.innerHTML += `

          <div class="product-container shadow">

            <p>Title: ${prod.title}</p>

            <p>Description: ${prod.description}</p>

            <p>Price: ${prod.price}</p>

            <p>Thumbnail: ${prod.thumbnail}</p>

            <p>Category: ${prod.category}</p>

            <p>Status: ${prod.status}</p>

            <p>Code: ${prod.code}</p>

            <p>Stock: ${prod.stock}</p>

            <p>pid: ${prod.pid}</p>

          </div>

          `;

    });

  });
  */