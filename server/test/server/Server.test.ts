const mockUse = jest.fn();
jest.mock("express", () => ({
    __esModule: true,
    default: () => ({
        use: mockUse,
    }),
    json: () => {},
    static: () => {},
    Router: () => {}
})) as any;

const mockLog = jest.fn();
console.log = mockLog;

import { Router } from "express";
import { Server } from "../../src/server/Server";

describe("Server", () => {
    describe("constructor", () => {
        beforeEach(() => {
            mockUse.mockReset();
        });

        test("uses extra middleware if the server is in development mode", () => {
            new Server(false);
            const numberOfProductionMiddlewares = mockUse.mock.calls.length;
            mockUse.mockReset();

            new Server(true);
            const numberOfDevelopmentMiddlewares = mockUse.mock.calls.length;
            
            expect(numberOfDevelopmentMiddlewares).toBeGreaterThan(numberOfProductionMiddlewares);
        });

        test("uses a static directory if passed in", () => {
            new Server(true);
            const baseNumberOfMiddlewares = mockUse.mock.calls.length;
            mockUse.mockReset();

            new Server(true, "path");
            const staticDirectoryNumberOfMiddlewares = mockUse.mock.calls.length;
            
            // app.use should get called once more - with express.static
            expect(staticDirectoryNumberOfMiddlewares).toEqual(baseNumberOfMiddlewares + 1);
        });
    });

    describe("addRouter", () => {
        test("calls use to add the router", () => {
            const server = new Server();
            mockUse.mockReset();

            server.addRouter(Router(), "prefix");

            expect(mockUse).toHaveBeenCalledTimes(1);
        });

        test("adds the router under the correct prefix", () => {
            const server = new Server();
            mockUse.mockReset();

            server.addRouter(Router(), "prefix");

            console.log(server.app.routes);
        });
    });

    describe("start", () => {
        test("listens to the correct port and uses a callback", () => {
            process.env.PORT = "12345";
            const mockListen = jest.fn();

            const server = new Server();
            server.app.listen = mockListen;

            server.start();

            expect(mockListen).toHaveBeenCalledWith(process.env.PORT, expect.anything());
            expect(mockLog).not.toHaveBeenCalled(); // it should eventually be but not until the server starts
        });

        test("doesn't use the callback immediately (should be after the server starts)", () => {
            process.env.PORT = "12345";
            const mockListen = jest.fn();

            const server = new Server();
            server.app.listen = mockListen;

            server.start();

            expect(mockLog).not.toHaveBeenCalled(); // console.log should eventually be but not until the server starts
        });
    });
});