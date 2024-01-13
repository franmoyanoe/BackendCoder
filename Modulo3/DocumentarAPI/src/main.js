import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import multer from 'multer'
import {engine} from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import mongoose from 'mongoose'
import ProductManagerMongo from "./controllers/managerMongo/productManagerMongo.js"
import MessagesManager from "./controllers/managerMongo/messageManagerMongo.js";
import router from './routes/main.routes.js'
import cookieParser from 'cookie-parser'
import FileStorage from 'session-file-store'
import passport from 'passport'
import initializePassport from './config/passport.js'
import config from "./config.js";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

const app = express()
const fileStorage = FileStorage(session)
//const PORT = 8080;
app.use(express.json())

const productManagerSocket = new ProductManagerMongo()
const messagesManagerSocket = new MessagesManager();

//Conexion a Mongo
mongoose.connect(config.mongoURL)
    .then(async() => {console.log("BDD conectada")
        //await cartModel.create({})
        //const resultado = await cartModel.findOne({_id:"6506ff427b83ee72898cfcae"}).populate('products.id_prod')
        }
    )
    .catch((error) => console.log("Error en conexion con MongoDB ATLAS: ", error))


//Server
const server = app.listen(config.port, () => {
    console.log(`Server on port ${config.port}`)
})
const io = new Server(server) //Necesita saber la configuracion de los servidores

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


app.use(cookieParser(config.jwtSecret)) //Firmo la cookie
app.use(session({ //Configuracion de la sesion de mi app
    store: MongoStore.create({
        mongoUrl: config.mongoURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 30 //Segundos, no en milisegundos
    }),
    //store: new fileStorage({ path: './sessions', ttl: 10000, retries: 1 }),
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Routes
app.use('/',router)
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +

//Documentacion
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion del curso de Backend',
            decription: 'API Coderhouse Backend'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

//** cualquier subcarpeta 
//* cualquier nombre de archivo
 
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))  




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
})

