//import 'dotenv/config'
import bcrypt from 'bcrypt'

//Encriptar contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))
//const hashPassword = createHash("Nico")
//console.log("La contraseña encriptada es: ",hashPassword)


//Validar contraseña encriptada
export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)
//console.log("Validamos si la contraseña es correcta: ",validatePassword("Nico",hashPassword))
