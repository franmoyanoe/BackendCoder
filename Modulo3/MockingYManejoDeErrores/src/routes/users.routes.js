import { Router } from "express";
import { userModel } from "../dao/models/users.models.js";
import { createHash } from "../utils/bcrypt.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";


const userRouter = Router()

    userRouter.post('/', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body
    //console.log(password)
    try {

        if(!first_name || !last_name || !email){
            CustomError.createError({
                name: "User creation error",
                cause: generateUserErrorInfo(!first_name, last_name, email),
                message: "Error trying to create user",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        const hashPassword = createHash(password)
        const response = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashPassword,
            age: age
        })
        //res.redirect('../../static/login');
        res.status(200).send({ mensaje: 'Usuario creado', respuesta: response })
    } catch (error) {
        res.status(400).send({ error: `Error en create user: ${error}` })
    }

})


userRouter.get('/', async (req, res) => {
	try {
		const allUsers = await userModel.find();
        if(allUsers){
            res.status(200).send({resultado: "Todos los usuarios",message: allUsers});
        }else{
		res.status(400).send({ message: `No hay usuarios cargados` });            
        }	
	} catch (error) {
        console.error("Error en userRouter get:", error);
        res.status(500).send({ error: "Error interno del servidor" });
	}
});

export default userRouter

//Ingresar usuario sin encriptar password
/*
userRouter.post('/', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body
    try {
        const user = await userModel.findOne({email:email})
        if(!user){
            const response = await userModel.create({ first_name, last_name, email, password, age })
            res.status(200).send({ mensaje: 'Usuario creado', respuesta: response })
        }else{
            res.status(400).send({
				respuesta: `Error al crear usuario`,
				message: 'Usuario existente',
			});
        }
        
    } catch (error) {
        console.error("Error en userRouter post:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }

})
*/

//Encriptar contraseña con bcrypt
/*
    {
    "first_name":"Lex",
    "last_name": "Luthor",
    "email":"lex@lex.com",
    "password":"123",
    "age":38 
    }
*/

/*
    userRouter.post('/', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        return res.status(200).send({ mensaje: 'Usuario creado' })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
})
*/
