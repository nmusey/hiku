import express, { Express, Router, json, static as expressStatic } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { loggerMiddleware } from "../middlewares/logger.middleware.js";

export class Server {
    app: Express;

    constructor(isDevelopment?: boolean, staticDirectory?: string) {
        this.app = express();
        
        this.app.use(json());
        this.app.use(compression());
        this.app.use(
            helmet({
                contentSecurityPolicy: { 
                    useDefaults: true,
                    directives: {
                        scriptSrc: ["'self'", "'unsafe-eval'"]
                    }
                }
            })
        );

        if (staticDirectory) {
            this.app.use(expressStatic(staticDirectory));
        }

        if (isDevelopment) {
            this.app.use(cors());
            this.app.use(loggerMiddleware);
        }
    }

    addRouter(router: Router, prefix: string): void {
        this.app.use(prefix, router);
    }

    start(): void {
        const { PORT } = process.env;
        
        this.app.listen(PORT, () => console.log(`HTTP server started on port ${PORT}`));
    }
}

export default Server;