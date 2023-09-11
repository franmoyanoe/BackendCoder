import express from 'express'
import mongoose from 'mongoose'
import productRouter from './routes/products2.routes.js'


const app = express()
const PORT = 4000

mongoose.connect('mongodb+srv://francomoyano:<password>@cluster0.r7cxn6u.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("BDD conectada"))
    .catch((error) => console.log("Error en conexion con MongoDB ATLAS: ", error))
 
app.use(express.json())
app.use('/api/products', productRouter)

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})