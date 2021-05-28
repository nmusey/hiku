import { Endpoint } from "../../../common/constants/Endpoints";
import { Pages } from "../constants/Pages";
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
    const requestInit = buildRequestInit("POST", body);
    const url = buildApiEndpoint(endpoint);

    const response = await fetch(url, requestInit);
    setJWT(response.headers.get(JWT_KEY));

    if (response.status === 401) {
        window.location.hash = Pages.Login.route;
    }

    return response;
};

export const getJSON = async (endpoint: Endpoint, queryParams?: Record<string, unknown>): Promise<Response> => {
    const requestInit = buildRequestInit("GET");
    let url = buildApiEndpoint(endpoint);

    if (queryParams) {
        url += "?";
        url += Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join("&");
    }

    const response = await fetch(url, requestInit);
    setJWT(response.headers.get(JWT_KEY));

    if (response.status === 401) {
        window.location.hash = Pages.Login.route;
    }

    return response;
};

export const getJSONWithParams = async (endpoint: Endpoint, params?: Record<string, string>): Promise<Response> => {
    const requestInit = buildRequestInit("GET");
    let action = "";

    if (params) {
        endpoint.action.split("/").forEach(urlPart => {
            const key = urlPart.replace(":", "");

            if (params[key]) {
                urlPart = urlPart.replace(urlPart, params[key]);
            }

            action += urlPart + "/";
        });
    }

    let url = buildApiEndpoint({ ...endpoint, action });

    const response = await fetch(url, requestInit);
    setJWT(response.headers.get(JWT_KEY));

    if (response.status === 401) {
        window.location.hash = Pages.Login.route;
    }

    return response;
};

export const isResponseSuccess = (response: Response): boolean => response.status < 400;