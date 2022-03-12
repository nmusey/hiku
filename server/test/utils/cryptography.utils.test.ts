import { comparePasswordToHashed, createRegistrationToken, hashPassword } from "../../src/utils/cryptography.utils";

describe("cryptography utils", () => {
    describe("hashPassword", () => {
        test("returns a string different from the input", async () => {
            const plainText = "plainText";
            const hashed = await hashPassword(plainText);

            expect(hashed).not.toEqual(plainText);
        });

        test("returns encrypted strings of the same length, regardless of input length", async () => {
            const plainText1 = "short";
            const plainText2 = "long long long string";

            const hashed1 = await hashPassword(plainText1);
            const hashed2 = await hashPassword(plainText2);

            expect(hashed1.length).toEqual(hashed2.length);
        });

        test("returns the string in the form encrypted.salt", async () => {
            const plainText = "plainText";
            const hashed = await hashPassword(plainText);

            const hashParts = hashed.split(".");

            expect(hashParts.length).toEqual(2);
        });

        test("gives random salt for the same password", async () => {
            const plainText = "plainText";
            const hashed1 = await hashPassword(plainText);
            const hashed2 = await hashPassword(plainText);

            const salt1 = hashed1.split(".")[1];
            const salt2 = hashed2.split(".")[1];

            expect(salt1).not.toMatch(salt2);
        });
    });

    describe("comparePasswordToHashed", () => {
        test("returns true if the hashed string is the same", async () => {
            const plainText = "plainText";
            const hashedText = await hashPassword(plainText);

            const result = await comparePasswordToHashed(hashedText, plainText);

            expect(result).toBe(true);
        });

        test("returns false if the hashed string is not the same", async () => {
            const plainText = "plainText";
            const differentPlainText = "thisisdifferent";
            const hashedText = await hashPassword(plainText);

            const result = await comparePasswordToHashed(hashedText, differentPlainText);

            expect(result).toBe(false);
        });

        test("returns false if stored password isn't passed", async () => {
            const result = await comparePasswordToHashed("", "thisShouldntMatter");
            expect(result).toBe(false);
        });

        test("returns false if supplied password isn't passed", async () => {
            const result = await comparePasswordToHashed("thisShouldntMatter", "");
            expect(result).toBe(false);
        });

        test("returns false if neither password is passed", async () => {
            const result = await comparePasswordToHashed("", "");
            expect(result).toBe(false);
        });
    });

    describe("createRegistrationToken", () => {
        test("Returns a string of at least 16 characters", () => {
            const registrationCode = createRegistrationToken();

            expect(registrationCode.length).toBeGreaterThanOrEqual(16);
        });

        test("Registration codes are random", () => {
            const registrationCode1 = createRegistrationToken();
            const registrationCode2 = createRegistrationToken();

            expect(registrationCode1).not.toMatch(registrationCode2);
        });

        test("Registration codes are not sequential", () => {
            const registrationCode1 = createRegistrationToken();
            const registrationCode2 = createRegistrationToken();

            const incrementedRegistrationCode1 = parseInt(registrationCode1, 16) + 1;
            const incrementedRegistrationCode1String = `${incrementedRegistrationCode1 + 1}`;

            expect(incrementedRegistrationCode1String).not.toMatch(registrationCode2);
        });
    });
});