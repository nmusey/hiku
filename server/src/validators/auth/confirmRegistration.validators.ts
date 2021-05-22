import { body } from "express-validator";

export const confirmRegistrationValidators = [
    body("username")
        .trim()
        .notEmpty().withMessage("Please provide a username.")
    ,
    body("token")
        .trim()
        .notEmpty().withMessage("Please provide a confirmation token.")
];