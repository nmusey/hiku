import {config as dotenvSafeConfig} from "dotenv-safe";
import { isDevelopment } from "./constants/Environment";

dotenvSafeConfig({
    path: isDevelopment ? ".env.dev" : ".env",
    example: ".env.example"
});

import { STATIC_PATH } from "./constants/Paths";
import { baseRouter } from "./routers/base.router";
import { authRouter } from "./routers/auth.router";
import { Server } from "./server/Server";

const PORT = parseInt(process.env.PORT || "3000");

const server = new Server(STATIC_PATH);

server.addRouter(authRouter, "/api/auth");
server.addRouter(baseRouter, "");

server.start(PORT);