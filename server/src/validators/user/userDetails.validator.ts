import { param } from "express-validator";

export const userDetailsValidator = [
    param("username")
        .isString()
]