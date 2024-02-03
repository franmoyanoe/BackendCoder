import dotenv from 'dotenv';

const environment = 'DEVELOPMENT';
dotenv.config({
    path: environment === 'DEVELOPMENT' ? './.env.development' : './.env.production'
});

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    PERSISTENCE: process.env.PERSISTENCE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_CALLBACKURL: process.env.CLIENT_CALLBACKURL,
    NODE_ENV: environment 
};

