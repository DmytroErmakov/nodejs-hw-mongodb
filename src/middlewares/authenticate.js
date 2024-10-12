import createHttpError from "http-errors";


import * as authServices from "../services/auth.js";

const authenticate = async (req, res, next) => {
    // const {authorizacion} = req.headers; один вариант получения из заголовка токена
    const authorizacion = req.get("Authorization");

    if (!authorizacion) {
        return next(createHttpError(401, "Autorization header not found"));
    }

    const [bearer, token] = authorizacion.split(" ");

    if (bearer !== "Bearer") {
        return next(createHttpError(401, "Autorization header must have Bearer type"));
    }

    const session = await authServices.findSessionByAccessToken(token);
    if (!session) {
        return next(createHttpError(401, "Session not found"));
    }

    if (new Date() > session.accessTokenValidUntil) {
        return next(createHttpError(401, "Access token expired"));
    }

    const user = await authServices.findUser({ _id: session.userId });
    if (!user) {
        return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    
    next();
};

export default authenticate;

