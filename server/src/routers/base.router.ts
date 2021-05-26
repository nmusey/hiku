import { Router } from "express";
import { resolve } from "path";
import { STATIC_PATH } from "../constants/Paths.js";

export const baseRouter = Router();

baseRouter.get("/", (req, res) => {
    res.render(
        resolve(STATIC_PATH, "index.html")
    );
});

baseRouter.get("*", (req, res) => {
    res.status(404).send("404 not found");
});