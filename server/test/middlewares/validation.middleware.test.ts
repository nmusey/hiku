import { validationMiddleware } from "../../src/middlewares/validation.middleware";
import { mockRequest } from "../testUtils/mockRequest"
import { mockResponse } from "../testUtils/mockResponse"

let isEmptyResult = false;
jest.mock("express-validator", () => ({
        validationResult: jest.fn(() => ({
            isEmpty: () => isEmptyResult,
            array: () => []
        }))
    })
);

describe("validationMiddleware", () => {
    let request: any = {};
    let response: any = {};
    
    const mockNext = jest.fn();

    beforeEach(() => {
        request = { ...mockRequest };
        response = { ...mockResponse };
    });

    test("calls next function when no validation errors are present", () => {
        isEmptyResult = true;

        validationMiddleware(request, response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    test("does not call next function when validation errors are present", () => {
        isEmptyResult = false;

        validationMiddleware(request, response, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
    });

    test("sends a 400 HTTP status when validation errors are present", () => {
        isEmptyResult = false;

        validationMiddleware(request, response, mockNext);

        expect(response.lastStatus).toEqual(400);
    });
});