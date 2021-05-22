import { body } from "express-validator";

export const registerValidator = [
        body("email")
            .normalizeEmail()
            .notEmpty().withMessage("Please provide an email")
            .isEmail().withMessage("Please provide a valid email address.")
        ,
        body("username")
            .trim()
            .notEmpty().withMessage("Please provide a username")
            .matches(/\w{3,24}/).withMessage("Please provide a username 3-24 characters using letters, numbers, and underscores.")
        ,
        body("password")
            .trim()
            .notEmpty().withMessage("Please provide a password")
            .isLength({ min: 8 }).withMessage("Please provide a password that is at least 8 characters.")
];