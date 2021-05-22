import { body } from "express-validator";

export const loginValidators = [
    body("email")
        .normalizeEmail()
        .isEmail().withMessage("Please provide a valid email.")
    ,
    body("password")
        .trim()
];