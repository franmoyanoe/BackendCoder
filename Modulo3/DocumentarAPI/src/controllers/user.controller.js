import { userModel } from "../models/users.models.js";
import { createHash } from "../utils/bcrypt.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import crypto from 'crypto'
import { sendRecoveryEmail } from "../config/nodemailer.js";


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
const recoveryLinks = {}
export const passwordRecovery = async (req, res) => {
    const { email } = req.body
    //Verificion de usuario existente

    try {
        const token = crypto.randomBytes(20).toString('hex') //Token unico con el fin de no utilizar JWT para algo simple

        recoveryLinks[token] = { email, timestamp: Date.now() }

        const recoveryLink = `http://localhost:8000/api/users/reset-password/${token}`

        sendRecoveryEmail(email, recoveryLink)

        res.status(200).send('Correo de recuperacion enviado correctamente')
    } catch (error) {
        res.status(500).send('Error al enviar correo de recuperacion: ', error)
    }
}

export const resetPassword = async(req,res)=>{
    const { token } = req.params
    const { newPassword } = req.body

    try {
        //Verifico que el token es valido y no ha expirado (1 hora)
        const linkData = recoveryLinks[token]
        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            const { email } = linkData

			const user = await userModel.findOne({ email: email });
			const checkPasswords = validatePassword(newPassword, user.password);
			if (!checkPasswords) {
				const passwordHash = createHash(newPassword);
				await userModel.findOneAndUpdate({ email: email }, { password: passwordHash });
                
			} else {
				res.status(400).send(
					'No se pueden usar la contraseña anterior!'
				);
			}

            delete recoveryLinks[token]

            res.status(200).send('Contraseña modificada correctamente')

        } else {
            res.status(400).send('Token invalido o expirado. Pruebe nuevamente')
        }
    } catch (error) {
        res.status(500).send('Error al cambiar contraseña de cliente: ', error)
    }
}

