import {config as dotenvSafeConfig} from "dotenv-safe";

dotenvSafeConfig({
    path: ".env",
    example: ".env.example"
});

import { STATIC_PATH } from "./constants/Paths.js";
import { baseRouter } from "./routers/base.router.js";
import { authRouter } from "./routers/auth.router.js";
import { Server } from "./server/Server.js";
import { Controller } from "../../common/constants/Endpoints.js";
import { postRouter } from "./routers/post.router.js";

const PORT = parseInt(process.env.PORT || "3000");

const server = new Server(STATIC_PATH);

server.addRouter(authRouter, `/api/${Controller.Auth}`);
server.addRouter(postRouter, `/api/${Controller.Post}`);
server.addRouter(baseRouter, "");

server.start(PORT);