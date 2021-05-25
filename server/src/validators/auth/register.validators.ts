import { body } from "express-validator";

export const registerValidators = [
        body("email")
            .normalizeEmail()
            .notEmpty().withMessage("Please provide an email").bail()
            .isEmail().withMessage("Please provide a valid email address.")
        ,
        body("username")
            .trim()
            .notEmpty().withMessage("Please provide a username").bail()
            .matches(/\w{3,24}/).withMessage("Please provide a username 3-24 characters using letters, numbers, and underscores.")
        ,
        body("password")
            .trim()
            .notEmpty().withMessage("Please provide a password").bail()
            .isLength({ min: 8 }).withMessage("Please provide a password that is at least 8 characters.")
];