import { loggerMiddleware } from "../../src/middlewares/logger.middleware";

describe("loggerMiddleware", () => {
    const mockNext = jest.fn();

    test("always calls the next function", () => {
        loggerMiddleware({} as any, {} as any, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });
});