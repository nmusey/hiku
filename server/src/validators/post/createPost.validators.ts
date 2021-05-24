import { body, CustomValidator } from "express-validator";
import { syllable } from "syllable";

const hasSyllables = (targetSyllables: number, name: string): CustomValidator => (value: string) => {
    const actualSyllables = syllable(value);

    if (actualSyllables > targetSyllables) {
        throw new Error(`The ${name} line has ${actualSyllables - targetSyllables} too many syllables.`);
    } else if (actualSyllables < targetSyllables) {
        throw new Error(`The ${name} line has ${targetSyllables - actualSyllables} too few syllables.`);
    }

    return true;
};

export const createPostValidators = [
    body("firstLine")
        .custom(hasSyllables(5, "first"))
    ,
    body("secondLine")
        .custom(hasSyllables(7, "second"))
    ,
    body("thirdLine")
        .custom(hasSyllables(5, "third"))
];