
//Codigo en proceso, ya tiene una validacion en messageError.js
export const authAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ error: 'You dont have permissions, you need to be an admin' });
    }
}

export const Authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send({ error: 'you are not authenticated' });
    }
}