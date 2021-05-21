import express, {Express, Router, json} from "express";

export class Server {
    server: Express;

    constructor(staticDirectory?: string) {
        this.server = express();
        this.server.use(json());

        if (staticDirectory) {
            this.server.use(express.static(staticDirectory));
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