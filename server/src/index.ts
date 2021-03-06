import {config as dotenvSafeConfig} from "dotenv-safe";
import { isDevelopment } from "./constants/Environment.js";

dotenvSafeConfig({
    path: ".env",
    example: ".env.example"
});

import { STATIC_PATH } from "./constants/Paths.js";
import { baseRouter } from "./routers/base.router.js";
import { authRouter } from "./routers/auth.router.js";
import { postRouter } from "./routers/post.router.js";
import { userRouter } from "./routers/user.router.js";
import { Server } from "./server/Server.js";
import { Controller } from "../../common/constants/Endpoints.js";

const server = new Server(isDevelopment, STATIC_PATH);

server.addRouter(authRouter, `/api/${Controller.Auth}`);
server.addRouter(postRouter, `/api/${Controller.Post}`);
server.addRouter(userRouter, `/api/${Controller.User}`);
server.addRouter(baseRouter, "");

server.start();