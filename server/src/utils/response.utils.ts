import path from "path";
import { Response } from "express"
import { STATIC_PATH } from "../constants/Paths";

export const serveStaticFile = (response: Response, fileName: string): void => {
    return response.sendFile(path.resolve(STATIC_PATH, fileName));
}