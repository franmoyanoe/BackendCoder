import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import multer from 'multer'
import {engine} from 'express-handlebars'
import { Server } from 'socket.io'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'; // Importa el enrutador del carrito
import { __dirname } from './path.js'
import path from 'path'
//import ProductManager from './dao/fileSystem/controllers/ProductManager.js'; // Importa la clase ProductManager
import mongoose from 'mongoose'
//import productRouter from './routes/productsFileSystem.routes.js'
//import cartRouter from './routes/cartFileSystem.routes.js'
import cartModel from './dao/models/carts.models.js'
import ProductManagerMongo from "./dao/MongoDB/productManagerMongo.js"
import MessagesManager from "./dao/MongoDB/messageManagerMongo.js";
import userRouter from './routes/users.routes.js'
import sessionRouter from './routes/sessions.routes.js'
import cookieParser from 'cookie-parser'
import FileStorage from 'session-file-store'
import { userModel } from "./dao/models/users.models.js"
import passport from 'passport'
import initializePassport from './config/passport.js'



const app = express()
const fileStorage = FileStorage(session)
const PORT = 8080;
app.use(express.json())

const productManagerSocket = new ProductManagerMongo()
const messagesManagerSocket = new MessagesManager();

//Conexion a Mongo
mongoose.connect(process.env.MONGO_URL)
    .then(async() => {console.log("BDD conectada")
        //await cartModel.create({})
        //const resultado = await cartModel.findOne({_id:"6506ff427b83ee72898cfcae"}).populate('products.id_prod')
        //console.log(JSON.stringify(resultado))
        }
    )
    .catch((error) => console.log("Error en conexion con MongoDB ATLAS: ", error))


//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server) //Necesita saber la configuracion de los servidores

//const productManager = new ProductManager('src/models/productos.txt');

//Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb => callback
        cb(null, 'src/public/img') //el null hace referencia a que no envie errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //concateno la fecha actual en ms con el nombre del archivo
    }
})
const upload = multer({ storage: storage })

//Middlewares

app.use(express.urlencoded({ extended: true })) //URL extensas
app.engine('handlebars', engine()) //Defino trabajar con hbs y guardo la config
app.set('view engine', 'handlebars')//vistas y extension
app.set('views', path.resolve(__dirname, './views'))//indica la localizacion de las vistas se encuentra en views


app.use(cookieParser(process.env.SIGNED_COOKIE)) //Firmo la cookie
app.use(session({ //Configuracion de la sesion de mi app
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 30 //Segundos, no en milisegundos
    }),
    //store: new fileStorage({ path: './sessions', ttl: 10000, retries: 1 }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Routes
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionRouter)
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +



//Cookies
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es el valor de una cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
})


// Renderizar la vista "realTimeProducts.handlebars" con el formulario para agregar productos
//http://localhost:8080/static/realTimeProducts
app.get('/static/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        titulo: 'Crear nuevo Producto',
        rutaCSS: 'realTimeProducts',
        rutaJS: 'realTimeProducts'
    });
})

app.get('/static/chat',(req,res)=>{
    res.render('chat',{
        titulo: 'Chat message',
        rutaCSS: 'chat',
        rutaJS: 'chat'
    });
})

app.get('/static/products', (req, res) => {
	const user = req.session.user;
	res.render('products', {
		rutaCSS: 'products',
		rutaJS: 'products',
		user,
	});
});

app.get('/static/login', (req, res) => {
	res.render('login', {
		rutaCSS: 'login',
		rutaJS: 'login',
	});
});

app.get('/static/signInUser', (req, res) => {
	res.render('signInUser', {
		rutaCSS: 'signInUser',
		rutaJS: 'signInUser',
	});
});

//socket con mongo
io.on("connection",async(socket)=>{

    console.log("Conection with socket.io Mongo")

    const Productos =await productManagerSocket.getProductsAll()
    socket.emit("envioProductos", Productos)

    socket.on('nuevoProducto', async (prod) => {
        await productManagerSocket.addProduct(prod);
        //const products = await productManager.getProducts();
        //socket.emit('productosActualizados', products);
        socket.emit('mensajeProductoCreado', 'El producto se creó correctamente');
    });

    socket.on("deleteProduct",async(id)=>{
        console.log(id)
       await productManagerSocket.deleteProduct(id)
       const Productos =await productManagerSocket.getProductsAll()
       socket.emit("envioProductos", Productos)
        })
 
      socket.on('mensaje', async (info) => {
		const { email, message } = info;
		await messagesManagerSocket.createMessage({
			email,
			message,
		});
		const messages = await messagesManagerSocket.getMessages();

		socket.emit('mensajes', messages);
	});
//Ingresar y hacer sign in nuevo usuario
    socket.on('signInUser', async (user) => {
		const { email } = user;
		const searchUser = await userModel.findOne({ email: email });

		if (!searchUser) {
			await userModel.create(user);
			socket.emit('usuarioCreado', "Usuario creado");
		} else {
			socket.emit('existeUsuario', "Usuario existente");
		}
	});

})







//rutas de fileSystem
//app.use('/api/product',routerProd)   // ruta productos
//app.use('/api/carts', routerCart);     // ruta carritos

//Usando fileSystem
//Conexion con Socket.io
/*
io.on('connection', (socket) => {
    console.log('Conexion con Socket.io');

    socket.on('nuevoProducto', async (prod) => {
        await productManager.addProduct(prod);
        const products = await productManager.getProducts();
        socket.emit('productosActualizados', products);
        socket.emit('mensajeProductoCreado', 'El producto se creó correctamente');
    });
});
*/
// Renderizar la vista "home.handlebars" con la lista de productos
//Direccion http://localhost:8080/static/home
/*
app.get('/static/home', async (req, res) => {
    const productos = await productManager.getProducts();

    res.render('home', {
        titulo: 'Lista de Productos',
        rutaCSS: 'home',
        rutaJS: 'home',
        productos: productos,
    });
});
*/

/*
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
*/