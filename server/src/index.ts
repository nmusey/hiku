import express from "express";
import path from "path";

const app = express();

const STATIC_PATH = path.resolve(__dirname, "../client");

app.use(express.static(STATIC_PATH));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(STATIC_PATH, "index.html"));
})

app.listen(3000, () => console.log("server is up"));