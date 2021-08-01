import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { Request, Response } from "express";

const EXPIRY_LENGTH_MINUTES = 30;
export const JWT_HEADER_KEY = "jwt";

export const generateJWT = (user: User): string => {
    if (!user.id || !user.email || !user.username) {
        return "";
    }

    const jwtBody = {
        id: user.id,
        email: user.email,
        username: user.username
    };

    const token = jwt.sign(jwtBody, process.env.JWT_SECRET!, { expiresIn: EXPIRY_LENGTH_MINUTES * 60});
    return token;
};

export const generateInvalidJWT = (): string => {
    return "";
};

export const isValidJWT = (token: string): boolean => {
    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return true;
    } catch {
        return false;
    }
};

export const decodeJWT = (token: string): User | null => {
    if (isValidJWT(token)) {
        return jwt.verify(token, process.env.JWT_SECRET!) as User;
    }

    return null;
};

export const refreshJWT = (token: string): string => {
    const user = decodeJWT(token);

    if (!user) {
        return generateInvalidJWT();
    }

    return generateJWT(user);
};

export const getBearerToken = (req: Request): string => {
    if (!req.headers.authorization) {
        return "";
    }

    const [tokenType, token] = req.headers.authorization.split(" ");

    if (tokenType != "Bearer" || !token) {
        return "";
    }

    return token;
};

export const setJWTOnResponse = (res: Response, user: User): void => {
    const jwt = generateJWT(user);
    res.setHeader(JWT_HEADER_KEY, jwt);
};

export const setInvalidJWTOnResponse = (res: Response): void => {
    const jwt = generateInvalidJWT();
    res.setHeader(JWT_HEADER_KEY, jwt);
};

export const getUserFromJWT = (req: Request): User | null => {
    const jwt = getBearerToken(req);
    return decodeJWT(jwt);
};