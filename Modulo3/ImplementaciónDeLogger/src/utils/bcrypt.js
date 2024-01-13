//import 'dotenv/config'
import bcrypt from 'bcrypt'

//Encriptar contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))
//const hashPassword = createHash("Nico")



//Validar contraseña encriptada
export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)

