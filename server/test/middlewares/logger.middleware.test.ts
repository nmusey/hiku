import { loggerMiddleware } from "../../src/middlewares/logger.middleware";

const mockLog = jest.fn();
global.console.log = mockLog;

describe("loggerMiddleware", () => {
    const mockNext = jest.fn();

    test("always calls the next function", () => {
        loggerMiddleware({} as any, {} as any, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    test("logs information about the request", () => {
        loggerMiddleware({} as any, {} as any, mockNext);

        expect(mockLog).toHaveBeenCalled();
    });
});