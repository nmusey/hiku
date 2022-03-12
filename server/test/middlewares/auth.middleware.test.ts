import { User } from "@prisma/client";
import { authMiddleware } from "../../src/middlewares/auth.middleware";
import { generateJWT, isValidJWT, JWT_HEADER_KEY } from "../../src/utils/jwt.utils";
import { mockRequest } from "../testUtils/mockRequest";
import { mockResponse } from "../testUtils/mockResponse";

describe("auth middleware", () => {
    let request: any;
    let response: any;

    const mockNext = jest.fn();

    const user: User = {
        id: 1,
        email: "email",
        username: "username",
        password: "password",
        registeredDate: new Date(),
        registrationToken: ""
    };

    beforeAll(() => {
        process.env.JWT_SECRET = "secret";
    });

    beforeEach(() => {
        mockNext.mockReset();
        request = { ...mockRequest };
        response = { ...mockResponse };
    });

    test("rejects a request without a JWT with a 401 status", () => {
        authMiddleware(request, response, mockNext);

        expect(mockResponse.lastStatus).toEqual(401);
    });

    test("rejects a request with a bad JWT with a 401 status", () => {
        const token = generateJWT(user);
        token.concat("asdf");

        authMiddleware(request, response, mockNext);

        expect(mockResponse.lastStatus).toEqual(401);
    });

    test("exits if no valid JWT is attached", () => {
        authMiddleware(request, response, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
    });

    test("passes on control if a valid JWT is attached", () => {
        const token = generateJWT(user);
        request.headers.authorization = `Bearer ${token}`;

        authMiddleware(request, response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    test("updates the JWT to another valid JWT if it was already valid", () => {
        const originalToken = generateJWT(user);
        request.headers.authorization = `Bearer ${originalToken}`;

        authMiddleware(request, response, mockNext);

        const newToken = response.getHeader(JWT_HEADER_KEY) as string;
        
        expect(isValidJWT(newToken)).toBe(true);
    });
});