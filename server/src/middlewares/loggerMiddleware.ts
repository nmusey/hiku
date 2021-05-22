import { RequestHandler } from "express";

export const loggerMiddleware: RequestHandler = (req, res, next): void => {
    console.log(`${req.method} ${req.url}`);
    next();
};