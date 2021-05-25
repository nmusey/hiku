import { Endpoint } from "../../../common/constants/Endpoints";
import { Page } from "../constants/Pages";

export const buildApiEndpoint = (endpoint: Endpoint): string => {
    const { origin } = window.location;
    return `${origin}/api/${endpoint.controller}/${endpoint.action}`;
};

export const replaceParams = (page: Page, params: Record<string, string>): string => {
    let route = page.route;
    
    if (params) {
        Object.keys(params).forEach(key => {
            route = route.replace(
                `:${key}`, 
                params[key]
            );
        });
    }

    return route;
}