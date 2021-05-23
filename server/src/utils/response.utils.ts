import { resolve } from "path";
import { Response } from "express";
import { STATIC_PATH } from "../constants/Paths.js";

export const serveStaticFile = (response: Response, fileName: string): void => {
    return response.sendFile(resolve(STATIC_PATH, fileName));
};