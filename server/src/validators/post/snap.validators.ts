import { body } from "express-validator";

export const snapValidators = [
    body("postId")
        .exists().withMessage("Please choose a post to snap.")
];