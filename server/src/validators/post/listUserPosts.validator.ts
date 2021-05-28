import { param } from "express-validator";

export const listUserPostsValidators = [
    param("username")
        .notEmpty().withMessage("Please provide a user id.").bail()
    ,
    param("cursor")
        .notEmpty()
        .isNumeric().withMessage("Cursor query must be a number.")
];