import express, {Express, Router, json } from "express";
import cors from "cors";
import { isDevelopment } from "../constants/Environment";
import { loggerMiddleware } from "../middlewares/logger.middleware";

export class Server {
    server: Express;

    constructor(staticDirectory?: string) {
        this.server = express();
        this.server.use(json());

        if (staticDirectory) {
            this.server.use(express.static(staticDirectory));
        }

        if (isDevelopment) {
            this.server.use(cors());
            this.server.use(loggerMiddleware);
        }
    }

    addRouter(router: Router, prefix: string): void {
        this.server.use(prefix, router);
    }

    start(port: number): void {
        this.server.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
}

export default Server;