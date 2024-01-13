import { userModel } from "../models/users.models.js";
import { createHash } from "../utils/bcrypt.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";


export const getUsers = async (req, res) => {
	try {
		const allUsers = await userModel.find();
        if(allUsers){
            res.status(200).send({resultado: "Todos los usuarios",message: allUsers});
        }else{
		res.status(400).send({ message: `No hay usuarios cargados` });            
        }	
	} catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
	}
};

export const postUser = async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body

    try {
        //validar datos y en caso de error tirar un error
        if (!first_name || !last_name || !email) {
            const error = CustomError.createError({
                name: "User creation error",
                cause: generateUserErrorInfo(!first_name, last_name, email),
                message: "Error trying to create user",
                code: EErrors.INVALID_TYPES_ERROR
            });
            res.status(400).send({ error });
            return;  // Importante agregar este return para salir de la función después de enviar la respuesta
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
        res.status(500).send({ error: `Error en create user: ${error}` })
    }

}

