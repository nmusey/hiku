import express, {Express, Router, json } from "express";
import cors from "cors";
import compression from "compression";
import fs from "fs";
import http from "http"
import https from "https"
import helmet from "helmet";
import { isDevelopment } from "../constants/Environment.js";
import { loggerMiddleware } from "../middlewares/logger.middleware.js";

export class Server {
    app: Express;

    constructor(staticDirectory?: string) {
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
            this.app.use(express.static(staticDirectory));
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
        const { HTTP_PORT, HTTPS_PORT } = process.env;
        const credentials = {
            key: fs.readFileSync(process.env.PRIVATE_KEY_LOCATION!, 'utf8'),
            cert: fs.readFileSync(process.env.CERTIFICATE_LOCATION!, 'utf8')
        };

        const httpServer = http.createServer(this.app);
        const httpsServer = https.createServer(credentials, this.app);

        httpServer.listen(HTTP_PORT, () => {
            console.log(`HTTP server started on port ${HTTP_PORT}`);
        });

        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`HTTPS server started on port ${HTTPS_PORT}`);
        });
    }
}

export default Server;