import { Endpoint } from "../constants/Endpoints";
import { getJWT, JWT_KEY, setJWT } from "./jwt.utils";
import { buildApiEndpoint } from "./url.utils";

const buildRequestInit = (method: string, body?: Record<string, unknown>): RequestInit => {
    const jwt = getJWT();

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${jwt}`);
    
    return {
        method,
        body: body ? JSON.stringify(body) : null,
        headers
    };
};

export const postJSON = async (endpoint: Endpoint, body = {}): Promise<Response> => {
    const url = buildApiEndpoint(endpoint);
    const requestInit = buildRequestInit("POST", body);

    const response = await fetch(url, requestInit);
    setJWT(response.headers.get(JWT_KEY));

    return response;
};

export const getJSON = async (endpoint: Endpoint): Promise<Response> => {
    const url = buildApiEndpoint(endpoint);
    const requestInit = buildRequestInit("GET");

    const response = await fetch(url, requestInit);
    setJWT(response.headers.get(JWT_KEY));

    return response;
};

export const isResponseSuccess = (response: Response): boolean => response.status < 400;