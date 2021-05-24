import { query } from "express-validator";

export const listPostsValidators = [
    query("cursor")
        .notEmpty()
        .isString()
        .custom(val => (val as string).match(/^[0-9]+$/)).withMessage("Cursor query must be a number.")
];