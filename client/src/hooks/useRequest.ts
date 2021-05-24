import { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { Endpoint } from "../../../common/constants/Endpoints";
import { getJSON, isResponseSuccess, postJSON } from "../utils/fetch.utils";
import { Pages } from "../constants/Pages";

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

export const useRequest = <Req, Res>(endpoint: Endpoint, method: RequestMethods): [boolean, string[], (body?: Req) => Promise<UseRequestReturn<Res>>] => {
    const [isLoading, setIsLoading] = useState(false);
    const [ errors, setErrors ] = useState<string[]>([]);
    const history = useHistory();

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

            if (!isResponseSuccess(response)) {
                const errorList = (responseBody as unknown as ErrorResponse).errors;
                setErrors(errorList);

                if (response.status === 401) {
                    console.log("here");
                    history.push(Pages.Login.route);
                }
            }

            setIsLoading(false);
            return { response, responseBody };
        },
        [setIsLoading, endpoint]
    );

    return [ isLoading, errors, initiator ];
};