import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'francoemmanuelmoyano@gmail.com',
        pass: ' xhpr yoqq bldv edwy',
        authMethod: 'LOGIN'
    }
})

//Funciones de nodemailer

export const sendRecoveryEmail = (email, recoveryLink) => {
    const mailOptions = {
        from: 'francoemmanuelmoyano@gmail.com',
        to: email,
        subject: 'Link de recuperacion de su contraseña',
        text: `Por favor haz click en el siguiente enlace ${recoveryLink}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log(error)
        else
            console.log('Email enviado correctamente')
    })
}