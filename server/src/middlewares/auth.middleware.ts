import { RequestHandler } from "express";
import { getBearerToken, decodeJWT, refreshJWT, JWT_HEADER_KEY } from "../utils/jwt.utils.js";

export const authMiddleware: RequestHandler = (req, res, next): void => {
    const jwt = getBearerToken(req);
    const user = decodeJWT(jwt);

    if (!jwt || !user) {
        console.log(`Unauthorized attempt to hit ${req.path}`);

        res.status(401).send({ errors: [ "You are not authorized to perform that action. Please try logging in." ] });
        return;
    }

    const newJwt = refreshJWT(jwt);
    res.setHeader(JWT_HEADER_KEY, newJwt);

    next();
};