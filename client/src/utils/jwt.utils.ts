import { UserInfo } from "../../../common/types/UserInfo";

export const JWT_KEY = "jwt";

export const removeJWT = (): void => {
    window.localStorage.removeItem(JWT_KEY);
};

export const getJWT = (): string | null => {
    return window.localStorage.getItem(JWT_KEY);
};

export const setJWTOnResponse = (newToken: string | null): void => {
    window.localStorage.setItem(JWT_KEY, newToken || "");
};

export const readJWT = (): UserInfo | undefined => {
    const token = getJWT();
    if (!token) {
        return;
    }

    return JSON.parse(window.atob(token.split(".")[1]));
};