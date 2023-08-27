import express from 'express'
import multer from 'multer'
import {engine} from 'express-handlebars'
import { Server } from 'socket.io'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/carts.routes.js'; // Importa el enrutador del carrito
import { __dirname } from './path.js'
import path from 'path'
import ProductManager from './controllers/ProductManager.js'; // Importa la clase ProductManager


const app = express()
const PORT = 8080;

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server) //Necesita saber la configuracion de los servidores

const productManager = new ProductManager('src/models/productos.txt');

//Config

const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb => callback
        cb(null, 'src/public/img') //el null hace referencia a que no envie errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //concateno la fecha actual en ms con el nombre del archivo
    }
})


//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //URL extensas
app.engine('handlebars', engine()) //Defino trabajar con hbs y guardo la config
app.set('view engine', 'handlebars')//vistas y extension
app.set('views', path.resolve(__dirname, './views'))//indica la localizacion de las vistas se encuentra en views

const upload = multer({ storage: storage })

//Conexion con Socket.io

io.on('connection', (socket) => {
    console.log('Conexion con Socket.io');

    socket.on('nuevoProducto', async (prod) => {
        await productManager.addProduct(prod);
        const products = await productManager.getProducts();
        io.emit('productosActualizados', products);
        io.emit('mensajeProductoCreado', 'El producto se creó correctamente');
    });
});

//Routes
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +
app.use('/api/product',routerProd)   // ruta productos
app.use('/api/carts', routerCart);     // ruta carritos


// Renderizar la vista "home.handlebars" con la lista de productos
//Direccion http://localhost:8080/static/home

app.get('/static/home', async (req, res) => {
    const productos = await productManager.getProducts();

    res.render('home', {
        titulo: 'Lista de Productos',
        rutaCSS: 'home',
        rutaJS: 'home',
        productos: productos,
    });
});

// Renderizar la vista "realTimeProducts.handlebars" con el formulario para agregar productos
//http://localhost:8080/static/realTimeProducts

app.get('/static/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        titulo: 'Crear nuevo Producto',
        rutaCSS: 'realTimeProducts',
        rutaJS: 'realTimeProducts'
    });
})
