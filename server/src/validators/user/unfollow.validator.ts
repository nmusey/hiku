import { body } from "express-validator";

export const unfollowValidator = [
    body("userId")
        .exists().withMessage("Please try again with a user id.").bail()
        .isNumeric().withMessage("User id should be numeric.")
];