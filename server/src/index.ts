import {config as dotenvSafeConfig} from "dotenv-safe";

const isDevelopment = process.env.NODE_ENV !== "production";

dotenvSafeConfig({
    path: isDevelopment ? "dev.env" : ".env",
    example: ".env.example"
});

import { STATIC_PATH } from "./constants/Paths";
import { baseRouter } from "./routers/base.router";
import { Server } from "./server/Server";

const PORT = parseInt(process.env.PORT || "3000");

const server = new Server(STATIC_PATH);

server.addRouter(baseRouter, "/");

server.start(PORT);