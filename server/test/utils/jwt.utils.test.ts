import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { decodeJWT, generateInvalidJWT, generateJWT, getBearerToken, getUserFromJWT, isValidJWT, JWT_HEADER_KEY, refreshJWT, setInvalidJWTOnResponse, setJWTOnResponse } from "../../src/utils/jwt.utils";
import { Request } from "express";
import { mockRequest } from "../testUtils/mockRequest";
import { mockResponse } from "../testUtils/mockResponse";

describe("jwt utils", () => {
    const MOCK_SECRET = "secret";
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlbWFpbCIsInVzZXJuYW1lIjoidGVzdF91c2VyIn0.OFqfV1bWEab7OX7M7TY6Xwg24LcyWuMEPEv3e5ePH0k";
    
    let request: any;
    let response: any;

    beforeAll(() => {
        process.env.JWT_SECRET = MOCK_SECRET;
    });

    beforeEach(() => {
         request = { ...mockRequest };
         response = { ...mockResponse };
    });
        

    describe("generateJWT", () => {
        it("returns a verifiable JWT when given a full user", () => {
            const mockUser: User = {
                id: 1,
                email: "email",
                username: "test_user"
            } as User;

            const token = generateJWT(mockUser);
            const decoded = jwt.verify(token, MOCK_SECRET);

            expect(decoded).toBeTruthy();
        });

        it("returns an empty string when given an empty user", () => {
            const mockUser: User = {} as User;

            const token = generateJWT(mockUser);

            expect(token).toBeFalsy();
        });

        it("returns an empty string when given an empty user id", () => {
            const mockUser: User = {
                email: "email",
                username: "test_user"
            } as User;

            const token = generateJWT(mockUser);

            expect(token).toBeFalsy();
        });
    });

    describe("generateInvalidJWT", () => {
        it("returns an empty string", () => {
            const invalidToken = generateInvalidJWT();

            expect(invalidToken).toBeFalsy();
        });
    });

    describe("isValidJWT", () => {
        it("returns true when given a verifiable jwt", () => {
            const result = isValidJWT(mockToken);

            expect(result).toBe(true);
        });

        it("returns false when given a JWT with a bad signature", () => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlbWFpbCIsInVzZXJuYW1lIjoidGVzdF91c2VyIn0.badsignature"

            const result = isValidJWT(token);

            expect(result).toBe(false);
        });

        it("returns false when given a JWT with a bad body", () => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.badbody.OFqfV1bWEab7OX7M7TY6Xwg24LcyWuMEPEv3e5ePH0k"

            const result = isValidJWT(token);

            expect(result).toBe(false);
        });
    });

    describe("decodeJWT", () => {
        it("returns a User object when a valid JWT is given", () => {
            const user = decodeJWT(mockToken);

            expect(user).toBeDefined();
            expect(user?.id).toBeDefined();
            expect(user?.id).toEqual(1);
        });

        it("returns null when an invalid JWT is given", () => {
            const user = decodeJWT("badtoken");

            expect(user).toBe(null);
        });
    });

    describe("refreshJWT", () => {
        it("returns a valid JWT when given a valid JWT", () => {
            const result = refreshJWT(mockToken);

            expect(result).toBeTruthy();
        });

        it("returns an invalid JWT when given an invalid JWT", () => {
            const result = refreshJWT("badtoken");

            expect(result).toBeFalsy();
        });
    });

    describe("getBearerToken", () => {
        it("returns whatever bearer token is attached to the request", () => {
            request.headers.authorization = "Bearer token";
            const result = getBearerToken(request);

            expect(result).toBe("token");
        });

        it("returns an empty string when no headers are present", () => {
            const request = {
                headers: {}
            } as Request;
            const result = getBearerToken(request);

            expect(result).toBeFalsy();
        });

        it("returns an empty string when the token is not a bearer token", () => {
            const request = {
                headers: {
                    authorization: "Basic token"
                }
            } as Request;

            const result = getBearerToken(request);

            expect(result).toBeFalsy();
        });

        it("returns an empty string when no token is present", () => {
            const request = {
                headers: {
                    authorization: ""
                }
            } as Request;

            const result = getBearerToken(request);

            expect(result).toBeFalsy();
        });
    });

    describe("setJWTOnResponse", () => {
        const mockUser: User = {
            id: 1,
            email: "email",
            username: "username",
            password: "password",
            registeredDate: new Date(),
            registrationToken: ""
        };

        test("sets a header on the response", () => {
            setJWTOnResponse(response, mockUser);
    
            const tokenHeader = response.getHeader(JWT_HEADER_KEY);
            expect(tokenHeader).toBeTruthy();
        });

        test("sets a valid JWT on the response", () => {
            setJWTOnResponse(response, mockUser);
    
            const tokenHeader = response.getHeader(JWT_HEADER_KEY) as string;
            expect(isValidJWT(tokenHeader)).toBe(true);
        });
    });

    describe("setInvalidJWTOnResponse", () => {
        test("sets a blank header on the response", () => {
            setInvalidJWTOnResponse(response);
    
            const tokenHeader = response.getHeader(JWT_HEADER_KEY);
            expect(tokenHeader).toBeDefined();
            expect(tokenHeader).toBeFalsy();
        });
    });

    describe("getUserFromJWT", () => {
        beforeEach(() => {
            request.headers.authorization = `Bearer ${mockToken}`;
        });

        test("returns an object resembling a user", () => {
            const result = getUserFromJWT(request);

            expect(result).toBeDefined();
            expect(result?.email).toBeDefined();
        });

        test("does not return a password on the user object", () => {
            const result = getUserFromJWT(request);

            expect(result?.password).toBeUndefined();
        });
    });
});