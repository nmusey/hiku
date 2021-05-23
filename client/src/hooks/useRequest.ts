import { useCallback, useState } from "react";
import { Endpoint } from "../constants/Endpoints";
import { getJSON, postJSON } from "../utils/fetch.utils";

export interface ErrorResponse {
    errors: string[];
}

export enum RequestMethods {
    Get = "GET",
    Post = "POST"
}

interface UseRequestReturn<T> {
    response: Response;
    responseBody: T | ErrorResponse;
}

export const useRequest = <Req, Res>(endpoint: Endpoint, method: RequestMethods): [boolean, (body?: Req) => Promise<UseRequestReturn<Res>>] => {
    const [isLoading, setIsLoading] = useState(false);

    const initiator = useCallback(
        async (requestBody?: Req) => {
            setIsLoading(true);

            let response: Response;

            switch (method) {
                case RequestMethods.Get:
                    response = await getJSON(endpoint);
                    break;
                case RequestMethods.Post:
                default:
                    response = await postJSON(endpoint, requestBody);
                    break;
            }

            const responseBody = await response.json() as Res;
            setIsLoading(false);
            return { response, responseBody };
        },
        [setIsLoading, endpoint]
    );

    return [ isLoading, initiator ];
};