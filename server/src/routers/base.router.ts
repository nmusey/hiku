import { Router } from "express";
import { serveStaticFile } from "../utils/response.utils.js";

export const baseRouter = Router();

baseRouter.get("/", (req, res) => {
    serveStaticFile(res, "index.html");
});

baseRouter.get("*", (req, res) => {
    res.status(404).send("404 not found");
});