import express from 'express'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/carts.routes.js'; // Importa el enrutador del carrito


const app = express()
const PORT = 8080;


//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //URL extensas
//const upload = multer({ storage: storage })

//app.use('/', routerProd)

app.use('/api/product',routerProd)
app.use('/api/carts', routerCart);     // Grupo de rutas para carritos




//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})