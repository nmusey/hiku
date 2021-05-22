import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validationMiddleware: RequestHandler = (req, res, next): void => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array().map(err => err.msg) });
        return;
    }

    next();
};