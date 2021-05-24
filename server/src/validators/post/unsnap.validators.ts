import { body } from "express-validator";

export const unsnapValidators = [
    body("postId")
        .exists().withMessage("Please choose a post to unsnap.")
];