import { STATIC_PATH } from "./constants/Paths";
import { baseRouter } from "./routers/base.router";
import { Server } from "./server/Server";

const PORT = 3000;

const server = new Server(STATIC_PATH);

server.addRouter(baseRouter, "/");

server.start(PORT);