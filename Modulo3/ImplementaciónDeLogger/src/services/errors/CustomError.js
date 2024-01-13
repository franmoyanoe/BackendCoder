export default class CustomError {
    
    static createError({ name = "Error!!", cause, message, code = 1 }) {
        const error = new Error(message);
        error.name = name;
        error.code = code;
        error.cause = cause; // Agrega la propiedad 'cause' directamente al objeto 'error'
        return error; // Agrega esta línea para devolver el error creado
    }
}

