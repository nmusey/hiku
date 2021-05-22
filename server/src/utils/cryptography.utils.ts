import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const REGISTRATION_TOKEN_LENGTH = 16;

const scryptAsync = promisify(scrypt);

export const hashPassword = async (plaintext: string): Promise<string> => {
    const salt = randomBytes(SALT_LENGTH).toString("hex");
    const buffer = (await scryptAsync(plaintext, salt, KEY_LENGTH)) as Buffer;
    return `${buffer.toString("hex")}.${salt}`;
};

export const compareHashedPasswords = async (storedPassword: string, suppliedPassword: string): Promise<boolean> => {
    if (!storedPassword || !suppliedPassword) {
        return false;
    }

    const [hashedPassword, salt] = storedPassword.split(".");
    const buffer = (await scryptAsync(suppliedPassword, salt, KEY_LENGTH)) as Buffer;

    return buffer.toString("hex") === hashedPassword;
};

export const createRegistrationToken = (): string => {
    return randomBytes(REGISTRATION_TOKEN_LENGTH).toString("hex");
}