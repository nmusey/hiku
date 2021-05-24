import { body } from "express-validator";

export const searchValidators = [
    body("searchTerm")
        .exists().withMessage("Please provide a search term.").bail()
        .isString().withMessage("Please provide a string as a search term").bail()
    ,
    body("cursor")
        .isNumeric().withMessage("Please provide a numeric cursor.").bail()
        .custom(value => value > 0).withMessage("Please provide a cursor greater than 0.")
];