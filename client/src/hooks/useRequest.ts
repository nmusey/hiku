import { useCallback, useState } from "react";
import { Endpoint } from "../../../common/constants/Endpoints";
import { getJSON, getJSONWithParams, isResponseSuccess, postJSON } from "../utils/fetch.utils";

export interface ErrorResponse {
    errors: string[];
}

export enum RequestMethods {
    Get = "GET",
    Post = "POST",
    GetWithParams = "GET_WITH_PARAMS"
}

interface UseRequestReturn<T> {
    response: Response;
    responseBody: T | ErrorResponse;
}

export const useRequest = <Req, Res>(endpoint: Endpoint, method: RequestMethods): [boolean, string[], (body?: Req) => Promise<UseRequestReturn<Res>>] => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errors, setErrors ] = useState<string[]>([]);

    const initiator = useCallback(
        async (requestBody?: Req) => {
            setIsLoading(true);

            let response: Response;

            switch (method) {
                case RequestMethods.Get:
                    response = await getJSON(endpoint, requestBody as Record<string, unknown>);
                    break;
                case RequestMethods.GetWithParams:
                    response = await getJSONWithParams(endpoint, requestBody as unknown as Record<string, string>);
                    break;
                case RequestMethods.Post:
                default:
                    response = await postJSON(endpoint, requestBody);
                    break;
            }

            const responseBody = await response.json() as Res;

            if (!isResponseSuccess(response)) {
                const errorList = (responseBody as unknown as ErrorResponse).errors;
                setErrors(errorList);
            }

            setIsLoading(false);
            return { response, responseBody };
        },
        [setIsLoading, endpoint, method]
    );

    return [ isLoading, errors, initiator ];
};