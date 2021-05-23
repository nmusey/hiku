import { Endpoint } from "../constants/Endpoints";

export const buildApiEndpoint = (endpoint: Endpoint): string => {
    const { origin } = window.location;
    return `${origin}/api/${endpoint.controller}/${endpoint.action}`;
}